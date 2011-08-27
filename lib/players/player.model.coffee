if require?
  Backbone = require('backbone')
  Vector = require('../vector')
  ProjectileModel = require('../projectiles/projectile.model')
else
  Backbone = window.Backbone
  Vector = window.Vector
  ProjectileModel = window.ProjectileModel

PlayerModel = Backbone.Model.extend

  defaults: ->
    team: 'ships'
    self: false
    position: Math.random() * Math.PI * 2
    velocity: 0
    trajectory: 0
    state: 'waiting'
    lives: 3
    hp: 100
    score: 0
    self: false
    kills: 0
    hits: 0
    fires: 0
    start: Date.now()
    name: 'anonymous'

  max_speed: 0.5
  max_angle: Math.PI / 4 #/

  initialize: -> @speed = if @get('team') is 'spores' then 0.01 else 0.005

  validate: (attrs) -> return 'invalid name' unless attrs?.name?.length < 11

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

  fire: -> 
    player_id = @get('id')
    player_team = @get('team')
    player_position = @get('position')
    player_trajectory = @get('trajectory')
    player_fires = @get('fires')
    
    @set({ fires: ++player_fires }, silent: true)
    
    if player_team is 'spores'
      offset = -100
      direction = -14
    else
      offset = -200
      direction = 14
    
    position = new Vector(0, offset).rotate(player_position)
    velocity = new Vector(1, direction).rotate(player_position).rotate(player_trajectory)
    id = "#{player_id}_#{Date.now()}"
    
    projectile = new ProjectileModel(id: id, player: player_id, position: position, velocity: velocity)  
      
  update: ->
    velocity = @get('velocity')
    position = @get('position')
    team = @get('team')

    rotation = if team is 'spores' then 0.001 else 0.005 # planetary rotation
    velocity *= 0.9 # decay
    position += velocity + rotation

    @set({ velocity: velocity, position: position }, silent: true)

  test: (projectile, projectile_player) ->
    return unless @get('state') is 'alive'

    if projectile_player
      projectile_player_team = projectile_player.get('team')
      projectile_player_score = projectile_player.get('score')

    position = projectile.get('position')
    player_team = @get('team')
    return if projectile_player_team is player_team
    player_rotation = @get('position')
    offset = if player_team is 'spores' then -100 else -200
    player_position = new Vector(0, offset).rotate(player_rotation)
    distance = position.squared_distance(player_position)

    return unless distance < 100

    projectile_player_hits = projectile_player.get('hits')
    projectile_player.set({ score: projectile_player_score += 10, hits: ++projectile_player_hits }, silent: true)

    hp = @get('hp')

    @set({ hp: hp -= 10 }, silent: true)

    projectile.set({ ttl: 7, state: 'dying' }, silent: true)

    return unless hp < 0

    projectile_player_kills = projectile_player.get('kills')
    projectile_player.set({ score: projectile_player_score += 100, kills: ++projectile_player_kills }, silent: true)

    lives = @get('lives')
    lives--

    if lives < 0
      @set({ state: 'dead', end: Date.now() }, silent: true)
    else
      @set({ position: Math.random() * Math.PI * 2, velocity: 0, lives: lives, hp: 100 }, silent: true)

  draw: (helper) ->
    return unless @get('state') is 'alive'

    team = @get('team')
    self = @get('self')

    position = @get('position')
    trajectory = @get('trajectory')

    hp = @get('hp')

    helper.save()
    helper.translate(helper.half_width, helper.half_height)
    helper.rotate(position)
    helper.translate(0, if team is 'spores' then -100 else -200)
    helper.no_stroke()
    helper.fill('rgba(255, 255, 255, 0.8)')
    helper.circle(0, 0, 4, 4)
    helper.no_fill()
    helper.stroke_width(2)
    helper.stroke("rgba(255, 255, 255, #{hp / 125})")
    helper.circle(0, 0, 12, 12)

    if self
      helper.stroke('rgba(255, 0, 0, 0.8)')
      helper.circle(0, 0, 20, 20)

    helper.rotate(trajectory)
    helper.no_stroke()
    helper.fill('rgba(255, 255, 255, 0.8)')
    
    if team is 'spores'
      helper.rect(-1, 4, 2, -18)
    else
      helper.rect(-1, 4, 2, 10)

    helper.restore()

if module?.exports?
  module.exports = PlayerModel
else
  window.PlayerModel = PlayerModel
