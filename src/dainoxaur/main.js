import Animations from "../Animations.js";
import FrameIndexPattern from "../FrameIndexPattern.js";
import GameLoop from "../GameLoop.js";
import { gridCells } from "../gridCells.js";
import Process from "../Process.js";
import Resources from "../Resources.js";
import Sprite from "../Sprites.js";
import VectorTo from "../VectorTo.js";
import { action } from "./action.js";
import { drawEnemies, updateEnemies } from "./enemy.js";
import {
  DEAD,
  FALLING,
  JUMP,
  MOVE_LEFT,
  MOVE_RIGHT,
  PLAY_HOLD,
  PLAY_IDLE,
  STANDING,
} from "./dinoAnimation.js";
import ObjectConfig from "./ObjectConfig.js";

//#region Fields
let isGameOver = false;
let isSetReset = false;
let isWatingToStart = true;
let isDead = true;
let SCORE = 0;
let HIGH_SCORE = 0;
let GAME_SPEED = 0;
const GAME_SPEED_INCREMENT = 0.5;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const resources = {
  images: {
    dino_right: "../assets/sprites/olaf_right.png",
    enemy_left: "../assets/sprites/kira_left.png",
    sky: "../assets/sprites/sky.png",
    grass: "../assets/sprites/grass.png",
    ground: "../assets/sprites/ground.png",
    bush: "../assets/sprites/bush.png",
    icons: "../assets/sprites/GUI/IconButtons.png",
    textButtons: "../assets/sprites/GUI/TextButtons.png",
    boxs: "../assets/sprites/GUI/Boxs.png",
    gameOverTitle: "../assets/sprites/GUI/GameOver.png",
    scoreText: "../assets/sprites/GUI/Score.png",
    highScoreText: "../assets/sprites/GUI/High-score.png",
  },

  sounds: {
    jump: "../assets/sound-effect/jump.wav",
    die: "../assets/sound-effect/die.wav",
    tap: "../assets/sound-effect/tap.wav",
  },
};
const resourceClass = new Resources(resources.images, resources.sounds);
//#endregion

const process = new Process("dainoxaur", {
  version: "1.0.3",
  highScore: 0,
  jumpKey: ["ArrowUp", "Space"],
  isDrawBackground: false,
  isMute: false,
});
export let saveFile = process.getSaveFile();
HIGH_SCORE = saveFile.highScore;

//#region GUI
const score = document.getElementById("score");

const menuStart = new ObjectConfig("canvas-start", {
  resource: resourceClass.images.textButtons,
  frameSize: new VectorTo(64, 32),
  rows: 3,
  columns: 3,
  frame: 7,
  animation: new Animations({
    playIdle: new FrameIndexPattern(PLAY_IDLE),
    playHold: new FrameIndexPattern(PLAY_HOLD),
  }),
});
menuStart.canvas.addEventListener("mousedown", () => {
  menuStart.sprite.animation.play("playHold");
});
menuStart.canvas.addEventListener("mouseup", (e) => {
  menuStart.sprite.frame = 1;
  if (!saveFile.isMute) {
    resourceClass.sounds.tap.sound.play();
  }

  reset(e);
});

const divGameOver = document.getElementById("divGameOver");
const menuGameOver = new ObjectConfig("canvas-game-over", {
  resource: resourceClass.images.boxs,
  frameSize: new VectorTo(194, 144),
});

const txtGameOver = new ObjectConfig("canvas-game-over-title", {
  resource: resourceClass.images.gameOverTitle,
  frameSize: new VectorTo(194, 144),
});

const scoreSpan = document.getElementById("score-text");
const scoreText = new ObjectConfig("canvas-score", {
  resource: resourceClass.images.scoreText,
  frameSize: new VectorTo(107, 29),
});

const highscoreSpan = document.getElementById("high-score-text");
const highscoreTextCanvas = document.getElementById("canvas-high-score");
const ctxHighScoreText = highscoreTextCanvas.getContext("2d");
const highScoreText = new Sprite({
  resource: resourceClass.images.highScoreText,
  frameSize: new VectorTo(201, 39),
});

const btnRestartCanvas = document.getElementById("canvas-restart");
const ctxBtnRestart = btnRestartCanvas.getContext("2d");
const btnRestart = new Sprite({
  resource: resourceClass.images.icons,
  frameSize: new VectorTo(32, 32),
  rows: 10,
  columns: 10,
  frame: 98,
});

