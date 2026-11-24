// OOP demo

class Walker {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.diameter = 5;
    this.colour = colour;
  }

  display() {
    fill(this.colour);
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let moveChoice = random(100);
    if (moveChoice < 25) { // up
      this.y -= this.speed;
    }
    else if (moveChoice < 50) { // down
      this.y += this.speed;
    }
    else if (moveChoice < 75) { // left
      this.x -= this.speed;
    }
    else { // right
      this.x += this.speed;
    }
  }
}

// let redWalker;
// let blueWalker;

let walkers = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // redWalker = new Walker((width * 0.25), height/2);
  // blueWalker = new Walker((width * 0.75), height/2);
  // blueWalker.colour = 'blue';
}

function draw() {
  for (let walker of walkers) {
    walker.move();
    walker.display();
  }

  // redWalker.move();
  // blueWalker.move();

  // redWalker.display();
  // blueWalker.display();
}

function mousePressed() {
  let newColour = color(random(255), random(255), random(255));
  let newWalker = new Walker(mouseX, mouseY, newColour);
  walkers.push(newWalker);
}