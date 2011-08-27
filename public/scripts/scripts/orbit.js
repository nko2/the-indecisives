(function() {
  window.Orbit = (function() {
    function Orbit(radius) {
      this.radius = radius;
    }
    Orbit.prototype.draw = function(helper) {
      helper.stroke('rgba(255, 255, 255, 0.4)');
      helper.no_fill();
      return helper.circle(helper.half_width, helper.half_height, this.radius);
    };
    return Orbit;
  })();
}).call(this);
