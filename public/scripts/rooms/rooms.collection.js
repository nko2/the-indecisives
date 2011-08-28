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
      _.bindAll(this, 'update_all', 'update_one');
      this.update = _.throttle(this.update, 1000 / 15);
      return this.io = options.io;
    },
    comparator: function(room) {
      return room.players.length;
    },
    update_all: function() {
      return this.each(this.update_one);
    },
    update_one: function(room) {
      var players, projectiles, room_name;
      room_name = room.get('name');
      players = room.players;
      projectiles = room.projectiles;
      projectiles.update();
      players.update();
      this.io.sockets["in"](room_name).volatile.emit('players:update', players.toJSON());
      return this.io.sockets["in"](room_name).volatile.emit('projectiles:update', projectiles.toJSON());
    },
    next: function() {
      var room, room_name;
      room = this.first();
      if (!(room && room.players.length < this.max)) {
        room = new RoomModel();
        room_name = room.get('name');
        room.players.bind('remove', __bind(function(player) {
          if (!(room.players.length > 0)) {
            this.remove(room);
          }
          return this.io.sockets["in"](room_name).emit('player:disconnect', player.toJSON());
        }, this));
        room.projectiles.bind('remove', __bind(function(projectile) {
          return this.io.sockets["in"](room_name).volatile.emit('projectile:remove', projectile.toJSON());
        }, this));
        this.add(room);
      }
      return room;
    }
  });
}).call(this);
