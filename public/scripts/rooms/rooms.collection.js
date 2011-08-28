(function() {
  var Backbone, RoomsCollection, _;
  Backbone = require('backbone');
  _ = require('underscore');
  module.exports = RoomsCollection = Backbone.Collection.extend({
    model: RoomModel,
    max: 10,
    comparator: function(room) {
      return room.players.length;
    },
    next: function() {
      var room;
      console.log('getting next available room...');
      room = this.first();
      if (!(room && room.length < max)) {
        console.log('creating a new room...');
        room = new RoomModel();
        this.add(room);
      }
      return room;
    }
  });
}).call(this);
