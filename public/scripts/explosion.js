(function() {
  window.Explosion = (function() {
    Explosion.prototype.total_width = 336;
    Explosion.prototype.width = 48;
    Explosion.prototype.height = 60;
    Explosion.prototype.frames = 6;
    function Explosion() {
      var helper;
      helper = new Canvas(null, this.total_width, this.height);
      this.canvas = helper.canvas;
      helper.draw_image('/images/explosion.png', 0, 0, helper.width, helper.height);
    }
    Explosion.prototype.draw = function(helper) {
      var frame;
      frame = helper.ticks % this.frames;
      helper.context.globalCompositeOperation = 'lighter';
      return helper.context.drawImage(this.canvas, this.width * frame, 0, this.width, this.height, -24, -30, this.width, this.height);
    };
    return Explosion;
  })();
}).call(this);
