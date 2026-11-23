// OOP demo

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.diameter = 5;
    this.colour = 'red';
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

let redWalker;
let blueWalker;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  redWalker = new Walker((width * 0.25), height/2);
  blueWalker = new Walker((width * 0.75), height/2);
  blueWalker.colour = 'blue';
}

function draw() {
  redWalker.move();
  blueWalker.move();

  redWalker.display();
  blueWalker.display();
}
