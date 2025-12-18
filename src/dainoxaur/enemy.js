import VectorTo from "../VectorTo.js";
import { gridCells } from "../gridCells.js";

let isGameOver = false;
let ENEMY_NEXT_INTERVAL = 1000;
const DIFFICUL = 600;
const ENEMY_INTERVAL_MIN = 2000;
const ENEMY_INTERVAL_MAX = 3000;
const destinationPos = new VectorTo(gridCells(-2), gridCells(8));

function getRamdomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setNextEnemyTime(speed) {
  const num = getRamdomNumber(
    ENEMY_INTERVAL_MIN - speed * DIFFICUL,
    ENEMY_INTERVAL_MAX - speed * DIFFICUL
  );
  ENEMY_NEXT_INTERVAL = num;
}

function drawEnemies(ctx, enemies, detta, speed) {
  enemies.forEach((enemy) => {
    const enemyOfSet = new VectorTo(8, -22);
    const enemyPosX = enemy.position.x + enemyOfSet.x;
    const enemyPosY = enemy.position.y + enemyOfSet.y;

    if (enemy.position.x > destinationPos.x) {
      enemy.position.x -= 2 + speed;
      enemy.drawImage(ctx, enemyPosX, enemyPosY);
    } else {
      if (ENEMY_NEXT_INTERVAL < 0) {
        enemy.position.x = gridCells(22);
        setNextEnemyTime(speed);
      }
      ENEMY_NEXT_INTERVAL -= detta;
    }
    enemy.step(detta);
  });
}

function updateEnemies(dino, enemies) {
  return enemies.some((enemy) => {
    const adjustBy = 2;
    if (
      dino.position.x < enemy.position.x + enemy.frameSize.x / adjustBy &&
      dino.position.x + dino.frameSize.x / adjustBy > enemy.position.x &&
      dino.position.y < enemy.position.y + enemy.frameSize.y / adjustBy &&
      dino.position.y + dino.frameSize.y / adjustBy > enemy.position.y
    ) {
      isGameOver = true;
      return true;
    } else {
      isGameOver = true;
      return false;
    }
  });
}

export { getRamdomNumber, drawEnemies, updateEnemies };
