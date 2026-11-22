// String-Simulation
// Milo Sadoway
// 10-29-2026
//
// Extra for Experts:

const STRING_CONSTANTS = {
  TYPES: {
    BLANK: 0,
    A_STRING: 1,
    B_STRING: 2,
    C_STRING: 3,
    D_STRING: 4,
    E_STRING: 5,
    F_STRING: 6,
    G_STRING: 7,
  },
  COLOURS: {
    BLANK: "Silver",
    A_STRING: "Red",
    B_STRING: "Orange",
    C_STRING: "Yellow",
    D_STRING: "Green",
    E_STRING: "Blue",
    F_STRING: "Purple",
    G_STRING: "Violet",
  },
  WAVE_DATA: {},
};

const STRING_CREATION_ADDITIONAL = 1;
const MIN_STRING_HIT_STRENGTH = 1;
const STRING_DETECTION_SIZE = 1;

const FULL_CIRCLE_IN_RADIANS = 2 * Math.PI;
const ONE_RADIAN = Math.PI / 180;
const STRING_SIZE_MIN = 12;
const CELL_SIZE = 16;

class String {
  #stringOrigin;
  #stringGoal;
  #stringType;

  #ownedTiles;
  #touchingOwnedTiles = false;

  #totalDisplacementX;
  #totalDisplacementY;
  #waveData = {
    amplitude: 6,
    periodLength: 25,
    speed: 0.25,
  };

  constructor(originX, originY, goalX, goalY, stringType, ownedTiles) {
    this.#stringOrigin = { x: originX, y: originY };
    this.#stringGoal = { x: goalX, y: goalY };
    this.#stringType = stringType;
    this.#ownedTiles = ownedTiles;

    // Although these numbers should already be intergers, lets floor
    // them again just in case
    let displacementX = Math.floor(this.#stringGoal.x - this.#stringOrigin.x);
    let displacementY = Math.floor(this.#stringGoal.y - this.#stringOrigin.y);
    this.#totalDisplacementX = displacementX;
    this.#totalDisplacementY = displacementY;

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

  // I used some public sites to help me calculate the sine wave (listed below):
  //
  // - Video Demo: https://www.youtube.com/watch?v=uqlz015kjV4&t=207s -> (Reference video of how I 
  //   wanted the graph to behave)
  //
  // - Desmos Graph: https://www.desmos.com/calculator/m77fpdxscn -> (Used
  //   to understand how to get the perpendicular angles of the line)
  //
  // - Example: https://stackoverflow.com/questions/46700368/angled-direction-sine-wave -> (A public
  //   explanation of how to solve the problem)
  updateAndDrawWave() {
    let stringOrigin = this.#stringOrigin;
    let displacementX = this.#totalDisplacementX;
    let displacementY = this.#totalDisplacementY;

    let displacementSlope = Math.hypot(displacementX, displacementY);
    let perpendicularToSlopeX = (-displacementY / displacementSlope);
    let perpendicularToSlopeY = (displacementX / displacementSlope);
    let directionX = (displacementX / displacementSlope);
    let directionY = (displacementY / displacementSlope);

    for (let tile of this.#ownedTiles) {
      let newPositionX = (tile.x - stringOrigin.x) * directionX;
      let newPositionY = (tile.y - stringOrigin.y) * directionY;
      let pointOnWave = (newPositionX + newPositionY);

      let periodLength = this.#waveData.periodLength;
      let amplitude = this.#waveData.amplitude;
      let speed = this.#waveData.speed;

      let phaseShift = ((FULL_CIRCLE_IN_RADIANS * pointOnWave) / periodLength) - (speed * frameCount);
      let positionOnWave = (Math.sin(phaseShift) * amplitude);

      let finalX = Math.round(tile.x + perpendicularToSlopeX * positionOnWave);
      let finalY = Math.round(tile.y + perpendicularToSlopeY * positionOnWave);
      let tileType = this.#stringType

      toggleTile(finalY, finalX, tileType);
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
      newGrid[col].push(STRING_CONSTANTS.TYPES.BLANK);
    }
  }

  return newGrid;
}

function draw() {
  background(220);

  updateGrid();
  visualizeGrid();
}

function toggleTile(col, row, tileType = STRING_CONSTANTS.TYPES.BLANK) {
  // edge checking
  if ((col >= 0 && col < columns) && (row >= 0 && row < rows)) {
    grid[col][row] = tileType;
  }
}

function updateGrid() {
  grid = generateEmptyGrid(columns, rows);

  for (let string of strings) {
    string.updateAndDrawWave();
  }
}
function visualizeGrid() {
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[col][row] === STRING_CONSTANTS.TYPES.BLANK) {
        fill(STRING_CONSTANTS.COLOURS.BLANK);
      }
      else if (grid[col][row] === STRING_CONSTANTS.TYPES.A_STRING) {
        fill(STRING_CONSTANTS.COLOURS.A_STRING);
      }
      else if (grid[col][row] === STRING_CONSTANTS.TYPES.B_STRING) {
        fill(STRING_CONSTANTS.COLOURS.B_STRING);
      }
      else if (grid[col][row] === STRING_CONSTANTS.TYPES.C_STRING) {
        fill(STRING_CONSTANTS.COLOURS.C_STRING);
      }
      else if (grid[col][row] === STRING_CONSTANTS.TYPES.D_STRING) {
        fill(STRING_CONSTANTS.COLOURS.D_STRING);
      }
      else if (grid[col][row] === STRING_CONSTANTS.TYPES.E_STRING) {
        fill(STRING_CONSTANTS.COLOURS.E_STRING);
      }
      else if (grid[col][row] === STRING_CONSTANTS.TYPES.F_STRING) {
        fill(STRING_CONSTANTS.COLOURS.F_STRING);
      }
      else if (grid[col][row] === STRING_CONSTANTS.TYPES.G_STRING) {
        fill(STRING_CONSTANTS.COLOURS.G_STRING);
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

      let randomType = Math.round(random(0, 7));
      new String(lastWaveOrigin.x, lastWaveOrigin.y, lastWaveGoal.x, lastWaveGoal.y, randomType, ownedTiles);
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