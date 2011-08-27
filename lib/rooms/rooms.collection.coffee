Backbone = require('backbone')
_ = require('underscore')

module.exports = RoomsCollection = Backbone.Collection.extend

  model: RoomModel
  max: 10

  initialize: (models, options) ->
    @io = options.io

  comparator: (room) -> return room.players.length

  next: ->
    console.log 'getting next available room...'

    room = @first()

    unless room and room.length < @max
      console.log 'creating a new room...'

      room = new RoomModel()

      room.players.bind 'remove', (player) =>
        @io.sockets.emit('player:disconnect', player.toJSON())
      room.projectiles.bind 'remove', (projectile) =>
        @io.sockets.volatile.emit('projectile:remove', projectile.toJSON())

      @add(room)

    return room
