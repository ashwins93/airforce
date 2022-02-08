export class Projectile {
  constructor(options) {
    this.canvas = options.canvas;
    this.position = options.position;
    this.velocity = options.velocity;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
  }

  draw() {
    const c = this.canvas.getContext("2d");

    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  drawNextFrame() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.draw();
  }
}
