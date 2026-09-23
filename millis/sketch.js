// Millis Demo

const waitTime = 2000;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

let latestTime = 0;
let state = "red";

function draw() {
  background(state);

  if (millis() > (latestTime + waitTime)) {
    if (state === "black") {
      state = "red";
      background(state);
    }
    else {
      state = "black";
      background(state);
    }

    latestTime = millis();
  }
}
