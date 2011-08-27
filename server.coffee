nko = require('nko')('L3U8N469dCVshmal')

express = require('express')
_ = require('underscore')

Vector = require('./src/scripts/vector')
PlayerModel = require('./src/scripts/players/player.model')
PlayersCollection = require('./src/scripts/players/players.collection')

app = express.createServer()
app.use(express.compiler(src: "#{__dirname}/src", dest: "#{__dirname}/public", enable: ['coffeescript', 'less']))
app.use(express.static("#{__dirname}/public"))
app.listen(80)

console.log("listening on #{80}...")

io = require('socket.io').listen(app)
io.configure -> io.set('log level', 2)

players = new PlayersCollection()

players.bind 'remove', (player) ->
  io.sockets.volatile.emit('player:disconnect', player.toJSON())

players.bind 'change', (player) ->
  io.sockets.volatile.emit('player:update', player.toJSON())

game_loop = ->
  console.log Date.now()
  players.update()

  setTimeout ->
    game_loop()
  , 1000 / 1

game_loop()

io.sockets.on 'connection', (socket) ->
  team = if players.spores().length > players.ships().length then 'ships' else 'spores'

  player = new PlayerModel(id: socket.id, team: team)
  player.players = players
  players.add(player, silent: true)

  socket.on 'player:update',  (action, callback) ->
    player_state = player.get('state')

    switch action
      when 'LEFT' then player.move_right()
      when 'RIGHT' then player.move_left()
      when 'DOWN' then player.aim_left()
      when 'UP' then player.aim_right()

  socket.on 'disconnect', ->
    player = players.get(socket.id)
    players.remove(player)
