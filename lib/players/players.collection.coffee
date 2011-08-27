if require?
  Backbone = require('backbone')
  PlayerModel = require('./player.model')
else
  Backbone = window.Backbone
  PlayerModel = window.PlayerModel

PlayersCollection = Backbone.Collection.extend
  model: PlayerModel
  
  draw: (helper) ->
    @each (player) -> player.draw(helper)
  
  update: ->
    @each (player) -> player.update()
    
  test: (projectile) ->
    projectile_player = @get(projectile.get('player'))
    @each (player) -> player.test(projectile, projectile_player)

  spores: -> 
    return @select (player) ->
      return player.get('team') is 'spores'
    
  ships: -> 
    return @select (player) ->
      return player.get('team') is 'ships'  

if module?.exports?
  module.exports = PlayersCollection
else
  window.PlayersCollection = PlayersCollection
