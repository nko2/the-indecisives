(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Canvas = (function() {
    Canvas.prototype.should_stroke = false;
    Canvas.prototype.should_fill = true;
    Canvas.prototype.ticks = 0;
    function Canvas(canvas, width, height) {
      this.canvas = canvas;
      this.width = width != null ? width : 500;
      this.height = height != null ? height : 500;
      this.step = __bind(this.step, this);
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
      }
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context = this.canvas.getContext('2d');
      this.half_width = this.width / 2;
      this.half_height = this.height / 2;
    }
    Canvas.prototype.no_stroke = function() {
      return this.should_stroke = false;
    };
    Canvas.prototype.no_fill = function() {
      return this.should_fill = false;
    };
    Canvas.prototype.stroke = function(color) {
      this.should_stroke = true;
      return this.context.strokeStyle = color;
    };
    Canvas.prototype.fill = function(color) {
      this.should_fill = true;
      return this.context.fillStyle = color;
    };
    Canvas.prototype.stroke_width = function(width) {
      return this.context.lineWidth = width;
    };
    Canvas.prototype.translate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      return this.context.translate(x, y);
    };
    Canvas.prototype.rotate = function(angle) {
      if (angle == null) {
        angle = 0;
      }
      return this.context.rotate(angle);
    };
    Canvas.prototype.save = function() {
      return this.context.save();
    };
    Canvas.prototype.restore = function() {
      return this.context.restore();
    };
    Canvas.prototype.draw_image = function(src, x, y, width, height) {
      var image;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      if (typeof src !== 'string') {
        this.context.drawImage(src, x, y, width, height);
        return;
      }
      image = new Image();
      image.onload = __bind(function() {
        return this.context.drawImage(image, x, y, width, height);
      }, this);
      return image.src = src;
    };
    Canvas.prototype.text = function(value, x, y, font, lineHeight, textAlign, textBaseline) {
      var i, line, lines, _results;
      if (font == null) {
        font = '14px Helvetica, Arial, sans-serif';
      }
      if (lineHeight == null) {
        lineHeight = 18;
      }
      if (textAlign == null) {
        textAlign = 'left';
      }
      if (textBaseline == null) {
        textBaseline = 'top';
      }
      if (typeof value !== 'string') {
        value = value.toString();
      }
      this.context.font = font;
      this.context.textAlign = textAlign;
      this.context.textBaseline = textBaseline;
      lines = value.split('\n');
      _results = [];
      for (i in lines) {
        line = lines[i];
        _results.push(this.context.fillText(line, x, y + i * lineHeight));
      }
      return _results;
    };
    Canvas.prototype.rect = function(x, y, width, height) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      if (this.should_fill) {
        this.context.fillRect(x, y, width, height);
      }
      if (this.should_stroke) {
        return this.context.strokeRect(x, y, width, height);
      }
    };
    Canvas.prototype.clear = function(x, y, width, height) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      return this.context.clearRect(x, y, width, height);
    };
    Canvas.prototype.circle = function(x, y, radius) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (radius == null) {
        radius = 10;
      }
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, Math.PI * 2, true);
      this.context.closePath();
      if (this.should_fill) {
        this.context.fill();
      }
      if (this.should_stroke) {
        return this.context.stroke();
      }
    };
    Canvas.prototype.get_animation_frame = function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(callback, element) {
        return window.setTimeout(callback, 1000 / 60);
      };
    };
    Canvas.prototype.step = function(timestamp) {
      this.clear();
      this.ticks++;
      this.draw_callback.call(this);
      return this.get_animation_frame()(this.step, this.canvas);
    };
    Canvas.prototype.draw = function(draw_callback) {
      this.draw_callback = draw_callback;
      return this.step();
    };
    return Canvas;
  })();
}).call(this);
