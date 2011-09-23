(function() {
  var World;
  window.World = World = (function() {
    function World(x, y, cell_size, display) {
      this.display = display;
      this.neighbor_matrix = [[[-1, -1], [0, -1], [1, -1]], [[-1, 0], [1, 0]], [[-1, 1], [0, 1], [1, 1]]];
      this.initialize_grid(x, y, cell_size);
      this.draw_cells();
      this.cache_cells();
      this.bind_click();
      this.setting_mode = '';
      this.generational_coloring = false;
      console.log("INITIALIZED " + this.width + "x" + this.height + " WORLD");
    }
    World.prototype.initialize_grid = function(x, y) {
      var _results;
      this.width = x;
      this.height = y;
      y = 0;
      x = 0;
      this.cells = [];
      _results = [];
      while (y < this.height) {
        this.cells.push([]);
        while (x < this.width) {
          this.cells[y].push([0, 0, 0]);
          x += 1;
        }
        y += 1;
        _results.push(x = 0);
      }
      return _results;
    };
    World.prototype.dom_target = function() {
      return $('td', this.display);
    };
    World.prototype.next = function() {
      this.update();
      return this.render();
    };
    World.prototype.cache_cells = function() {
      var cell, row, x, y, _len, _ref, _results;
      this.dom_cells = [];
      _ref = this.cells;
      _results = [];
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        this.dom_cells.push([]);
        _results.push((function() {
          var _len2, _results2;
          _results2 = [];
          for (x = 0, _len2 = row.length; x < _len2; x++) {
            cell = row[x];
            _results2.push(this.dom_cells[y].push($("#" + x + "-" + y)));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    World.prototype.update = function() {
      var c, col, row, x, y, _len, _ref, _results;
      _ref = this.cells;
      _results = [];
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        _results.push((function() {
          var _len2, _results2;
          _results2 = [];
          for (x = 0, _len2 = row.length; x < _len2; x++) {
            col = row[x];
            c = this.neighbor_count(x, y);
            _results2.push(col[0] === 1 ? c === 2 || c === 3 ? (col[1] = 1, col[2] = col[2] + 1) : (col[1] = 0, col[2] = 0) : col[0] === 0 ? c === 3 ? (col[1] = 1, col[2] = 1) : void 0 : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    World.prototype.draw_cells = function() {
      var cell, out, row, x, y, _len, _len2, _ref;
      console.log("regular world draw");
      console.dir(this.display);
      console.dir($(this.display));
      this.display.empty();
      out = [];
      _ref = this.cells;
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        out.push("<tr>");
        for (x = 0, _len2 = row.length; x < _len2; x++) {
          cell = row[x];
          out.push("<td data-point='" + x + "," + y + "' class='cell dead' id='" + x + "-" + y + "'>&nbsp;</td>");
        }
        out.push('</tr>');
      }
      return this.display.html(out.join(''));
    };
    World.prototype.draw_cell = function(x, y) {
      if (this.cells[y][x][0] === 0) {
        return this.dom_cells[y][x].addClass('dead');
      } else {
        return this.dom_cells[y][x].removeClass('dead');
      }
    };
    World.prototype.render = function() {
      var cell, row, x, y, _len, _ref, _results;
      _ref = this.cells;
      _results = [];
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        _results.push((function() {
          var _len2, _results2;
          _results2 = [];
          for (x = 0, _len2 = row.length; x < _len2; x++) {
            cell = row[x];
            if (cell[0] === cell[1] && !this.generational_coloring) {
              continue;
            }
            cell[0] = cell[1];
            _results2.push(this.draw_cell(x, y));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    World.prototype.state = function(c) {
      if (c[0] === 0) {
        return 'dead';
      } else {
        return '';
      }
    };
    World.prototype.neighbor_count = function(x, y) {
      var coords, living, nx, ny, row, self, _i, _j, _len, _len2, _ref;
      living = 0;
      self = this;
      _ref = this.neighbor_matrix;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
          coords = row[_j];
          nx = coords[0] + x;
          if (nx < 0) {
            nx += self.width;
          } else if (nx >= self.width) {
            nx -= self.width;
          }
          ny = coords[1] + y;
          if (ny < 0) {
            ny += self.height;
          } else if (ny >= self.height) {
            ny -= self.height;
          }
          living += self.cells[ny][nx][0];
        }
      }
      return living;
    };
    World.prototype.toggle = function(point) {
      var x, y;
      x = point.x, y = point.y;
      return this.cells[y][x] = this.cells[y][x][0] === 0 ? [1, 1, 1] : [0, 0, 0];
    };
    World.prototype.set = function(pattern, point, rotation) {
      var new_pattern, row, self, value, x, y, _len, _len2;
      while (rotation % 4 !== 0) {
        new_pattern = [];
        for (y = 0, _len = pattern.length; y < _len; y++) {
          row = pattern[y];
          new_pattern.push([]);
          for (x = 0, _len2 = row.length; x < _len2; x++) {
            value = row[x];
            new_pattern[y][Math.abs(x - 2)] = pattern[x][y];
          }
        }
        pattern = new_pattern;
        rotation -= 1;
      }
      self = this;
      return _.each(pattern, function(row, py) {
        return _.each(row, function(value, px) {
          var nx, ny;
          nx = point.x + px;
          if (nx < 0) {
            nx += self.width;
          } else if (nx >= self.width) {
            nx -= self.width;
          }
          ny = point.y + py;
          if (ny < 0) {
            ny += self.height;
          } else if (ny >= self.height) {
            ny -= self.height;
          }
          self.cells[ny][nx][0] = value;
          self.cells[ny][nx][1] = value;
          self.cells[ny][nx][2] = value;
          return self.draw_cell(nx, ny);
        });
      });
    };
    World.prototype.clear = function() {
      var cell, row, x, y, _len, _ref, _results;
      _ref = this.cells;
      _results = [];
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        _results.push((function() {
          var _len2, _results2;
          _results2 = [];
          for (x = 0, _len2 = row.length; x < _len2; x++) {
            cell = row[x];
            this.cells[y][x] = [0, 0, 0];
            _results2.push(this.draw_cell(x, y));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    World.prototype.random_rotation = function() {
      return Math.floor(Math.random() * 4);
    };
    World.prototype.get_clicked_point = function(evt) {
      var point;
      point = $(evt.target).data('point').split(',');
      return {
        x: parseInt(point[0]),
        y: parseInt(point[1])
      };
    };
    World.prototype.bind_click = function() {
      var self;
      self = this;
      this.dom_target().unbind();
      self.was_running = false;
      self.tracking = false;
      this.dom_target().bind('mousedown', function(evt) {
        self.was_running = window.running;
        console.log('mousedown');
        if (window.pause != null) {
          window.pause();
        }
        return self.dom_target().bind('mousemove', function(evt) {
          var x, y, _ref;
          self.tracking = true;
          _ref = self.get_clicked_point(evt), x = _ref.x, y = _ref.y;
          if (self.cells[y][x][0] !== 1) {
            self.cells[y][x] = [1, 1, 1];
            return self.draw_cell(x, y);
          }
        });
      });
      this.dom_target().bind('mouseup', function(evt) {
        self.dom_target().unbind('mousemove');
        if ((window.start != null) && self.was_running) {
          return window.start();
        }
      });
      return this.dom_target().bind('click', function(evt) {
        var point;
        point = self.get_clicked_point(evt);
        switch (self.setting_mode) {
          case 'glider':
            console.log('glider');
            self.set(PATTERNS.a_glider, point, self.random_rotation());
            break;
          case 'gun':
            console.log('gun');
            self.set(PATTERNS.a_gun, point, 0);
            break;
          case 'conway':
            console.log('conway');
            self.set(PATTERNS.a_conway, point, 0);
            break;
          default:
            if (!self.tracking) {
              console.log('point');
              self.toggle(point);
              self.draw_cell(point.x, point.y);
            }
        }
        return self.tracking = false;
      });
    };
    World.prototype.toggle_mode = function(mode) {
      return this.setting_mode = this.setting_mode === mode ? '' : mode;
    };
    World.prototype.toggle_generational_coloring = function() {
      return this.generational_coloring = !generational_coloring;
    };
    return World;
  })();
  window.create_world = function(x, y, pixel, container) {
    console.log("creating table world");
    return new World(x, y, pixel, container);
  };
}).call(this);
