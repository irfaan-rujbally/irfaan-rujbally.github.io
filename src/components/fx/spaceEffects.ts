import type { SectionId } from '@/types';

type Ctx = CanvasRenderingContext2D;
type Rgb = [number, number, number];

/* The sky's colour cast per section, so each part of the page feels like a
   different stretch of space. Low alpha: it should tint, never compete. */
export const SECTION_TINTS: Record<SectionId, Rgb> = {
  hero: [200, 90, 40],
  about: [40, 70, 170],
  skills: [20, 130, 95],
  experience: [95, 40, 160],
  education: [30, 95, 175],
  projects: [160, 30, 115],
  contact: [195, 85, 30],
};

export const easeRgb = (current: Rgb, target: Rgb, amount: number): void => {
  for (let i = 0; i < 3; i++) current[i] += (target[i] - current[i]) * amount;
};

export const drawTint = (ctx: Ctx, width: number, height: number, [r, g, b]: Rgb): void => {
  const glow = ctx.createRadialGradient(width * 0.72, height * 0.3, 0, width * 0.72, height * 0.3, Math.max(width, height) * 0.85);
  glow.addColorStop(0, `rgba(${r | 0}, ${g | 0}, ${b | 0}, 0.3)`);
  glow.addColorStop(0.55, `rgba(${r | 0}, ${g | 0}, ${b | 0}, 0.1)`);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.globalAlpha = 1;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
};

/**
 * One star as a hyperspace streak radiating from the centre. Past a little
 * speed it gets a red/cyan fringe either side, the lens-split look of a jump.
 */
export const drawStreak = (
  ctx: Ctx,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  warp: number,
  cx: number,
  cy: number,
): void => {
  const stretch = warp * 0.55;
  const tailX = x - (x - cx) * stretch;
  const tailY = y - (y - cy) * stretch;
  const line = (colour: string, offset: number, a: number): void => {
    ctx.globalAlpha = a;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(tailX + offset, tailY);
    ctx.lineTo(x + offset, y);
    ctx.stroke();
  };
  ctx.lineWidth = radius;
  if (warp > 0.15) {
    line('#ff5a6e', 1.6, alpha * 0.45);
    line('#5ad8ff', -1.6, alpha * 0.45);
  }
  line('#dfe9ff', 0, Math.min(1, alpha + warp));
};

/** A white-out at the very top of a jump, fading in only past `from`. */
export const drawFlash = (ctx: Ctx, width: number, height: number, warp: number, from = 0.55): void => {
  if (warp <= from) return;
  ctx.globalAlpha = (warp - from) * 0.4;
  ctx.fillStyle = '#e8f1ff';
  ctx.fillRect(0, 0, width, height);
};
