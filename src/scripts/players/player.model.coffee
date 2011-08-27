if require?
  Backbone = require('backbone')
  Vector = require('./src/scripts/vector')
else
  Backbone = window.Backbone
  Vector = window.Vector

PlayerModel = Backbone.Model.extend
  defaults:

  max_speed: 0.5
  max_angle: Math.PI / 4

  initialize: -> @speed = if @get('team') is 'spores' then 0.01 else 0.005

  move_left: ->

  move_right: ->

  aim_left: ->

  aim_right: ->

  update: ->

  draw: ->
