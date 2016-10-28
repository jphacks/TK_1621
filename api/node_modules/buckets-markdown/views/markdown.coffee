Buckets = require 'buckets'


marked = require 'marked'

tpl = require '../templates/input'

module.exports = class MarkdownInput extends Buckets.View
  template: tpl

  events:
    'click #markdownLogo': 'togglePreview'
    'click .markdown-preview': 'togglePreview'

  togglePreview: (e) ->
    e.preventDefault()

    $preview = @$('.markdown-preview').html marked @$('textarea').val(),
      breaks: yes
      smartypants: yes

    $arrow = @$('#markdownLogoArrow').css 'transform-origin', '50% 50%'

    isOpen = $preview.is(':visible')

    unless isOpen
      TweenLite.fromTo $preview.show(), .2, y: -400,
        y: 0
        ease: Sine.easeOut
    else
      TweenLite.to $preview.show(), .1,
        y: -400
        ease: Sine.easeIn

        onComplete: ->
          $preview.hide()

    @arrowAnim?.progress 1

    @arrowAnim = TweenLite.to $arrow, .2,
      rotation: '+=180'
      ease: Power1.easeOut
