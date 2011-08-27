(function() {
  window.PlayersView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'add', 'remove', 'reset');
      this.reset = _.throttle(this.reset, 1000);
      this.collection.bind('add', this.add);
      this.collection.bind('remove', this.remove);
      return this.collection.bind('reset', this.reset);
    },
    reset: function() {
      this.el.innerHTML = '';
      return this.collection.each(this.add);
    },
    add: function(model) {
      var view;
      view = new PlayerView({
        model: model
      });
      model.view = view;
      if (model.get('self')) {
        $(this.el).prepend(view.render().el);
        return;
      }
      return $(this.el).append(view.render().el);
    },
    remove: function(model) {
      return model.view.remove();
    }
  });
}).call(this);
