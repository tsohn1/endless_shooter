
class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed=1000, health=100) {
    super(scene, x, y, 'enemy');
    this.setScale(0.5);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.speed = speed;
    this.health = health;
  }

  update(player) {
    // Chase the player logic
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const velocityX = (this.speed * Math.cos(angle));
    const velocityY = (this.speed * Math.sin(angle));

    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
    
}
  takeDamage(damage) {
    this.health -= damage
    if (this.health <= 0) {
      this.destroy();
    }
  }
}

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, source, speed=3000, lifespan=1000) {
    super(scene, x, y, 'projectile');
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.speed = speed;
    this.lifespan = lifespan;
    this.source = source;
  }

  launch(targetX, targetY) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    const velocityX = (this.speed * Math.cos(angle));
    const velocityY = (this.speed * Math.sin(angle));
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);


    // Destroy the projectile after a specified lifespan
    this.scene.time.delayedCall(this.lifespan, () => {
      this.destroy();
    });
  }
}

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed=1500, health = 100, attackSpeed = 100, projectileSpeed = 3000, projectileDuration = 1000) {
    super(scene, x, y, 'player');
    this.setScale(0.5);
    scene.add.existing(this);
    scene.physics.world.enable(this);

    //player stats
    this.speed = speed;
    this.health = health;
    this.attackSpeed = attackSpeed;
    this.projectileSpeed = projectileSpeed;
    this.projectileDuration = projectileDuration;
    this.lastFired = 0; // To keep track of last firing time
  }

  update(cursors) {
    let velocityX = 0;
    let velocityY = 0;

    if (cursors.up.isDown) {
      velocityY -= 1;
    } 
    if (cursors.down.isDown) {
      velocityY += 1;
    }

    if (cursors.left.isDown) {
      velocityX -= 1;
    } 
    if (cursors.right.isDown) {
      velocityX += 1;
    }
    // Normalize the velocity vector
    const length = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    if (length !== 0) {
        velocityX /= length;
        velocityY /= length;
    }

    // Set the constant speed
    const finalSpeed = this.speed;
    this.setVelocityX(velocityX * finalSpeed);
    this.setVelocityY(velocityY * finalSpeed);
    

    
  }

  shootProjectile(targetX, targetY) {
    const timeNow = this.scene.time.now;
    if (timeNow - this.lastFired > this.attackSpeed) {
      const projectile = new Projectile(this.scene, this.x, this.y, 'player', this.projectileSpeed, this.projectileDuration);
      projectile.launch(targetX, targetY);
      this.lastFired = timeNow;
    }
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      // Game over logic
      console.log("You Have Died.")
    }
  }


}

class Game extends Phaser.Scene {
  constructor() {
    super();

    this.player;
    this.enemies = [];
    this.objects;
    this.cursors;

  }

  preload() {
		this.load.image('player', '/assets/circle1.png');
    this.load.image('projectile', '/assets/circle2.png');
    this.load.image('enemy', 'assets/enemy_circle.png');
  }

  create() {
    
    this.createPlayer();
  
    this.createObjects();
    // Set up mouse input for shooting projectiles

    // this.input.on('pointerdown', this.handlePointerDown, this);
    this.createEnemies();

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

  }

  createEnemies() {
    spawnEnemies(this, 5, 3000, 500, this.enemies);
  }
  createPlayer() {
    this.player = new Player(this, windowWidth / 2, windowHeight / 2);
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
    this.player.update(this.cursors);
    this.enemies.forEach(enemy => enemy.update(this.player));
    this.checkPointerDown();
  }

  checkPointerDown() {
    // Shoot projectile on left click
    if (this.input.activePointer.leftButtonDown()) {
      this.player.shootProjectile( this.input.activePointer.worldX, this.input.activePointer.worldY);
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

// Function to spawn multiple enemies at intervals
function spawnEnemies(scene, numberOfEnemies, spawnInterval, speed, enemies) {
  let enemyCount = 0;

  // Timer event to spawn enemies at intervals
  const spawnTimer = scene.time.addEvent({
  delay: spawnInterval,
  loop: true,
  callback: () => {
    const randomX = Phaser.Math.Between(0, scene.game.config.width);
    const randomY = Phaser.Math.Between(0, scene.game.config.height);
    const enemy = new Enemy(scene, randomX, randomY, speed);
    enemies.push(enemy);

    // Increase the count and stop spawning when the desired number is reached
    enemyCount++;
    if (enemyCount === numberOfEnemies) {
      spawnTimer.destroy();
      }
    }
  });
}

const game = new Phaser.Game(config);
