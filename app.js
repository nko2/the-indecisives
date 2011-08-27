(function() {
  var PlayerModel, PlayersCollection, ProjectileModel, ProjectilesCollection, Vector, app, express, game_loop, io, nko, players, projectiles, _;
  nko = require('nko')('L3U8N469dCVshmal');
  express = require('express');
  _ = require('underscore');
  Vector = require('./public/scripts/vector');
  PlayerModel = require('./public/scripts/players/player.model');
  PlayersCollection = require('./public/scripts/players/players.collection');
  ProjectileModel = require('./public/scripts/projectiles/projectile.model');
  ProjectilesCollection = require('./public/scripts/projectiles/projectiles.collection');
  app = express.createServer();
  app.use(express.compiler({
    src: "" + __dirname + "/src",
    dest: "" + __dirname + "/public",
    enable: ['coffeescript', 'less']
  }));
  app.use(express.static("" + __dirname + "/public"));
  app.listen(80, function() {
    if (process.getuid() === 0) {
      return require('fs').stat(__filename, function(err, stats) {
        if (err) {
          return console.log(err);
        }
        return process.setuid(stats.uid);
      });
    }
  });
  console.log("listening on " + 80 + "...");
  io = require('socket.io').listen(app);
  io.configure('production', function() {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.set('log level', 1);
    return io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  });
  players = new PlayersCollection();
  projectiles = new ProjectilesCollection();
  players.bind('remove', function(player) {
    return io.sockets.volatile.emit('player:disconnect', player.toJSON());
  });
  projectiles.bind('remove', function(projectile) {
    return io.sockets.volatile.emit('projectile:remove', projectile.toJSON());
  });
  game_loop = function() {
    projectiles.update();
    players.update();
    io.sockets.volatile.emit('projectiles:update', projectiles.toJSON());
    io.sockets.volatile.emit('players:update', players.toJSON());
    return setTimeout(function() {
      return game_loop();
    }, 1000 / 30);
  };
  game_loop();
  io.sockets.on('connection', function(socket) {
    var player, team;
    team = players.spores().length > players.ships().length ? 'ships' : 'spores';
    player = new PlayerModel({
      id: socket.id,
      team: team
    });
    player.players = players;
    players.add(player, {
      silent: true
    });
    socket.on('player:update', function(action, callback) {
      var player_state, projectile;
      player_state = player.get('state');
      switch (action) {
        case 'LEFT':
          return player.move_right();
        case 'RIGHT':
          return player.move_left();
        case 'DOWN':
          return player.aim_left();
        case 'UP':
          return player.aim_right();
        case 'SPACE':
          projectile = player.fire();
          projectile.projectiles = projectiles;
          projectile.players = players;
          projectiles.add(projectile, {
            silent: true
          });
          console.log(projectile.id);
          return callback(projectile.id);
      }
    });
    return socket.on('disconnect', function() {
      player = players.get(socket.id);
      return players.remove(player);
    });
  });
}).call(this);
