function animations(rootFrame = 0, n = 6, directionRight = true) {
  const durations = {
    6: 500,
    5: 400,
    4: 500,
    3: 500,
    2: 300,
  };

  const frames = [];

  const duration = durations[n];
  for (let i = 0; i < n; i++) {
    frames.push({
      time: i * (duration / n),
      frame: directionRight ? rootFrame + i : rootFrame - i,
    });
  }

  return { duration, frames };
}

function stopAnimations(rootFrame = 0) {
  return {
    duration: 400,
    frames: [
      {
        time: 0,
        frame: rootFrame,
      },
    ],
  };
}

export const MOVE_RIGHT = animations(0);
export const PLAY_IDLE = animations(7, 2);
export const DEAD = stopAnimations(24);
export const MOVE_LEFT = animations(5, 6, false);
export const CROUCH_LEFT = animations(11, 6, false);
export const PLAY_HOLD = stopAnimations(8);
export const JUMP = stopAnimations(38);
export const FALLING = stopAnimations(18);
export const STANDING = stopAnimations(6);
