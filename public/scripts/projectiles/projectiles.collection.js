(function() {
  var Backbone, ProjectileModel, ProjectilesCollection;
  if (typeof require !== "undefined" && require !== null) {
    Backbone = require('backbone');
    ProjectileModel = require('/src/scripts/projectile.model');
  } else {
    Backbone = window.Backbone;
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
    }
  });
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = ProjectilesCollection;
  } else {
    window.ProjectilesCollection = ProjectilesCollection;
  }
}).call(this);
