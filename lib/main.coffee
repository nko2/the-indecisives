window.onload = ->
  helper = new Canvas(document.getElementById('game-canvas'))
  background = new Background()
  planet = new Planet()
  orbit = new Orbit(200)
  
  window.players = players = new PlayersCollection()
  window.player = player = new PlayerModel()
  window.projectiles = projectiles = new ProjectilesCollection()
  window.projectile = projectile = new ProjectileModel()
  
  helper.draw ->
    players.update()
    projectiles.update()
    
    background.draw(this)
    planet.draw(this)
    orbit.draw(this)
    players.draw(this)
    projectiles.draw(this)
  
  window.socket = socket = io.connect()

  socket.socket.on 'error', (reason) ->
    console.error('unable to connect socket.io', reason)

  socket.on 'players:update', (players_data) -> 
    _.each players_data, (player_data) ->
      player_data.self = true if player_data.id is socket.socket.sessionid
      player = players.get(player_data.id)
      
      unless player
        player = new PlayerModel(player_data)
        window.current_player = player if player_data.self
        player.players = players
        players.add(player)
        return
      
      player.clear()
      player.set(player_data)
      
      return unless player_data.self
    
  socket.on 'player:disconnect', (player_data) ->
    player = players.get('player_data.id')
    players.remove(player)

  socket.on 'connect', ->
    socket.on 'error',(err) -> console.error(err)

    window.addEventListener 'keypress', (event) =>
      switch event.keyCode
        when 100, 68
          socket.emit('player:update', 'UP')
          current_player.aim_left() if current_player.get('state') is 'alive'
        when 97, 65
          socket.emit('player:update', 'DOWN')  
          current_player.aim_right() if current_player.get('state') is 'alive'
    , false

    window.addEventListener 'keyup', (event) =>
      switch event.keyCode
        when 83
          socket.emit('player:update', 'LEFT')
          current_player.move_left() if current_player.get('state') is 'alive'
        when 87
          socket.emit('player:update', 'RIGHT')  
          current_player.move_right() if current_player.get('state') is 'alive'
        when 32
          if current_player.get('state') is 'alive'
            projectile = current_player.fire()
            projectile.projectiles = projectiles
            projectile.players = players
            projectiles.add(projectile)

          socket.emit 'player:update', 'SPACE', (projectile_id) ->
            projectile.set(id: projectile_id) if projectile_id
    , false
    
    socket.on 'projectile:update', (projectile_data) ->
      projectile_data.self = true if projectile_data.player is socket.socket.sessionid
      projectile = projectiles.get(projectile_data.id)
      projectile_data.position = new Vector(projectile_data.position.x, projectile_data.position.y) if projectile_data.position
      projectile_data.velocity = new Vector(projectile_data.velocity.x, projectile_data.velocity.y) if projectile_data.velocity

      unless projectile
        projectile = new ProjectileModel(projectile_data)
        projectile.players = players 
        projectile.projectiles = projectiles
        projectiles.add(projectile)
        return
      
      projectile.clear()
      projectile.set(projectile_data)
      
           
      
  socket.on 'disconnect', -> 
    console.error('disconnected')

  
























