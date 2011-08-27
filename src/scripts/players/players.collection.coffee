if require?
  Backbone = require('backbone')
  PlayerModel = require('./src/scripts/player.model')
else
  Backbone = window.Backbone
  PlayerModel = window.PlayerModel

PlayersCollection = Backbone.Collection.extend
  model: PlayerModel
  
  draw:(helper) ->
    @each (player) -> 
      player.draw(helper)
  
  update:(helper) ->
    @each (player) -> 
      player.update(helper)
    
  spores: -> 
    return @select (player) ->
      return player.get('team') is 'spores'
    
  ships: -> 
    return @select (player) ->
      return player.get('team') is 'ships'  