(function() {
  var PlayerModel, PlayersCollection, ProjectileModel, ProjectilesCollection, Vector, app, express, game_loop, io, nko, players, projectiles, send_updates, _;
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
  app.post('/', function(req, res) {
    return res.end();
  });
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
  io.configure(function() {
    return io.set('log level', 1);
  });
  io.configure('production', function() {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.set('log level', 1);
    return io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  });
  players = new PlayersCollection();
  projectiles = new ProjectilesCollection();
  players.bind('remove', function(player) {
    console.log("removing player " + player.id);
    return io.sockets.emit('player:disconnect', player.toJSON());
  });
  projectiles.bind('remove', function(projectile) {
    return io.sockets.volatile.emit('projectile:remove', projectile.toJSON());
  });
  send_updates = function() {
    io.sockets.volatile.emit('players:update', players.toJSON());
    return io.sockets.volatile.emit('projectiles:update', projectiles.toJSON());
  };
  send_updates = _.throttle(send_updates, 1000 / 15);
  game_loop = function() {
    projectiles.update();
    players.update();
    send_updates();
    return setTimeout(function() {
      return game_loop();
    }, 1000 / 60);
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
    players.add(player);
    socket.on('player:name', function(name) {
      return player.set({
        name: name
      }, {
        silent: true
      });
    });
    socket.on('player:update', function(action, callback) {
      var player_state, projectile;
      player_state = player.get('state');
      if (action === 'SPACE' && (player_state === 'waiting' || player_state === 'dead')) {
        return player.set({
          state: 'alive',
          score: 0,
          lives: 3,
          hp: 100,
          position: Math.random() * Math.PI * 2,
          velocity: 0
        }, {
          silent: true
        });
      } else if (player_state === 'alive') {
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
            projectiles.add(projectile);
            return callback(projectile.id);
        }
      }
    });
    return socket.on('disconnect', function() {
      var diff, ships, spores;
      player = players.get(socket.id);
      players.remove(player);
      spores = players.spores();
      ships = players.ships();
      if (spores.length > ships.length) {
        diff = spores.length - ships.length;
        if (diff > 1) {
          return spores[0].set({
            team: 'ships'
          }, {
            silent: true
          });
        }
      } else {
        diff = ships.length - spores.length;
        if (diff > 1) {
          return ships[0].set({
            team: 'spores'
          }, {
            silent: true
          });
        }
      }
    });
  });
}).call(this);
