class window.Canvas

  should_stroke: false
  should_fill: true
  
  ticks: 0

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

  draw_image: (src, x = 0, y = 0, width = @width, height = @height) ->
    if typeof src isnt 'string'
      @context.drawImage(src, x, y, width, height)
      return

    image = new Image()
    image.onload = => @context.drawImage(image, x, y, width, height)
    image.src = src

  text: (value, x, y, font = '14px Helvetica, Arial, sans-serif', lineHeight = 18, textAlign = 'left', textBaseline = 'top') ->
    value = value.toString() if typeof value isnt 'string'
    @context.font = font
    @context.textAlign = textAlign
    @context.textBaseline = textBaseline
    lines = value.split('\n')
    @context.fillText(line, x, y + i * lineHeight) for i, line of lines

  rect: (x = 0, y = 0, width = @width, height = @height) ->
    @context.fillRect(x, y, width, height) if @should_fill
    @context.strokeRect(x, y, width, height) if @should_stroke

  clear: (x = 0, y = 0, width = @width, height = @height) -> @context.clearRect(x, y, width, height)

  circle: (x = 0, y = 0, radius = 10) ->
    @context.beginPath()
    @context.arc(x, y, radius, 0, Math.PI * 2, true)
    @context.closePath()
    @context.fill() if @should_fill
    @context.stroke() if @should_stroke

  # http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  get_animation_frame: ->
    return window.requestAnimationFrame or
           window.webkitRequestAnimationFrame or
           window.mozRequestAnimationFrame or
           window.oRequestAnimationFrame or
           (callback, element) -> window.setTimeout(callback, 1000 / 60)

  step: (timestamp) =>
    @clear()
    @ticks++
    @draw_callback.call(this)
    @get_animation_frame()(@step, @canvas)

  draw: (@draw_callback) -> @step()
