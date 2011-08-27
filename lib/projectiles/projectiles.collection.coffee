if require?
  Backbone = require('backbone')
  ProjectileModel = require('./projectile.model')
else
  Backbone = window.Backbone
  ProjectileModel = window.ProjectileModel

ProjectilesCollection = Backbone.Collection.extend
  model: ProjectileModel
  
  draw:(helper) ->
    @each (projectile) ->
      projectile.draw(helper)

  update: ->
    @each (projectile) ->
      projectile.update()


if module?.exports?
  module.exports = ProjectilesCollection
else 
  window.ProjectilesCollection = ProjectilesCollection
