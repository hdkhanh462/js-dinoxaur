export default class GameObject {
  constructor({ position }) {
    this.position = position;
    this.children = []; // Changed from object to array
  }

  stepEntry(delta, root) {
    this.children.forEach((child) => child.stepEntry(delta, root));

    this.step(delta, root);
  }

  step(_delta) {}

  draw(ctx, x, y) {
    const drawPosX = this.position.x;
    const drawPosY = this.position.y; // Fixed typo from this.position.x to this.position.y

    this.drawImage(ctx, drawPosX, drawPosY); // Corrected method call

    this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
  }

  drawImage(ctx, drawPosX, drawPosY) {
    // Placeholder implementation for drawImage
    ctx.fillRect(drawPosX, drawPosY, 10, 10);
  }

  addChild(gameObject) {
    this.children.push(gameObject);
  }

  removeChild(gameObject) {
    this.children = this.children.filter((g) => gameObject !== g);
  }
}
