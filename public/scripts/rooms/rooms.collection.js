(function() {
  var Backbone, RoomModel, RoomsCollection, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Backbone = require('backbone');
  _ = require('underscore');
  RoomModel = require('./room.model');
  module.exports = RoomsCollection = Backbone.Collection.extend({
    model: RoomModel,
    max: 3,
    initialize: function(models, options) {
      this.update = _.throttle(this.update, 1000 / 15);
      return this.io = options.io;
    },
    comparator: function(room) {
      return room.players.length;
    },
    update: function() {
      return this.each(__bind(function(room) {
        var players, projectiles;
        players = room.players;
        projectiles = room.projectiles;
        projectiles.update();
        players.update();
        this.io.sockets.volatile.emit('players:update', players.toJSON());
        return this.io.sockets.volatile.emit('projectiles:update', projectiles.toJSON());
      }, this));
    },
    next: function() {
      var room;
      room = this.first();
      if (!(room && room.players.length < this.max)) {
        room = new RoomModel();
        room.players.bind('remove', __bind(function(player) {
          if (!(room.players.length > 0)) {
            this.remove(room);
          }
          return this.io.sockets.emit('player:disconnect', player.toJSON());
        }, this));
        room.projectiles.bind('remove', __bind(function(projectile) {
          return this.io.sockets.volatile.emit('projectile:remove', projectile.toJSON());
        }, this));
        this.add(room);
      }
      return room;
    }
  });
}).call(this);
