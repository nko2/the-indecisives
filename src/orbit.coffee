class window.Orbit

  constructor: (@radius) ->

  draw: (helper) ->
    helper.stroke('rgba(255, 255, 255, 0.4)')
    helper.no_fill()
    helper.circle(helper.half_width, helper.half_height, @radius)
