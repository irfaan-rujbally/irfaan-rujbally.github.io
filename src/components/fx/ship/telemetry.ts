/*
 * Written by the ship every frame, read by the DOM HUD on its own frame loop.
 * A plain mutable object rather than React state: sixty updates a second
 * through React would re-render the HUD for nothing.
 */
export const telemetry = {
  /** Compass heading of the nose, 0–359. */
  heading: 0,
  /** On-screen box around the ship in CSS pixels; `visible` is false while it's off screen. */
  screen: { x: 0, y: 0, size: 0, visible: false },
};
