// window.setInterval demo

let theColour;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  window.setInterval(changeColourOfCircle, 500);
}

function changeColourOfCircle() {
  theColour = color(random(200), random(200), random(200));
}

function draw() {
  background(220);

  fill(theColour);
  circle(width/2, height/2, 500);
}
