// Array and Object Notation
// Milo Sadoway
// Oct 7, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
//
// https://p5js.org/reference/p5/loadModel/
// https://p5js.org/reference/p5/camera/
// https://p5js.org/reference/p5/pointLight/
// https://p5js.org/reference/p5/constants/WEBGL/



async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(220);

  orbitControl();
  translate(250, 0, 0); //moves our drawing origin to the top left corner
  box();
}
