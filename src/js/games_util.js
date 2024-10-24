let x = 50;
let y = 50;
let angle = 0; // Initial angle for rotation
let chosenBlocks = []; // Store chosen blocks in sequence

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.drag = function(event) {
  event.dataTransfer.setData('text', event.target.id);
}

// Drop a block into the chosen area to add it to the sequence
window.dropToSequence = function(event) {
  event.preventDefault();
  let blockId = event.dataTransfer.getData("text");

  if (!blockId.includes("-")) {
    let block = document.getElementById(blockId).cloneNode(true);
    block.id = blockId + "-" + chosenBlocks.length;
    block.draggable = true;
    block.ondragstart = drag;

    document.getElementById("content").appendChild(block);
    chosenBlocks.push(blockId);
  }
}

window.allowDrop = function(event) {
  event.preventDefault();
}

// Function to simulate the playing of the chosen sequence
window.playSequence = async function() {
  let playButton = document.querySelector(".play-button");

  // Disable the play button while the sequence is playing
  playButton.disabled = true;

  let canvas = document.getElementById("gameCanvas");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  console.log(chosenBlocks.length);

  for (let i = 0; i < chosenBlocks.length; i++) {
    let action = chosenBlocks[i];
    console.log(chosenBlocks[i]);
    if (action === "moveBlock") {
      moveSprite(50);
    } else if (action === "rotateBlock") {
      rotateSprite(90);
    }

    // Draw something on the canvas to represent movement
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    await sleep(1000);
  }
  playButton.disabled = false;
}

window.droptoRemove = function(event) {
  event.preventDefault();
  let blockId = event.dataTransfer.getData('text');
  console.log(blockId);
  if (blockId.includes("-")) {
    let blockElement = document.getElementById(blockId);
    blockElement.parentNode.removeChild(blockElement);

    let originalBlockId = blockId.split("-")[0];
    let index = chosenBlocks.indexOf(originalBlockId);
    if (index > -1) {
      chosenBlocks.splice(index, 1);
    }
  }
}

//Function for drawing images

function moveSprite(distance) {
  x += distance * Math.cos((angle * Math.PI) / 180);
  y += distance * Math.sin((angle * Math.PI) / 180);
  drawSprite();
}

function rotateSprite(deg) {
  angle += deg;
  drawSprite();
}


function drawSprite() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.save(); // Save the current state

  // Move the origin to the sprite's position
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180); // Rotate the sprite

  // Draw a simple square as the sprite
  ctx.fillStyle = 'blue';
  ctx.fillRect(-25, -25, 50, 50); // Draw a 50x50 square

  ctx.restore(); // Restore the canvas state
}
