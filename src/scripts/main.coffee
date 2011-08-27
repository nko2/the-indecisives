window.onload = ->
  helper = new Canvas(document.getElementById('game-canvas'))
  background = new Background()
  planet = new Planet()
  orbit = new Orbit(200)
  
  helper.draw ->
    background.draw(this)
    planet.draw(this)
    orbit.draw(this)
  
  window.socket = socket = io.connect()
  
  socket.on 'player:update', (player_data) -> 
  
    player_data.self = true if player_data is socket.socket.sessionid
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
