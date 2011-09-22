(function() {
  var CanvasWorld;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.CanvasWorld = CanvasWorld = (function() {
    __extends(CanvasWorld, World);
    function CanvasWorld() {
      CanvasWorld.__super__.constructor.apply(this, arguments);
    }
    CanvasWorld.prototype.CELL_FILL = ['rgb(0,0,0)', 'rgb(255, 255, 255)'];
    CanvasWorld.prototype.generation_color = function(gen) {
      var c;
      if (gen * 2 <= 255) {
        c = gen * 2;
      } else {
        c = 255;
      }
      return "rgb(" + c + ", " + c + ", " + c + ")";
    };
    CanvasWorld.prototype.set_dimensions = function() {
      this.screen_width = window.innerWidth;
      this.screen_height = window.innerHeight;
      this.step_x = Math.floor(this.screen_width / this.width);
      this.step_y = Math.floor(this.screen_height / this.height);
      this.canvas.width = this.screen_width;
      return this.canvas.height = this.screen_height;
    };
    CanvasWorld.prototype.fill_window = function() {
      var cell, row, x, y, _len, _ref, _results;
      $('body').css({
        background: "#666"
      });
      _ref = this.cells;
      _results = [];
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        _results.push((function() {
          var _len2, _results2;
          _results2 = [];
          for (x = 0, _len2 = row.length; x < _len2; x++) {
            cell = row[x];
            _results2.push(this.draw_cell(x, y));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    CanvasWorld.prototype.draw_cells = function() {
      this.canvas = window.document.getElementById(this.display.attr('id'));
      this.context = this.canvas.getContext('2d');
      this.set_dimensions();
      this.fill_window();
      return $(window).resize(__bind(function() {
        this.set_dimensions();
        return this.fill_window();
      }, this));
    };
    CanvasWorld.prototype.cache_cells = function() {};
    CanvasWorld.prototype.get_clicked_point = function(evt) {
      return {
        x: Math.floor(evt.offsetX / this.step_x),
        y: Math.floor(evt.offsetY / this.step_y)
      };
    };
    CanvasWorld.prototype.dom_target = function() {
      return $(this.display);
    };
    CanvasWorld.prototype.draw_cell = function(x, y) {
      if (this.generational_coloring) {
        this.context.fillStyle = this.cells[y][x][0] === 0 ? '#000' : this.generation_color(this.cells[y][x][2]);
      } else {
        this.context.fillStyle = this.CELL_FILL[this.cells[y][x][0]];
      }
      return this.context.fillRect(x * this.step_x, y * this.step_y, this.step_x, this.step_y);
    };
    return CanvasWorld;
  })();
  window.create_world = function(x, y, container) {
    console.log("creating canvas world");
    return new CanvasWorld(x, y, container);
  };
}).call(this);
