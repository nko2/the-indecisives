class Vector

  constructor: (@x = 0, @y = 0) -> return this

  add: (v) ->
    @x += v.x
    @y += v.y
    return this

  multiply_scalar: (value) ->
    @x *= value
    @y *= value
    return this

  rotate: (radians) ->
    _x = @x * Math.cos(radians) - @y * Math.sin(radians)
    _y = @x * Math.sin(radians) + @y * Math.cos(radians)

    @x = _x
    @y = _y

    return this

  restrict: (cap) ->
    if @x > cap then @x = cap
    else if @x < -cap then @x = -cap
    if @y > cap then @y = cap
    else if @y < -cap then @y = -cap
    return this

  squared_distance: (vector) ->
    return Math.pow(@x - vector.x, 2) + Math.pow(@y - vector.y, 2)

  toJSON: -> return x: @x, y: @y

if module?.exports?
  module.exports = Vector
else
  window.Vector = Vector
