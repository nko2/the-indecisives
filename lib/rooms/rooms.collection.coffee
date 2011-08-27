Backbone = require('backbone')
_ = require('underscore')

module.exports = RoomsCollection = Backbone.Collection.extend

  model: RoomModel
  max: 10

  comparator: (room) -> return room.players.length

  next: ->
    console.log 'getting next available room...'

    room = @first()

    unless room and room.length < max
      console.log 'creating a new room...'
      room = new RoomModel()
      @add(room)

    return room


