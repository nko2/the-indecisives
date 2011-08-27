(function() {
  window.Planet = (function() {
    function Planet() {
      var helper;
      helper = new Canvas(null, 220, 220);
      this.canvas = helper.canvas;
      helper.circle(110, 110, 110);
      helper.fill('rgba(255,255,255,0.4)');
    }
    Planet.prototype.draw = function(helper) {
      helper.save();
      helper.translate(helper.width / 2, helper.height / 2);
      helper.draw_image(this.canvas, -110, -110, 220, 220);
      return helper.restore();
    };
    return Planet;
  })();
}).call(this);
