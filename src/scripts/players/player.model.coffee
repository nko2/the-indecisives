if require?
  Backbone = require('backbone')
  Vector = require('./src/scripts/vector')
else
  Backbone = window.Backbone
  Vector = window.Vector

PlayerModel = Backbone.Model.extend
  defaults:
    team: 'ships'
    self: false
    position: Math.random() * Math.PI * 2
    velocity: 0
    trajectory: 0

  max_speed: 0.5
  max_angle: Math.PI / 4

  initialize: -> @speed = if @get('team') is 'spores' then 0.01 else 0.005

  move_left: ->
    velocity = @get('velocity')
    @set({ velocity: velocity += @speed }, silent: true) if velocity < @max_speed

  move_right: ->
    velocity = @get('velocity')
    @set({ velocity: velocity -= @speed }, silent: true) if velocity < @max_speed

  aim_left: ->
    trajectory = @get('trajectory')
    @set({ trajectory: trajectory += 0.1 }, silent: true) if trajectory < @max_angle

  aim_right: ->
    trajectory = @get('trajectory')
    @set({ trajectory: trajectory -= 0.1 }, silent: true) if trajectory > -@max_angle

  update: ->
    velocity = @get('velocity')
    position = @get('position')
    team = @get('team')

    rotation = if team is 'spores' then 0.001 else 0.005 # planetary rotation
    velocity *= 0.9 # decay
    position += velocity + rotation

    @set({ velocity: velocity, position: position }, silent: true)
    @change()

  draw: (helper) ->
