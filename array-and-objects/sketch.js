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
  textMode("center");

  updateCenterOffsets();

  for (let i = 0; i < 1; i++) {
    textsOnScreen.push(spawnTextObject("Something", 50, 0.005));
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
    fluctuateTextObjectsDestination(textObject);
    showcaseTextObject(textObject);


    textObject.textAlpha += textObject.textSpeed
  }
}

function fluctuateTextObjectsDestination(textObject) {

}
function showcaseTextObject(textObject) {
  let xPos = lerp(textObject.xStartPos, textObject.xDestination + (250 * noise(textObject.textAlpha)), textObject.textAlpha);
  let yPos = lerp(textObject.yStartPos, textObject.yDestination + (250 * noise(textObject.textAlpha)), textObject.textAlpha);

  textSize(textObject.textSize);
  text(textObject.text, xPos, yPos);
}

function spawnTextObject(text, textSize, textSpeed) {
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

  console.log(xDestination)
  console.log(yDestination)

  let textObject = {
    xStartPos: xStartPos,
    yStartPos: yStartPos,
    xDestination: xDestination,
    yDestination: yDestination,

    textDuration: random(TEXT_TIME_MIN, TEXT_TIME_MAX),
    textAlpha: 0,

    textSpeed: textSpeed,
    textSize: textSize,
    text: text,
  };

  return textObject;
}


// let textObject = {
//   text: "Something",
//   textSize: 75,

//   xStartPos: 0,
//   yStartPos: 0,
// };
// let onScreenTexts = [];

// async function setup() {
//   createCanvas(windowWidth, windowHeight);

//   textObject.xStartPos = windowWidth / 2
//   textObject.yStartPos = windowHeight / 2

//   for (let i = 0; i < 100; i++) {
//     onScreenTexts.push(textObject)
//   }
// }

// function draw() {
//   background(220);

//   for (let textObj of onScreenTexts) {
//     textObj.xStartPos = constrain(textObj.xStartPos += random(-999, 999), -textObj.textSize, windowWidth);
//     textObj.yStartPos = constrain(textObj.yStartPos += random(-999, 999), -textObj.textSize, windowHeight);

//     textSize(textObj.textSize);
//     text(textObj.text, textObj.xStartPos, textObject.yStartPos);
//   }
// }

