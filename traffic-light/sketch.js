// Traffic Light Starter Code
// Your Name Here
// The Date Here

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

const GREEN = "green";
const YELLOW = "yellow";
const RED = "red";

let greenLightDuration = 3000;
let yellowLightDuration = 1500;
let redLightDuration = 3000;

let trafficLightState = GREEN;
let lastSwitchTime = 0;


async function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  updateLightState();
  drawOutlineOfLights();
  displayCorrectLight();
}

function updateLightState() {
  if (trafficLightState === GREEN && millis() >= lastSwitchTime + greenLightDuration) {
    trafficLightState = YELLOW;
    lastSwitchTime = millis();
  }
  if (trafficLightState === YELLOW && millis() >= lastSwitchTime + yellowLightDuration) {
    trafficLightState = RED;
    lastSwitchTime = millis();
  }
  if (trafficLightState === RED && millis() >= lastSwitchTime + redLightDuration) {
    trafficLightState = GREEN;
    lastSwitchTime = millis();
  }
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  //lights
  fill(255);
  ellipse(width/2, height/2 - 65, 50, 50); //top
  ellipse(width/2, height/2, 50, 50); //middle
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
}

function displayCorrectLight() {
  if (trafficLightState === GREEN) {
    fill("green");
    ellipse(width/2, height/2 + 65, 50, 50); //bottom
  }
  if (trafficLightState === YELLOW) {
    fill("yellow");
    ellipse(width/2, height/2, 50, 50); //middle
  }
  if (trafficLightState === RED) {
    fill("red");
    ellipse(width/2, height/2 - 65, 50, 50); //top
  }
}
