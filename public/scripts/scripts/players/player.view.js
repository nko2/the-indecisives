(function() {
  window.PlayerView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(document.getElementById('player-template').innerHTML),
    initialize: function() {
      if (this.model.get('self')) {
        return this.el.className = 'self';
      }
    },
    render: function() {
      this.el.innerHTML = this.template(this.model.toJSON());
      return this;
    }
  });
}).call(this);
