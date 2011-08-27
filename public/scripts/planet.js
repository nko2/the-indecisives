(function() {
  window.Planet = (function() {
    function Planet() {
      var helper;
      helper = new Canvas(null, 224, 224);
      this.canvas = helper.canvas;
      helper.draw_image('/images/planet_grey.png', 0, 0, 224, 224);
    }
    Planet.prototype.draw = function(helper) {
      helper.save();
      helper.translate(helper.width / 2, helper.height / 2);
      helper.rotate(helper.ticks * 0.001);
      helper.draw_image(this.canvas, -112, -112, 224, 224);
      return helper.restore();
    };
    return Planet;
  })();
}).call(this);
