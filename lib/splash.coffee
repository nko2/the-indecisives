class window.Splash

  constructor: (header = '', body = '', @visible = true, height = 120)
  
  draw: (helper) ->
    return unless @visible
    
    helper.save()
    helper.fill('rgba(225, 225, 225, 0.4)')
    helper.translate(0, helper.half_height - @height / 2)
    helper.text(@header, 0, 0, "48px 'IM Fell English SC', serif", 0, 'center')
    helper.text(@body, 0, 60, "24px 'IM Fell English SC', serif", 24, 'center')
    helper.restore()
    
  show: -> @visible = true
  hide: -> @visible = false
