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
    comparator: function(player) {
      return -player.get('score');
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
    others: function() {
      return this.select(function(player) {
        return !player.get('self');
      });
    },
    spectators: function() {
      return this.select(function(player) {
        return player.get('state') === 'waiting';
      });
    },
    players: function() {
      return this.select(function(player) {
        return player.get('state') === 'alive';
      });
    },
    balance: function() {
      var diff, ships, spores;
      spores = this.spores();
      ships = this.ships();
      if (spores.length > ships.length) {
        diff = spores.length - ships.length;
        if (diff > 1) {
          return spores[0].set({
            team: 'ships'
          }, {
            silent: true
          });
        }
      } else {
        diff = ships.length - spores.length;
        if (diff > 1) {
          return ships[0].set({
            team: 'spores'
          }, {
            silent: true
          });
        }
      }
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
