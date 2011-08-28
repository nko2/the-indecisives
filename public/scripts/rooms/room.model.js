(function() {
  var Backbone, PlayersCollection, ProjectilesCollection, RoomModel, _;
  Backbone = require('backbone');
  _ = require('underscore');
  PlayersCollection = require('../players/players.collection');
  ProjectilesCollection = require('../projectiles/projectiles.collection');
  module.exports = RoomModel = Backbone.Model.extend({
    defaults: function() {
      return {
        name: "" + (Date.now()) + "_" + (Math.floor(Math.random() * 10))
      };
    },
    initialize: function() {
      this.players = new PlayersCollection();
      return this.projectiles = new ProjectilesCollection();
    }
  });
}).call(this);
