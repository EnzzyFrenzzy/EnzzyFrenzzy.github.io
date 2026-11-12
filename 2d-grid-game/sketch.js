// String-Simulation
// Milo Sadoway
// 10-29-2026
//
// Extra for Experts:

const BLANK_TILE = 0;
const FILLED_TILE = 1;

const ONE_RADIAN = Math.PI / 180;
const CELL_SIZE = 10;

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

// INFINITY CONTROlS
let amplitudeX = 4;
let amplitudeY = 1;
let speedX = 1 / 10;
let speedY = 1 / 5;

let xPos = 0;
let yPos = 0;

// WAVE CONTROLS
let waveAmplitude = 1;
let wavePeriodLength = ONE_RADIAN * 1/2;
let waveSpeed = 1 / 30;

let waveYPos = 0;

// GENERAL
let startingY;
let startingX;

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
function updateWaveRelatedInfo() {
  startingY = height / 2;
  startingX = width / 2;

  xPos += speedX;
  yPos += speedY;

  waveYPos += waveSpeed;
}

function drawInfinity() {
  let x = startingX + Math.cos(xPos) * height / CELL_SIZE * amplitudeX;
  let y = startingY + Math.sin(yPos) * height / CELL_SIZE * amplitudeY;
  let col = Math.floor(y / CELL_SIZE);
  let row = Math.floor(x / CELL_SIZE);

  if (grid[col][row] === BLANK_TILE) {
    toggleCell(col, row);
  }
}
function drawWave() {
  // for it to work nicely, make the grid empty first
  grid = generateEmptyGrid(columns, rows);

  for (let x = 0; x <= width; x++) {
    let phaseShift = wavePeriodLength * x;
    let y = startingY + Math.sin(waveYPos + phaseShift) * height / CELL_SIZE * waveAmplitude;

    let col = Math.floor(y / CELL_SIZE);
    let row = Math.floor(x / CELL_SIZE);
    toggleCell(col, row);
  }
}
function updateGrid() {
  updateWaveRelatedInfo();
  // drawInfinity();
  drawWave();
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

