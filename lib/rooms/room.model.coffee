Backbone = require('backbone')
_ = require('underscore')

module.exports = RoomModel = Backbone.Model.extend
  
  initialize: -> 
    _.bindAll(this, 'update')

    @players = new PlayersCollection()
    @projectiles = new ProjectilesCollection()
