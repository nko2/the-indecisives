nko = require('nko')('L3U8N469dCVshmal')

express = require('express')
_ = require('underscore')

Vector = require('./public/scripts/vector')
PlayerModel = require('./public/scripts/players/player.model')
PlayersCollection = require('./public/scripts/players/players.collection')

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
io.configure 'production', ->
  io.enable('browser client minification')
  io.enable('browser client etag')
  io.set('log level', 1)
  io.set 'transports', [
         'websocket'
         'flashsocket'
         'htmlfile'
         'xhr-polling'
         'jsonp-polling'
  ]

io.configure 'development', -> io.set('transports', ['websocket'])

players = new PlayersCollection()

players.bind 'remove', (player) ->
  io.sockets.volatile.emit('player:disconnect', player.toJSON())

game_loop = ->
  players.update()

  io.sockets.volatile.emit('players:update', players.toJSON())

  setTimeout ->
    game_loop()
  , 1000 / 30

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
      when 'SPACE'
        projectile = player.fire()
        projectile.projectiles = projectiles
        projectile.players = players
        projectiles.add(projectile, silent: true)
        callback(projectile.id)

  socket.on 'disconnect', ->
    player = players.get(socket.id)
    players.remove(player)
