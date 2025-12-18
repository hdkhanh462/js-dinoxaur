export const gridCells = (n) => {
  return n * 16;
};

export const isSpaceFree = (walls, x, y) => {
  if (!walls || typeof x !== "number" || typeof y !== "number") {
    throw new Error(
      "Invalid input: walls must be a Set, x and y must be numbers"
    );
  }

  const str = `${x},${y}`;
  return !walls.has(str);
};
