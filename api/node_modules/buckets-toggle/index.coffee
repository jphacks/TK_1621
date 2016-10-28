module.exports = class TogglePlugin
  constructor: (options) ->
    options.hbs?.registerHelper 'toggle', (value) ->
      checked = if value == 'true' then 'checked' else ''
      new options.hbs.handlebars.SafeString """
          <input type="checkbox" id="input-toggle" class="uiswitch form-control" value="#{value}" #{checked}>
      """

  preSave: ->
    console.log 'preSave', arguments
