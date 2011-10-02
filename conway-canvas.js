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
    CanvasWorld.prototype.correct_array_for_length = function(arr, push, len) {
      var _results;
      if (arr.length < len) {
        if (push === 'row') {
          arr.push([]);
        } else {
          arr.push([0, 0, 0]);
        }
        while (arr.length < len) {
          if (push === 'row') {
            arr.push([]);
          } else {
            arr.push([0, 0, 0]);
          }
        }
      }
      if (arr.length > len) {
        arr.pop();
        _results = [];
        while (arr.length > len) {
          _results.push(arr.pop());
        }
        return _results;
      }
    };
    CanvasWorld.prototype.initialize_grid = function(x, y, cell_size) {
      var _ref;
      this.cell_size = cell_size;
      if ((_ref = this.cells) == null) {
        this.cells = [];
      }
      this.canvas = window.document.getElementById(this.display.attr('id'));
      this.context = this.canvas.getContext('2d');
      return this.set_dimensions();
    };
    CanvasWorld.prototype.set_dimensions = function() {
      var row, _i, _len, _ref, _results;
      this.screen_width = window.innerWidth;
      this.screen_height = window.innerHeight;
      this.step_x = this.cell_size;
      this.step_y = this.cell_size;
      this.canvas.width = this.screen_width;
      this.canvas.height = this.screen_height;
      this.width = (0.5 + (this.screen_width / this.cell_size)) << 0;
      this.height = (0.5 + (this.screen_height / this.cell_size)) << 0;
      this.correct_array_for_length(this.cells, 'row', this.height);
      _ref = this.cells;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _results.push(this.correct_array_for_length(row, 'cell', this.width));
      }
      return _results;
    };
    CanvasWorld.prototype.fill_window = function() {
      var cell, row, x, y, _len, _ref, _results;
      console.log("FILLING CANVAS");
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
      this.fill_window();
      return $(window).resize(__bind(function() {
        this.set_dimensions();
        return this.fill_window();
      }, this));
    };
    CanvasWorld.prototype.cache_cells = function() {};
    CanvasWorld.prototype.get_clicked_point = function(evt) {
      return {
        x: (0.5 + (evt.offsetX / this.step_x)) << 0,
        y: (0.5 + (evt.offsetY / this.step_y)) << 0
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
  window.create_world = function(x, y, pixel, container) {
    console.log("creating canvas world");
    return new CanvasWorld(x, y, pixel, container);
  };
}).call(this);
