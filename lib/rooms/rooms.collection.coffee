Backbone = require('backbone')
_ = require('underscore')

RoomModel = require('./room.model')

module.exports = RoomsCollection = Backbone.Collection.extend

  model: RoomModel
  max: 3

  initialize: (models, options) ->
    _.bindAll(this, 'update_all', 'update_one')
    @update = _.throttle(@update, 1000 / 15)
    @io = options.io

  comparator: (room) -> return room.players.length

  update_all: -> @each(@update_one)

  update_one: (room) ->
    room_name = room.get('name')

    players = room.players
    projectiles = room.projectiles

    projectiles.update()
    players.update()

    @io.sockets.in(room_name).volatile.emit('players:update', players.toJSON())
    @io.sockets.in(room_name).volatile.emit('projectiles:update', projectiles.toJSON())

  next: ->
    room = @first()

    unless room and room.players.length < @max
      room = new RoomModel()
      room_name = room.get('name')

      room.players.bind 'remove', (player) =>
        @remove(room) unless room.players.length > 0
        @io.sockets.in(room_name).emit('player:disconnect', player.toJSON())

      room.projectiles.bind 'remove', (projectile) =>
        @io.sockets.in(room_name).volatile.emit('projectile:remove', projectile.toJSON())

      @add(room)

    return room
