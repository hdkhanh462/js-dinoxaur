import { gridCells } from "../gridCells.js";
import Imput from "./Imput.js";

let isJumpPressed = false;
let isJumpInProcess = false;
let isFalling = false;
let FLOAT_TIME = 105;

const config = {
  JUMP_HEIGHT: gridCells(6),
  GROUND: gridCells(9),
  JUMP_SPEED: 4,
  GRAVITY: 3,
};

const imput = new Imput(onJumpPressed, onJumpReleased);
function onJumpPressed() {
  isJumpPressed = true;
}

function onJumpReleased() {
  isJumpPressed = false;
}

export function action(delta, dino, isMute) {
  if (isJumpPressed) isJumpInProcess = true;

  if (isJumpInProcess && !isFalling) {
    if (dino.position.y > config.JUMP_HEIGHT) {
      dino.animation.play("jump");
      if (!isMute) {
        dino.playSound("jump");
      }
      dino.position.y -= config.JUMP_SPEED;
    } else {
      if (FLOAT_TIME < 0) {
        dino.animation.play("falling");
        isFalling = true;
        FLOAT_TIME = 105;
      } else {
        FLOAT_TIME -= delta;
      }
    }
  } else {
    if (dino.position.y < config.GROUND) {
      dino.position.y += config.GRAVITY;
    } else {
      dino.animation.play("moveRight");
      isFalling = false;
      isJumpInProcess = false;
    }
  }
}
