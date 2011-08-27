window.PlayersView = Backbone.View.extend
  initialize: ->
    _.bindAll(this, 'add', 'remove', 'reset')

    @reset = _.throttle(@reset, 1000)

    @collection.bind('add', @add)
    @collection.bind('remove', @remove)
    @collection.bind('reset', @reset)

  reset: ->
    @el.innerHTML = ''
    @collection.each(@add)

  add: (model) ->
    view = new PlayerView(model: model)
    model.view = view

    if model.get('self')
      $(@el).prepend(view.render().el)
      return

    $(@el).append(view.render().el)

  remove: (model) -> model.view.remove()
