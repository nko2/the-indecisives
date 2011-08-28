Backbone = require('backbone')
_ = require('underscore')
PlayersCollection = require('../players/players.collection')
ProjectilesCollection = require('../projectiles/projectiles.collection')

module.exports = RoomModel = Backbone.Model.extend

  defaults: ->
    return name: "#{Date.now()}_#{Math.floor(Math.random() * 10)}"
  
  initialize: -> 
    @players = new PlayersCollection()
    @projectiles = new ProjectilesCollection()
