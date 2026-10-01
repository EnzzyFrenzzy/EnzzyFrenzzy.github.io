// Interactive Scene
// Milo Sadoway
// Sept 22, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// https://p5js.org/reference/ -- mouse references

const LANTERN_KEYCODE = "f";
const DAYCYCLE_KEYCODE = " ";

const MOON_START_TIME = 18;
const MOON_STOP_TIME = 22;
const SUN_START_TIME = 5;
const SUN_STOP_TIME = 9;

const SPEEDUP_TIME_CHANGE_AMOUNT = 0.1;
const TIME_CHANGE_AMOUNT = 0.01;
const MAX_TIME = 24;
const MIN_TIME = 0;

let lanternOn = false;
let dayCycleOn = true;
let currentTime = 4;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  updateCurrentTime();
  ensureCurrentTimeIsValid();

  visualizeSky();
  visualizeSun();
  visualizeMoon();
  visualizeScene();
}

function updateCurrentTime() {
  if (dayCycleOn) {
    currentTime += TIME_CHANGE_AMOUNT
  }
}
function ensureCurrentTimeIsValid() {
  if (currentTime < MIN_TIME) {
    currentTime = MAX_TIME;
  }
  else if (currentTime > MAX_TIME) {
    currentTime = MIN_TIME;
  }
}

function visualizeSky() {
  background(120);
}
function visualizeSun() {
  let normalFromSunTime = norm(currentTime, SUN_START_TIME, SUN_STOP_TIME);
  let xPosition = (windowWidth / 3) + (windowWidth / 3 * normalFromSunTime);
  let yPosition = windowHeight - (windowHeight * normalFromSunTime);

  push();
  noStroke();
  translate(xPosition, yPosition);

  let sunRingcolor1 = color(255, 218, 19, 25);
  let sunRingcolor2 = color(255, 198, 49, 75);
  let sunRingcolor3 = color(249, 154, 16, 200);
  let sunRingcolor4 = color(249, 137, 16, 255);

  fill(sunRingcolor1);
  circle(0, 0, 125);
  fill(sunRingcolor2);
  circle(0, 0, 115);
  fill(sunRingcolor3);
  circle(0, 0, 105);
  fill(sunRingcolor4);
  circle(0, 0, 95);

  pop();
}
function visualizeMoon() {
  let normalFromMoonTime = norm(currentTime, MOON_START_TIME, MOON_STOP_TIME);
  let xPosition = (windowWidth / 3) + (windowWidth / 3 * normalFromMoonTime);
  let yPosition = windowHeight - (windowHeight * normalFromMoonTime);

  push();
  noStroke();
  translate(xPosition, yPosition);

  let moonGlowRing = color(212, 235, 251, 25);
  let moonRingColor1 = color(201, 204, 205, 200);
  let moonRingColor2 = color(171, 175, 176, 255);
  let moonCraterColor = color(77, 79, 81, 255);

  fill(moonGlowRing);
  circle(0, 0, 125);
  fill(moonRingColor1);
  circle(0, 0, 115);
  fill(moonRingColor2);
  circle(0, 0, 110);

  // random craters
  fill(moonCraterColor);
  circle(25, 25, 33);
  circle(5, 40, 20);
  circle(-5, -20, 37);
  circle(-10, -40, 23);
  circle(-20, 15, 25);
  circle(-32, 2, 25);
  circle(-32, 32, 15);
  circle(32, -32, 15);
  circle(40, -20, 22);

  pop();
}
function visualizeScene() {

}

function mouseWheel(event) {
  if (event.delta > 0) {
    currentTime -= SPEEDUP_TIME_CHANGE_AMOUNT;
  }
  else {
    currentTime += SPEEDUP_TIME_CHANGE_AMOUNT;
  }
}

function keyPressed() {
  if (key === LANTERN_KEYCODE) {
    lanternOn = !lanternOn;
    console.log(lanternOn);
  }
  if (key === DAYCYCLE_KEYCODE) {
    dayCycleOn = !dayCycleOn;
    console.log(dayCycleOn);
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