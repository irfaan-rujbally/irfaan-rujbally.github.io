const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export type SpherePoint = [x: number, y: number, z: number];

/**
 * Distribute `count` points evenly over a sphere using the golden-angle
 * (Fibonacci) method. Naive lat/long clumps at the poles; this does not.
 */
export const fibonacciSphere = (count: number, radius: number): SpherePoint[] => {
  if (count <= 0) return [];
  if (count === 1) return [[0, 0, radius]];

  const points: SpherePoint[] = [];

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;

    points.push([
      Math.cos(theta) * ringRadius * radius,
      y * radius,
      Math.sin(theta) * ringRadius * radius,
    ]);
  }

  return points;
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number): number =>
  from + (to - from) * t;

/** Frame-rate independent damping factor for exponential smoothing. */
export const damp = (rate: number, delta: number): number =>
  1 - Math.exp(-rate * delta);
