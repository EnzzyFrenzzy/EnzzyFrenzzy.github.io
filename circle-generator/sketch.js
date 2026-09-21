// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


async function setup() {
  createCanvas(windowWidth, windowHeight);
  background(175);
}

function draw() {
  fill(random(255), random(255), random(255));
  circle(random(windowWidth), random(windowHeight), random(50));
}
