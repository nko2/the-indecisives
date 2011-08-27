class window.Explosion
  total_width: 336
  width: 48
  height: 60
  frames: 6
  
  constructor: ->
    helper = new Canvas(null, @total_width, @height)
    @canvas = helper.canvas
    helper.draw_image('/images/explosion.png', 0, 0, helper.width, helper.height)
  
  draw: (helper) ->
    frame = helper.ticks % @frames
    helper.context.globalCompositeOperation = 'lighter'
    helper.context.drawImage(@canvas, @width * frame, 0, @width, @height, -24, -30, @width, @height)
    