import { saveFile } from "./main.js";

export const UP = "UP";
export const DOWN = "DOWN";
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";

export default class Imput {
  constructor(onPressed, onReleased) {
    this.onPressed = onPressed;
    this.onReleased = onReleased;
    this.heldDirections = [];

    document.addEventListener("keydown", (e) => {
      if (e.code === saveFile.jumpKey[0] || e.code === saveFile.jumpKey[1]) {
        this.onKeyPressed(UP);
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.code === saveFile.jumpKey[0] || e.code === saveFile.jumpKey[1]) {
        this.onKeyReleased(UP);
      }
    });

    document.addEventListener("touchstart", () => {
      this.onKeyPressed(UP);
    });
    document.addEventListener("touchend", () => {
      this.onKeyReleased(UP);
    });
  }

  get direction() {
    return this.heldDirections[0];
  }

  onKeyPressed(direction) {
    if (this.heldDirections.indexOf(direction) === -1) {
      this.heldDirections.unshift(direction);
    }
    this.onPressed();
  }

  onKeyReleased(direction) {
    const index = this.heldDirections.indexOf(direction);
    if (index === -1) return;

    this.heldDirections.splice(index, 1);
    this.onReleased();
  }
}
