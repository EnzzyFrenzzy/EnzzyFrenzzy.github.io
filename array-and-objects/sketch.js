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

const TEXT_TIME_MIN = 5;
const TEXT_TIME_MAX = 9;

let centerOffsetX;
let centerOffsetY;

let textsOnScreen = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);

  updateCenterOffsets();

  for (let i = 0; i < 205; i++) {
    textsOnScreen.push(spawnTextObject("Something", 50, 1));
  }
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

function draw() {
  background(220);

  for (let textObject of textsOnScreen) {
    textMode("center");
    text(textObject.text, textObject.xPos, textObject.yPos);

    textObject.xPos += textObject.xDir * textObject.textSpeed;
    textObject.yPos += textObject.yDir * textObject.textSpeed;
  }
}


function spawnTextObject(text, textSize, textSpeed) {
  let xPos = random(width / 2 - centerOffsetX, width / 2 + centerOffsetX);
  let yPos = random(height / 2 - centerOffsetY, height / 2 + centerOffsetY);

  let textObject = {
    xPos: xPos, // random(xPosChoices),
    yPos: yPos, //random(yPosChoices),
    xDir: random(-1, 1),
    yDir: random(-1, 1),

    textDuration: random(TEXT_TIME_MIN, TEXT_TIME_MAX),
    textSpeed: textSpeed,
    textSize: textSize,
    text: text,
  };

  return textObject;
}

// let textObject = {
//   text: "Something",
//   textSize: 75,

//   xPos: 0,
//   yPos: 0,
// };
// let onScreenTexts = [];

// async function setup() {
//   createCanvas(windowWidth, windowHeight);

//   textObject.xPos = windowWidth / 2
//   textObject.yPos = windowHeight / 2

//   for (let i = 0; i < 100; i++) {
//     onScreenTexts.push(textObject)
//   }
// }

// function draw() {
//   background(220);

//   for (let textObj of onScreenTexts) {
//     textObj.xPos = constrain(textObj.xPos += random(-999, 999), -textObj.textSize, windowWidth);
//     textObj.yPos = constrain(textObj.yPos += random(-999, 999), -textObj.textSize, windowHeight);

//     textSize(textObj.textSize);
//     text(textObj.text, textObj.xPos, textObject.yPos);
//   }
// }

