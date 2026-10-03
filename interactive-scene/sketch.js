// Interactive Scene
// Milo Sadoway
// Sept 22, 2026
//
// Extra for Experts:
// I made a way to control time, by using one main value for the player
// to manipulate how time works. Using that value, I am able to showcase
// different times of the day, whenver I want.
//
// Also, some polish was added by using custom pixel art, created by me.

const DAYCYCLE_KEYCODE = " ";

// at what hours will celestial bodies show
const MOON_START_TIME = 18;
const MOON_STOP_TIME = 22;
const SUN_START_TIME = 5;
const SUN_STOP_TIME = 9;

// Changes the speed of time
const SPEEDUP_TIME_CHANGE_AMOUNT = 0.1;
const TIME_CHANGE_AMOUNT = 0.01;

// This is a 24 hour clock, DONT TOUCH!
const MAX_TIME = 24;
const MIN_TIME = 0;

// what times the tints will begin to appear, and depending
// on which celestial body they are for
const SUNRISE_START = 5;
const MOONRISE_START = 16;
const SUN_AND_MOON_RISE_ADDITIONAL = 3;

const BACKGROUND_COLOR = (50, 50, 50);
const SCREEN_TINT_OPACITY = 200; // how visible the screen tint is over the background color.

// simple day and night states
const DAYSTATE_DAY = "daytime (AM)";
const DAYSTATE_NIGHT = "nightime (PM)";

// The lean is calculated in radians, NOT DEGREES
const LANTERN_LEAN_INTENSITY = 0.02;
const LANTERN_LEAN_LERP_INTENSITY = 0.2;
const LANTERN_LEAN_MAX = 1;
const LANTERN_SIZE_DIVIDER = 8;

// All the instructions given to the player
const MOUSE_WHEEL_INSTRUCTION_TEXT = "Use the mouse wheel to speed time up, or rewind time.";
const DAYCYCLE_INSTRUCTION_TEXT = "Use the 'Spacebar' on the keyboard to pause/unpause time.";
const LANTERN_INSTRUCTION_TEXT = "Left click on the mouse to control your lantern.";
const INSTRUCTION_TEXT_SIZE = 24;
const INSTRUCTION_SPACING = 32;

// All images used
let sceneBackground;
let lanternOffImage;
let lanternOnImage;
let lanternGlow;

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
  lanternOnImage = await loadImage("assets/LanternOn.png");
  lanternGlow = await loadImage("assets/LanternGlow.png");

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
  visualizeInstructions();
}

// if the day cycle is on, update the current time
function updateCurrentTime() {
  if (dayCycleOn) {
    currentTime += TIME_CHANGE_AMOUNT;
  }
}
// ensure that current time is never below MIN_TIME or above MAX_TIME
function ensureCurrentTimeIsValid() {
  if (currentTime < MIN_TIME) {
    currentTime = MAX_TIME;
  }
  else if (currentTime > MAX_TIME) {
    currentTime = MIN_TIME;
  }
}
// changes the day state between AM and PM depending on what the time is.
function updateDayState() {
  if (currentTime < MAX_TIME / 2) {
    dayState = DAYSTATE_DAY;
  }
  else {
    dayState = DAYSTATE_NIGHT;
  }
}
// changes the background tint based on the current time, and wether its AM or PM
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
// changes the current lean amount the lantern has, due to the users mouse moving around.
function updateLanternLean() {
  if (movedX > 0 || movedX < 0) {
    lanternLean += (movedX * LANTERN_LEAN_INTENSITY);
  }

  lanternLean = constrain(lanternLean, -LANTERN_LEAN_MAX, LANTERN_LEAN_MAX);
  lanternLean = lerp(lanternLean, 0, LANTERN_LEAN_LERP_INTENSITY);
}

// visualizes the newly updated tints for both day and night.
function visualizeSky() {
  background(BACKGROUND_COLOR);

  // daytime tint
  push();
  fill(108, 220, 233, (SCREEN_TINT_OPACITY * dayTintStrength));
  rect(0, 0, width, height);
  pop();

  // nightime tint
  push();
  fill(18, 24, 45, (SCREEN_TINT_OPACITY * nightTintStrength));
  rect(0, 0, width, height);
  pop();
}
// visualizes the suns celestial body on screen.
function visualizeSun() {
  let normalFromSunTime = norm(currentTime, SUN_START_TIME, SUN_STOP_TIME);
  let xPosition = (windowWidth / 3) + (windowWidth / 3 * normalFromSunTime);
  let yPosition = windowHeight - (windowHeight * normalFromSunTime);

  push();
  noStroke();
  translate(xPosition, yPosition);

  // from lightest and least visible,
  // to brightest and most visible
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
// visualizes the moons celestial body on screen.
function visualizeMoon() {
  let normalFromMoonTime = norm(currentTime, MOON_START_TIME, MOON_STOP_TIME);
  let xPosition = (windowWidth / 3) + (windowWidth / 3 * normalFromMoonTime);
  let yPosition = windowHeight - (windowHeight * normalFromMoonTime);

  push();
  noStroke();
  translate(xPosition, yPosition);

  // from lightest and least visible,
  // to brightest and most visible
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
// visualizes the scene on screen.
function visualizeScene() {
  image(sceneBackground, 0, 0, width, height);
}
// visualizes the lantern attached to the players mouse.
function visualizeLantern() {
  let lanternSize;

  // ensures the lantern always stays a consistent square
  if (width > height) {
    lanternSize = width / LANTERN_SIZE_DIVIDER;
  }
  else {
    lanternSize = height / LANTERN_SIZE_DIVIDER;
  }

  push();
  translate(mouseX, mouseY);
  rotate(lanternLean);

  let usedImage;
  let lanternPos = (lanternSize / 2);

  if (lanternOn) {
    usedImage = lanternOnImage;
  }
  else {
    usedImage = lanternOffImage;
  }

  image(usedImage, -lanternPos, 0, lanternSize, lanternSize);

  // Used to show the glow. Yes there is an if statement which
  // is the same right before this, however if we make the glow
  // before, it will appear behind the lantern, rather than in front.
  if (lanternOn) {
    image(lanternGlow, -lanternPos * 2, -lanternPos, lanternSize * 2, lanternSize * 2);
  }
  pop();
}
// visualizes the instructions for the player to read.
function visualizeInstructions() {
  push();
  textSize(INSTRUCTION_TEXT_SIZE);

  text(MOUSE_WHEEL_INSTRUCTION_TEXT, INSTRUCTION_SPACING, height - INSTRUCTION_SPACING);
  text(DAYCYCLE_INSTRUCTION_TEXT, INSTRUCTION_SPACING, height - INSTRUCTION_SPACING * 2);
  text(LANTERN_INSTRUCTION_TEXT, INSTRUCTION_SPACING, height - INSTRUCTION_SPACING * 3);
  pop();
}

// what occurs during the mouse wheel event
function mouseWheel(event) {
  // the mouse wheel is reversed to simulate the scroll up to fast
  // forward time, while the scroll down is to reverse it.
  if (event.delta > 0) {
    currentTime -= SPEEDUP_TIME_CHANGE_AMOUNT;
  }
  else {
    currentTime += SPEEDUP_TIME_CHANGE_AMOUNT;
  }
}
// what occurs during the mouse click event
function mouseClicked() {
  lanternOn = !lanternOn;
}
// what occurs during specific key presses
function keyPressed() {
  if (key === DAYCYCLE_KEYCODE) {
    dayCycleOn = !dayCycleOn;
  }
}
