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
const MIN_STRING_HIT_STRENGTH = 1;
const STRING_DETECTION_SIZE = 1;

const ONE_RADIAN = Math.PI / 180;
const STRING_SIZE_MIN = 12;
const CELL_SIZE = 16;

class String {
  #stringOrigin;
  #stringGoal;
  #stringType;

  #ownedTiles;
  #touchingOwnedTiles = false;

  constructor(originX, originY, goalX, goalY, stringType, ownedTiles) {
    this.#stringOrigin = { x: originX, y: originY };
    this.#stringGoal = { x: goalX, y: goalY };
    this.#stringType = stringType;
    this.#ownedTiles = ownedTiles;

    strings.push(this);
  }

  onMouseHitOwnedTiles(previousX, previousY, currentX, currentY, hitStrength) {
    let stringOrigin = this.#stringOrigin;
    let stringGoal = this.#stringGoal;

    let withinBoundsX = ((previousX >= stringOrigin.x && previousX <= stringGoal.x) || (previousX <= stringOrigin.x && previousX >= stringGoal.x));
    let withinBoundsY = ((previousY >= stringOrigin.y && previousY <= stringGoal.y) || (previousY <= stringOrigin.y && previousY >= stringGoal.y));
    let hasTouchedTile = false;

    if (withinBoundsX && withinBoundsY) {
      for (let tile of this.#ownedTiles) {
        let innerTileX = (tile.x - STRING_DETECTION_SIZE);
        let outerTileX = (tile.x + STRING_DETECTION_SIZE);
        let innerTileY = (tile.y - STRING_DETECTION_SIZE);
        let outerTileY = (tile.y + STRING_DETECTION_SIZE);

        let hitTileBoundsX = ((currentX >= innerTileX && currentX <= outerTileX) || (currentX <= innerTileX && currentX >= outerTileX));
        let hitTileBoundsY = ((currentY >= innerTileY && currentY <= outerTileY) || (currentY <= innerTileY && currentY >= outerTileY));
        if (hitTileBoundsX && hitTileBoundsY) {
          hasTouchedTile = true;
          break;
        }
      }
    }

    if (!this.#touchingOwnedTiles && hasTouchedTile) {
      console.log("I was Hit!");
    }

    this.#touchingOwnedTiles = hasTouchedTile;
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
    let displacement = Math.max(distanceX, distanceY);

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
function mouseMoved() {
  let previousX = Math.floor(pmouseX / CELL_SIZE);
  let previousY = Math.floor(pmouseY / CELL_SIZE);
  let currentX = Math.floor(mouseX / CELL_SIZE);
  let currentY = Math.floor(mouseY / CELL_SIZE);

  let distanceX = Math.abs(currentX - previousX);
  let distanceY = Math.abs(currentY - previousY);
  let hypotenuseOfDistance = Math.hypot(distanceX, distanceY);

  let hitStrength = hypotenuseOfDistance;
  if (hitStrength >= MIN_STRING_HIT_STRENGTH) {
    for (let string of strings) {
      string.onMouseHitOwnedTiles(previousX, previousY, currentX, currentY, hitStrength);
    }
  }
}