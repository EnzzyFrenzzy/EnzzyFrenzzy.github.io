// String-Simulation
// Milo Sadoway
// 10-29-2026
//
// Used the following sites:
// https://www.w3schools.com/jsref/jsref_object_values.asp
// https://www.youtube.com/watch?v=uqlz015kjV4&t=207s
// https://www.desmos.com/calculator/m77fpdxscn
// https://stackoverflow.com/questions/46700368/angled-direction-sine-wave
//
// Extra for Experts:
// - I used some sounds
// - started using OOP in this  project
// - Used some object functions like .values() and .keys()

// minor calculation additionals and whatnot
const STRING_CREATION_ADDITIONAL = 1;
const HIT_STRENGTH_MULTIPLIER = 2;
const MIN_STRING_HIT_STRENGTH = 1;
const STRING_DETECTION_SIZE = 1;

// Main calculation stuff
const FULL_CIRCLE_IN_RADIANS = (2 * Math.PI);
const ONE_RADIAN = (Math.PI / 180);
const STRING_SIZE_MIN = 12;
const CELL_SIZE = 16;

// the main data constants used throughout the whole script.
const TILE_STROKE_COLOUR = "Grey";
const STRING_CONSTANTS = {
  // only for displaying via text during string selection
  NAMES: {
    A_STRING: "A",
    B_STRING: "B",
    C_STRING: "C",
    D_STRING: "D",
    E_STRING: "E",
    F_STRING: "F",
    G_STRING: "G",
  },

  TYPES: {
    A_STRING: 0,
    B_STRING: 1,
    C_STRING: 2,
    D_STRING: 3,
    E_STRING: 4,
    F_STRING: 5,
    G_STRING: 6,
  },
  COLOURS: {
    A_STRING: "Red",
    B_STRING: "Orange",
    C_STRING: "Yellow",
    D_STRING: "Green",
    E_STRING: "Blue",
    F_STRING: "Purple",
    G_STRING: "Violet",
  },

  // These are meant to represent differences in Hertz (definitely not accurately),
  // so its best to just leave these values alone.
  BLANK_WAVE_DATA: {
    A_STRING: { periodLength: (CELL_SIZE * 3.5), speed: 0.18, amplitude: 0 },
    B_STRING: { periodLength: (CELL_SIZE * 3.25), speed: 0.20, amplitude: 0 },
    C_STRING: { periodLength: (CELL_SIZE * 3), speed: 0.22, amplitude: 0 },
    D_STRING: { periodLength: (CELL_SIZE * 2.75), speed: 0.24, amplitude: 0 },
    E_STRING: { periodLength: (CELL_SIZE * 2.5), speed: 0.26, amplitude: 0 },
    F_STRING: { periodLength: (CELL_SIZE * 2.25), speed: 0.28, amplitude: 0 },
    G_STRING: { periodLength: (CELL_SIZE * 2), speed: 0.3, amplitude: 0 },
  },
};

// Seperate these from the STRING_CONSTANTS so that other code can access
// the constants more easily, without needing to deal with these
const BLANK_TILE_COLOUR = "Silver";
const BLANK_TILE_TYPE = -1;

const STRING_DIMINISH_SPEED = 0.02;
const MAX_STRING_AMPLITUDE = Math.floor(CELL_SIZE * 0.9);
const MIN_STRING_AMPLITUDE = 0;

// The text options that are used for string selection
const SElECTION_STROKE_COLOUR = "Black";
const SELECTION_ON_SCREEN_TIME = 2000;
const SELECTION_STROKE_SIZE = 8;
const SELECTION_TEXT_SIZE = 60;

// the text options used for instructions
const INSTRUCTIONS = {
  HIDDEN: [
    "View the instructions with 'I'.",
  ],
  VISIBLE: [
    `CLICK two points on the grid to spawn a string. (AT LEAST ${STRING_SIZE_MIN} tiles long)`,
    "Do controlled FLICK's with your MOUSE to interact. (Not fast nor slow)",
    "Change the selected string with MOUSE-SCROLL.",
    "Close the instructions with ' I '.",
  ],
};
const INSTRUCTION_STROKE_COLOUR = "Black";
const INSTRUCTION_TEXT_COLOUR = "Beige";
const INSTRUCTION_FONT = 'Verdana';
const INSTRUCTION_STROKE_SIZE = 6;
const INSTRUCTION_TEXT_SIZE = 26;
const INSTRUCTION_SPACING = 44;

