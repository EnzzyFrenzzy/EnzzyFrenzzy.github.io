// Using window-setTimeout example

let message = "A message!";

async function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);
  textSize(50);

  window.setTimeout(changeCurrentMessage, 3000, "Newer message");
}

function changeCurrentMessage(newMessage) {
  message = newMessage;
}

function draw() {
  background(220);

  text(message, width/2, height/2);
}

