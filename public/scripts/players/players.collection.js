(function() {
  var Backbone, PlayerModel, PlayersCollection, _;
  if (typeof require !== "undefined" && require !== null) {
    Backbone = require('backbone');
    _ = require('underscore');
    PlayerModel = require('./player.model');
  } else {
    Backbone = window.Backbone;
    _ = window._;
    PlayerModel = window.PlayerModel;
  }
  PlayersCollection = Backbone.Collection.extend({
    model: PlayerModel,
    draw: function(helper) {
      return this.each(function(player) {
        return player.draw(helper);
      });
    },
    update: function() {
      return this.each(function(player) {
        return player.update();
      });
    },
    changes: function() {
      var changed_players;
      changed_players = [];
      this.each(function(player) {
        var changed_player;
        changed_player = player.changedAttributes();
        if (changed_player) {
          return changed_players.push(changed_player);
        }
      });
      return changed_players;
    },
    test: function(projectile) {
      var projectile_player;
      projectile_player = this.get(projectile.get('player'));
      return this.each(function(player) {
        return player.test(projectile, projectile_player);
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
