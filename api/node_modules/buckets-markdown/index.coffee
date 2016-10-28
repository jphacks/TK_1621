marked = require 'marked'

module.exports = class MarkdownPlugin
  constructor: (options) ->
    options.hbs?.registerHelper 'markdown', (text='') ->
      new options.hbs.handlebars.SafeString marked text,
        breaks: yes
        smartypants: yes

