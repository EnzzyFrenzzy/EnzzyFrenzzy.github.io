// Interactive Scene
// Milo Sadoway
// Sept 22, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// https://p5js.org/reference/ -- mouse references

const MIN_TIME = 0;
const MAX_TIME = 24;

const TIME_CHANGE_AMOUNT = 0.1;

let currentTime = 12;
let lanternOn = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  ensureCurrentTimeIsValid();
}

function ensureCurrentTimeIsValid() {
  if (currentTime < MIN_TIME) {
    currentTime = MAX_TIME;
  }
  else if (currentTime > MAX_TIME) {
    currentTime = MIN_TIME;
  }

  console.log(currentTime);
}

function mouseWheel(event) {
  // delta is flipped
  if (event.delta > 0) {
    currentTime -= TIME_CHANGE_AMOUNT;
  } 
  else {
    currentTime += TIME_CHANGE_AMOUNT;
  }
}

///// OTHER IDEA /////

// const CURRENTLY_PLAYING = "Playing";
// const WITHIN_MENU = "InMenu";

// const TRANSITION_TIME = 0.5;
// let lastTransitionTime;

// let gameState = WITHIN_MENU;
// let inTransition = false;
// let transitionPosX = 0;

// https://p5js.org/reference/p5/push/
// function transition(newGameState) {
//   if (inTransition) {
//     return;
//   }
//   inTransition = true;

//   if (millis() >= lastTransitionTime + (TRANSITION_TIME / 2)) {
//     gameState = newGameState;
//   }
//   if (millis() >= lastTransitionTime + TRANSITION_TIME) {
//     inTransition = false;
//     lastTransitionTime = millis();
//     transitionPosX = 0;
//   }
// }