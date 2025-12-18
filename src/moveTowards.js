// Improved readability and added comments for clarity.
export function moveTowards(person, destinationPos, speed) {
  let dx = destinationPos.x - person.position.x;
  let dy = destinationPos.y - person.position.y;

  const distance = Math.sqrt(dx ** 2 + dy ** 2);

  if (distance <= speed) {
    // Snap to destination if within speed range
    person.position.x = destinationPos.x;
    person.position.y = destinationPos.y;
    return 0; // No remaining distance
  }

  // Normalize direction vector
  const normalizedX = dx / distance;
  const normalizedY = dy / distance;

  // Move towards destination
  person.position.x += normalizedX * speed;
  person.position.y += normalizedY * speed;

  // Recalculate remaining distance
  dx = destinationPos.x - person.position.x;
  dy = destinationPos.y - person.position.y;

  return Math.sqrt(dx ** 2 + dy ** 2); // Return remaining distance
}
