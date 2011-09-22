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

$ =>
  runner = null
  running = false

  # defined by conway and overridden conway-canvas
  world = create_world(40, 20, $('#container'))

  set_mode_labels = () ->
    if running 
      $('#mode-viewer').addClass 'offscreen-left'
    else
      $('#mode-viewer').removeClass 'offscreen-left'

    $('.mode').addClass 'hidden'
    unless world.setting_mode == ''
      $("##{world.setting_mode}").removeClass 'hidden'

  pause = (show_modal) => 
    $('#modal').removeClass('offscreen-top') if show_modal
    clearInterval runner
    running = false

  $(document).bind 'keydown', (event) =>
    # console.log event.keyCode
    switch event.keyCode
      when 32 # spacebar
        event.preventDefault()
        $('#modal').addClass('offscreen-top')
        if running
          pause()
        else
          # START
          runner = setInterval((-> world.next()), window.DELAY)
          running = true
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

  $('#set-delay').change ->
    value = parseInt($('#set-delay').val())
    if typeof value == 'number' and value <= 500 and value >= 0
      window.DELAY = value
      $('#show-delay').text(value)

  $('#grid-density').change ->
    value = $('#grid-density').val().split(',')

    x = parseInt(value[0])
    y = parseInt(value[1])

    if typeof x is 'number' and x > 0 and typeof y is 'number' and y > 0
      # defined by conway and overridden conway-canvas
      world.initialize_grid x, y

  $('#source-link').click (evt) ->
    evt.preventDefault()
    console.log 'clicked!'
    $('#source-wrapper').toggleClass('hidden')
    if $('#source-wrapper').is(':visible')
      top_offset = $('#source-wrapper').offset().top
      total_height = $(window).height()
      available_height = total_height - top_offset - 40
      $('#source-wrapper').css('height', available_height + 'px')
