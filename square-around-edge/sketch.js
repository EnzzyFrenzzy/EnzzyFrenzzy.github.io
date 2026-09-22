// Square Moving Around Edge of Screen

const squareSize = 100;
const squareSpeed = 10;

let xPosition = 0;
let yPosition = 0;
let xDirection = 1;
let yDirection = 1;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  moveSquare();
}

function moveSquare() {
  if (xPosition >= windowWidth - squareSize) {
    xDirection = -1;
    xPosition = windowWidth - squareSize;
    yPosition += squareSpeed * yDirection;
  }
  else if (xPosition <= 0) {
    xDirection = 1;
    xPosition = 0;
    yPosition += squareSpeed * yDirection;
  }

  if (yPosition >= windowHeight - squareSize) {
    yDirection = -1;
    yPosition = windowHeight - squareSize;
    xPosition += squareSpeed * xDirection;
  }
  else if (yPosition <= 0) {
    yDirection = 1;
    yPosition = 0;
    xPosition += squareSpeed * xDirection;
  }

  fill(120);
  square(xPosition, yPosition, squareSize);
}