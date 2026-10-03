// Interactive Scene
// Milo Sadoway
// Sept 22, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// https://p5js.org/reference/ -- mouse references

const DAYCYCLE_KEYCODE = " ";

const MOON_START_TIME = 18;
const MOON_STOP_TIME = 22;
const SUN_START_TIME = 5;
const SUN_STOP_TIME = 9;

const SPEEDUP_TIME_CHANGE_AMOUNT = 0.1;
const TIME_CHANGE_AMOUNT = 0.01;
const MAX_TIME = 24;
const MIN_TIME = 0;

const SUNRISE_START = 5;
const MOONRISE_START = 16;
const SUN_AND_MOON_RISE_ADDITIONAL = 3;

const BACKGROUND_COLOR = (50, 50, 50);
const SCREEN_TINT_AMOUNT = 200;

const DAYSTATE_DAY = "daytime (AM)";
const DAYSTATE_NIGHT = "nightime (PM)";

// The lean is calculated in radians, NOT DEGREES
const LANTERN_LEAN_INTENSITY = 0.05;
const LANTERN_LEAN_LERP_INTENSITY = 0.2;
const LANTERN_LEAN_MAX = 1;
const LANTERN_SIZE_DIVIDER = 8;

let sceneForeground;
let sceneBackground;
let lanternOffImage;
let lanternOnImage;

let dayCycleOn = true;
let currentTime = 4;
let dayState;

let dayTintStrength;
let nightTintStrength;

let lanternOn = false;
let lanternLean = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  sceneBackground = await loadImage("assets/SceneBackground.png");
  lanternOffImage = await loadImage("assets/LanternOff.png");
  lanternOnImage = await loadImage("assets/LanternOn.png")

  // to ensure everything is properly working before we start
  updateCurrentTime();
  ensureCurrentTimeIsValid();
  updateDayState();
  updateTints();
  updateLanternLean();
}

function draw() {
  updateCurrentTime();
  ensureCurrentTimeIsValid();
  updateDayState();
  updateTints();
  updateLanternLean();

  visualizeSky();
  visualizeSun();
  visualizeMoon();
  visualizeScene();
  visualizeLantern();
}

function updateCurrentTime() {
  if (dayCycleOn) {
    currentTime += TIME_CHANGE_AMOUNT;
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
function updateDayState() {
  if (currentTime < MAX_TIME / 2) {
    dayState = DAYSTATE_DAY;
  }
  else {
    dayState = DAYSTATE_NIGHT;
  }
}
function updateTints() {
  if (dayState === DAYSTATE_DAY) {
    let sunriseTimeNorm = norm(currentTime, SUNRISE_START, (SUNRISE_START + SUN_AND_MOON_RISE_ADDITIONAL));
    let constrainedTimeNorm = constrain(sunriseTimeNorm, 0, 1);

    dayTintStrength = constrainedTimeNorm;
    nightTintStrength = (1 - constrainedTimeNorm);
  }
  else if (dayState === DAYSTATE_NIGHT) {
    let moonriseTimeNorm = norm(currentTime, MOONRISE_START, (MOONRISE_START + SUN_AND_MOON_RISE_ADDITIONAL));
    let constrainedTimeNorm = constrain(moonriseTimeNorm, 0, 1);

    nightTintStrength = constrainedTimeNorm;
    dayTintStrength = (1 - constrainedTimeNorm);
  }
}
function updateLanternLean() {
  if (movedX > 0 || movedX < 0) {
    lanternLean += (movedX * LANTERN_LEAN_INTENSITY);
  }

  lanternLean = constrain(lanternLean, -LANTERN_LEAN_MAX, LANTERN_LEAN_MAX);
  lanternLean = lerp(lanternLean, 0, LANTERN_LEAN_LERP_INTENSITY);
}

function visualizeSky() {
  background(BACKGROUND_COLOR);

  // daytime tint
  push();
  fill(108, 220, 233, (SCREEN_TINT_AMOUNT * dayTintStrength));
  rect(0, 0, width, height);
  pop();

  // nightime tint
  push();
  fill(18, 24, 45, (SCREEN_TINT_AMOUNT * nightTintStrength));
  rect(0, 0, width, height);
  pop();
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
  let moonCraterColor = color(104, 107, 107, 255);

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
  image(sceneBackground, 0, 0, width, height);
}
function visualizeLantern() {
  let lanternSize;

  if (width > height) {
    lanternSize = width / LANTERN_SIZE_DIVIDER
  }
  else {
    lanternSize = height / LANTERN_SIZE_DIVIDER
  }

  push();
  translate(mouseX, mouseY);
  rotate(lanternLean);

  let usedImage;
  if (lanternOn) {
    usedImage = lanternOnImage;
  }
  else {
    usedImage = lanternOffImage;
  }

  image(usedImage, -(lanternSize / 2), 0, lanternSize, lanternSize);
  pop();
}

function mouseWheel(event) {
  if (event.delta > 0) {
    currentTime -= SPEEDUP_TIME_CHANGE_AMOUNT;
  }
  else {
    currentTime += SPEEDUP_TIME_CHANGE_AMOUNT;
  }
}
function mouseClicked() {
  lanternOn = !lanternOn;
}
function keyPressed() {
  if (key === DAYCYCLE_KEYCODE) {
    dayCycleOn = !dayCycleOn;
    console.log(dayCycleOn);
  }
}
