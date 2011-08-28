if require?
  Backbone = require('backbone')
  _ = require('underscore')
  PlayerModel = require('./player.model')
else
  Backbone = window.Backbone
  _ = window._
  PlayerModel = window.PlayerModel

PlayersCollection = Backbone.Collection.extend
  model: PlayerModel
  
  draw: (helper) ->
    @each (player) -> player.draw(helper)

  comparator: (player) -> return -player.get('score')
  
  update: ->
    @each (player) -> player.update()

  changes: ->
    changed_players = []
    @each (player) ->
      changed_player = player.changedAttributes()
      changed_players.push(changed_player) if changed_player
    return changed_players
    
  test: (projectile) ->
    projectile_player = @get(projectile.get('player'))
    @each (player) -> player.test(projectile, projectile_player)

  others: ->
    return @select (player) ->
      return not player.get('self')

  spectators: ->
    return @select (player) ->
      return player.get('state') is 'waiting'

  players: ->
    return @select (player) ->
      return player.get('state') is 'alive'

  balance: ->
    spores = @spores()
    ships = @ships()

    if spores.length > ships.length
      diff = spores.length - ships.length
      spores[0].set({ team: 'ships' }, silent: true) if diff > 1
    else
      diff = ships.length - spores.length
      ships[0].set({ team: 'spores' }, silent: true) if diff > 1

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
