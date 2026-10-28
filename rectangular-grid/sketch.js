// 2D rectangular Grid
// and Edge-case checking

const CELL_SIZE = 50;

let columns;
let rows;
let grid;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  calculateGrid();
}

function calculateGrid() {
  columns = Math.floor(height / CELL_SIZE);
  rows = Math.floor(width / CELL_SIZE);

  grid = generateGrid(columns, rows);
}
function generateGrid(columns, rows) {
  let newGrid = [];

  for (let col = 0; col < columns; col++) {
    newGrid.push([]);

    for (let row = 0; row < rows; row++) {
      if (random(100) < 50) {
        newGrid[col].push(0);
      }
      else {
        newGrid[col].push(1);
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
      newGrid[col].push(0);
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
      if (grid[col][row] === 0) {
        fill("white");
      }
      else if (grid[col][row] === 1) {
        fill("black");
      }

      square(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = generateGrid(columns, rows);
  }
  else if (key === "e") {
    grid = generateEmptyGrid(columns, rows);
  }
}
function mousePressed() {
  let col = Math.floor(mouseY / CELL_SIZE);
  let row = Math.floor(mouseX / CELL_SIZE);

  // middle
  toggleCell(col, row);

  // neighbors
  toggleCell(col + 1, row);
  toggleCell(col - 1, row);
  toggleCell(col, row + 1);
  toggleCell(col, row - 1);
}

function toggleCell(col, row) {
  // edge checking
  if ((col >= 0 && col < columns) && (row >= 0 && row < rows)) {
    if (grid[col][row] === 0) {
      grid[col][row] = 1;
    }
    else if (grid[col][row] === 1) {
      grid[col][row] = 0;
    }
  }
}