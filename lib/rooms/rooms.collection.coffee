Backbone = require('backbone')
_ = require('underscore')

RoomModel = require('./room.model')

module.exports = RoomsCollection = Backbone.Collection.extend

  model: RoomModel
  max: 3

  initialize: (models, options) ->
    @update = _.throttle(@update, 1000 / 15)
    @io = options.io

  comparator: (room) -> return room.players.length

  update: ->
    @each (room) =>
      players = room.players
      projectiles = room.projectiles

      projectiles.update()
      players.update()

      @io.sockets.volatile.emit('players:update', players.toJSON())
      @io.sockets.volatile.emit('projectiles:update', projectiles.toJSON())

  next: ->
    room = @first()

    unless room and room.players.length < @max
      room = new RoomModel()

      room.players.bind 'remove', (player) =>
        @remove(room) unless room.players.length > 0
        @io.sockets.emit('player:disconnect', player.toJSON())

      room.projectiles.bind 'remove', (projectile) =>
        @io.sockets.volatile.emit('projectile:remove', projectile.toJSON())

      @add(room)

    return room
