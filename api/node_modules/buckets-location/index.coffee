module.exports = class LocationPlugin
  constructor: (options) ->
    options.hbs?.registerHelper 'map', (location) ->
      return unless location?.lat and location?.lng

      new options.hbs.handlebars.SafeString """
        <img src="//maps.googleapis.com/maps/api/staticmap?center=#{location.lat},#{location.lng}&zoom=14&size=230x140&markers=#{location.lat},#{location.lng}&sensor=false&scale=2">
      """
