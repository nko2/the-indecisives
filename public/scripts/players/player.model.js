(function() {
  var Backbone, PlayerModel, Vector;
  if (typeof require !== "undefined" && require !== null) {
    Backbone = require('backbone');
    Vector = require('./src/scripts/vector');
  } else {
    Backbone = window.Backbone;
    Vector = window.Vector;
  }
  PlayerModel = Backbone.Model.extend({
    defaults: {
      team: 'ships',
      self: false,
      position: Math.random() * Math.PI * 2,
      velocity: 0,
      trajectory: 0
    },
    max_speed: 0.5,
    max_angle: Math.PI / 4,
    initialize: function() {
      return this.speed = this.get('team') === 'spores' ? 0.01 : 0.005;
    },
    move_left: function() {
      var velocity;
      velocity = this.get('velocity');
      if (velocity < this.max_speed) {
        return this.set({
          velocity: velocity += this.speed
        }, {
          silent: true
        });
      }
    },
    move_right: function() {
      var velocity;
      velocity = this.get('velocity');
      if (velocity < this.max_speed) {
        return this.set({
          velocity: velocity -= this.speed
        }, {
          silent: true
        });
      }
    },
    aim_left: function() {
      var trajectory;
      trajectory = this.get('trajectory');
      if (trajectory < this.max_angle) {
        return this.set({
          trajectory: trajectory += 0.1
        }, {
          silent: true
        });
      }
    },
    aim_right: function() {
      var trajectory;
      trajectory = this.get('trajectory');
      if (trajectory > -this.max_angle) {
        return this.set({
          trajectory: trajectory -= 0.1
        }, {
          silent: true
        });
      }
    },
    update: function() {
      var position, rotation, team, velocity;
      velocity = this.get('velocity');
      position = this.get('position');
      team = this.get('team');
      rotation = team === 'spores' ? 0.001 : 0.005;
      velocity *= 0.9;
      position += velocity + rotation;
      this.set({
        velocity: velocity,
        position: position
      }, {
        silent: true
      });
      return this.change();
    },
    draw: function(helper) {}
  });
}).call(this);
