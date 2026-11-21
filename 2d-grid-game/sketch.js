// String-Simulation
// Milo Sadoway
// 10-29-2026
//
// Extra for Experts:

const BLANK_TILE_TYPE = 0;
const CREATION_TILE_TYPE = 1;
const A_STRING_TILE_TYPE = 2;
const B_STRING_TILE_TYPE = 3;
const C_STRING_TILE_TYPE = 4;
const D_STRING_TILE_TYPE = 5;
const E_STRING_TILE_TYPE = 6;
const F_STRING_TILE_TYPE = 7;
const G_STRING_TILE_TYPE = 8;

const BLANK_TILE_COLOUR = "Silver";
const CREATION_TILE_COLOUR = "Grey";
const A_STRING_TILE_COLOUR = "Red";
const B_STRING_TILE_COLOUR = "Orange";
const C_STRING_TILE_COLOUR = "Yellow";
const D_STRING_TILE_COLOUR = "Green";
const E_STRING_TILE_COLOUR = "Blue";
const F_STRING_TILE_COLOUR = "Purple";
const G_STRING_TILE_COLOUR = "Violet";

const STRING_CREATION_ADDITIONAL = 1;
const ONE_RADIAN = Math.PI / 180;
const STRING_SIZE_MIN = 12;
const CELL_SIZE = 16;

class String {
  #stringOrigin;
  #stringGoal;
  #stringType;

  #ownedTiles;

  constructor(originX, originY, goalX, goalY, stringType, ownedTiles) {
    this.#stringOrigin = { x: Math.floor(originX / CELL_SIZE), y: Math.floor(originY / CELL_SIZE) };
    this.#stringGoal = { x: Math.floor(goalX / CELL_SIZE), y: Math.floor(goalY / CELL_SIZE) };
    this.#stringType = stringType;
    this.#ownedTiles = ownedTiles;

    strings.push(this);
  }

  toggleAllOwnedTiles() {
    for (let tile of this.#ownedTiles) {
      toggleTile(tile.y, tile.x);
    }
  }
}

let creatingWave = false;
let lastWaveOrigin = { x: 0, y: 0 };
let lastWaveGoal = { x: 0, y: 0 };

let mouseInteractingWithWave = false;

let strings = [];
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
      newGrid[col].push(BLANK_TILE_TYPE);
    }
  }

  return newGrid;
}

function draw() {
  background(220);

  updateGrid();
  visualizeGrid();
}

function toggleTile(col, row) {
  // edge checking
  if ((col >= 0 && col < columns) && (row >= 0 && row < rows)) {
    if (grid[col][row] === BLANK_TILE_TYPE) {
      grid[col][row] = CREATION_TILE_TYPE;
    }
  }
}

// function manipulateWaveViaMouseFlick() {
//   let midway = Math.floor(height / 2 / CELL_SIZE);

//   let previousPos = Math.floor(pmouseY / CELL_SIZE);
//   let currentPos = Math.floor(mouseY / CELL_SIZE);

//   if ((currentPos >= midway && previousPos <= midway) || (currentPos <= midway && previousPos >= midway)) {
//     if (!mouseOnWave) {
//       mouseOnWave = true;

//       waveAmplitude = Math.abs(movedY);
//       // wavePeriodLength = Math.abs(movedX / CELL_SIZE);
//     }
//   }
//   else {
//     mouseOnWave = false;
//   }
// }

// function mouseMoved() {
//   manipulateWaveViaMouseFlick();
// }

function updateGrid() {
}
function visualizeGrid() {
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[col][row] === BLANK_TILE_TYPE) {
        fill(BLANK_TILE_COLOUR);
      }
      else if (grid[col][row] === CREATION_TILE_TYPE) {
        fill(F_STRING_TILE_COLOUR);
      }

      square(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }
}

function mousePressed() {
  if (!creatingWave) {
    let newX = Math.floor(mouseX / CELL_SIZE);
    let newY = Math.floor(mouseY / CELL_SIZE);

    creatingWave = true;
    lastWaveOrigin = { x: newX, y: newY };
  }
  else {
    let newX = Math.floor(mouseX / CELL_SIZE);
    let newY = Math.floor(mouseY / CELL_SIZE);

    let distanceX = Math.floor(Math.abs(lastWaveOrigin.x - newX));
    let distanceY = Math.floor(Math.abs(lastWaveOrigin.y - newY));
    let displacement = (distanceX ^ distanceX + distanceY ^ distanceX);

    if ((distanceX >= STRING_SIZE_MIN) || (distanceY >= STRING_SIZE_MIN)) {
      lastWaveGoal = { x: newX, y: newY };
      creatingWave = false;

      // Sometimes the goal tile is not calculated as owned, so place them
      // into the ownedTiles list beforehand, just in case.
      let ownedTiles = [{ y: lastWaveGoal.y, x: lastWaveGoal.x }];
      for (let posAlpha = 0; posAlpha <= 1; posAlpha += (1 / (displacement + STRING_CREATION_ADDITIONAL))) {
        let posY = Math.floor(lerp(lastWaveOrigin.y, lastWaveGoal.y, posAlpha));
        let posX = Math.floor(lerp(lastWaveOrigin.x, lastWaveGoal.x, posAlpha));

        let newOwnedTile = { y: posY, x: posX };
        ownedTiles.push(newOwnedTile);
      }

      let newString = new String(lastWaveOrigin.x, lastWaveOrigin.y, lastWaveGoal.x, lastWaveGoal.y, CREATION_TILE_TYPE, ownedTiles);
      newString.toggleAllOwnedTiles();
    }
  }
}