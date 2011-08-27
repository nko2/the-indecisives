class window.Background

  constructor: ->
    helper = new Canvas()
    @canvas = helper.canvas
    helper.no_stroke()

    for i in [0..100]
      x = Math.floor(Math.random() * helper.width)
      y = Math.floor(Math.random() * helper.height)

      radius = Math.random() * 3
      helper.fill('rgba(255, 255, 255, 0.2)')
      helper.circle(x, y, radius + 2)
      helper.fill('rgba(255, 255, 255, 0.6)')
      helper.circle(x, y, radius)

  draw: (helper) -> helper.draw_image(@canvas)
