import { Flight } from "./flight";
import flight from "./images/plane.png";
import enemy from "./images/plane_enemy.png";
import { Projectile } from "./projectile";

function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = url;

    image.onload = function () {
      resolve(image);
    };
  });
}

export class Game {
  constructor(options) {
    this.canvas = options.canvas;
    this.player = null;
    this.enemies = [];
    this.playerProjectiles = [];
    this.enemySpawnInterval = 1000;
    this.maxEnemies = 5;

    this.gameOver = false;

    this.keyPressed = {};
    window.addEventListener("keydown", (event) => {
      this.keyPressed[event.key.toLowerCase()] = true;
    });
    window.addEventListener("keyup", (event) => {
      this.keyPressed[event.key.toLowerCase()] = false;

      if (event.key.toLowerCase() === "z") {
        this.playerProjectiles.push(
          new Projectile({
            width: 20,
            height: 5,
            color: "orange",
            velocity: {
              x: 10,
              y: 0,
            },
            position: {
              x: this.player.position.x + this.player.width,
              y: this.player.position.y + this.player.height / 2,
            },
            canvas: this.canvas,
          })
        );
      }
    });
  }

  startGame() {
    console.log(enemy);
    Promise.all([loadImage(flight), loadImage(enemy)]).then(
      ([playerImg, enemyImg]) => {
        this.player = new Flight({
          position: {
            x: 20,
            y: this.canvas.height / 2,
          },
          velocity: {
            x: 0,
            y: 0,
          },
          image: playerImg,
          width: 150,
          canvas: this.canvas,
        });
        this.gameLoop();
        console.log("enemy", enemyImg);
        setInterval(() => {
          this.spawnEnemy(enemyImg);
        }, this.enemySpawnInterval);
      }
    );
  }

  // this is going to draw the current frame
  paint() {
    const c = this.canvas.getContext("2d");
    c.fillStyle = "rgb(129,213,251)";
    // clear the screen
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.drawNextFrame();

    let indexesToRemove = [];
    let enemyIndexesToRemove = [];

    this.playerProjectiles.forEach((projectile, index) => {
      if (projectile.position.x > this.canvas.width) {
        // remove the projectile
        indexesToRemove.push(index);
      }
      projectile.drawNextFrame();

      this.enemies.forEach((enemy, enemyIdx) => {
        if (Game.hasCollided(projectile, enemy)) {
          // it's a hit
          indexesToRemove.push(index);
          enemyIndexesToRemove.push(enemyIdx);
        }
      });
    });

    indexesToRemove.forEach((idx) => {
      this.playerProjectiles.splice(idx, 1);
    });

    enemyIndexesToRemove.forEach((idx) => {
      this.enemies.splice(idx, 1);
    });

    this.enemies.forEach((enemy) => {
      enemy.drawNextFrame();

      if (Game.hasCollided(enemy, this.player)) {
        this.gameOver = true;
      }
    });
  }

  gameLoop() {
    this.paint();

    if (
      this.keyPressed.arrowdown &&
      this.player.position.y + this.player.height < this.canvas.height - 20
    ) {
      this.player.velocity.y = 10;
    } else if (this.keyPressed.arrowup && this.player.position.y > 20) {
      this.player.velocity.y = -10;
    } else {
      this.player.velocity.y = 0;
    }

    if (!this.gameOver) {
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  spawnEnemy(enemyImg) {
    this.enemies.push(
      new Flight({
        position: {
          x: this.canvas.width,
          y: 20 + Math.floor(Math.random() * (this.canvas.height - 100)),
        },
        velocity: {
          x: -5,
          y: 0,
        },
        image: enemyImg,
        width: 150,
        canvas: this.canvas,
      })
    );
  }

  static hasCollided(object1, object2) {
    return (
      object1.position.x < object2.position.x + object2.width &&
      object1.position.x + object1.width > object2.position.x &&
      object1.position.y < object2.position.y + object2.height &&
      object1.position.y + object1.height > object2.position.y
    );
  }
}
