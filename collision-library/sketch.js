// Collision Demo

let hit = false;
let logo;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  logo = await loadImage("Logo.png");
}

function draw() {
  background(255);

  hit = collideRectCircle(300, 400, 200, 150, mouseX, mouseY, 100);
  if (hit) {
    fill("red");
  }
  else {
    fill("black");
  }

  imageMode('center');
  image(logo, mouseX, mouseY, 100, 100);

  rect(300, 400, 200, 150);

  // This circle represents a simple method
  // circle(mouseX, mouseY, 100);
}
