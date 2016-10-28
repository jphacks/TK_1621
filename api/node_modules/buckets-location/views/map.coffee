Buckets = require 'buckets'

_ = Buckets._

tpl = require './../templates/map'

module.exports = class MapInputView extends Buckets.View
  template: tpl
  defaultLocation:
    lat: 39.952335
    lng: -75.163789

  events:
    'change [name="location"]': 'updateLocationText'
    'keydown [name="location"]': 'keyDownLocation'
    'click [href="#getCurrent"]': 'clickGetCurrent'
    'change .simpleLocation': 'updateSimpleLocation'

  getTemplateData: ->
    _.extend super,
      googleMapsAvailable: google?.maps?
      lat: @lat
      lng: @lng

  initialize: ->
    super

    Modernizr.load
      test: window.google?
      nope: 'https://www.google.com/jsapi'
      complete: => _.defer =>
        if window.google?
          unless Buckets.mediator.mapsLoaded?
            Buckets.mediator.mapsLoaded = new $.Deferred

            google.load 'maps', '3',
              other_params:'sensor=false'
              callback: => Buckets.mediator.mapsLoaded.resolve()

          Buckets.mediator.mapsLoaded.done @mapsLoaded
        else
          console.warn 'Could not load Google API.', window.google

          # Just in case they don’t have network access
          @render()

  render: ->
    val = @model.get('value')

    if val?.lat and val.lng
      location =
        lat: val.lat
        lng: val.lng
    else
      location = @defaultLocation

    @updatePosition location.lat, location.lng

    super

    @$map = @$('.map')

  mapsLoaded: =>
    @render()

    if @readonly
      @$map.append """
        <img src="//maps.googleapis.com/maps/api/staticmap?center=#{@lat},#{@lng}&zoom=14&size=230x140&markers=#{@lat},#{@lng}&sensor=false&scale=2">
      """
    else
      google.maps.visualRefresh = true

      @map = new google.maps.Map @$map.get(0),
        zoom: 14
        mapTypeId: google.maps.MapTypeId.ROADMAP
        disableDoubleClickZoom: true
        streetViewControl: false
        scrollwheel: false
        mapTypeControl: no
        styles: [
          featureType: 'poi'
          elementType: 'labels',
          stylers: [visibility: 'off']
        ]

      @geocoder = new google.maps.Geocoder

      # We already updated to set lat/lng, but this will render the marker for default vals
      @updatePosition @lat, @lng

  updateSimpleLocation: ->
    @updatePosition @$('[name="lat"]').val(), @$('[name="lng"]').val()

  updatePosition: (lat, lng) ->
    @lat = parseFloat(lat)
    @lng = parseFloat(lng)

    if @map
      if @marker
        hadMarker = true
        @marker.setMap null
        delete @marker

      @map.panTo new google.maps.LatLng lat, lng

      @marker = new google.maps.Marker
        position: new google.maps.LatLng lat, lng
        map: @map
        animation: google.maps.Animation.DROP unless hadMarker

  updateLocationText: (e) =>
    val = $(e.target).val()

    if val isnt @lastValue
      @geocoder.geocode
        address: $(e.target).val()
      , (results, status) =>
        if results?[0] and status is 'OK'
          loc = results[0].geometry.location

          @updatePosition loc.lat(), loc.lng()

          @model.set results

          if @usingGeolocation is true
            val = results[0].formatted_address
            $(e.currentTarget).val val
            @usingGeolocation = false

          @lastValue = val

  keyDownLocation: (e) ->
    if e.keyCode is 13 # (return key)
      e.preventDefault()
      @updateLocationText(e)

  getValue: ->
    @updateSimpleLocation() unless google?.maps?
    if @isDefaultLocation()
      null
    else
      lat: @lat
      lng: @lng
      name: @$('input[name="location"]').val()

  clickGetCurrent: (e) ->
    $el = $(e.currentTarget)
    $input = @$('input[name="location"]')
    fallbackCachedValue = $input.val()

    e.preventDefault()

    enableInput = ->
      $input.prop 'disabled', false
      $el.removeClass('loadingPulse')

    if navigator.geolocation?
      $input.prop 'disabled', true
      $el.addClass('loadingPulse')
      $input.val 'Looking up location…'

      navigator.geolocation?.getCurrentPosition (pos) =>
        if pos?.coords
          @usingGeolocation = true

          $input
            .val "#{pos.coords.latitude}, #{pos.coords.longitude}"
            .trigger 'change'

        enableInput()

      , ->
        $input.val fallbackCachedValue
        enableInput()

  isDefaultLocation: -> @lat is @defaultLocation.lat and @lng is @defaultLocation.lng

  dispose: ->
    if google?.maps?.event? and not @disposed
      if @marker?
        @marker.setMap null

      google.maps.event.clearInstanceListeners window
      google.maps.event.clearInstanceListeners document
      google.maps.event.clearInstanceListeners @$map.get(0)

    super
