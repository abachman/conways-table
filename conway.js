(function() {
  var World;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  World = (function() {
    function World(cells, display) {
      this.cells = cells;
      this.display = display;
      this.height = this.cells.length;
      this.width = this.cells[0].length;
      this.neighbor_matrix = [[[-1, -1], [0, -1], [1, -1]], [[-1, 0], [1, 0]], [[-1, 1], [0, 1], [1, 1]]];
      this.draw();
      this.cache_cells();
    }
    World.prototype.next = function() {
      this.update();
      return this.render();
    };
    World.prototype.cache_cells = function() {
      var cell, row, x, y, _len, _len2, _ref;
      this.dom_cells = [];
      _ref = this.cells;
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        this.dom_cells.push([]);
        for (x = 0, _len2 = row.length; x < _len2; x++) {
          cell = row[x];
          this.dom_cells[y].push($("#" + x + "-" + y));
        }
      }
      return console.dir(this.dom_cells);
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
            _results2.push(col[0] === 1 ? c === 2 || c === 3 ? col[1] = 1 : col[1] = 0 : col[0] === 0 ? c === 3 ? col[1] = 1 : void 0 : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    World.prototype.draw = function() {
      var cell, out, row, x, y, _len, _len2, _ref;
      $(this.display).empty();
      out = [];
      _ref = this.cells;
      for (y = 0, _len = _ref.length; y < _len; y++) {
        row = _ref[y];
        out.push("<tr>");
        for (x = 0, _len2 = row.length; x < _len2; x++) {
          cell = row[x];
          out.push("<td data-point='" + x + "," + y + "'                  class='cell fade-cell " + (this.state(cell)) + "'                  id='" + x + "-" + y + "'>&nbsp;</td>");
        }
        out.push('</tr>');
      }
      return $(this.display).html(out.join());
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
            if (cell[0] === cell[1]) {
              continue;
            }
            cell[0] = cell[1];
            _results2.push(this.dom_cells[y][x].toggleClass('dead'));
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
      var living, self;
      living = 0;
      self = this;
      _.each(this.neighbor_matrix, function(row) {
        return _.each(row, function(coords) {
          var nx, ny;
          nx = coords[0] + x;
          if (nx < 0) {
            nx = self.width + nx;
          } else if (nx >= self.width) {
            nx = coords[0] + x - self.width;
          }
          ny = coords[1] + y;
          if (ny < 0) {
            ny = self.height + ny;
          } else if (ny >= self.height) {
            ny = coords[1] + y - self.height;
          }
          return living += self.cells[ny][nx][0];
        });
      });
      return living;
    };
    World.prototype.toggle = function(coords) {
      var x, y;
      x = coords.x, y = coords.y;
      return this.cells[y][x] = this.cells[y][x][0] === 0 ? [1, 1] : [0, 0];
    };
    World.prototype.set = function(pattern, point, rotation) {
      var new_pattern, row, self, value, x, y, _len, _len2;
      while (rotation % 4 !== 0) {
        console.dir(pattern);
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
          ny = point.y + py;
          if (nx >= 0 && ny >= 0 && nx < self.width && ny < self.height) {
            self.cells[ny][nx] = [value, value];
            if (value === 0) {
              return self.dom_cells[ny][nx].addClass('dead');
            } else {
              return self.dom_cells[ny][nx].removeClass('dead');
            }
          }
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
            this.cells[y][x] = [0, 0];
            _results2.push(this.dom_cells[y][x].addClass('dead'));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    return World;
  })();
  $(__bind(function() {
    var a_conway, a_glider, a_gun, delay, map, runner, running, set_mode_labels, setting_mode, size, world, x, y;
    map = [];
    y = 0;
    x = 0;
    size = 40;
    delay = 10;
    while (y < size) {
      map.push([]);
      while (x < size * 2) {
        map[y].push([0, 0]);
        x += 1;
      }
      y += 1;
      x = 0;
    }
    world = new World(map, $('#container'));
    a_gun = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    a_conway = [[0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0]];
    a_glider = [[0, 0, 1], [1, 0, 1], [0, 1, 1]];
    runner = null;
    running = false;
    setting_mode = '';
    set_mode_labels = function() {
      $('.mode').addClass('hidden');
      if (!running) {
        $('#paused').removeClass('hidden');
      }
      if (setting_mode !== '') {
        return $("#" + setting_mode).removeClass('hidden');
      }
    };
    $('#container td').bind('click', function() {
      var point, rotation;
      $(this).toggleClass('dead');
      point = $(this).data('point').split(',');
      point = {
        x: parseInt(point[0]),
        y: parseInt(point[1])
      };
      rotation = Math.floor(Math.random() * 4);
      if (setting_mode === 'glider') {
        console.log('glider');
        return world.set(a_glider, point, rotation);
      } else if (setting_mode === 'gun') {
        console.log('gun');
        return world.set(a_gun, point, 0);
      } else if (setting_mode === 'conway') {
        console.log('conway');
        return world.set(a_conway, point, 0);
      } else {
        console.log('point');
        return world.toggle(point);
      }
    });
    return $(document).bind('keydown', __bind(function(event) {
      console.log(event.keyCode);
      console.dir(event);
      if (event.keyCode === 32) {
        event.preventDefault();
        $('#modal').fadeOut();
        if (running) {
          clearInterval(runner);
          running = false;
        } else {
          runner = setInterval((function() {
            return world.next();
          }), delay);
          running = true;
        }
      } else if (event.keyCode === 71) {
        setting_mode = setting_mode === 'glider' ? '' : 'glider';
      } else if (event.keyCode === 78) {
        setting_mode = setting_mode === 'gun' ? '' : 'gun';
      } else if (event.keyCode === 67) {
        setting_mode = setting_mode === 'conway' ? '' : 'conway';
      } else if (event.keyCode === 66) {
        world.clear();
      } else if (event.keyCode === 70) {
        $('table').toggleClass('fade-mode');
      } else if (event.keyCode === 27 || (event.keyCode === 191 && event.shiftKey)) {
        $('#modal').fadeIn();
        clearInterval(runner);
        running = false;
      }
      return set_mode_labels();
    }, this));
  }, this));
}).call(this);
