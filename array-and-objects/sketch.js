// Array and Object Notation
// Milo Sadoway
// Oct 7, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
//
// https://p5js.org/reference/p5/fontBounds/
// https://p5js.org/reference/p5/object/

const CENTER_OFFSET = 200;

let textsOnScreen = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

function spawnTextObject(text, textSize, textSpeed) {
  let xPosChoices = [random(0, width /  2 - CENTER_OFFSET), random(width /  2 + CENTER_OFFSET, width)];
  let yPosChoices = [random(0, height /  2 - CENTER_OFFSET), random(height /  2 + CENTER_OFFSET, height)];

  let textObject = {
    xPos: random(xPosChoices),
    yPos: random(yPosChoices),
    xDir: random(-1, 1),
    yDir: random(-1, 1),

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

