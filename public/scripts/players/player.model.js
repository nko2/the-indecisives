(function() {
  var Backbone, PlayerModel, ProjectileModel, Vector;
  if (typeof require !== "undefined" && require !== null) {
    Backbone = require('backbone');
    Vector = require('../vector');
    ProjectileModel = require('../projectiles/projectile.model');
  } else {
    Backbone = window.Backbone;
    Vector = window.Vector;
    ProjectileModel = window.ProjectileModel;
  }
  console.log(ProjectileModel);
  PlayerModel = Backbone.Model.extend({
    defaults: {
      team: 'ships',
      self: false,
      position: Math.random() * Math.PI * 2,
      velocity: 0,
      trajectory: 0,
      state: 'alive'
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
    fire: function() {
      var direction, id, offset, player_fires, player_id, player_position, player_team, player_trajectory, position, projectile, velocity;
      player_id = this.get('id');
      player_team = this.get('team');
      player_position = this.get('position');
      player_trajectory = this.get('trajectory');
      player_fires = this.get('fires');
      this.set({
        fires: ++player_fires
      }, {
        silent: true
      });
      if (player_team === 'spores') {
        offset = -100;
        direction = -10;
      } else {
        offset = -200;
        direction = 10;
      }
      position = new Vector(0, offset).rotate(player_position);
      velocity = new Vector(1, direction).rotate(player_position);
      id = "" + player_id + "_" + (Date.now());
      return projectile = new ProjectileModel({
        id: id,
        player: player_id,
        position: position,
        velocity: velocity
      });
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
    test: function() {},
    draw: function(helper) {
      var position, self, team, trajectory;
      team = this.get('team');
      self = this.get('self');
      position = this.get('position');
      trajectory = this.get('trajectory');
      helper.save();
      helper.translate(helper.half_width, helper.half_height);
      helper.rotate(position);
      helper.translate(0, team === 'spores' ? -100 : -200);
      helper.no_stroke();
      helper.fill('rgba(255, 255, 255, 0.8)');
      helper.circle(0, 0, 4, 4);
      helper.no_fill();
      helper.stroke_width(2);
      helper.stroke("rgba(255, 255, 255, 1");
      helper.circle(0, 0, 12, 12);
      if (self) {
        helper.stroke('rgba(255, 0, 0, 0.8)');
        helper.circle(0, 0, 20, 20);
      }
      helper.rotate(trajectory);
      helper.no_stroke();
      helper.fill('rgba(255, 255, 255, 0.8)');
      if (team === 'spores') {
        helper.rect(-1, 4, 2, -18);
      } else {
        helper.rect(-1, 4, 2, 10);
      }
      return helper.restore();
    }
  });
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = PlayerModel;
  } else {
    window.PlayerModel = PlayerModel;
  }
}).call(this);
