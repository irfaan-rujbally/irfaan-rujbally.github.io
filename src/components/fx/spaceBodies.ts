/*
 * Planets, galaxies and nebulae are painted once into offscreen canvases on
 * resize, then stamped every frame. Gradients and thousands of galaxy dots are
 * far too slow to redraw at 60fps; drawImage of a cached sprite is nearly free.
 */

type Ctx = CanvasRenderingContext2D;

export type PlanetLook = {
  light: string;
  mid: string;
  dark: string;
  glow: string;
  bands?: string;
  ring?: string;
};

const sprite = (size: number, paint: (ctx: Ctx, centre: number) => void): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Math.max(2, Math.ceil(size));
  const ctx = canvas.getContext('2d');
  if (ctx !== null) paint(ctx, canvas.width / 2);
  return canvas;
};

const gaussian = (): number => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

const drawRing = (ctx: Ctx, c: number, r: number, colour: string, front: boolean): void => {
  ctx.save();
  ctx.translate(c, c);
  ctx.rotate(-0.38);
  for (const [scale, width, alpha] of [[1.75, r * 0.16, 0.55], [2.05, r * 0.1, 0.35], [2.25, r * 0.05, 0.25]]) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * scale, r * scale * 0.24, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
};

export const paintPlanet = (radius: number, look: PlanetLook): HTMLCanvasElement =>
  sprite(radius * (look.ring === undefined ? 2.8 : 5), (ctx, c) => {
    const r = radius;

    const glow = ctx.createRadialGradient(c, c, r * 0.95, c, c, r * 1.35);
    glow.addColorStop(0, look.glow);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, c * 2, c * 2);

    if (look.ring !== undefined) drawRing(ctx, c, r, look.ring, false);

    ctx.save();
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.clip();

    const body = ctx.createRadialGradient(c - r * 0.45, c - r * 0.45, r * 0.05, c, c, r * 1.1);
    body.addColorStop(0, look.light);
    body.addColorStop(0.55, look.mid);
    body.addColorStop(1, look.dark);
    ctx.fillStyle = body;
    ctx.fillRect(c - r, c - r, r * 2, r * 2);

    if (look.bands !== undefined) {
      ctx.fillStyle = look.bands;
      ctx.filter = `blur(${Math.max(1, r * 0.025)}px)`;
      for (let i = 0; i < 11; i++) {
        ctx.globalAlpha = 0.06 + Math.random() * 0.14;
        const y = c - r + (i + Math.random() * 0.6) * ((r * 2) / 11);
        ctx.fillRect(c - r * 1.1, y, r * 2.2, r * (0.04 + Math.random() * 0.1));
      }
      ctx.filter = 'none';
      ctx.globalAlpha = 1;
    }

    /* Night side: lit from the top left, so shade towards the bottom right. */
    const shade = ctx.createRadialGradient(c - r * 0.6, c - r * 0.6, r * 0.9, c - r * 0.3, c - r * 0.3, r * 2.1);
    shade.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shade.addColorStop(1, 'rgba(0, 0, 0, 0.92)');
    ctx.fillStyle = shade;
    ctx.fillRect(c - r, c - r, r * 2, r * 2);
    ctx.restore();

    if (look.ring !== undefined) drawRing(ctx, c, r, look.ring, true);
  });

export const paintGalaxy = (size: number, arms: [string, string], tilt: number): HTMLCanvasElement =>
  sprite(size, (ctx, c) => {
    const radius = c * 0.92;
    ctx.translate(c, c);
    ctx.rotate(tilt);
    ctx.scale(1, 0.42);

    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.45);
    core.addColorStop(0, 'rgba(255, 244, 214, 0.85)');
    core.addColorStop(0.3, 'rgba(255, 214, 170, 0.28)');
    core.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = core;
    ctx.fillRect(-c, -c, c * 2, c * 2);

    ctx.globalCompositeOperation = 'lighter';
    const count = Math.round(size * 6);
    for (let i = 0; i < count; i++) {
      const arm = i % 2;
      const d = Math.pow(Math.random(), 1.4) * radius;
      const angle = arm * Math.PI + (d / radius) * 3.6 + gaussian() * 0.38;
      const spread = gaussian() * radius * 0.06;
      ctx.fillStyle = d < radius * 0.25 ? 'rgb(255, 230, 190)' : arms[i % 3 === 0 ? 1 : 0];
      ctx.globalAlpha = 0.25 + Math.random() * 0.45;
      const dot = 0.5 + Math.random() * 1.1;
      ctx.fillRect(Math.cos(angle) * d + spread, Math.sin(angle) * d + spread, dot, dot);
    }
  });

export const paintNebula = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(2, Math.ceil(width / 2));
  canvas.height = Math.max(2, Math.ceil(height / 2));
  const ctx = canvas.getContext('2d');
  if (ctx === null) return canvas;

  const clouds: [number, number, number, string][] = [
    [0.18, 0.22, 0.45, 'rgba(88, 52, 160, 0.20)'],
    [0.82, 0.3, 0.38, 'rgba(24, 92, 150, 0.16)'],
    [0.62, 0.88, 0.5, 'rgba(150, 40, 80, 0.13)'],
    [0.05, 0.8, 0.3, 'rgba(20, 120, 120, 0.12)'],
  ];
  for (const [x, y, r, colour] of clouds) {
    const cx = x * canvas.width;
    const cy = y * canvas.height;
    const radius = r * Math.max(canvas.width, canvas.height);
    const cloud = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    cloud.addColorStop(0, colour);
    cloud.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cloud;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return canvas;
};

export type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

export const drawMeteor = (ctx: Ctx, meteor: Meteor): void => {
  const tailX = meteor.x - meteor.vx * 0.22;
  const tailY = meteor.y - meteor.vy * 0.22;
  const trail = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
  trail.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  trail.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.globalAlpha = Math.min(1, meteor.life * 2);
  ctx.strokeStyle = trail;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(meteor.x, meteor.y);
  ctx.lineTo(tailX, tailY);
  ctx.stroke();
};
