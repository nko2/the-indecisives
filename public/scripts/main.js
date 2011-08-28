(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.onload = function() {
    var background, helper, orbit, planet, players, players_view, projectiles, socket, splash;
    helper = new Canvas(document.getElementById('game-canvas'));
    background = new Background();
    planet = new Planet();
    orbit = new Orbit(200);
    window.players = players = new PlayersCollection();
    window.projectiles = projectiles = new ProjectilesCollection();
    window.explosion = new Explosion();
    splash = new Splash('Get Started', 'Press the spacebar to join the fight!');
    players_view = new PlayersView({
      collection: players,
      el: document.getElementById('players')
    });
    helper.draw(function() {
      projectiles.update();
      players.update();
      background.draw(this);
      planet.draw(this);
      orbit.draw(this);
      players.draw(this);
      projectiles.draw(this);
      return splash.draw(this);
    });
    window.socket = socket = io.connect();
    return socket.on('connect', function() {
      $(document.getElementById('name-form')).bind('submit', function(e) {
        e.preventDefault();
        return socket.emit('player:name', document.getElementById('name').value);
      });
      window.addEventListener('keypress', __bind(function(event) {
        switch (event.keyCode) {
          case 100:
          case 68:
            if (current_player.get('state') !== 'alive') {
              return;
            }
            socket.emit('player:aim:left');
            return current_player.aim_left();
          case 97:
          case 65:
            if (current_player.get('state') !== 'alive') {
              return;
            }
            socket.emit('player:aim:right');
            return current_player.aim_right();
        }
      }, this), false);
      window.addEventListener('keyup', __bind(function(event) {
        var projectile;
        console.log(event.keyCode);
        switch (event.keyCode) {
          case 83:
            if (current_player.get('state') !== 'alive') {
              return;
            }
            socket.emit('player:move:left');
            return current_player.move_left();
          case 87:
            if (current_player.get('state') !== 'alive') {
              return;
            }
            socket.emit('player:move:right');
            return current_player.move_right();
          case 74:
            console.log('JOIN');
            return socket.emit('player:join');
          case 13:
            if (current_player.get('state') !== 'alive') {
              return;
            }
            projectile = current_player.fire();
            projectile.projectiles = projectiles;
            projectile.players = players;
            projectiles.add(projectile);
            return socket.emit('player:fire', function(projectile_id) {
              if (projectile_id) {
                return projectile.set({
                  id: projectile_id
                });
              }
            });
        }
      }, this), false);
      socket.on('players:update', function(players_data) {
        return _.each(players_data, function(player_data) {
          var accuracy, duration, fires, hits, kills, player, state;
          player = players.get(player_data.id);
          if (player_data.id === socket.socket.sessionid) {
            player_data.self = true;
          }
          if (!player) {
            player = new PlayerModel(player_data);
            if (player_data.self) {
              window.current_player = player;
            }
            player.players = players;
            player.projectiles = projectiles;
            players.add(player);
          } else {
            player.set(player_data);
          }
          if (!player_data.self) {
            return;
          }
          state = player_data.state;
          if (state === 'dead') {
            kills = player.get('kills');
            hits = player.get('hits');
            fires = player.get('fires');
            accuracy = fires > 0 ? (hits / fires).toPrecision(2) : 0;
            duration = (player.get('end') - player.get('start')) / 1000;
            splash.header = 'You died...';
            splash.body = "" + kills + " total kills\n" + accuracy + "% accuracy\nsurvived " + duration + " seconds\n\nPress the spacebar to rejoin the fight!";
            splash.height = 220;
            return splash.show();
          } else if (state !== 'waiting') {
            return splash.hide();
          }
        });
      });
      socket.on('player:disconnect', function(player_data) {
        var player;
        player = players.get('player_data.id');
        return players.remove(player);
      });
      socket.on('projectiles:update', function(projectiles_data) {
        return _.each(projectiles_data, function(projectile_data) {
          var projectile;
          if (projectile_data.player === socket.socket.sessionid) {
            projectile_data.self = true;
          }
          if (projectile_data.position) {
            projectile_data.position = new Vector(projectile_data.position.x, projectile_data.position.y);
          }
          if (projectile_data.velocity) {
            projectile_data.velocity = new Vector(projectile_data.velocity.x, projectile_data.velocity.y);
          }
          projectile = projectiles.get(projectile_data.id);
          if (!projectile) {
            projectile = new ProjectileModel(projectile_data);
            projectile.players = players;
            projectile.projectiles = projectiles;
            return projectiles.add(projectile);
          } else {
            return projectile.set(projectile_data);
          }
        });
      });
      return socket.on('projectile:remove', function(projectile_data) {
        var projectile;
        projectile = projectiles.get(projectile_data.id);
        return projectiles.remove(projectile);
      });
    });
  };
}).call(this);
