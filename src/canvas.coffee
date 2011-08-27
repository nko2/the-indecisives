class window.Canvas

  should_stroke: false
  should_fill: true

  constructor: (@canvas, @width = 640, @height = 480) ->
    unless @canvas
      @canvas = document.createElement('canvas')

    @canvas.width = @width
    @canvas.height = @height

    @context = @canvas.getContext('2d')

    @half_width = @width / 2
    @half_height = @height / 2

  no_stroke: -> @should_stroke = false
  no_fill: -> @should_fill = false
  
  stroke: (color) ->
    @should_stroke = true
    @context.strokeStyle = color

  fill: (color) ->
    @should_fill = true
    @context.fillStyle = color

  stroke_width: (width) -> @context.lineWidth = width

  translate: (x = 0, y = 0) -> @context.translate(x, y)
  rotate: (angle = 0) -> @context.rotate(angle)

  save: -> @context.save()
  restore: -> @context.restore()
