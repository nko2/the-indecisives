if require?
  Backbone = require('backbone')
  _ = require('underscore')
  ProjectileModel = require('./projectile.model')
else
  Backbone = window.Backbone
  _ = window._
  ProjectileModel = window.ProjectileModel

ProjectilesCollection = Backbone.Collection.extend

  model: ProjectileModel
  
  draw:(helper) ->
    @each (projectile) -> projectile.draw(helper)

  update: ->
    @each (projectile) -> projectile.update()

  changes: ->
    changed_projectiles = []
    @each (projectile) ->
      changed_projectile = projectile.changedAttributes()
      changed_projectiles.push(changed_projectile) if changed_projectile
    return changed_projectiles


if module?.exports?
  module.exports = ProjectilesCollection
else 
  window.ProjectilesCollection = ProjectilesCollection
