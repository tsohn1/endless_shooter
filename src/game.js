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
var playerSpeed = 500;


function preload() {
  // You can preload assets here if needed
}

function create() {
  player = this.add.circle(windowWidth/2, windowHeight/2, playerRadius, 0x00ff00);
  player.setOrigin(0.5, 0.5);

  this.cameras.main.startFollow(player);

  var graphics = this.add.graphics();

  // Set the fill color and alpha
  graphics.fillStyle(0xFF0000, 1);

  // Draw a rectangle
  graphics.fillRect(100, 100, 200, 100);

  // Set the line style for the circle
  graphics.lineStyle(4, 0x00FF00, 1);

  // Draw a circle
  graphics.strokeCircle(400, 300, 50);
  // Draw a circle
  graphics.strokeCircle(900, 300, 50);

  // Draw a line
  graphics.lineBetween(500, 100, 600, 200);
}

function update() {
  // Handle player movement
  // Calculate the total velocity based on pressed keys
  let velocityX = 0;
  let velocityY = 0;

  if (this.input.keyboard.addKey('W').isDown) {
      velocityY -= 1;
  }
  if (this.input.keyboard.addKey('S').isDown) {
      velocityY += 1;
  }
  if (this.input.keyboard.addKey('A').isDown) {
      velocityX -= 1;
  }
  if (this.input.keyboard.addKey('D').isDown) {
      velocityX += 1;
  }

  // Normalize the velocity vector
  const length = Math.sqrt(velocityX ** 2 + velocityY ** 2);
  if (length !== 0) {
      velocityX /= length;
      velocityY /= length;
  }

  // Set the constant speed
  const finalSpeed = playerSpeed * this.game.loop.delta / 1000;
  player.x += velocityX * finalSpeed;
  player.y += velocityY * finalSpeed;
}
