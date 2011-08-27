window.PlayerView = Backbone.View.extend

  tagName: 'li'

  template: _.template(document.getElementById('player-template').innerHTML)

  initialize: ->
    @el.className = 'self' if @model.get('self')

  render: ->
    @el.innerHTML = @template(@model.toJSON())
    return this
