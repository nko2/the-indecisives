class Vector

  constructor: (@x = 0, @y = 0) -> return this

  add: (v) ->
    @x += v.x
    @y += v.y
    return this

  rotate: (radians) ->
    _x = @x * Math.cos(radians) - @y * Math.sin(radians)
    _y = @x * Math.sin(radians) + @y * Math.cos(radians)

    @x = _x
    @y = _y

    return this

  toJSON: -> return x: @x, y: @y

if module?.exports?
  module.exports = Vector
else
  window.Vector = Vector
