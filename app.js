(function() {
  var PlayerModel, PlayersCollection, ProjectilesCollection, RoomsCollection, Vector, app, express, game_loop, io, nko, rooms, update_clients, _;
  nko = require('nko')('L3U8N469dCVshmal');
  express = require('express');
  _ = require('underscore');
  Vector = require('./public/scripts/vector');
  PlayerModel = require('./public/scripts/players/player.model');
  RoomsCollection = require('./public/scripts/rooms/rooms.collection');
  PlayersCollection = require('./public/scripts/players/players.collection');
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
  io.configure(function() {
    io.set('log level', 2);
    return io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  });
  io.configure('production', function() {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.set('log level', 1);
    return io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  });
  rooms = new RoomsCollection(null, {
    io: io
  });
  update_clients = function() {};
  update_clients = _.throttle(update_clients, 1000 / 15);
  game_loop = function() {
    rooms.update_states();
    rooms.update_rooms();
    return setTimeout(function() {
      return game_loop();
    }, 1000 / 60);
  };
  game_loop();
  io.sockets.on('connection', function(socket) {
    var player, players, projectiles, room, room_name, team;
    room = rooms.next();
    room_name = room.get('name');
    socket.join(room_name);
    players = room.players;
    projectiles = room.projectiles;
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
    socket.on('player:move:left', function() {
      return player.move_left();
    });
    socket.on('player:move:right', function() {
      return player.move_right();
    });
    socket.on('player:aim:left', function() {
      return player.aim_left();
    });
    socket.on('player:aim:right', function() {
      return player.aim_right();
    });
    socket.on('player:fire', function(callback) {
      var projectile;
      if (player.get('state') !== 'alive') {
        return;
      }
      projectile = player.fire();
      projectile.projectiles = projectiles;
      projectile.players = players;
      projectiles.add(projectile);
      return callback(projectile.id);
    });
    socket.on('player:join', function() {
      var _ref;
      if ((_ref = player.get('state')) !== 'waiting' && _ref !== 'dead') {
        return;
      }
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
    });
    return socket.on('disconnect', function() {
      player = players.get(socket.id);
      return players.remove(player);
    });
  });
}).call(this);
