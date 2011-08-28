(function() {
  var aim_left, aim_right, aiming_left, aiming_right, background, camera_position, helper, orbit, planet, players, players_view, projectiles, socket, splash;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  soundManager.url = '/swfs/';
  soundManager.flashVersion = 9;
  soundManager.useFlashBlock = false;
  soundManager.onready(function() {
    soundManager.createSound({
      id: 'background',
      url: '/audio/background.mp3',
      autoLoad: true,
      autoPlay: true,
      loops: 5,
      volume: 50
    });
    soundManager.createSound({
      id: 'explosion',
      url: '/audio/explosion.mp3',
      autoLoad: true,
      autoPlay: false,
      volume: 50
    });
    soundManager.createSound({
      id: 'fire1',
      url: '/audio/fire1.mp3',
      autoLoad: true,
      autoPlay: false,
      volume: 50
    });
    return soundManager.createSound({
      id: 'fire2',
      url: '/audio/fire2.mp3',
      autoLoad: true,
      autoPlay: false,
      volume: 50
    });
  });
  $(document.getElementById('toggle-mute')).bind('click', function(e) {
    e.preventDefault();
    soundManager.toggleMute('background');
    soundManager.toggleMute('explosion');
    soundManager.toggleMute('fire1');
    return soundManager.toggleMute('fire2');
  });
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
  aiming_left = false;
  aiming_right = false;
  camera_position = new Vector();
  aim_left = _.throttle(function() {
    socket.emit('player:aim:left');
    return current_player.aim_left();
  }, 1000 / 15);
  aim_right = _.throttle(function() {
    socket.emit('player:aim:right');
    return current_player.aim_right();
  }, 1000 / 15);
  $("a[href^='#']").bind('click', function(e) {
    var $target, target;
    e.preventDefault();
    target = this.hash;
    $target = $(target);
    return $('html, body').stop().animate({
      scrollTop: $target.offset().top
    }, 500, function() {
      return window.location.hash = target;
    });
  });
  helper.draw(function() {
    if (aiming_left) {
      aim_left();
    }
    if (aiming_right) {
      aim_right();
    }
    camera_position.add(new Vector(Math.sin(this.ticks * 0.02) * 0.5 * Math.random(), Math.cos(this.ticks * 0.02) * 0.5 * Math.random()));
    camera_position.restrict(25);
    this.save();
    this.translate(camera_position.x, camera_position.y);
    projectiles.update();
    players.update();
    background.draw(this);
    planet.draw(this);
    orbit.draw(this);
    players.draw(this);
    projectiles.draw(this);
    this.restore();
    return splash.draw(this);
  });
  window.socket = socket = io.connect();
  socket.on('connect', function() {
    $(document.getElementById('name-form')).bind('submit', function(e) {
      e.preventDefault();
      return socket.emit('player:name', document.getElementById('name').value);
    });
    $(document).bind('keydown', __bind(function(event) {
      switch (event.keyCode) {
        case 68:
          if (current_player.get('state') === 'alive') {
            return aiming_left = true;
          }
          break;
        case 65:
          if (current_player.get('state') === 'alive') {
            return aiming_right = true;
          }
      }
    }, this));
    $(document).bind('keyup', __bind(function(event) {
      var projectile;
      switch (event.keyCode) {
        case 68:
          return aiming_left = false;
        case 65:
          return aiming_right = false;
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
    }, this));
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
}).call(this);
