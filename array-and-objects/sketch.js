// Array and Object Notation
// Milo Sadoway
// Oct 7, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
//
// https://p5js.org/reference/p5/fontBounds/
// https://p5js.org/reference/p5/object/

const CENTER_OFFSET_DIVISOR = 6;

const MAX_TEXT_FLUCTUATION_TIME = 99999;
const MAX_TEXT_FLUCTUATION_SPEED = 0.1;
const FLUCTUATION_INTENSITY = 100;

const TEXT_VISIBILITY_MIN = 0;
const TEXT_VISIBILITY_MAX = 1;
const TEXT_TIME_MIN = 4;
const TEXT_TIME_MAX = 8;

const TEXT_SPEED_MIN = 0.001;
const TEXT_SPEED_MAX = 0.01;
const TEXT_SIZE_MIN = 20;
const TEXT_SIZE_MAX = 70;

const HOVERED_OVER_TEXT_STYLE = "bold italic";
const REGULAR_TEXT_STYLE = "normal";

const MAX_TEXTS_ON_SCREEN = 16;
const TEXT_ADDED_DEBOUNCE = 0.25;

const POSSIBLE_TEXTS = [
  "WHY", "HELLO", "THERE"
];

let spawnTextDebounce = TEXT_ADDED_DEBOUNCE;
let hoveringOverText = false;
let textsOnScreen = [];
let selectedTexts = [];

let centerOffsetX;
let centerOffsetY;

////////// Main setup function
async function setup() {
  createCanvas(windowWidth, windowHeight);

  updateCenterOffsets();
}

// Makes the text not spawn outside of the users window
function updateCenterOffsets() {
  if (windowWidth > windowHeight) {
    centerOffsetX = (windowHeight / CENTER_OFFSET_DIVISOR);
    centerOffsetY = (windowHeight / CENTER_OFFSET_DIVISOR);
  }
  else {
    centerOffsetX = (windowWidth / CENTER_OFFSET_DIVISOR);
    centerOffsetY = (windowWidth / CENTER_OFFSET_DIVISOR);
  }
}

////////// Main draw function
function draw() {
  background(125);
  spawnTextObjects();
  updateTextSpawnDebounce();
  removeUnusableTextObjects();
  resetHoveringOverTextState();

  for (let textObject of textsOnScreen) {
    showcaseTextObject(textObject);
    checkIfHoveringOverTextObject(textObject);

    textObjectPerFrameUpdates(textObject);
    updateTextObjectIsUsableState(textObject);
    updateTextObjectVisibility(textObject);
    fluctuateTextObjectsDestination(textObject);
  }
}

function spawnTextObjects() {
  let canSpawnText = (spawnTextDebounce <= 0) && ((textsOnScreen.length) < MAX_TEXTS_ON_SCREEN);

  if (canSpawnText) {
    let text = random(POSSIBLE_TEXTS);
    let textSize = random(TEXT_SIZE_MIN, TEXT_SIZE_MAX);
    let textSpeed = random(TEXT_SPEED_MIN, TEXT_SPEED_MAX);

    let textObject = createTextObject(text, textSize, textSpeed);
    textsOnScreen.push(textObject);
    spawnTextDebounce = TEXT_ADDED_DEBOUNCE;
  }
}
function createTextObject(text, textSize, textSpeed) {
  let xStartPos = random(width / 2 - centerOffsetX, width / 2 + centerOffsetX);
  let yStartPos = random(height / 2 - centerOffsetY, height / 2 + centerOffsetY);

  let xDestination;
  if (xStartPos < width / 2) {
    xDestination = random(0, (width / 2));
  }
  else {
    xDestination = random((width / 2), width);
  }

  let yDestination;
  if (yStartPos < height / 2) {
    yDestination = random(0, (height / 2));
  }
  else {
    yDestination = random((height / 2), height);
  }

  let textObject = {
    xStartPos: xStartPos,
    yStartPos: yStartPos,

    xDestination: xDestination,
    yDestination: yDestination,
    destinationAlpha: 0,

    xPos: xStartPos,
    yPos: yStartPos,

    // Text which are not fast shouldn't have lots of fluctuation
    fluctuationSpeed: random(MAX_TEXT_FLUCTUATION_SPEED) * textSpeed,
    fluctuationTimeX: random(MAX_TEXT_FLUCTUATION_TIME),
    fluctuationTimeY: random(MAX_TEXT_FLUCTUATION_TIME),
    xFluctuation: xDestination,
    yFluctuation: yDestination,

    textDuration: random(TEXT_TIME_MIN, TEXT_TIME_MAX),
    currentDuration: 0,

    textSpeed: textSpeed,
    textSize: textSize,
    text: text,

    usable: true,
    visibility: 0,
    isHoveredOver: false,
  };

  return textObject;
}