btnRestartCanvas.addEventListener("mousedown", () => {
  btnRestart.frame = 99;
});
btnRestartCanvas.addEventListener("mouseup", (e) => {
  btnRestart.frame = 98;

  if (!saveFile.isMute) {
    resourceClass.sounds.tap.sound.play();
  }
  reset(e);
});

// const btnSettingCanvas = document.getElementById("canvas-setting");
// const ctxBtnSetting = btnSettingCanvas.getContext("2d");
// const btnSetting = new Sprite({
//   resource: resourceClass.images.icons,
//   frameSize: new VectorTo(32, 32),
//   rows: 10,
//   columns: 10,
//   frame: 18,
// });
// btnSettingCanvas.addEventListener("mousedown", () => {
//   btnSetting.frame = 19;
// });
// btnSettingCanvas.addEventListener("mouseup", () => {
//   btnSetting.frame = 18;
//   resourceClass.sounds.tap.sound.play();
// });
//#endregion

//#region Background
const sky = new Sprite({
  resource: resourceClass.images.sky,
  frameSize: new VectorTo(600, 300),
  position: new VectorTo(0, 0),
  scale: 0.6,
});
const grass = new Sprite({
  resource: resourceClass.images.grass,
  frameSize: new VectorTo(600, 300),
  position: new VectorTo(0, -8),
  scale: 0.6,
});
const ground = new Sprite({
  resource: resourceClass.images.ground,
  frameSize: new VectorTo(600, 300),
  position: new VectorTo(0, 50),
  scale: 0.4,
});
const bush = new Sprite({
  resource: resourceClass.images.bush,
  frameSize: new VectorTo(600, 300),
  position: new VectorTo(0, 60),
  scale: 0.4,
});
//#endregion

//#region  Character
const dino = new Sprite({
  resource: resourceClass.images.dino_right,
  sounds: {
    jump: resourceClass.sounds.jump,
    die: resourceClass.sounds.die,
  },
  frameSize: new VectorTo(24, 24),
  rows: 7,
  columns: 6,
  frame: 0,
  position: new VectorTo(gridCells(2), gridCells(9)),
  animation: new Animations({
    moveRight: new FrameIndexPattern(MOVE_RIGHT),
    jump: new FrameIndexPattern(JUMP),
    falling: new FrameIndexPattern(FALLING),
    dead: new FrameIndexPattern(DEAD),
    standing: new FrameIndexPattern(STANDING),
  }),
});
const dinoDestinationPos = dino.position.duplicate();
const enemies = [];
//#endregion

//#region Game
const draw = (delta) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Menu
  menuStart.sprite.drawImage(menuStart.ctx, 0, 0);

  if (saveFile.isDrawBackground) {
    //Sky
    sky.drawImage(ctx, sky.position.x, sky.position.y);
    sky.drawImage(ctx, sky.position.x + 340, sky.position.y);
    sky.drawImage(ctx, sky.position.x + 680, sky.position.y);

    //Grass
    grass.drawImage(ctx, grass.position.x, grass.position.y);
    grass.drawImage(ctx, grass.position.x + 346, grass.position.y);
    grass.drawImage(ctx, grass.position.x + 692, grass.position.y);
  }

  //Ground
  ground.drawImage(ctx, ground.position.x, ground.position.y);
  ground.drawImage(ctx, ground.position.x + 230, ground.position.y);
  ground.drawImage(ctx, ground.position.x + 460, ground.position.y);

  //Characters
  const dinoOfSet = new VectorTo(5, -22);
  const dinoPosX = dino.position.x + dinoOfSet.x;
  const dinoPosY = dino.position.y + dinoOfSet.y;
  dino.drawImage(ctx, dinoPosX, dinoPosY);

  if (!isGameOver && !isWatingToStart) {
    menuStart.canvas.classList.add("invisible");
    drawEnemies(ctx, enemies, delta, GAME_SPEED);
  }

  //Bush
  bush.drawImage(ctx, bush.position.x, bush.position.y);
  bush.drawImage(ctx, bush.position.x + 230, bush.position.y);
  bush.drawImage(ctx, bush.position.x + 460, bush.position.y);

  if (isGameOver || isWatingToStart) {
    btnRestart.drawImage(ctxBtnRestart, 0, 0);
    // btnSetting.drawImage(ctxBtnSetting, 0, 0);
    // btnSettingCanvas.classList.remove("invisible");
  } else {
    // btnSettingCanvas.classList.add("invisible");
  }
};

