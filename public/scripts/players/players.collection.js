(function() {
  var Backbone, PlayerModel, PlayersCollection;
  if (typeof require !== "undefined" && require !== null) {
    Backbone = require('backbone');
    PlayerModel = require('./player.model');
  } else {
    Backbone = window.Backbone;
    PlayerModel = window.PlayerModel;
  }
  PlayersCollection = Backbone.Collection.extend({
    model: PlayerModel,
    draw: function(helper) {
      return this.each(function(player) {
        return player.draw(helper);
      });
    },
    update: function(helper) {
      return this.each(function(player) {
        return player.update(helper);
      });
    },
    spores: function() {
      return this.select(function(player) {
        return player.get('team') === 'spores';
      });
    },
    ships: function() {
      return this.select(function(player) {
        return player.get('team') === 'ships';
      });
    }
  });
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = PlayersCollection;
  } else {
    window.PlayersCollection = PlayersCollection;
  }
}).call(this);