function updateTextSpawnDebounce() {
  spawnTextDebounce -= 1 / frameRate();

  constrain(spawnTextDebounce, 0, TEXT_ADDED_DEBOUNCE);
}
function removeUnusableTextObjects() {
  for (let textObject of textsOnScreen) {
    let unusableTextObject = (textObject.usable === false && textObject.visibility <= TEXT_VISIBILITY_MIN);

    if (unusableTextObject) {
      let textObjectIndex = textsOnScreen.indexOf(textObject);
      let validIndexFound = (textObjectIndex !== -1)

      // if there is an actual index found
      if (validIndexFound) {
        textsOnScreen.splice(textObjectIndex, 1);
      }
    }
  }
}

function resetHoveringOverTextState() {
  // Although this is one line, the name of the function allows it to
  // be more easily understood what it means.

  hoveringOverText = false;
}

function showcaseTextObject(textObject) {
  let xPos = lerp(textObject.xStartPos, (textObject.xDestination + textObject.xFluctuation), textObject.destinationAlpha);
  let yPos = lerp(textObject.yStartPos, (textObject.yDestination + textObject.yFluctuation), textObject.destinationAlpha);

  push();

  textAlign(CENTER);
  textSize(textObject.textSize);

  // the alpha is represented in a 0-255 range, not 0-1
  let visibility = 255 * textObject.visibility
  fill(255, 255, 255, visibility);

  if (textObject.isHoveredOver) {
    textStyle(HOVERED_OVER_TEXT_STYLE);
  }
  else {
    textStyle(REGULAR_TEXT_STYLE);
  }

  text(textObject.text, xPos, yPos);

  pop();

  textObject.xPos = xPos;
  textObject.yPos = yPos;
}
function checkIfHoveringOverTextObject(textObject) {
  let sizeOfText = textObject.textSize;
  let text = textObject.text;

  let xPos = textObject.xPos;
  let yPos = textObject.yPos;

  push();

  textSize(sizeOfText);

  // the withinBoundsY looks different since the y isnt actually in
  // the center, but on the top. (withinBoundsX is in the center though)
  let bounds = fontBounds(text, xPos, yPos);
  let withinBoundsX = (mouseX > bounds.x - (bounds.w / 2)) && (mouseX < bounds.x + (bounds.w / 2));
  let withinBoundsY = (mouseY > bounds.y) && (mouseY < bounds.y + bounds.h);

  if (!hoveringOverText && withinBoundsX && withinBoundsY) {
    hoveringOverText = true;
    textObject.isHoveredOver = true;
  }
  else {
    // dont include "hoveringOverText" change here, since that would
    // make it switch between true/false within the for loop.

    textObject.isHoveredOver = false;
  }

  pop();
}

function textObjectPerFrameUpdates(textObject) {
  textObject.destinationAlpha += textObject.textSpeed;
  textObject.currentDuration += 1 / frameRate();
}
function updateTextObjectIsUsableState(textObject) {
  let overDuration = (textObject.textDuration < textObject.currentDuration);
  if (overDuration) {
    textObject.usable = false;
  }

  let outsideBoundingX = (textObject.xPos < 0 || textObject.xPos > width);
  let outsideBoundingY = (textObject.yPos < 0 || textObject.yPos > height);
  if (outsideBoundingX || outsideBoundingY) {
    textObject.usable = false;
  }
}
function updateTextObjectVisibility(textObject) {
  let newVisibility = textObject.visibility;

  if (textObject.usable) {
    newVisibility += 1 / frameRate();
  }
  else {
    newVisibility -= 1 / frameRate();
  }

  textObject.visibility = constrain(newVisibility, TEXT_VISIBILITY_MIN, TEXT_VISIBILITY_MAX);
}
function fluctuateTextObjectsDestination(textObject) {
  textObject.xFluctuation = noise(textObject.fluctuationTimeX) * FLUCTUATION_INTENSITY;
  textObject.yFluctuation = noise(textObject.fluctuationTimeY) * FLUCTUATION_INTENSITY;

  textObject.fluctuationTimeX += textObject.fluctuationSpeed;
  textObject.fluctuationTimeY += textObject.fluctuationSpeed;
}


