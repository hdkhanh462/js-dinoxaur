import Sprite from "../Sprites.js";

export default class ObjectConfig {
  constructor(canvasID, sprite = null) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");
    this.sprite = sprite != null ? new Sprite(sprite) : null;
  }
}
