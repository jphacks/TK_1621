Buckets = require 'buckets'
tpl = require './../templates/toggle'

module.exports = class ToggleView extends Buckets.View
  template: tpl

  events:
    'click .uiswitch': 'toggleValue'

  toggleValue: (event) ->
    event.toElement.value = if event.toElement.value is 'true' then 'false' else 'true'