const update = (delta) => {
  if (isGameOver) {
    dino.frame = 27;
    if (!isDead && !saveFile.isMute) {
      dino.playSound("die");
      isDead = true;
    }
    setReset();
  }
  if (isGameOver || isWatingToStart) {
    menuStart.sprite.step(delta);
    return;
  }

  SCORE += delta * 0.01;
  score.textContent = String(Math.floor(SCORE)).padStart(4, "0");
  setGameSpeed();

  //Sky
  sky.position.x -= 0.5 + GAME_SPEED;
  if (sky.position.x < -340) {
    sky.position.x = sky.position.x + 340;
  }

  //Grass
  grass.position.x -= 0.5 + GAME_SPEED;
  if (grass.position.x < -346) {
    grass.position.x = grass.position.x + 346;
  }

  //Ground
  ground.position.x -= 2 + GAME_SPEED;
  if (ground.position.x < -230) {
    ground.position.x = ground.position.x + 230;
  }

  //Bush
  bush.position.x -= 2 + GAME_SPEED;
  if (bush.position.x < -230) {
    bush.position.x = bush.position.x + 230;
  }

  isGameOver = updateEnemies(dino, enemies);
  if (isGameOver) {
    //Update high score
    if (Math.floor(SCORE) > HIGH_SCORE) {
      HIGH_SCORE = Math.floor(SCORE);
      saveFile.highScore = Math.floor(SCORE);
      process.save(saveFile);
    }
    divGameOver.classList.remove("invisible");
    menuGameOver.sprite.drawImage(menuGameOver.ctx, 0, 0);
    menuGameOver.canvas.classList.remove("invisible");
    txtGameOver.sprite.drawImage(txtGameOver.ctx, 0, 0);
    scoreText.sprite.drawImage(scoreText.ctx, 0, 0);
    highScoreText.drawImage(ctxHighScoreText, 0, 0);

    scoreSpan.textContent = String(Math.floor(SCORE));
    highscoreSpan.textContent = HIGH_SCORE;
  }

  action(delta, dino, saveFile.isMute);
  dino.step(delta);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

function setReset() {
  if (!isSetReset) {
    isSetReset = true;

    // setTimeout(() => {
    //   window.addEventListener("keydown", reset);
    //   window.addEventListener("touchstart", reset);
    // }, 1000);
  }
}

function reset(e) {
  if (
    e.type !== "touchstart" &&
    e.type !== "mouseup" &&
    (e.code !== saveFile.jumpKey[0] || e.code !== saveFile.jumpKey[1])
  ) {
    return;
  }
  // window.removeEventListener("keydown", reset);
  // window.removeEventListener("touchstart", reset);

  isSetReset = false;
  isGameOver = false;
  isWatingToStart = false;
  isDead = false;
  SCORE = 0;
  GAME_SPEED = 0;
  enemies.splice(0, enemies.length);
  // menuGameOverCanvas.classList.add("invisible");
  divGameOver.classList.add("invisible");

  for (let i = 0; i < 5; i++) {
    enemies.push(
      new Sprite({
        resource: resourceClass.images.enemy_left,
        frameSize: new VectorTo(24, 24),
        rows: 7,
        columns: 6,
        frame: 0,
        position: new VectorTo(gridCells(22), gridCells(9)),
        animation: new Animations({
          moveLeft: new FrameIndexPattern(MOVE_LEFT),
          standing: new FrameIndexPattern(STANDING),
          jump: new FrameIndexPattern(JUMP),
        }),
      })
    );
  }
}

function setGameSpeed() {
  if (500 / Math.floor(SCORE) == 1) {
    GAME_SPEED = GAME_SPEED_INCREMENT * 1;
  }
  if (1000 / Math.floor(SCORE) == 1) {
    GAME_SPEED = GAME_SPEED_INCREMENT * 2;
  }

  if (1500 / Math.floor(SCORE) == 1) {
    GAME_SPEED = GAME_SPEED_INCREMENT * 2.5;
  }

  if (2000 / Math.floor(SCORE) == 1) {
    GAME_SPEED = GAME_SPEED_INCREMENT * 3;
  }
}
//#endregion

// canvas.addEventListener("keydown", reset);
// canvas.addEventListener("touchstart", reset);
