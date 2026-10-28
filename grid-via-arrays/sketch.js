// Grid demo via 2D arrays
// both hard-coded and randomizing grids

// When hard-coding grid, use these
// let grid = [
//   [1, 0, 1, 0],
//   [0, 1, 1, 0],
//   [1, 0, 0, 1],
//   [0, 0, 1, 1]
// ];
// const SQUARE_DIMENSIONS = grid.length;

// if randomizing grid
const SQUARE_DIMENSIONS = 25;
let squareSize;
let grid;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  createSquareSize();
  grid = randomizeGrid(SQUARE_DIMENSIONS, SQUARE_DIMENSIONS);
}

function createSquareSize() {
  if (width < height) {
    squareSize = width / SQUARE_DIMENSIONS;
  }
  else {
    squareSize = height / SQUARE_DIMENSIONS;
  }
}
function randomizeGrid(columns, rows) {
  let newGrid = [];
  
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);

    for (let x = 0; x < columns; x++) {
      if (random(100) < 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
      }
      
    }
  }

  return newGrid;
}

function draw() {
  background(220);

  visualizeGrid();
}

function visualizeGrid() {
  for (let y = 0; y < SQUARE_DIMENSIONS; y++) {
    for (let x = 0; x < SQUARE_DIMENSIONS; x++) {
      if (grid[y][x] === 1) {
        fill("black");
      }
      else if (grid[y][x] === 0) {
        fill("white");
      }

      square(x * squareSize, y * squareSize, squareSize);
    }
  }
}

function mousePressed() {
  let column = Math.floor(mouseY / squareSize);
  let row = Math.floor(mouseX / squareSize);

  console.log(column, row);
  toggleCell(column, row);
}

function toggleCell(column, row) {
  if (grid[column][row] === 1) {
    grid[column][row] = 0;
  }
  else if (grid[column][row] === 0) {
    grid[column][row] = 1;
  }
}