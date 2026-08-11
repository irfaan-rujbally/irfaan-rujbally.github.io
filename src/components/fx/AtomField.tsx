import { useEffect, useRef } from 'react';
import { useIsDarkTheme } from '@/hooks/useIsDarkTheme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/*
 * Drifting atoms with bonds drawn between near neighbours, sitting behind the
 * whole page so it never reads as flat white or flat black.
 *
 * Canvas rather than DOM nodes: at ~70 atoms the bond pass is ~2,500 pair tests
 * a frame, which is nothing for 2D canvas but would mean thousands of layout
 * boxes as elements.
 */
const DENSITY = 1 / 18000; // atoms per px² of viewport
const MIN_ATOMS = 22;
const MAX_ATOMS = 90;

const BOND_DISTANCE = 132; // ~ the mean atom spacing, so bonds stay sparse
const POINTER_RADIUS = 170;
const POINTER_PUSH = 0.9;
const DRIFT = 0.16; // px per frame
const ATOM_RADIUS = 1.5;

/*
 * Alphas are the whole design. Everything here is deliberately near the floor of
 * what renders — the field should be felt rather than looked at, and anything
 * higher competes with body copy for attention.
 */
const PALETTE = {
  dark: { atom: '226, 232, 240', bond: '148, 163, 184', live: '96, 165, 250', atomAlpha: 0.30, bondAlpha: 0.13 },
  light: { atom: '30, 41, 59', bond: '71, 85, 105', live: '37, 99, 235', atomAlpha: 0.24, bondAlpha: 0.10 },
} as const;

type Atom = { x: number; y: number; vx: number; vy: number };

export const AtomField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDarkTheme();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return undefined;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return undefined;

    const palette = isDark ? PALETTE.dark : PALETTE.light;
    const pointer = { x: -9999, y: -9999 };
    let atoms: Atom[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round(
        Math.min(MAX_ATOMS, Math.max(MIN_ATOMS, width * height * DENSITY)),
      );

      // Keep the atoms that already exist so a resize nudges the field rather
      // than visibly rebuilding it.
      atoms = atoms.slice(0, target);
      while (atoms.length < target) {
        const angle = Math.random() * Math.PI * 2;
        atoms.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * DRIFT,
          vy: Math.sin(angle) * DRIFT,
        });
      }
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, width, height);

      // Bonds first so atoms sit on top of the line ends.
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const dx = atoms[i].x - atoms[j].x;
          const dy = atoms[i].y - atoms[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > BOND_DISTANCE) continue;

          const strength = 1 - dist / BOND_DISTANCE;

          // A bond lights up in the accent colour when the pointer is near its
          // midpoint. This is the whole "reactive" read — the field is otherwise
          // uniform, so a travelling highlight is legible at very low alpha.
          const mx = (atoms[i].x + atoms[j].x) / 2 - pointer.x;
          const my = (atoms[i].y + atoms[j].y) / 2 - pointer.y;
          const near = Math.max(0, 1 - Math.hypot(mx, my) / POINTER_RADIUS);

          const colour = near > 0 ? palette.live : palette.bond;
          const alpha = palette.bondAlpha * strength + near * 0.22;

          ctx.strokeStyle = `rgba(${colour}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(atoms[i].x, atoms[i].y);
          ctx.lineTo(atoms[j].x, atoms[j].y);
          ctx.stroke();
        }
      }

      for (const atom of atoms) {
        const near = Math.max(
          0,
          1 - Math.hypot(atom.x - pointer.x, atom.y - pointer.y) / POINTER_RADIUS,
        );
        ctx.fillStyle = `rgba(${near > 0 ? palette.live : palette.atom}, ${(
          palette.atomAlpha + near * 0.3
        ).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, ATOM_RADIUS + near * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (): void => {
      for (const atom of atoms) {
        atom.x += atom.vx;
        atom.y += atom.vy;

        // Soft repulsion, so the field parts around the pointer and settles
        // back once it leaves instead of staying deformed.
        const dx = atom.x - pointer.x;
        const dy = atom.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < POINTER_RADIUS && dist > 0.01) {
          const push = ((1 - dist / POINTER_RADIUS) * POINTER_PUSH) / dist;
          atom.x += dx * push;
          atom.y += dy * push;
        }

        // Wrap rather than bounce: bouncing collects atoms along the edges.
        if (atom.x < -20) atom.x = width + 20;
        if (atom.x > width + 20) atom.x = -20;
        if (atom.y < -20) atom.y = height + 20;
        if (atom.y > height + 20) atom.y = -20;
      }

      draw();
      frame = requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent): void => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onLeave = (): void => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    // Reduced motion still gets the texture, just held still.
    const start = (): void => {
      cancelAnimationFrame(frame);
      if (reduced) draw();
      else frame = requestAnimationFrame(step);
    };

    const onVisibility = (): void => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };

    const onResize = (): void => {
      resize();
      if (reduced) draw();
    };

    resize();
    start();

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [isDark, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
};
