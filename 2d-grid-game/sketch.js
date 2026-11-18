// String-Simulation
// Milo Sadoway
// 10-29-2026
//
// Extra for Experts:

const FILLED_TILE = 1;

const BLANK_TILE = 0;
const SPAWN_STRING_TILE = 1;
const A_STRING_TILE = 2;
const B_STRING_TILE = 3;
const C_STRING_TILE = 4;
const D_STRING_TILE = 5;
const E_STRING_TILE = 6;
const F_STRING_TILE = 7;
const G_STRING_TILE = 8;

const ONE_RADIAN = Math.PI / 180;
const CELL_SIZE = 16;

class String {
  #stringOrigin;
  #stringGoal;
  #stringType;

  // #stringDistanceX = 0;
  // #stringDistanceY = 0;

  // #currentAmplitude = 0;
  // #currentPosition = 0;

  constructor(originX, originY, goalX, goalY, stringType) {
    this.#stringOrigin = {x: Math.floor(originX / CELL_SIZE), y: Math.floor(originY / CELL_SIZE)};
    this.#stringGoal = {x: Math.floor(goalX / CELL_SIZE), y: Math.floor(goalY / CELL_SIZE)};
    this.#stringType = stringType;

    // let newDistanceX = 
  }

  test() {
    console.log(this.#stringOrigin, this.#stringGoal, this.#stringType);
  }
}

let columns;
let rows;
let grid;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  calculateGrid();
  let newString = new String(random(height), random(height), random(height), random(height), C_STRING_TILE);
  newString.test();
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
let waveAmplitude = 8;
let wavePeriodLength = ONE_RADIAN * 1;
let waveSpeed = 1 / 4;

let waveYDiminish = 1 / 10;
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
  waveAmplitude = constrain(waveAmplitude -= waveYDiminish, 0, CELL_SIZE);
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
    let waveInitial = Math.sin(waveYPos + wavePeriodLength * x);
    let waveHeight = height / CELL_SIZE * waveAmplitude;
    let waveNormal;

    if (x < width/2) {
      waveNormal = lerp(0, 1, x / width);
    }
    else {
      waveNormal = lerp(1, 0, x / width);
    }

    let y = startingY + waveInitial * waveHeight * waveNormal;
    let col = Math.floor(y / CELL_SIZE);
    let row = Math.floor(x / CELL_SIZE);
    
    toggleCell(col, row);
  }
}

function manipulateWaveViaMousePosition() {
  wavePeriodLength = lerp(0, 1, mouseX / width) * ONE_RADIAN * CELL_SIZE / 4;
  waveAmplitude = lerp(0, 1, mouseY / height) * CELL_SIZE;
}

let mouseOnWave = false;

function manipulateWaveViaMouseFlick() {
  let midway = Math.floor(height / 2 / CELL_SIZE);

  let previousPos = Math.floor(pmouseY / CELL_SIZE);
  let currentPos = Math.floor(mouseY / CELL_SIZE);

  if ((currentPos >= midway && previousPos <= midway) || (currentPos <= midway && previousPos >= midway)) {
    if (!mouseOnWave) {
      mouseOnWave = true;

      waveAmplitude = Math.abs(movedY);
      // wavePeriodLength = Math.abs(movedX / CELL_SIZE);
    }
  }
  else {
    mouseOnWave = false;
  }
}

function mouseMoved() {
  manipulateWaveViaMouseFlick();
}

function updateGrid() {
  updateWaveRelatedInfo();

  // manipulateWaveViaMousePosition();
  // drawInfinity();

  drawWave();
}
function visualizeGrid() {
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[col][row] === BLANK_TILE) {
        fill("grey");
      }
      else if (grid[col][row] === FILLED_TILE) {
        fill("black");
      }

      square(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }
}