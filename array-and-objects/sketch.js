// Array and Object Notation
// Milo Sadoway
// Oct 7, 2026
//
// Extra for Experts:
// - I used some new methods for arrays that were not taught in class
// - I made a gameplay loop (albeit simple)

const CENTER_OFFSET_DIVISOR = 6;

const MAX_TEXT_FLUCTUATION_TIME = 99999;
const MAX_TEXT_FLUCTUATION_SPEED = 0.1;
const FLUCTUATION_INTENSITY = 100;

const TEXT_VISIBILITY_MIN = 0;
const TEXT_VISIBILITY_MAX = 1;
const TEXT_TIME_MIN = 3;
const TEXT_TIME_MAX = 6;

const TEXT_SPEED_MIN = 0.001;
const TEXT_SPEED_MAX = 0.01;
const TEXT_SIZE_MIN = 20;
const TEXT_SIZE_MAX = 70;

const HOVERED_OVER_TEXT_STYLE = "bold";
const HOVERED_OVER_TEXT_STROKE = 8;
const REGULAR_TEXT_STYLE = "normal";
const REGULAR_TEXT_STROKE = 0;

// All the instructions given to the player
const ADD_WORD_INSTRUCTION_TEXT = "Left-click on a word to add it to your list.";
const REMOVE_WORD_INSTRUCTION_TEXT = "Right-click to remove the last word in your list.";
const SUBMITTION_INSTRUCTION_TEXT = "Once done, press ENTER and see if your list matches the sentence given.";
const INSTRUCTION_TEXT_STROKE = 6;
const INSTRUCTION_TEXT_SIZE = 20;
const INSTRUCTION_SPACING = 32;

const WORD_SPACING = " "
const YOUR_SENTENCE = "Your sentence:   ";
const GENERATED_SENTENCE = "Sentence to Match:   ";
const SUCCESS = "Successful!"
const FAILURE = "Incorrect"

const SHOW_RESULT_DURATION = 1;

// CHANGE THESE CONSTANTS TO CHANGE
// HOW DIFFICULT OR EASY THE GAME IS
/////////////////////////////////
const MAX_TEXTS_ON_SCREEN = 35;
const TEXT_ADDED_DEBOUNCE = 0.2;
const BLANK_WORD = "";

const WORDS_IN_SENTENCE_MAX = 8;
const WORDS_IN_SENTENCE_MIN = 3;

// Try to keep these more basic, common words.
// Since once it gets complex, it gets difficult
// to read all texts on the screen at once.
const POSSIBLE_TEXTS = [
  "hello", "how", "are", "you", "good", "morning",
  "have", "fun", "stay", "safe", "be", "kind",
  "see", "you", "soon", "take", "care", "my",
  "friend", "stay", "happy", "keep", "going", "you",
  "got", "this", "good", "luck", "dream", "big",
  "smile", "more", "worry", "less", "love", "your",
  "life", "be", "yourself", "stay", "strong", "never"
];
/////////////////////////////////

let spawnTextDebounce = TEXT_ADDED_DEBOUNCE;
let currentWordHoveredOver = BLANK_WORD;
let hoveringOverText = false;

let correctlyMatchedSentence = false;
let canRegenerateSentence = true;
let resultDuration = 0;

let sentenceToMatch = [];
let selectedWords = [];
let textsOnScreen = [];

