window.CanvasWorld = class CanvasWorld extends World
  # dead, alive
  CELL_FILL: [ 'rgb(0,0,0)', 'rgb(255, 255, 255)' ]

  generation_color: (gen) ->
    if gen * 2 <= 255
      c = gen * 2
    else
      c = 255
    "rgb(#{c}, #{c}, #{c})"

  # force @display to fill the window
  set_dimensions: ->
    @screen_width = window.innerWidth
    @screen_height = window.innerHeight
    
    # set step size
    @step_x = Math.floor(@screen_width / @width)
    @step_y = Math.floor(@screen_height / @height)

    # set canvas size. DO NOT USE jQuery CSS!
    @canvas.width = @screen_width
    @canvas.height = @screen_height

  fill_window: ->
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
    @canvas = window.document.getElementById @display.attr('id')
    @context = @canvas.getContext('2d')

    @set_dimensions()
    @fill_window()
    
    $(window).resize =>
      @set_dimensions()
      @fill_window()

  # no-op
  cache_cells: ->

  get_clicked_point: (evt) ->
    {
      x: Math.floor(evt.offsetX / @step_x)
      y: Math.floor(evt.offsetY / @step_y)
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
window.create_world = (x, y, container) ->
  console.log "creating canvas world"
  new CanvasWorld x, y, container

