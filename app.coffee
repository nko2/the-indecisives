nko = require('nko')('L3U8N469dCVshmal')

express = require('express')
_ = require('underscore')

Vector = require('./public/scripts/vector')
PlayerModel = require('./public/scripts/players/player.model')
RoomsCollection = require('./public/scripts/rooms/rooms.collection')

PlayersCollection = require('./public/scripts/players/players.collection')
ProjectilesCollection = require('./public/scripts/projectiles/projectiles.collection')

app = express.createServer()
app.use(express.compiler(src: "#{__dirname}/src", dest: "#{__dirname}/public", enable: ['coffeescript', 'less']))
app.use(express.static("#{__dirname}/public"))

app.listen 80, ->
  # if run as root, downgrade to the owner of this file
  if process.getuid() is 0
    require('fs').stat __filename, (err, stats) ->
      return console.log(err) if err
      process.setuid(stats.uid)

console.log("listening on #{80}...")

io = require('socket.io').listen(app)

io.configure ->
  io.set('log level', 2)
  io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'])

io.configure 'production', ->
  io.enable('browser client minification')
  io.enable('browser client etag')
  io.set('log level', 1)
  io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'])

rooms = new RoomsCollection(null, io: io)

update_clients = ->

update_clients = _.throttle(update_clients, 1000 / 15)

game_loop = ->
  rooms.update_states()
  rooms.update_rooms()

  setTimeout ->
    game_loop()
  , 1000 / 60 #/

game_loop()

io.sockets.on 'connection', (socket) ->
  room = rooms.next()
  room_name = room.get('name')

  socket.join(room_name)

  players = room.players
  projectiles = room.projectiles

  team = if players.spores().length > players.ships().length then 'ships' else 'spores'

  player = new PlayerModel(id: socket.id, team: team)
  player.players = players
  players.add(player)

  socket.on 'player:name', (name) ->
    player.set({ name: name }, silent: true)

  socket.on 'player:move:left', -> player.move_left()
  socket.on 'player:move:right', -> player.move_right()
  socket.on 'player:aim:left', -> player.aim_left()
  socket.on 'player:aim:right', -> player.aim_right()

  socket.on 'player:fire', (callback) ->
    return unless player.get('state') is 'alive'
    projectile = player.fire()
    projectile.projectiles = projectiles
    projectile.players = players
    projectiles.add(projectile)
    callback(projectile.id)

  socket.on 'player:join', ->
    return unless player.get('state') in ['waiting', 'dead']
    player.set({ state: 'alive', score: 0, lives: 3, hp: 100, position: Math.random() * Math.PI * 2, velocity: 0 }, silent: true)

  socket.on 'disconnect', ->
    player = players.get(socket.id)
    players.remove(player)
