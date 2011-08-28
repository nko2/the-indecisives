(function() {
  var Backbone, RoomModel, _;
  Backbone = require('backbone');
  _ = require('underscore');
  module.exports = RoomModel = Backbone.Model.extend({
    initialize: function() {
      _.bindAll(this, 'update');
      this.players = new PlayersCollection();
      return this.projectiles = new ProjectilesCollection();
    }
  });
}).call(this);