let lastWaveOrigin = { x: 0, y: 0 };
let lastWaveGoal = { x: 0, y: 0 };
let creatingWave = false;

let selectedStringType = STRING_CONSTANTS.TYPES.A_STRING;
let stringSelectionIndex = 0;
let lastSelectionTime = 0;

let instructionsAreVisible = true;

let strings = [];
let columns;
let rows;
let grid;

// all of the string sounds to be used
let stringSoundA;
let stringSoundB;
let stringSoundC;
let stringSoundD;
let stringSoundE;
let stringSoundF;
let stringSoundG;

class String {
  #stringOrigin;
  #stringGoal;
  #stringType;
  #stringSound;

  #ownedTiles;
  #touchingOwnedTiles = false;

  #totalDisplacementX;
  #totalDisplacementY;

  #waveData;

  // sets the #waveData to become a blank template provided by the
  // STRING_CONSTANTS listed above.
  #finalizeWaveData() {
    let stringType = this.#stringType;

    if (stringType === STRING_CONSTANTS.TYPES.A_STRING) {
      this.#waveData = structuredClone(STRING_CONSTANTS.BLANK_WAVE_DATA.A_STRING);
    }
    else if (stringType === STRING_CONSTANTS.TYPES.B_STRING) {
      this.#waveData = structuredClone(STRING_CONSTANTS.BLANK_WAVE_DATA.B_STRING);
    }
    else if (stringType === STRING_CONSTANTS.TYPES.C_STRING) {
      this.#waveData = structuredClone(STRING_CONSTANTS.BLANK_WAVE_DATA.C_STRING);
    }
    else if (stringType === STRING_CONSTANTS.TYPES.D_STRING) {
      this.#waveData = structuredClone(STRING_CONSTANTS.BLANK_WAVE_DATA.D_STRING);
    }
    else if (stringType === STRING_CONSTANTS.TYPES.E_STRING) {
      this.#waveData = structuredClone(STRING_CONSTANTS.BLANK_WAVE_DATA.E_STRING);
    }
    else if (stringType === STRING_CONSTANTS.TYPES.F_STRING) {
      this.#waveData = structuredClone(STRING_CONSTANTS.BLANK_WAVE_DATA.F_STRING);
    }
    else if (stringType === STRING_CONSTANTS.TYPES.G_STRING) {
      this.#waveData = structuredClone(STRING_CONSTANTS.BLANK_WAVE_DATA.G_STRING);
    }
  }

  // Checks the stringType, and plays the corresponding string sound
  #finalizeStringSound() {
    let stringType = this.#stringType;
    let selectedStringSound;

    if (stringType === STRING_CONSTANTS.TYPES.A_STRING) {
      selectedStringSound = stringSoundA;
    }
    else if (stringType === STRING_CONSTANTS.TYPES.B_STRING) {
      selectedStringSound = stringSoundB;
    }
    else if (stringType === STRING_CONSTANTS.TYPES.C_STRING) {
      selectedStringSound = stringSoundC;
    }
    else if (stringType === STRING_CONSTANTS.TYPES.D_STRING) {
      selectedStringSound = stringSoundD;
    }
    else if (stringType === STRING_CONSTANTS.TYPES.E_STRING) {
      selectedStringSound = stringSoundE;
    }
    else if (stringType === STRING_CONSTANTS.TYPES.F_STRING) {
      selectedStringSound = stringSoundF;
    }
    else if (stringType === STRING_CONSTANTS.TYPES.G_STRING) {
      selectedStringSound = stringSoundG;
    }

    this.#stringSound = selectedStringSound;
  }

  // what is needed on string construction:
  // Origin point -> X and Y
  // Goal point -> X and Y
  // The type of string it will be
  // The owned tiles (the midline)
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

    this.#finalizeStringSound();
    this.#finalizeWaveData();
    strings.push(this);
  }

  // Used for detection on when the mouse has hit any strings midline
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

    let mouseSuccessfullyHitString = (!this.#touchingOwnedTiles && hasTouchedTile);
    if (mouseSuccessfullyHitString) {
      if (hitStrength > this.#waveData.amplitude) {
        // since the sound is slightly delayed, lets make it play first, and hopefully
        // the user wont care too much.
        this.#stringSound.play();

        let newAmplitude = constrain((this.#waveData.amplitude + hitStrength), MIN_STRING_AMPLITUDE, MAX_STRING_AMPLITUDE);
        this.#waveData.amplitude = newAmplitude;

      }
    }

    this.#touchingOwnedTiles = hasTouchedTile;
  }

  // Updates the string's owned tiles to create a sine wave. Then, applies
  // that wave onto the grid. *This should be called per frame on the draw function
  // at all times.*
  updateAndDrawWave() {
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

    let stringOrigin = this.#stringOrigin;
    let displacementX = this.#totalDisplacementX;
    let displacementY = this.#totalDisplacementY;

    let displacementSlope = Math.hypot(displacementX, displacementY);
    if (displacementSlope === 0) { // So we dont get any division errors
      return;
    }

    let perpendicularToSlopeX = (-displacementY / displacementSlope);
    let perpendicularToSlopeY = (displacementX / displacementSlope);
    let directionX = (displacementX / displacementSlope);
    let directionY = (displacementY / displacementSlope);

    for (let tile of this.#ownedTiles) {
      let periodLength = this.#waveData.periodLength;
      let amplitude = this.#waveData.amplitude;
      let speed = this.#waveData.speed;

      let finalX = tile.x;
      let finalY = tile.y;

      // If the amplitude is nothing/below out minimum, then we dont need to do all of these calculations,
      // since it wont matter anyways! 
      if (amplitude > MIN_STRING_AMPLITUDE) {
        let newPositionX = (tile.x - stringOrigin.x) * directionX;
        let newPositionY = (tile.y - stringOrigin.y) * directionY;
        let pointOnWave = (newPositionX + newPositionY);

        let phaseShift = ((FULL_CIRCLE_IN_RADIANS * pointOnWave) / periodLength) - (speed * frameCount);
        let endClamps = Math.sin((Math.PI * pointOnWave) / displacementSlope);
        let positionOnWave = ((Math.sin(phaseShift) * amplitude) * endClamps);

        // using Math.floor would make lighter waves look stiff. Rounding is better.
        finalX = Math.round(tile.x + perpendicularToSlopeX * positionOnWave);
        finalY = Math.round(tile.y + perpendicularToSlopeY * positionOnWave);
      }

      let tileType = this.#stringType;
      toggleTile(finalY, finalX, tileType);
    }

    let newAmplitude = constrain((this.#waveData.amplitude -= STRING_DIMINISH_SPEED), MIN_STRING_AMPLITUDE, MAX_STRING_AMPLITUDE);
    this.#waveData.amplitude = newAmplitude;
  }
}

// main things on initialization
async function setup() {
  loadAllStringSounds();

  createCanvas(windowWidth, windowHeight);
  calculateGrid();
}

async function loadAllStringSounds() {
  stringSoundA = await loadSound("sounds/A_String.mp3");
  stringSoundB = await loadSound("sounds/B_String.mp3");
  stringSoundC = await loadSound("sounds/C_String.mp3");
  stringSoundD = await loadSound("sounds/D_String.mp3");
  stringSoundE = await loadSound("sounds/E_String.mp3");
  stringSoundF = await loadSound("sounds/F_String.mp3");
  stringSoundG = await loadSound("sounds/G_String.mp3");
}

// creates all of the total columns and rows the grid will have, then creates
// an empty grid
function calculateGrid() {
  columns = Math.floor(height / CELL_SIZE);
  rows = Math.floor(width / CELL_SIZE);

  grid = generateEmptyGrid(columns, rows);
}
// Sets all tiles on the grid to be the blank tile type
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

// main things per frame
function draw() {
  background(220);

  updateGrid();
  visualizeGrid();

  // keep these after visualizing the grid, so they show on top.
  visualizeStringSelection();
  visualizeInstructions();
}

// change the tile at grid[col][row] to the tileType.
function toggleTile(col, row, tileType = BLANK_TILE_TYPE) {
  // edge checking
  if ((col >= 0 && col < columns) && (row >= 0 && row < rows)) {
    grid[col][row] = tileType;
  }
}

// Updates the grid by having all strings draw their waves onto it.
function updateGrid() {
  grid = generateEmptyGrid(columns, rows);

  for (let string of strings) {
    string.updateAndDrawWave();
  }
}
// changes the grid by drawing certain colours when a tile value is changed.
function visualizeGrid() {
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      if (grid[col][row] === BLANK_TILE_TYPE) {
        fill(BLANK_TILE_COLOUR);
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

      stroke(TILE_STROKE_COLOUR);
      square(row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }
}

// the text that is shown to visualize which string is currently selected to spawn in.
function visualizeStringSelection() {
  if (lastSelectionTime >= millis()) {
    push();

    let stringName = Object.keys(STRING_CONSTANTS.TYPES)[selectedStringType];
    let providedColour = STRING_CONSTANTS.COLOURS[stringName];
    let providedText = (STRING_CONSTANTS.NAMES[stringName]);

    fill(providedColour);
    textSize(SELECTION_TEXT_SIZE);
    stroke(SElECTION_STROKE_COLOUR);
    strokeWeight(SELECTION_STROKE_SIZE);

    // The positionY is halved to keep the gaps on both sides more even.
    let positionY = (windowHeight - SELECTION_TEXT_SIZE / 2);
    let positionX = (windowWidth - SELECTION_TEXT_SIZE);
    text(providedText, positionX, positionY);

    pop();
  }
}
// the instructions visualized in text for the user
function visualizeInstructions() {
  push();

  textFont(INSTRUCTION_FONT);
  fill(INSTRUCTION_TEXT_COLOUR);
  textSize(INSTRUCTION_TEXT_SIZE);
  stroke(INSTRUCTION_STROKE_COLOUR);
  strokeWeight(INSTRUCTION_STROKE_SIZE);

  let spacingMultiplier = 1;
  if (instructionsAreVisible) {
    for (let instructionText of INSTRUCTIONS.VISIBLE) {
      // The spacing needs to change per frame for the Y, however the gap
      // on the left looks weird, so change it to make it look less weird.
      let spacingOffsetX = (INSTRUCTION_SPACING / 2);
      let spacingOffsetY = (INSTRUCTION_SPACING * spacingMultiplier);

      text(instructionText, spacingOffsetX, spacingOffsetY);
      spacingMultiplier++;
    }
  }
  else {
    for (let instructionText of INSTRUCTIONS.HIDDEN) {
      // The spacing needs to change per frame for the Y, however the gap
      // on the left looks weird, so change it to make it look less weird.
      let spacingOffsetX = (INSTRUCTION_SPACING / 2);
      let spacingOffsetY = (INSTRUCTION_SPACING * spacingMultiplier);

      text(instructionText, spacingOffsetX, spacingOffsetY);
      spacingMultiplier++;
    }
  }

  pop();
}

// how each string is created
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

      new String(lastWaveOrigin.x, lastWaveOrigin.y, lastWaveGoal.x, lastWaveGoal.y, selectedStringType, ownedTiles);
    }
  }
}
// how each string is interacted with
function mouseMoved() {
  let previousX = Math.floor(pmouseX / CELL_SIZE);
  let previousY = Math.floor(pmouseY / CELL_SIZE);
  let currentX = Math.floor(mouseX / CELL_SIZE);
  let currentY = Math.floor(mouseY / CELL_SIZE);

  // Cant be negative, since that will flip the sine wave of the string
  // it may effect
  let distanceX = Math.abs(currentX - previousX);
  let distanceY = Math.abs(currentY - previousY);
  let hypotenuseOfDistance = Math.hypot(distanceX, distanceY);

  let hitStrength = (hypotenuseOfDistance * HIT_STRENGTH_MULTIPLIER);
  if (hitStrength >= MIN_STRING_HIT_STRENGTH) {
    for (let string of strings) {
      string.onMouseHitOwnedTiles(previousX, previousY, currentX, currentY, hitStrength);
    }
  }
}
// how the string selected type is changed
function mouseWheel(event) {
  // the mouse wheel delta should be flipped, it feels nicer
  if (event.delta > 0) {
    stringSelectionIndex--;
  }
  else {
    stringSelectionIndex++;
  }

  // Since this is an object and not an array, we have to use
  // different methods of getting the key, and value of each within
  // the table. Used the site below to help figure out how:
  // https://www.w3schools.com/jsref/jsref_object_values.asp
  let totalNumberOfStringTypes = (Object.keys(STRING_CONSTANTS.TYPES).length - 1);
  let stringTypes = Object.values(STRING_CONSTANTS.TYPES);

  stringSelectionIndex = constrain(stringSelectionIndex, 0, totalNumberOfStringTypes);
  selectedStringType = stringTypes[stringSelectionIndex];
  lastSelectionTime = millis() + SELECTION_ON_SCREEN_TIME;
}
// how to hide and unhide instructions
function keyPressed() {
  if (key === "i") {
    instructionsAreVisible = !instructionsAreVisible;
  }
}