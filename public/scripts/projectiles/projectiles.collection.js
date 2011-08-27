(function() {
  var Backbone, ProjectileModel, ProjectilesCollection, _;
  if (typeof require !== "undefined" && require !== null) {
    Backbone = require('backbone');
    _ = require('underscore');
    ProjectileModel = require('./projectile.model');
  } else {
    Backbone = window.Backbone;
    _ = window._;
    ProjectileModel = window.ProjectileModel;
  }
  ProjectilesCollection = Backbone.Collection.extend({
    model: ProjectileModel,
    draw: function(helper) {
      return this.each(function(projectile) {
        return projectile.draw(helper);
      });
    },
    update: function() {
      return this.each(function(projectile) {
        return projectile.update();
      });
    },
    changes: function() {
      var changed_projectiles;
      changed_projectiles = [];
      this.each(function(projectile) {
        var changed_projectile;
        changed_projectile = projectile.changedAttributes();
        if (changed_projectile) {
          return changed_projectiles.push(changed_projectile);
        }
      });
      return changed_projectiles;
    }
  });
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = ProjectilesCollection;
  } else {
    window.ProjectilesCollection = ProjectilesCollection;
  }
}).call(this);
