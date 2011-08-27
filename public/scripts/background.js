(function() {
  window.Background = (function() {
    function Background() {
      var helper, i, radius, x, y;
      helper = new Canvas();
      this.canvas = helper.canvas;
      helper.no_stroke();
      for (i = 0; i <= 100; i++) {
        x = Math.floor(Math.random() * helper.width);
        y = Math.floor(Math.random() * helper.height);
        radius = Math.random() * 3;
        helper.fill('rgba(255, 255, 255, 0.2)');
        helper.circle(x, y, radius + 2);
        helper.fill('rgba(255, 255, 255, 0.6)');
        helper.circle(x, y, radius);
      }
    }
    Background.prototype.draw = function(helper) {
      return helper.draw_image(this.canvas);
    };
    return Background;
  })();
}).call(this);
