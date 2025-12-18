export const walls = new Set();

for (let nextX = 0; nextX < 304; nextX += 16) {
  walls.add(`${nextX},-16`);
}
walls.add(`0,-16`);

walls.add(`0,144`);

walls.add(`304,128`);

walls.add(`-16,128`);
