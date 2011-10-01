(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.PATTERNS = {
    a_gun: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    a_conway: [[0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0]],
    a_glider: [[0, 0, 1], [1, 0, 1], [0, 1, 1]]
  };
  window.PIXEL = 16;
  window.running = false;
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();
  $(__bind(function() {
    var container, initialize_controls, runner, set_mode_labels, world;
    runner = null;
    container = $('#container');
    world = create_world(40, 20, 16, container);
    world.set(PATTERNS.a_glider, {
      x: 2,
      y: 2
    }, 0);
    set_mode_labels = function() {
      if (running) {
        $('#mode-viewer').addClass('offscreen');
      } else {
        $('#mode-viewer').removeClass('offscreen');
      }
      $('.mode').addClass('invisible');
      if (world.setting_mode === '') {
        return $("#toggle").removeClass('invisible');
      } else {
        return $("#" + world.setting_mode).removeClass('invisible');
      }
    };
    window.pause = __bind(function(show_modal) {
      if (show_modal) {
        $('#modal').removeClass('offscreen');
      }
      return window.running = false;
    }, this);
    window.run = function() {
      if (window.running) {
        world.next();
        return window.requestAnimFrame(window.run, container);
      }
    };
    window.start = __bind(function() {
      window.running = true;
      return window.run();
    }, this);
    $(document).bind('keydown', __bind(function(event) {
      switch (event.keyCode) {
        case 32:
          event.preventDefault();
          $('#modal').addClass('offscreen');
          if (running) {
            pause();
          } else {
            start();
          }
          break;
        case 71:
          world.toggle_mode('glider');
          break;
        case 78:
          world.toggle_mode('gun');
          break;
        case 67:
          world.toggle_mode('conway');
          break;
        case 69:
          world.toggle_generational_coloring();
          break;
        case 66:
          world.clear();
          break;
        case 70:
          $('table').toggleClass('fade-mode');
          break;
        case 27:
          pause(true);
          break;
        case 191:
          if (event.shiftKey) {
            pause(true);
          }
      }
      return set_mode_labels();
    }, this));
    initialize_controls = function() {
      $('#set-delay').change(function() {
        var value;
        value = parseInt($('#set-delay').val());
        if (typeof value === 'number' && value <= 500 && value >= 0) {
          window.DELAY = value;
          return $('#show-delay').text(value);
        }
      });
      $('#grid-density').change(function() {
        var value, x, y;
        value = $('#grid-density').val().split(',');
        x = parseInt(value[0]);
        y = parseInt(value[1]);
        if (typeof x === 'number' && x > 0 && typeof y === 'number' && y > 0) {
          return world.initialize_grid(x, y, null);
        }
      });
      return $('#pixel-size').change(function() {
        var value;
        value = parseInt($('#pixel-size').val());
        if (typeof value === 'number' && value > 1) {
          world.initialize_grid(null, null, value);
          return world.fill_window();
        }
      });
    };
    $.get('_modes.html', function(request) {
      $('#mode-viewer').html(request);
      return setTimeout((function() {
        return $('#mode-viewer').addClass('animate-movement').removeClass('offscreen');
      }), 100);
    });
    return $.get('_instructions.html', function(request) {
      var tmpl;
      tmpl = _.template(request);
      $('#modal').html(tmpl(window.page));
      setTimeout((function() {
        return $('#modal').addClass('animate-movement').removeClass('offscreen');
      }), 100);
      return initialize_controls();
    });
  }, this));
}).call(this);
