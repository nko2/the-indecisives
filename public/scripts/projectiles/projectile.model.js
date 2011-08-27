(function() {
  var Backbone, ProjectileModel, Vector, _;
  if (typeof require !== "undefined" && require !== null) {
    _ = require('underscore');
    Backbone = require('backbone');
    Vector = require('../vector');
  } else {
    _ = window._;
    Backbone = window.Backbone;
    Vector = window.Vector;
  }
  ProjectileModel = Backbone.Model.extend({
    defaults: {
      ttl: 100,
      state: 'alive',
      velocity: new Vector(),
      position: new Vector(),
      self: false
    },
    initialize: function() {
      return _.bindAll(this, 'update');
    },
    update: function() {
      var delta, distance, force, position, r_squared, size, state, strength, ttl, velocity;
      state = this.get('state');
      ttl = this.get('ttl');
      ttl--;
      if (ttl < 0) {
        this.projectiles.remove(this);
        return;
      }
      if (state === 'dying') {
        this.set({
          ttl: ttl
        }, {
          silent: true
        });
        return;
      }
      velocity = this.get('velocity');
      position = this.get('position');
      size = 100;
      r_squared = position.squared_distance(new Vector());
      distance = Math.sqrt(r_squared);
      if (distance < 100) {
        this.projectiles.remove(this);
      }
      if (r_squared !== 0) {
        strength = 1;
        force = strength * (size / r_squared);
        delta = new Vector(-position.x * force, -position.y * force);
        velocity.add(delta);
        position.add(velocity);
        this.set({
          velocity: velocity,
          position: position,
          ttl: ttl
        }, {
          silent: true
        });
        return this.players.test(this);
      }
    },
    draw: function(helper) {
      var position, state, ttl;
      position = this.get('position');
      ttl = this.get('ttl');
      state = this.get('state');
      helper.no_stroke();
      if (this.get('self')) {
        helper.fill('rgba(255, 0, 0, 0.9)');
      } else {
        helper.fill('rgba(192, 192, 192, 0.6)');
      }
      helper.save();
      helper.translate(helper.width / 2, helper.height / 2);
      helper.translate(position.x, position.y);
      helper.circle(0, 0, 2, 2);
      if (state === 'dying') {
        window.explosion.draw(helper);
      }
      return helper.restore();
    }
  });
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = ProjectileModel;
  } else {
    window.ProjectileModel = ProjectileModel;
  }
}).call(this);
