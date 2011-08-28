Backbone = require('backbone')
_ = require('underscore')

RoomModel = require('./room.model')

module.exports = RoomsCollection = Backbone.Collection.extend

  model: RoomModel
  max: 10

  initialize: (models, options) ->
    _.bindAll(this, 'update_rooms', 'update_room', 'update_states', 'update_state')
    @update_rooms = _.throttle(@update_rooms, 1000 / 15)
    @io = options.io

  comparator: (room) -> return room.players.length

  update_states: -> @each(@update_state)

  update_state: (room) ->
    players = room.players
    projectiles = room.projectiles

    projectiles.update()
    players.update()

  update_rooms: -> @each(@update_room)

  update_room: (room) ->
    room_name = room.get('name')

    players = room.players
    projectiles = room.projectiles

    @io.sockets.in(room_name).volatile.emit('players:update', players.toJSON())
    @io.sockets.in(room_name).volatile.emit('projectiles:update', projectiles.toJSON())

  new: ->
    room = new RoomModel()
    room_name = room.get('name')

    players = room.players
    projectiles = room.projectiles

    players.bind 'remove', (player) =>
      @remove(room) unless players.length > 0
      players.balance()
      @io.sockets.in(room_name).emit('player:disconnect', player.toJSON())

    projectiles.bind 'remove', (projectile) =>
      @io.sockets.in(room_name).volatile.emit('projectile:remove', projectile.toJSON())

    @add(room)

    return room

  next: ->
    room = @first()
    room = @new(room) unless room and room.players.length < @max
    return room
