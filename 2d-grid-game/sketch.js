// Water-Simulation
// Milo Sadoway
// 10-29-2026
//
// Extra for Experts:

const AIR_INDEX = 0;
const WATER_INDEX = 1;
const OBJECT_INDEX = 2;

const OBJECT_OUTLINE_COLOR = 0;
const OBJECT_SIZE = 5;

// MAIN CONSTANTS
const CELL_SIZE = 40;

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

  grid = generateEmptyGrid(columns, rows);
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
      noStroke();

      if (grid[col][row] === AIR_INDEX) {
        fill("white");
      }
      else if (grid[col][row] === WATER_INDEX) {
        fill("blue");
      }
      else if (grid[col][row] === OBJECT_INDEX) {
        stroke(OBJECT_OUTLINE_COLOR);
        fill("grey");
      }

      square(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }
}

function mouseDragged() {
  if (mouseButton.left) {
    let col = Math.floor(mouseY / CELL_SIZE);
    let row = Math.floor(mouseX / CELL_SIZE);

    createObject(col, row); 
  }
}

function createObject(col, row) {
  let lowestIndex = Math.floor(OBJECT_SIZE / -2);

  for (let tileY = lowestIndex; tileY < OBJECT_SIZE; tileY++) {
    for (let tileX = lowestIndex; tileX < OBJECT_SIZE; tileX++) {
      toggleCell(col + tileY, row + tileX, OBJECT_INDEX);
    }
  }
  
}
function toggleCell(col, row, newIndex) {
  // edge checking
  if ((col >= 0 && col < columns) && (row >= 0 && row < rows)) {
    grid[col][row] = newIndex;
  }
}