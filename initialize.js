(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.PATTERNS = {
    a_gun: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    a_conway: [[0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0]],
    a_glider: [[0, 0, 1], [1, 0, 1], [0, 1, 1]]
  };
  $(__bind(function() {
    var pause, runner, running, set_mode_labels, world;
    runner = null;
    running = false;
    world = create_world(40, 20, $('#container'));
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
    pause = __bind(function(show_modal) {
      if (show_modal) {
        $('#modal').removeClass('offscreen');
      }
      clearInterval(runner);
      return running = false;
    }, this);
    $(document).bind('keydown', __bind(function(event) {
      switch (event.keyCode) {
        case 32:
          event.preventDefault();
          $('#modal').addClass('offscreen');
          if (running) {
            pause();
          } else {
            runner = setInterval((function() {
              return world.next();
            }), window.DELAY);
            running = true;
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
        return world.initialize_grid(x, y);
      }
    });
    $('#source-link').click(function(evt) {
      var available_height, top_offset, total_height;
      evt.preventDefault();
      console.log('clicked!');
      $('#source-wrapper').toggleClass('hidden');
      if ($('#source-wrapper').is(':visible')) {
        top_offset = $('#source-wrapper').offset().top;
        total_height = $(window).height();
        available_height = total_height - top_offset - 40;
        return $('#source-wrapper').css('height', available_height + 'px');
      }
    });
    $.get('_modes.html', function(request) {
      $('#mode-viewer').html(request);
      return setTimeout((function() {
        return $('#mode-viewer').addClass('animate-movement').removeClass('offscreen');
      }), 100);
    });
    return $.get('_instructions.html', function(request) {
      $('#modal').html(request);
      return setTimeout((function() {
        return $('#modal').addClass('animate-movement').removeClass('offscreen');
      }), 100);
    });
  }, this));
}).call(this);
