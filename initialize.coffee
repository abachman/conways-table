window.PATTERNS =
  a_gun: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0]
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0]
    [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ]

  a_conway: [
    [0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1]
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,0]
    [0,1,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0]
  ]

  a_glider: [
    [0, 0, 1]
    [1, 0, 1]
    [0, 1, 1]
  ]

# dimensions of a single pixel
window.PIXEL = 16;

# current activity
window.running = false

# Paul Irish's requestAnimationFrame shim
window.requestAnimFrame = (->
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          (callback, element) ->
            window.setTimeout(callback, 1000 / 60)
)()

$ =>
  runner = null
  container = $('#container')

  # defined by conway and overridden conway-canvas
  world = create_world(40, 20, 16, container)

  # somethin on screen
  world.set PATTERNS.a_glider, {x: 2, y: 2}, 0

  set_mode_labels = () ->
    if running
      $('#mode-viewer').addClass 'offscreen'
    else
      $('#mode-viewer').removeClass 'offscreen'

    $('.mode').addClass 'invisible'
    if world.setting_mode == ''
      $("#toggle").removeClass 'invisible'
    else
      $("##{world.setting_mode}").removeClass 'invisible'

  window.pause = (show_modal) =>
    $('#modal').removeClass('offscreen') if show_modal
    # clearInterval runner
    window.running = false

  # make world step if running == true
  window.run = ->
    if window.running
      world.next()
      window.requestAnimFrame(window.run, container)

  #
  window.start = =>
    window.running = true
    window.run()

  $(document).bind 'keydown', (event) =>
    # console.log event.keyCode
    switch event.keyCode
      when 32 # spacebar
        event.preventDefault()
        $('#modal').addClass('offscreen')
        if running
          pause()
        else
          start()
      when 71 # g
        world.toggle_mode 'glider'
      when 78 # n
        world.toggle_mode 'gun'
      when 67 # c
        world.toggle_mode 'conway'
      when 69 # e
        world.toggle_generational_coloring()
      when 66 # b
        world.clear()
      when 70 # f
        $('table').toggleClass('fade-mode')
      when 27
        pause(true)
      when 191
        pause(true) if event.shiftKey

    set_mode_labels()

  initialize_controls = ->
    $('#set-delay').change ->
      value = parseInt($('#set-delay').val())
      if typeof value == 'number' and value <= 500 and value >= 0
        window.DELAY = value
        $('#show-delay').text(value)

    # only on table
    $('#grid-density').change ->
      value = $('#grid-density').val().split(',')

      x = parseInt(value[0])
      y = parseInt(value[1])

      if typeof x is 'number' and x > 0 and typeof y is 'number' and y > 0
        # defined by conway and overridden conway-canvas
        world.initialize_grid x, y, null

    # only on canvas
    $('#pixel-size').change ->
      value = parseInt $('#pixel-size').val()

      if typeof value is 'number' and value > 1
        world.initialize_grid null, null, value
        world.fill_window()

  $.get '_modes.html', (request) ->
    $('#mode-viewer').html(request)
    setTimeout((->$('#mode-viewer').addClass('animate-movement').removeClass('offscreen')), 100)

  $.get '_instructions.html', (request) ->
    # set page specific elements
    tmpl = _.template(request)
    $('#modal').html tmpl(window.page)
    setTimeout((->$('#modal').addClass('animate-movement').removeClass('offscreen')), 100)
    initialize_controls()
