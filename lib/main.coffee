soundManager.url = '/swfs/'
soundManager.flashVersion = 9
soundManager.useFlashBlock = false

soundManager.onready ->
  soundManager.createSound
    id: 'background'
    url: '/audio/background.mp3'
    autoLoad: true
    autoPlay: true
    loops: 5
    volume: 50

  soundManager.createSound
    id: 'explosion'
    url: '/audio/explosion.mp3'
    autoLoad: true
    autoPlay: false
    volume: 50

  soundManager.createSound
    id: 'fire1'
    url: '/audio/fire1.mp3'
    autoLoad: true
    autoPlay: false
    volume: 50

  soundManager.createSound
    id: 'fire2'
    url: '/audio/fire2.mp3'
    autoLoad: true
    autoPlay: false
    volume: 50

$(document.getElementById('toggle-mute')).bind 'click', (e) ->
  e.preventDefault()
  soundManager.toggleMute('background')
  soundManager.toggleMute('explosion')
  soundManager.toggleMute('fire1')
  soundManager.toggleMute('fire2')

helper = new Canvas(document.getElementById('game-canvas'))

background = new Background()
planet = new Planet()
orbit = new Orbit(200)

window.players = players = new PlayersCollection()
window.projectiles = projectiles = new ProjectilesCollection()
window.explosion = new Explosion()

splash = new Splash()
splash.header = 'Get Started'
splash.height = 140
splash.body = """
  Press "J" to join the fight!
  Press "ENTER" to fire!
  """

players_view = new PlayersView(collection: players, el: document.getElementById('players'))

aiming_left = false
aiming_right = false

camera_position = new Vector()

aim_left = _.throttle ->
  socket.emit('player:aim:left')
  current_player.aim_left()
, 1000 / 15

aim_right = _.throttle ->
  socket.emit('player:aim:right')
  current_player.aim_right()
, 1000 / 15

$("a[href^='#']").bind 'click', (e) ->
  e.preventDefault()
  
  target = @hash
  return unless target.length > 0

  $target = $(target)
  
  $('html, body').stop().animate
    scrollTop: $target.offset().top
  , 500, ->
    window.location.hash = target
		
helper.draw ->
  aim_left() if aiming_left
  aim_right() if aiming_right

  camera_position.add(new Vector(Math.sin(@ticks * 0.02) * 0.5 * Math.random(), Math.cos(@ticks * 0.02) * 0.5 * Math.random()))
  camera_position.restrict(25)

  @save()
  @translate(camera_position.x, camera_position.y)

  projectiles.update()
  players.update()
  
  background.draw(this)
  planet.draw(this)
  orbit.draw(this)

  players.draw(this)
  projectiles.draw(this)

  @restore()

  splash.draw(this)

window.socket = socket = io.connect()

socket.on 'connect', ->
  $(document.getElementById('update-name')).bind 'click', (e) ->
    e.preventDefault()
    socket.emit('player:name', document.getElementById('name').value)

  $(document).bind 'keydown', (event) =>
    switch event.keyCode
      when 68 then aiming_left = true if current_player.get('state') is 'alive'
      when 65 then aiming_right = true if current_player.get('state') is 'alive'

  $(document).bind 'keyup', (event) =>
    switch event.keyCode
      when 68 then aiming_left = false
      when 65 then aiming_right = false
      when 83
        return unless current_player.get('state') is 'alive'
        socket.emit('player:move:left')
        current_player.move_left()
      when 87
        return unless current_player.get('state') is 'alive'
        socket.emit('player:move:right')
        current_player.move_right()
      when 74
        socket.emit('player:join')
      when 13
        return unless current_player.get('state') is 'alive'
        projectile = current_player.fire()
        projectile.projectiles = projectiles
        projectile.players = players
        projectiles.add(projectile)

        socket.emit 'player:fire', (projectile_id) ->
          projectile.set(id: projectile_id) if projectile_id

  # PLAYERS UPDATE
  socket.on 'players:update', (players_data) -> 
    _.each players_data, (player_data) ->
      player = players.get(player_data.id)
      player_data.self = true if player_data.id is socket.socket.sessionid

      unless player
        player = new PlayerModel(player_data)
        window.current_player = player if player_data.self
        player.players = players
        player.projectiles = projectiles
        players.add(player)
      else player.set(player_data)
      
      return unless player_data.self

      state = player_data.state

      if state is 'dead'
        kills = player.get('kills')
        hits = player.get('hits')
        fires = player.get('fires')
        accuracy = if fires > 0 then (hits / fires).toPrecision(2) else 0
        duration = (player.get('end') - player.get('start')) / 1000

        splash.header = 'You died...'
        splash.height = 220
        splash.body = """
          #{kills} total kills
          #{accuracy}% accuracy
          survived #{duration} seconds
          
          Press the spacebar to rejoin the fight!
          """

        splash.show()
      else unless state is 'waiting'
        splash.hide()

  # PLAYER DISCONNECT
  socket.on 'player:disconnect', (player_data) ->
    player = players.get('player_data.id')
    players.remove(player)
  
  # PROJECTILE UPDATE
  socket.on 'projectiles:update', (projectiles_data) ->
    _.each projectiles_data, (projectile_data) ->
      projectile_data.self = true if projectile_data.player is socket.socket.sessionid
      projectile_data.position = new Vector(projectile_data.position.x, projectile_data.position.y) if projectile_data.position
      projectile_data.velocity = new Vector(projectile_data.velocity.x, projectile_data.velocity.y) if projectile_data.velocity
      projectile = projectiles.get(projectile_data.id)
      unless projectile
        projectile = new ProjectileModel(projectile_data)
        projectile.players = players 
        projectile.projectiles = projectiles
        projectiles.add(projectile)
      else projectile.set(projectile_data)
    
  # PROJECTILE REMOVE  
  socket.on 'projectile:remove', (projectile_data) ->
    projectile = projectiles.get(projectile_data.id)
    projectiles.remove(projectile)
