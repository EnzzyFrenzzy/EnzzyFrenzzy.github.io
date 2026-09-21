// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth);
  }
  
}

function draw() {
  background(220);
  drawChessboard();
}

function drawChessboard() {
  let colour = 0;
  
  for (let x = 0; x <= width; x += width/8) {
    for (let y = 0; y <= height; y += height/8) {
      if (colour === 0) {
        colour = 255;
      }
      else {
        colour = 0;
      }
      
      fill(colour);
      square(x, y, height/8);
    }
  }
}