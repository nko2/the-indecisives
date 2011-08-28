(function() {
  window.Splash = (function() {
    function Splash(header, body, visible, height) {
      this.header = header != null ? header : '';
      this.body = body != null ? body : '';
      this.visible = visible != null ? visible : true;
      this.height = height != null ? height : 180;
    }
    Splash.prototype.draw = function(helper) {
      if (!this.visible) {
        return;
      }
      helper.save();
      helper.fill('rgba(225, 225, 225, 0.4)');
      helper.translate(0, helper.half_height - this.height / 2);
      helper.rect(0, 0, helper.width, this.height);
      helper.translate(helper.half_width, 0);
      helper.fill('rgb(0, 0, 0)');
      helper.text(this.header, 0, 10, "48px 'Maven Pro', Helvetica, Arial, sans-serif", 0, 'center');
      helper.text(this.body, 0, 70, "24px 'Maven Pro', Helvetica, Arial, sans-serif", 24, 'center');
      return helper.restore();
    };
    Splash.prototype.show = function() {
      return this.visible = true;
    };
    Splash.prototype.hide = function() {
      return this.visible = false;
    };
    return Splash;
  })();
}).call(this);
