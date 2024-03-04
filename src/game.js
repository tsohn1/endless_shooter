// Create a new Phaser game
const windowWidth = 800;
const windowHeight = 600;
const config = {
  type: Phaser.AUTO,
  width: windowWidth,
  height: windowHeight,
  scene: {
      preload: preload,
      create: create,
      update: update,
  },
  parent: 'game-container',
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config);
let player;
var playerRadius = 20;
var playerSpeed = 200;


function preload() {
  // You can preload assets here if needed
}

function create() {
  player = this.add.circle(windowWidth/2, windowHeight/2, playerRadius, 0x00ff00);
  player.setOrigin(0.5, 0.5);


  var graphics = this.add.graphics();

  // Set the fill color and alpha
  graphics.fillStyle(0xFF0000, 1);

  // Draw a rectangle
  graphics.fillRect(100, 100, 200, 100);

  // Set the line style for the circle
  graphics.lineStyle(4, 0x00FF00, 1);

  // Draw a circle
  graphics.strokeCircle(400, 300, 50);

  // Draw a line
  graphics.lineBetween(500, 100, 600, 200);
}

function update() {
  // Handle player movement
  if (this.input.keyboard.addKey('W').isDown) {
    player.y -= playerSpeed * this.game.loop.delta / 1000; // Move up
  }
  if (this.input.keyboard.addKey('S').isDown) {
    player.y += playerSpeed * this.game.loop.delta / 1000; // Move down
  }
  if (this.input.keyboard.addKey('A').isDown) {
    player.x -= playerSpeed * this.game.loop.delta / 1000; // Move left
  }
  if (this.input.keyboard.addKey('D').isDown) {
    player.x += playerSpeed * this.game.loop.delta / 1000; // Move right
  }
}
