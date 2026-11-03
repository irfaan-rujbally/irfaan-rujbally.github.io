import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { drawMeteor, paintGalaxy, paintNebula, paintPlanet, type Meteor } from './spaceBodies';

/*
 * The Star Wars mode backdrop: parallax star layers, a few planets and galaxies
 * that scroll at their own depth, and a hyperspace streak when the mode starts.
 * Same contract as AtomField — fixed behind the page, 2D canvas, paused while
 * the tab is hidden, held still for reduced motion.
 */
const STAR_LAYERS = [
  { density: 1 / 5200, speed: 0.04, size: [0.4, 0.9], parallax: 4 },
  { density: 1 / 11000, speed: 0.1, size: [0.7, 1.3], parallax: 10 },
  { density: 1 / 26000, speed: 0.2, size: [1.1, 1.9], parallax: 20 },
] as const;

const WARP_SECONDS = 1.3;

type Star = { x: number; y: number; r: number; alpha: number; phase: number; layer: number };
type Body = { sprite: HTMLCanvasElement; x: number; y: number; depth: number; alpha: number; spin: number };

const BODIES = (min: number): Body[] => [
  { sprite: paintGalaxy(min * 0.42, ['rgb(150, 180, 255)', 'rgb(220, 160, 255)'], 0.5), x: 0.4, y: 0.16, depth: 0.04, alpha: 0.75, spin: 0.004 },
  { sprite: paintGalaxy(min * 0.26, ['rgb(255, 190, 150)', 'rgb(160, 220, 255)'], -0.7), x: 0.16, y: 0.9, depth: 0.03, alpha: 0.6, spin: -0.006 },
  { sprite: paintPlanet(min * 0.2, { light: '#f6d9a3', mid: '#c98d4b', dark: '#4a2a12', glow: 'rgba(255, 196, 120, 0.35)', bands: '#7a4a22' }), x: 0.9, y: 0.82, depth: 0.12, alpha: 0.95, spin: 0 },
  { sprite: paintPlanet(min * 0.055, { light: '#bfe9ff', mid: '#3d86b8', dark: '#0b2238', glow: 'rgba(120, 200, 255, 0.4)', ring: '#a9c7d8' }), x: 0.1, y: 0.36, depth: 0.08, alpha: 0.95, spin: 0 },
  { sprite: paintPlanet(min * 0.026, { light: '#e6e6e6', mid: '#8d8d8d', dark: '#232323', glow: 'rgba(255, 255, 255, 0.15)' }), x: 0.72, y: 0.2, depth: 0.06, alpha: 0.9, spin: 0 },
  { sprite: paintPlanet(min * 0.016, { light: '#ffb3a1', mid: '#c2412d', dark: '#3a0d07', glow: 'rgba(255, 120, 90, 0.35)' }), x: 0.55, y: 0.62, depth: 0.05, alpha: 0.85, spin: 0 },
];

const wrap = (value: number, span: number): number => ((value % span) + span) % span;

export const SpaceField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d') ?? null;
    if (canvas === null || ctx === null) return undefined;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let bodies: Body[] = [];
    let nebula: HTMLCanvasElement | null = null;
    let frame = 0;
    let last = performance.now();
    let elapsed = reduced ? WARP_SECONDS : 0;
    let meteor: Meteor | null = null;
    let nextMeteor = 4 + Math.random() * 6;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = STAR_LAYERS.flatMap((layer, index) =>
        Array.from({ length: Math.round(width * height * layer.density) }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
          alpha: 0.35 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          layer: index,
        })),
      );
      bodies = BODIES(Math.min(width, height));
      nebula = paintNebula(width, height);
    };

    const draw = (dt: number): void => {
      elapsed += dt;
      const warp = Math.max(0, 1 - elapsed / WARP_SECONDS) ** 2;
      const settled = 1 - warp;
      const cx = width / 2;
      const cy = height / 2;

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2);

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = settled;
      if (nebula !== null) ctx.drawImage(nebula, 0, 0, width, height);

      for (const star of stars) {
        const layer = STAR_LAYERS[star.layer];
        star.x = wrap(star.x - layer.speed * dt * 60, width);
        const x = star.x + pointer.x * layer.parallax;
        const y = star.y + pointer.y * layer.parallax;
        const twinkle = 0.7 + 0.3 * Math.sin(elapsed * (1 + star.layer) + star.phase);
        const alpha = star.alpha * twinkle;

        if (warp > 0.01) {
          const stretch = warp * 0.55;
          ctx.globalAlpha = Math.min(1, alpha + warp);
          ctx.strokeStyle = '#dfe9ff';
          ctx.lineWidth = star.r;
          ctx.beginPath();
          ctx.moveTo(x - (x - cx) * stretch, y - (y - cy) * stretch);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = star.layer === 2 ? '#fff6d8' : '#e8eeff';
          ctx.fillRect(x - star.r / 2, y - star.r / 2, star.r, star.r);
        }
      }

      const scroll = window.scrollY;
      for (const body of bodies) {
        const size = body.sprite.width;
        const x = body.x * width + pointer.x * 30 * body.depth * 10;
        const y = wrap(body.y * height - scroll * body.depth + size, height + size * 2) - size;
        ctx.globalAlpha = body.alpha * settled;
        ctx.save();
        ctx.translate(x, y);
        if (body.spin !== 0) ctx.rotate(elapsed * body.spin);
        ctx.drawImage(body.sprite, -size / 2, -size / 2);
        ctx.restore();
      }

      if (!reduced && settled === 1) {
        nextMeteor -= dt;
        if (meteor === null && nextMeteor <= 0) {
          meteor = { x: Math.random() * width * 0.8, y: Math.random() * height * 0.3, vx: 520, vy: 240, life: 0.9 };
          nextMeteor = 7 + Math.random() * 9;
        }
        if (meteor !== null) {
          meteor.x += meteor.vx * dt;
          meteor.y += meteor.vy * dt;
          meteor.life -= dt;
          drawMeteor(ctx, meteor);
          if (meteor.life <= 0) meteor = null;
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number): void => {
      draw(Math.min((now - last) / 1000, 0.05));
      last = now;
      frame = requestAnimationFrame(loop);
    };

    const start = (): void => {
      cancelAnimationFrame(frame);
      last = performance.now();
      if (reduced) draw(0);
      else frame = requestAnimationFrame(loop);
    };

    const onVisibility = (): void => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };
    const onResize = (): void => {
      resize();
      if (reduced) draw(0);
    };
    const onScroll = (): void => {
      if (reduced) draw(0);
    };
    const onMove = (event: PointerEvent): void => {
      pointer.tx = (event.clientX / width) * 2 - 1;
      pointer.ty = (event.clientY / height) * 2 - 1;
    };

    resize();
    start();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
};
