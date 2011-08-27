(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.PlayersView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'add', 'reset');
      this.reset = _.throttle(this.reset, 1000);
      return this.collection.bind('all', this.reset);
    },
    reset: function() {
      var others, players, top;
      this.el.innerHTML = '';
      players = _.select(this.collection.models, function(player) {
        return player.get('state') !== 'waiting';
      });
      others = _.select(players, function(player) {
        return !player.get('self');
      });
      top = _.head(others, 3);
      _.each(top, __bind(function(player) {
        return this.add(player);
      }, this));
      if (window.current_player) {
        return this.add(window.current_player);
      }
    },
    add: function(player) {
      var view;
      view = new PlayerView({
        model: player
      });
      player.view = view;
      if (player.get('self')) {
        $(this.el).prepend(view.render().el);
        return;
      }
      return $(this.el).append(view.render().el);
    }
  });
}).call(this);
