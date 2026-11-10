// Water-Simulation
// Milo Sadoway
// 10-29-2026
//
// Extra for Experts:

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes



// class SoundString {
//   #maxAmplitude;
//   #maxSpeed;

//   #stringStart;
//   #stringEnd;

//   #waveAmplitude;
//   #wavePeriodSize;
//   #waveSpeed;

//   constructor(x1, y1, x2, y2) {
//     this.#stringStart = [x1, y1];
//     this.#stringEnd = [x2, y2];
//   }

//   something() {
//     console.log(this.#stringStart);
//   }
// }

// let newString = new SoundString(1, 2, 3, 4).something();

//////////////////////////////

// 2D rectangular Grid
// and Edge-case checking

const BLANK_TILE = 0;
const FILLED_TILE = 1;

const CELL_SIZE = 20;

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
      newGrid[col].push(BLANK_TILE);
    }
  }

  return newGrid;
}

function draw() {
  background(220);

  updateGrid();
  visualizeGrid();
}

let amplitudeX = 12;
let amplitudeY = 4;
let speedX = 1 / 40;
let speedY = 1 / 20;

let startingY;
let startingX;
let xPos = 0;
let yPos = 0;

function updateGrid() {
  startingY = height / 2;
  startingX = width / 2;

  xPos += speedX;
  yPos += speedY;
  
  let x = startingX + Math.cos(xPos) * height / CELL_SIZE * amplitudeX;
  let y = startingY + Math.sin(yPos) * height / CELL_SIZE * amplitudeY;
  let col = Math.floor(y / CELL_SIZE);
  let row = Math.floor(x / CELL_SIZE);

  toggleCell(col, row);
  console.log(col, row, y);
}
function visualizeGrid() {
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[col][row] === BLANK_TILE) {
        fill("white");
      }
      else if (grid[col][row] === FILLED_TILE) {
        fill("black");
      }

      square(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }
}

function keyPressed() {
}
function mousePressed() {
}

function toggleCell(col, row) {
  // edge checking
  if ((col >= 0 && col < columns) && (row >= 0 && row < rows)) {
    if (grid[col][row] === BLANK_TILE) {
      grid[col][row] = FILLED_TILE;
    }
    // else if (grid[col][row] === FILLED_TILE) {
    //   grid[col][row] = BLANK_TILE;
    // }
  }
}