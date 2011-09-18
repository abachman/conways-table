class World
  # @cells is an array of arrays (rows, columns) containing
  # points, two element arrays [current state, next state]
  #
  # reference @cells by [y, x]
  constructor: (@cells, @display) ->
    @height = @cells.length
    @width  = @cells[0].length

    @neighbor_matrix = [
      [ [-1, -1], [0, -1], [1, -1]]
      [ [-1, 0]          , [1, 0] ]
      [ [-1, 1],  [0, 1],  [1, 1] ]
    ]

    @draw()

    @cache_cells()

  next: ->
    @update()
    @render()

  cache_cells: ->
    @dom_cells = []
    for row, y in @cells
      @dom_cells.push []
      for cell, x in row
        @dom_cells[y].push $("##{x}-#{y}")
    console.dir @dom_cells

  update: ->
    for row, y in @cells
      for col, x in row
        c = @neighbor_count(x, y)
        if col[0] is 1
          if c is 2 or c is 3
            col[1] = 1
          else
            col[1] = 0
        else if col[0] is 0
          if c is 3
            col[1] = 1

  draw: ->
    $(@display).empty()
    out = []
    for row, y in @cells
      out.push "<tr>"
      for cell, x in row
        out.push "<td data-point='#{x},#{y}'
                  class='cell fade-cell #{@state(cell)}'
                  id='#{x}-#{y}'>&nbsp;</td>"
      out.push '</tr>'
    $(@display).html out.join()

  # next becomes current and dom updates
  # if state is changing
  render: ->
    for row, y in @cells
      for cell, x in row
        # skip unchanged cells
        continue if cell[0] is cell[1]
        cell[0] = cell[1]
        @dom_cells[y][x].toggleClass('dead')

  state: (c) ->
    if c[0] == 0 then 'dead' else ''

  neighbor_count: (x, y) ->
    living = 0
    self = this
    _.each @neighbor_matrix, (row) ->
      _.each row, (coords) ->
        nx = coords[0] + x
        if nx < 0
          nx = self.width + nx
        else if nx >= self.width
          nx = coords[0] + x - self.width 
        ny = coords[1] + y
        if ny < 0
          ny = self.height + ny
        else if ny >= self.height
          ny = coords[1] + y - self.height 

        living += self.cells[ny][nx][0]
    living

  toggle: (coords) ->
    {x, y} = coords
    @cells[y][x] = if @cells[y][x][0] is 0 then [1, 1] else [0, 0]

  # add a pattern to the screen
  set: (pattern, point, rotation) ->
    while rotation % 4 != 0
      console.dir pattern
      new_pattern = []
      for row, y in pattern
        new_pattern.push []
        for value, x in row
          new_pattern[y][Math.abs(x - 2)] = pattern[x][y]
      pattern = new_pattern
      rotation -= 1

    self = this
    _.each pattern, (row, py) ->
      _.each row, (value, px) ->
        nx = point.x + px
        ny = point.y + py
        if nx >= 0 && ny >= 0 && nx < self.width && ny < self.height
          self.cells[ny][nx] = [value, value]
          if value == 0
            self.dom_cells[ny][nx].addClass('dead')
          else
            self.dom_cells[ny][nx].removeClass('dead')

  clear: ->
    for row, y in @cells
      for cell, x in row
        @cells[y][x] = [0, 0]
        @dom_cells[y][x].addClass 'dead'

$ =>
  map = []
  y = 0
  x = 0
  size = 40 # of grid
  delay = 10 # between steps
  while y < size
    map.push []
    while x < size * 2
      # each cell is [current, next]
      map[y].push [0, 0]
      x += 1
    y += 1
    x = 0

  world = new World map, $('#container')

  a_gun = [
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

  a_conway = [
    [0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1]
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,0]
    [0,1,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0]
  ]

  a_glider = [
    [0, 0, 1]
    [1, 0, 1]
    [0, 1, 1]
  ]

  runner = null
  running = false
  setting_mode = ''

  set_mode_labels = () ->
    $('.mode').addClass 'hidden'
    unless running
      $('#paused').removeClass('hidden')
    unless setting_mode == ''
      $("##{setting_mode}").removeClass 'hidden'

  $('#container td').bind 'click', ->
    $(this).toggleClass('dead')
    point = $(this).data('point').split(',')
    point =
      x: parseInt point[0]
      y: parseInt point[1]
    rotation = Math.floor(Math.random() * 4)
    if setting_mode == 'glider'
      console.log 'glider'
      world.set a_glider, point, rotation
    else if setting_mode == 'gun'
      console.log 'gun'
      world.set a_gun, point, 0
    else if setting_mode == 'conway'
      console.log 'conway'
      world.set a_conway, point, 0
    else
      console.log 'point'
      world.toggle point

  $(document).bind 'keydown', (event) =>
    console.log event.keyCode
    console.dir event
    if event.keyCode is 32
      event.preventDefault();
      $('#modal').fadeOut();
      if running
        # STOP
        clearInterval runner
        running = false
      else
        # START
        runner = setInterval((-> world.next()), delay)
        running = true
    else if event.keyCode is 71
      setting_mode = if setting_mode is 'glider' then '' else 'glider'
    else if event.keyCode is 78
      setting_mode = if setting_mode is 'gun' then '' else 'gun'
    else if event.keyCode is 67
      setting_mode = if setting_mode is 'conway' then '' else 'conway'
    else if event.keyCode is 66
      world.clear()
    else if event.keyCode is 70
      $('table').toggleClass('fade-mode');
    else if event.keyCode is 27 or (event.keyCode is 191 and event.shiftKey)
      $('#modal').fadeIn();
      # STOP
      clearInterval runner
      running = false

    set_mode_labels()
