// Array and Object Notation
// Milo Sadoway
// Oct 7, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
//
// https://p5js.org/reference/p5/fontBounds/
// https://p5js.org/reference/p5/object/

let textObject = {
  text: "Something",
  textSize: 75,

  xPos: 0,
  yPos: 0,
};
let onScreenTexts = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);

  textObject.xPos = windowWidth / 2
  textObject.yPos = windowHeight / 2

  for (let i = 0; i < 100; i++) {
    onScreenTexts.push(textObject)
  }
}

function draw() {
  background(220);

  for (let textObj of onScreenTexts) {
    textObj.xPos = constrain(textObj.xPos += random(-999, 999), -textObj.textSize, windowWidth);
    textObj.yPos = constrain(textObj.yPos += random(-999, 999), -textObj.textSize, windowHeight);

    textSize(textObj.textSize);
    text(textObj.text, textObj.xPos, textObject.yPos);
  }
}

