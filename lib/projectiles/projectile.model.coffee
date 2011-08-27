if require?
  _ = require('underscore')
  Backbone = require('backbone')
  Vector = require('../vector')
else
  _ = window._
  Backbone = window.Backbone
  Vector = window.Vector

ProjectileModel = Backbone.Model.extend

  defaults:
    ttl: 100
    state: 'alive'
    velocity: new Vector()
    position: new Vector()
    self: false
  
  initialize: -> 
    _.bindAll(this, 'update')
    
  update: ->
    state = @get('state')
    ttl = @get('ttl')
    
    ttl--
    
    if ttl < 0
      @projectiles.remove(this)
      return
    
    if state is 'dying'
      @set({ttl: ttl})
      return
      
    velocity = @get('velocity')
    position = @get('position')

    size = 100
    
    r_squared = position.squared_distance(new Vector())
    distance = Math.sqrt(r_squared)
    
    if distance < 100
      @projectiles.remove(this)
    
    if r_squared isnt 0
      strength = 1
      force = strength * (size / r_squared)  #/
      delta = new Vector(-position.x * force, -position.y * force)
      velocity.add(delta)
      position.add(velocity)
      
      @set({velocity: velocity, position: position, ttl: ttl}, silent: true)
      # @players.test(this)
      @change()
      
  draw: (helper) ->
    position = @get('position')
    ttl = @get('ttl')
    state = @get('state')
    
    helper.no_stroke()
    
    if @get('self') then helper.fill('rgba(255, 0, 0, 0.9)')
    else helper.fill('rgba(192, 192, 192, 0.6)')
    
    helper.save()
    helper.translate(helper.width / 2, helper.height / 2)
    helper.translate(position.x, position.y)
    helper.circle(0, 0, 2, 2)
    helper.restore()

if module?.exports?
  module.exports = ProjectileModel
else
  window.ProjectileModel = ProjectileModel
      
      
      
      
      
      
      
      
      
      
      
      
