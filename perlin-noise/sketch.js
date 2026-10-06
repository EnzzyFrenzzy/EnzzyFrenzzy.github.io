// Perlin Noise Demo

let time = 0;
let deltaTime = 0.01;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  drawCircle();
}

function drawCircle() {
  let xPos = noise(time) * width;
  let yPos = noise(0, time) * height;

  fill('black');
  circle(xPos, yPos, 50);

  time += deltaTime;
}
