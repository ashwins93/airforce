export class Flight {
  constructor(options) {
    this.position = options.position;
    this.velocity = options.velocity;
    this.image = options.image;
    this.canvas = options.canvas;
    this.width = options.width;

    this.height = (this.width / this.image.width) * this.image.height;
  }

  draw() {
    const c = this.canvas.getContext("2d");
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  drawNextFrame() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.draw();
  }
}
