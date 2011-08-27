nko = require('nko')('L3U8N469dCVshmal')

express = require('express')
_ = require('underscore')

Vector = require('./public/scripts/vector')
PlayerModel = require('./public/scripts/players/player.model')
PlayersCollection = require('./public/scripts/players/players.collection')

ProjectilesCollection = require('./public/scripts/projectiles/projectiles.collection')

app = express.createServer()
app.use(express.compiler(src: "#{__dirname}/src", dest: "#{__dirname}/public", enable: ['coffeescript', 'less']))
app.use(express.static("#{__dirname}/public"))

app.post '/', (req, res) -> res.end()

app.listen 80, ->
  # if run as root, downgrade to the owner of this file
  if process.getuid() is 0
    require('fs').stat __filename, (err, stats) ->
      return console.log(err) if err
      process.setuid(stats.uid)

console.log("listening on #{80}...")

io = require('socket.io').listen(app)
io.configure -> io.set('log level', 1)
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

send_updates = ->
  io.sockets.volatile.emit('players:update', players.toJSON())
  io.sockets.volatile.emit('projectiles:update', projectiles.toJSON())

send_updates = _.throttle(send_updates, 1000 / 15)

game_loop = ->
  projectiles.update()
  players.update()

  send_updates()

  setTimeout ->
    game_loop()
  , 1000 / 60 #/

game_loop()

io.sockets.on 'connection', (socket) ->
  team = if players.spores().length > players.ships().length then 'ships' else 'spores'

  player = new PlayerModel(id: socket.id, team: team)
  player.players = players
  players.add(player)

  socket.on 'player:name', (name) ->
    player.set({ name: name }, silent: true)

  socket.on 'player:update', (action, callback) ->
    player_state = player.get('state')

    if action is 'SPACE' and (player_state is 'waiting' or player_state is 'dead')
      player.set({ state: 'alive', score: 0, lives: 3, hp: 100, position: Math.random() * Math.PI * 2, velocity: 0 }, silent: true)
    else if player_state is 'alive'
      switch action
        when 'LEFT' then player.move_right()
        when 'RIGHT' then player.move_left()
        when 'DOWN' then player.aim_left()
        when 'UP' then player.aim_right()
        when 'SPACE'
          projectile = player.fire()
          projectile.projectiles = projectiles
          projectile.players = players
          projectiles.add(projectile)
          callback(projectile.id)

  socket.on 'disconnect', ->
    player = players.get(socket.id)
    players.remove(player)

    spores = players.spores()
    ships = players.ships()

    if spores.length > ships.length
      diff = spores.length - ships.length
      spores[0].set({ team: 'ships' }, silent: true) if diff > 1
    else
      diff = ships.length - spores.length
      ships[0].set({ team: 'spores' }, silent: true) if diff > 1
