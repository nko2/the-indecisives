(function() {
  window.onload = function() {
    var background, helper, orbit, planet, socket;
    helper = new Canvas(document.getElementById('game-canvas'));
    background = new Background();
    planet = new Planet();
    orbit = new Orbit(200);
    helper.draw(function() {
      background.draw(this);
      planet.draw(this);
      return orbit.draw(this);
    });
    window.socket = socket = io.connect();
    socket.on('player:update', function(player_data) {
      var player;
      if (player_data === socket.socket.sessionid) {
        player_data.self = true;
      }
      player = players.get(player_data.id);
      if (!player) {
        player = new PlayerModel(player_data);
        if (player_data.self) {
          window.current_player = player;
        }
        player.players = players;
        players.add(player);
        return;
      }
      player.clear();
      player.set(player_data);
      if (!player_data.self) {}
    });
    return socket.on('player:disconnect', function(player_data) {
      var player;
      player = players.get('player_data.id');
      return players.remove(player);
    });
  };
}).call(this);
