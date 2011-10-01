window.World = class World
  # @cells is an array of arrays (rows, columns) containing
  # points, two element arrays [current state, next state]
  #
  # reference @cells by [y, x]
  constructor: (x, y, cell_size, @display) ->
    @neighbor_matrix = [
      [ [-1, -1], [0, -1], [1, -1]]
      [ [-1, 0]          , [1, 0] ]
      [ [-1, 1],  [0, 1],  [1, 1] ]
    ]

    @initialize_grid(x, y, cell_size)

    # default to toggling the clicked cell
    @setting_mode = ''

    # color by alive/dead or by dead/generation
    @generational_coloring = false

    console.log "INITIALIZED #{@width}x#{@height} WORLD"

  # build @cells array
  initialize_grid: (x, y) ->
    @width  = x
    @height = y

    y = 0
    x = 0
    @cells = []
    while y < @height
      @cells.push []
      while x < @width
        # each cell is [current, next, generation]
        @cells[y].push [0, 0, 0]
        x += 1
      y += 1
      x = 0

    # draw the grid, all dead cells
    @draw_cells()

    # keep DOM elements handy
    @cache_cells()

    # bind to toggle or set
    @bind_click()

    console.log "- initialized #{@width}x#{@height} grid"

  # the element that bind_click will bind to
  dom_target: ->
    $('td', @display)

  next: ->
    @update()
    @render()

  cache_cells: ->
    @dom_cells = []
    for row, y in @cells
      @dom_cells.push []
      for cell, x in row
        @dom_cells[y].push $("##{x}-#{y}")

  update: ->
    for row, y in @cells
      for col, x in row
        c = @neighbor_count(x, y)
        if col[0] is 1
          if c is 2 or c is 3
            # next state is alive
            col[1] = 1
            # increment generation counter
            col[2] = col[2] + 1
          else
            # next state is dead (starved or overrun)
            col[1] = 0
            # generation counter resets
            col[2] = 0
        else if col[0] is 0
          if c is 3
            # birth!
            col[1] = 1
            # generation counter starts
            col[2] = 1

  draw_cells: ->
    console.log "regular world draw"
    console.dir @display
    console.dir $(@display)
    @display.empty()
    out = []
    for row, y in @cells
      out.push "<tr>"
      for cell, x in row
        out.push "<td data-point='#{x},#{y}' class='cell dead' id='#{x}-#{y}'>&nbsp;</td>"
      out.push '</tr>'
    @display.html out.join('')

  # update a single cell
  draw_cell: (x, y) ->
    if @cells[y][x][0] is 0
      @dom_cells[y][x].addClass('dead')
    else
      @dom_cells[y][x].removeClass('dead')

  # next becomes current and dom updates
  # if state is changing
  render: ->
    for row, y in @cells
      for cell, x in row
        # skip unchanged cells
        continue if cell[0] is cell[1] and !@generational_coloring

        cell[0] = cell[1]
        @draw_cell x, y

  state: (c) ->
    if c[0] == 0 then 'dead' else ''

  neighbor_count: (x, y) ->
    living = 0
    self = this
    for row in @neighbor_matrix
      for coords in row
        # wrap nx and ny values with offset from coords
        nx = coords[0] + x
        if nx < 0
          nx += self.width
        else if nx >= self.width
          nx -= self.width
        ny = coords[1] + y
        if ny < 0
          ny += self.height
        else if ny >= self.height
          ny -= self.height
        living += self.cells[ny][nx][0]
    living

  toggle: (point) ->
    {x, y} = point
    @cells[y][x] = if @cells[y][x][0] is 0 then [1, 1, 1] else [0, 0, 0]

  # add a pattern to the screen
  set: (pattern, point, rotation) ->
    while rotation % 4 != 0
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
        if nx < 0
          nx += self.width
        else if nx >= self.width
          nx -= self.width

        ny = point.y + py
        if ny < 0
          ny += self.height
        else if ny >= self.height
          ny -= self.height

        self.cells[ny][nx][0] = value
        self.cells[ny][nx][1] = value
        self.cells[ny][nx][2] = value

        self.draw_cell nx, ny

  clear: ->
    for row, y in @cells
      for cell, x in row
        @cells[y][x] = [0, 0, 0]
        @draw_cell x, y

  random_rotation: -> Math.floor(Math.random() * 4)

  get_clicked_point: (evt) ->
    point = $(evt.target).data('point').split(',')
    {
      x: parseInt point[0]
      y: parseInt point[1]
    }

  bind_click: ->
    self = this
    @dom_target().unbind()

    self.was_running = false
    self.tracking = false
    @dom_target().bind 'mousedown', (evt) ->
      self.was_running = window.running
      console.log 'mousedown'
      window.pause() if window.pause?
      self.dom_target().bind 'mousemove', (evt) ->
        self.tracking = true
        {x, y} = self.get_clicked_point(evt)
        unless self.cells[y][x][0] is 1
          self.cells[y][x] = [1,1,1]
          self.draw_cell x, y


    @dom_target().bind 'mouseup', (evt) ->
      self.dom_target().unbind 'mousemove'
      window.start() if window.start? and self.was_running

    @dom_target().bind 'click', (evt) ->
      point = self.get_clicked_point(evt)
      if !self.tracking
        switch self.setting_mode
          when 'glider'
            console.log 'glider'
            self.set PATTERNS.a_glider, point, self.random_rotation()
          when 'gun'
            console.log 'gun'
            self.set PATTERNS.a_gun, point, 0
          when 'conway'
            console.log 'conway'
            self.set PATTERNS.a_conway, point, 0
          else
            console.log 'point'
            self.toggle point
            self.draw_cell point.x, point.y
      self.tracking = false

  toggle_mode: (mode) ->
    @setting_mode = if @setting_mode == mode then '' else mode

  toggle_generational_coloring: -> @generational_coloring = !generational_coloring

# load world into container
window.create_world = (x, y, pixel, container) ->
  console.log "creating table world"
  new World x, y, pixel, container
