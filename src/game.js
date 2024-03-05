// Create a new Phaser game


class Game extends Phaser.Scene {
  constructor() {
    super();

    this.player;
    this.playerRadius = 50;
    this.playerSpeed = 500;
    this.objects;

  }

  preload() {

  }

  create() {
    this.createPlayer();
    this.createObjects();
  }

  createPlayer() {
    this.player = this.add.circle(windowWidth/2, windowHeight/2, this.playerRadius, 0x00ff00);
    this.player.setOrigin(0.5, 0.5);
    this.cameras.main.startFollow(this.player);
  }

  createObjects() {
    this.objects = this.add.graphics();
  
    // Set the fill color and alpha
    this.objects.fillStyle(0xFF0000, 1);
  
    // Draw a rectangle
    this.objects.fillRect(100, 100, 200, 100);
  
    // Set the line style for the circle
    this.objects.lineStyle(4, 0x00FF00, 1);
  
    // Draw a circle
    this.objects.strokeCircle(400, 300, 50);
    
    // Draw a circle
    this.objects.strokeCircle(900, 300, 50);
  
    // Draw a line
    this.objects.lineBetween(500, 100, 600, 200);
  }

  update() {
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
    const finalSpeed = this.playerSpeed * this.game.loop.delta / 1000;
    this.player.x += velocityX * finalSpeed;
    this.player.y += velocityY * finalSpeed;
  }
}

const windowWidth = 800;
const windowHeight = 600;
const config = {
  type: Phaser.AUTO,
  width: windowWidth,
  height: windowHeight,
  scene: Game,
  parent: 'game-container',
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config);
