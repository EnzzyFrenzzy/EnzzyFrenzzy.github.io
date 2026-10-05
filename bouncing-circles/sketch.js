// Object Notation and Arrays
// Bouncing Circles

let circleObjects = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  updateCircleObjects();
}

function mousePressed() {
  createCircleObject();
}

function createCircleObject() {
  let raduis = random(10, 50);
  let xPos = constrain(mouseX, raduis, width - raduis);
  let yPos = constrain(mouseY, raduis, height - raduis);

  let circleObj = {
    xPosition: xPos,
    yPosition: yPos,
  
    xDirection: random(-5, 5),
    yDirection: random(-5, 5),
  
    radius: raduis,
    r: random(255),
    g: random(255),
    b: random(255),
  };

  circleObjects.push(circleObj);
}

function updateCircleObjects() {
  for (let circleObject of circleObjects) {
    // move circle
    circleObject.xPosition += circleObject.xDirection;
    circleObject.yPosition += circleObject.yDirection;

    // bounce off edges
    if (circleObject.xPosition <= (0 + circleObject.radius) || circleObject.xPosition >= (width - circleObject.radius)) {
      circleObject.xDirection *= -1;
    }
    if (circleObject.yPosition <= (0 + circleObject.radius) || circleObject.yPosition >= (height - circleObject.radius)) {
      circleObject.yDirection *= -1;
    }

    // display circle
    fill (circleObject.r, circleObject.g, circleObject.b);
    circle(circleObject.xPosition, circleObject.yPosition, (circleObject.radius * 2));
  };
}