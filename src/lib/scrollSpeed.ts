/*
 * One shared, smoothed reading of how fast the page is scrolling, in px/s.
 * The ship, the starfield and the HUD all react to it; a single listener keeps
 * them in agreement instead of three loops measuring slightly different things.
 */
let velocity = 0;
let lastY = 0;
let lastT = 0;
let frame = 0;
let users = 0;

const tick = (now: number): void => {
  const y = window.scrollY;
  const dt = Math.max(1, now - lastT) / 1000;
  const instant = (y - lastY) / dt;
  velocity += (instant - velocity) * Math.min(1, dt * 6);
  lastY = y;
  lastT = now;
  frame = requestAnimationFrame(tick);
};

/** Signed px/s: positive while scrolling down. */
export const getScrollVelocity = (): number => velocity;

export const startScrollSpeed = (): (() => void) => {
  users += 1;
  if (users === 1) {
    lastY = window.scrollY;
    lastT = performance.now();
    frame = requestAnimationFrame(tick);
  }
  return () => {
    users -= 1;
    if (users === 0) {
      cancelAnimationFrame(frame);
      velocity = 0;
    }
  };
};
