// 2D rectangular Grid
// and Edge-case checking

const CELL_SIZE = 50;
const OPEN_TILE = 0;
const WALL_TILE = 1;
const PLAYER_TILE = 9;

let columns;
let rows;
let grid;
let thePlayer = {
  x: 0,
  y: 0,
};

async function setup() {
  createCanvas(windowWidth, windowHeight);

  calculateGrid();
}

function calculateGrid() {
  columns = Math.floor(height / CELL_SIZE);
  rows = Math.floor(width / CELL_SIZE);

  grid = generateGrid(columns, rows);
  grid[thePlayer.y][thePlayer.x] = PLAYER_TILE;
}
function generateGrid(columns, rows) {
  let newGrid = [];

  for (let col = 0; col < columns; col++) {
    newGrid.push([]);

    for (let row = 0; row < rows; row++) {
      if (random(100) < 50) {
        newGrid[col].push(OPEN_TILE);
      }
      else {
        newGrid[col].push(WALL_TILE);
      }
    }
  }

  return newGrid;
}
function generateEmptyGrid(columns, rows) {
  let newGrid = [];

  for (let col = 0; col < columns; col++) {
    newGrid.push([]);

    for (let row = 0; row < rows; row++) {
      newGrid[col].push(OPEN_TILE);
    }
  }

  return newGrid;
}

function draw() {
  background(220);

  visualizeGrid();
}

function visualizeGrid() {
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[col][row] === OPEN_TILE) {
        fill("white");
      }
      else if (grid[col][row] === WALL_TILE) {
        fill("black");
      }
      else if (grid[col][row] === PLAYER_TILE) {
        fill("red");
      }

      square(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = generateGrid(columns, rows);
    grid[thePlayer.y][thePlayer.x] = PLAYER_TILE;
  }
  else if (key === "e") {
    grid = generateEmptyGrid(columns, rows);
    grid[thePlayer.y][thePlayer.x] = PLAYER_TILE;
  }
  else if (key === RIGHT_ARROW) {
    movePlayer(thePlayer.x + 1, thePlayer.y);
  }
  else if (key === LEFT_ARROW) {
    movePlayer(thePlayer.x - 1, thePlayer.y);
  }
  else if (key === UP_ARROW) {
    movePlayer(thePlayer.x, thePlayer.y - 1);
  }
  else if (key === DOWN_ARROW) {
    movePlayer(thePlayer.x, thePlayer.y + 1);
  }
}
function mousePressed() {
  let col = Math.floor(mouseY / CELL_SIZE);
  let row = Math.floor(mouseX / CELL_SIZE);

  toggleCell(col, row);
}

function movePlayer(x, y) {
  // edge checking
  if ((y >= 0 && y < columns) && (x >= 0 && x < rows)) {
    if (grid[y][x] === OPEN_TILE) {
      // remove old player
      let oldX = thePlayer.x;
      let oldY = thePlayer.y;

      // move the player
      thePlayer.x = x;
      thePlayer.y = y;

      // update the player on the grid
      grid[thePlayer.y][thePlayer.x] = PLAYER_TILE;
      grid[oldY][oldX] = OPEN_TILE;
    }
  }
}

function toggleCell(col, row) {
  // edge checking
  if ((col >= 0 && col < columns) && (row >= 0 && row < rows)) {
    if (grid[col][row] === OPEN_TILE) {
      grid[col][row] = WALL_TILE;
    }
    else if (grid[col][row] === WALL_TILE) {
      grid[col][row] = OPEN_TILE;
    }
  }
}