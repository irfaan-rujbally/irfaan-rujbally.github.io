import type { SectionId } from '@/types';

/**
 * Where the ship sits while a section is on screen. x and y are fractions of the
 * half-viewport at z = 0 (1 = right/top edge); z is depth towards the camera.
 * Angles are radians: yaw 0 points the nose at the viewer, π shows the engines.
 */
export type Pose = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  roll: number;
  scale: number;
};

export const SECTION_ORDER: SectionId[] = [
  'hero',
  'about',
  'skills',
  'experience',
  'education',
  'projects',
  'contact',
];

/* Each pose parks the ship on the side the section leaves empty. Positive pitch
   with yaw near π is a chase-camera view from above and behind: the Falcon is a
   flat disc, so this shows its whole top instead of a thin edge. */
export const POSES: Record<SectionId, Pose> = {
  hero: { x: 0.56, y: -0.2, z: 3.6, yaw: Math.PI + 0.5, pitch: 0.75, roll: 0.3, scale: 1.15 },
  about: { x: 0.75, y: 0.55, z: -1, yaw: -Math.PI / 2 - 0.3, pitch: 0.9, roll: -0.3, scale: 0.8 },
  skills: { x: 0.72, y: 0.5, z: 0, yaw: Math.PI - 0.5, pitch: 0.8, roll: -0.4, scale: 0.85 },
  experience: { x: 0.8, y: 0, z: 1.5, yaw: Math.PI + 0.35, pitch: 0.7, roll: 0.35, scale: 1 },
  education: { x: -0.5, y: 0.6, z: -1, yaw: Math.PI / 2 + 0.2, pitch: 0.9, roll: 0.2, scale: 0.8 },
  projects: { x: 0.7, y: 0.58, z: 0, yaw: Math.PI - 0.4, pitch: 0.8, roll: -0.3, scale: 0.85 },
  contact: { x: 0, y: 0.72, z: -9, yaw: Math.PI, pitch: 0.35, roll: 0, scale: 0.9 },
};

/** Far behind the scene: the ship launches from here when the mode starts. */
export const LAUNCH = { x: -0.2, y: -0.6, z: -70 };

export const smoothstep = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/**
 * Which two poses to blend for a scroll position. Each section holds its pose
 * for the first 30% of its height, then travels to the next one, so the ship
 * settles while you read and moves while you scroll between sections.
 */
export const blendFor = (tops: number[], anchor: number): { from: number; to: number; t: number } => {
  let index = 0;
  while (index < tops.length - 1 && anchor >= tops[index + 1]) index += 1;
  if (index >= tops.length - 1) return { from: index, to: index, t: 0 };
  const span = Math.max(1, tops[index + 1] - tops[index]);
  const progress = (anchor - tops[index]) / span;
  return { from: index, to: index + 1, t: smoothstep((progress - 0.3) / 0.7) };
};