let centerOffsetX;
let centerOffsetY;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  updateCenterOffsets();
  generateSentenceToMatch();
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
// If we need a new sentence, generate one
function generateSentenceToMatch() {
  if (canRegenerateSentence) {
    let newSentenceLength = Math.round(random(WORDS_IN_SENTENCE_MIN, WORDS_IN_SENTENCE_MAX));
    let newSentence = [];

    for (let i = 0; i < newSentenceLength; i++) {
      let randomWord = random(POSSIBLE_TEXTS);

      newSentence.push(randomWord);
    }

    sentenceToMatch = newSentence;
    canRegenerateSentence = false;
  }
}
// creates texts which show the info on the bottom left
function visualizeSentencesAndResult() {
  push();

  stroke(0, 0, 0);
  strokeWeight(INSTRUCTION_TEXT_STROKE);
  textSize(INSTRUCTION_TEXT_SIZE * 1.5);

  fill("White");

  // Spaces out each array into a string, using the .join() to
  // give some space between each (the parameter WORD_SPACING)
  text(YOUR_SENTENCE + selectedWords.join(WORD_SPACING), INSTRUCTION_SPACING, height - INSTRUCTION_SPACING * 3);
  text(GENERATED_SENTENCE + sentenceToMatch.join(WORD_SPACING), INSTRUCTION_SPACING, height - INSTRUCTION_SPACING);

  if (resultDuration > 0) {
    let resultTextSpacing = (height - INSTRUCTION_SPACING * 5);
    if (correctlyMatchedSentence === true) {
      fill("Green");
      text(SUCCESS, INSTRUCTION_SPACING, resultTextSpacing);
    }
    else if (correctlyMatchedSentence === false) {
      fill("Red");
      text(FAILURE, INSTRUCTION_SPACING, resultTextSpacing);
    }
  }
  resultDuration -= 1 / frameRate();

  pop();
}
// visualizes the instructions for the player to read.
function visualizeInstructions() {
  push();
  textSize(INSTRUCTION_TEXT_SIZE);

  // having the background color be pure black looks a bit
  // gross, so have it sligthly grey instead.
  fill(25, 25, 25);
  rectMode(CORNER);
  rect(0, 0, 725, 125);

  fill("White");
  text(SUBMITTION_INSTRUCTION_TEXT, INSTRUCTION_SPACING, INSTRUCTION_SPACING);
  text(REMOVE_WORD_INSTRUCTION_TEXT, INSTRUCTION_SPACING, INSTRUCTION_SPACING * 2);
  text(ADD_WORD_INSTRUCTION_TEXT, INSTRUCTION_SPACING, INSTRUCTION_SPACING * 3);

  pop();
}

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

  generateSentenceToMatch();
  visualizeSentencesAndResult();
  visualizeInstructions();
}

// draws all text objects that are supposed to be on the screen
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
// creates a text object, which holds enough data for a
// text to be created on the screen, using its data
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

// Ensures that the text spawn debounce isnt always the same
function updateTextSpawnDebounce() {
  spawnTextDebounce -= 1 / frameRate();

  constrain(spawnTextDebounce, 0, TEXT_ADDED_DEBOUNCE);
}
// removes old text objects which the user can no longer use
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

// Resets the current state of which text we are hovering over
function resetHoveringOverTextState() {
  // Although this is one line, the name of the function allows it to
  // be more easily understood what it means.

  hoveringOverText = false;
  currentWordHoveredOver = BLANK_WORD;
}

// visualizes a single text object, as a text on the screen
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
    strokeWeight(HOVERED_OVER_TEXT_STROKE);
  }
  else {
    textStyle(REGULAR_TEXT_STYLE);
    strokeWeight(REGULAR_TEXT_STROKE);
  }

  stroke(0, 0, 0, visibility);
  text(textObject.text, xPos, yPos);

  pop();

  textObject.xPos = xPos;
  textObject.yPos = yPos;
}
// What will occur if the user is hovering over this textObject
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
    textObject.isHoveredOver = true;

    currentWordHoveredOver = textObject.text;
    hoveringOverText = true;
  }
  else {
    // dont include "hoveringOverText" change here, since that would
    // make it switch between true/false within the for loop.

    textObject.isHoveredOver = false;
  }

  pop();
}

// Values that are updated in the textObject per frame
function textObjectPerFrameUpdates(textObject) {
  textObject.destinationAlpha += textObject.textSpeed;
  textObject.currentDuration += 1 / frameRate();
}
// Determines if the text object is still on screen, or still usable
// based on its duration
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
// allows the text object to be seen, and to fade in/out
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
// Slightly alters the text objects destination, giving the
// text object a "wavy" feel.
function fluctuateTextObjectsDestination(textObject) {
  textObject.xFluctuation = noise(textObject.fluctuationTimeX) * FLUCTUATION_INTENSITY;
  textObject.yFluctuation = noise(textObject.fluctuationTimeY) * FLUCTUATION_INTENSITY;

  textObject.fluctuationTimeX += textObject.fluctuationSpeed;
  textObject.fluctuationTimeY += textObject.fluctuationSpeed;
}

function mousePressed() {
  if (mouseButton.left) {
    let canAddWord = hoveringOverText && (currentWordHoveredOver !== BLANK_WORD);

    if (canAddWord) {
      selectedWords.push(currentWordHoveredOver);
    }
  }
  else if (mouseButton.center) {
    selectedWords.pop();
  }
}
function keyPressed() {
  if (key === ENTER) {
    let userWordsMatchSentenceLength = (selectedWords.length === sentenceToMatch.length);
    let userWordsMatchSentenceWords = selectedWords.every((word, index) => word === sentenceToMatch[index]);

    if (userWordsMatchSentenceLength && userWordsMatchSentenceWords) {
      correctlyMatchedSentence = true;
      resultDuration = SHOW_RESULT_DURATION;
    }
    else {
      correctlyMatchedSentence = false;
      resultDuration = SHOW_RESULT_DURATION;
    }

    selectedWords = [];
    canRegenerateSentence = true;
  }
}