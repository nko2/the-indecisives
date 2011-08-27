window.PlayersView = Backbone.View.extend
  initialize: ->
    _.bindAll(this, 'add', 'reset')

    @reset = _.throttle(@reset, 1000)
    @collection.bind('all', @reset)

  reset: ->
    @el.innerHTML = ''

    players = _.select @collection.models, (player) ->
      return player.get('state') isnt 'waiting'

    others = _.select players, (player) ->
      return not player.get('self')

    top = _.head(others, 3)

    _.each top, (player) => @add(player)

    @add(window.current_player) if window.current_player

  add: (player) ->
    view = new PlayerView(model: player)
    player.view = view

    if player.get('self')
      $(@el).prepend(view.render().el)
      return

    $(@el).append(view.render().el)
