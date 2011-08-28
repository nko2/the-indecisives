(function() {
  var Backbone, RoomModel, RoomsCollection, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Backbone = require('backbone');
  _ = require('underscore');
  RoomModel = require('./room.model');
  module.exports = RoomsCollection = Backbone.Collection.extend({
    model: RoomModel,
    max: 10,
    initialize: function(models, options) {
      _.bindAll(this, 'update_rooms', 'update_room', 'update_states', 'update_state');
      this.update_rooms = _.throttle(this.update_rooms, 1000 / 15);
      return this.io = options.io;
    },
    comparator: function(room) {
      return room.players.length;
    },
    update_states: function() {
      return this.each(this.update_state);
    },
    update_state: function(room) {
      var players, projectiles;
      players = room.players;
      projectiles = room.projectiles;
      projectiles.update();
      return players.update();
    },
    update_rooms: function() {
      return this.each(this.update_room);
    },
    update_room: function(room) {
      var players, projectiles, room_name;
      room_name = room.get('name');
      players = room.players;
      projectiles = room.projectiles;
      this.io.sockets["in"](room_name).volatile.emit('players:update', players.toJSON());
      return this.io.sockets["in"](room_name).volatile.emit('projectiles:update', projectiles.toJSON());
    },
    "new": function() {
      var players, projectiles, room, room_name;
      room = new RoomModel();
      room_name = room.get('name');
      players = room.players;
      projectiles = room.projectiles;
      players.bind('remove', __bind(function(player) {
        if (!(players.length > 0)) {
          this.remove(room);
        }
        players.balance();
        return this.io.sockets["in"](room_name).emit('player:disconnect', player.toJSON());
      }, this));
      projectiles.bind('remove', __bind(function(projectile) {
        return this.io.sockets["in"](room_name).volatile.emit('projectile:remove', projectile.toJSON());
      }, this));
      this.add(room);
      return room;
    },
    next: function() {
      var room;
      room = this.first();
      if (!(room && room.players.length < this.max)) {
        room = this["new"](room);
      }
      return room;
    }
  });
}).call(this);
