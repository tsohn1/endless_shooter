class PlayerProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
      super(scene, x, y, 'projectile');
      this.setScale(0.05);
  }

}
class PlayerProjectileGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene, speed) {
    super(scene.physics.world, scene);
    this.speed = speed;
    this.createMultiple({
      classType: undefined,
      frameQuantity: 500, // initial number of projectiles created
      active: false,
      visible: false,
      key: 'projectile'
    });
  }
  fireProjectile(sourceX, sourceY, destX, destY, lifespan) {
    const projectile = this.getFirstDead(false);
    if (projectile) {
      projectile.setActive(true).setVisible(true);
      projectile.setPosition(sourceX, sourceY)
      const angle = Phaser.Math.Angle.Between(sourceX, sourceY, destX, destY);
      projectile.setVelocityX(this.speed * Math.cos(angle));
      projectile.setVelocityY(this.speed * Math.sin(angle));

      // Set a timer to destroy the projectile after the specified lifespan
      this.scene.time.delayedCall(lifespan, () => {
        projectile.setActive(false).setVisible(false);
      });

    }
  }
  
}
class Game extends Phaser.Scene {
  constructor() {
    super();

    this.player;
    this.playerScale = 0.5;
    this.playerSpeed = 2500;
    this.playerProjectiles;
    this.playerProjectileSpeed = 3000;
    this.playerProjectileLifetime = 1000;
    this.objects;

  }

  preload() {
		this.load.image('player', '/assets/circle1.png');
    this.load.image('projectile', '/assets/circle2.png');
  }

  create() {
    
    this.createPlayer();
    this.playerProjectiles = new PlayerProjectileGroup(this, this.playerProjectileSpeed);
    this.createObjects();
    // Set up mouse input for shooting projectiles
    this.input.on('pointerdown', this.handlePointerDown, this);
  }

  createPlayer() {
    this.player = this.add.image(windowWidth/2, windowHeight/2, 'player');
    this.player.setScale(this.playerScale);
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

  handlePointerDown(pointer) {
    // Shoot projectile on left click
    if (pointer.leftButtonDown()) {
      let pos = this.player.getCenter();
      this.playerProjectiles.fireProjectile(pos.x, pos.y, pointer.worldX, pointer.worldY, this.playerProjectileLifetime);
    }
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
