window.CanvasWorld = class CanvasWorld extends World
  # dead, alive
  CELL_FILL: [ 'rgb(0,0,0)', 'rgb(255, 255, 255)' ]

  generation_color: (gen) ->
    if gen * 2 <= 255
      c = gen * 2
    else
      c = 255
    "rgb(#{c}, #{c}, #{c})"

  correct_array_for_length: (arr, push, len) ->
    # either push rows or cells
    if arr.length < len
      if push == 'row'
        arr.push []
      else
        arr.push [0, 0, 0]

      while arr.length < len
        if push == 'row'
          arr.push []
        else
          arr.push [0, 0, 0]

    if arr.length > len
      arr.pop()
      while arr.length > len
        arr.pop()

  initialize_grid: (x, y, cell_size) ->
    # height and width of each cell
    @cell_size = cell_size

    @cells ?= []

    # get canvas
    @canvas = window.document.getElementById @display.attr('id')
    @context = @canvas.getContext('2d')

    @set_dimensions()

  # force @display to fill the window
  set_dimensions: ->

    # how big is the screen
    @screen_width = window.innerWidth
    @screen_height = window.innerHeight

    # set step size
    @step_x = @cell_size
    @step_y = @cell_size

    # set canvas size. DO NOT USE jQuery CSS!
    @canvas.width = @screen_width
    @canvas.height = @screen_height

    # of x cells
    ## FASTER than Math.floor()
    @width = (0.5 + (@screen_width / @cell_size)) << 0
    # of y cells
    @height = (0.5 + (@screen_height / @cell_size)) << 0

    @correct_array_for_length(@cells, 'row', @height)

    for row in @cells
      @correct_array_for_length(row, 'cell', @width)

  fill_window: ->
    console.log "FILLING CANVAS"
    # cells are always an integer value width and height,
    # so we color the background that we can see through the canvas
    $('body').css background: "#666"
    # all black
    for row, y in @cells
      for cell, x in row
        @draw_cell x, y

  # one time only, draw world
  draw_cells: () ->
    # load drawing surface

    @fill_window()

    $(window).resize =>
      @set_dimensions()
      @fill_window()

  # no-op
  cache_cells: ->

  get_clicked_point: (evt) ->
    {
      x: (0.5 + (evt.offsetX / @step_x)) << 0
      y: (0.5 + (evt.offsetY / @step_y)) << 0
    }

  dom_target: ->
    $(@display)

  draw_cell: (x, y) ->
    # draw cell as it exists right now
    if @generational_coloring
      @context.fillStyle = if @cells[y][x][0] is 0 then '#000' else @generation_color(@cells[y][x][2])
    else
      @context.fillStyle = @CELL_FILL[ @cells[y][x][0] ]
    @context.fillRect x * @step_x, y * @step_y, @step_x, @step_y

# load world into container
window.create_world = (x, y, pixel, container) ->
  console.log "creating canvas world"
  new CanvasWorld x, y, pixel, container

