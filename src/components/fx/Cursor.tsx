import { useEffect, useMemo, useRef, useState } from 'react';
import { useHasFinePointer } from '@/hooks/useMediaQuery';
import { useIsDarkTheme } from '@/hooks/useIsDarkTheme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/*
 * Comet-trail cursor: a chain of circles that lag behind the pointer, each a
 * little smaller and dimmer than the one ahead of it.
 *
 * The constants below were measured off the reference implementation rather
 * than guessed — 30 dots, an 8px head tapering to ~3.6px, and a per-frame lerp
 * of 0.49 fitted against its actual catch-up curve. Changing COUNT alone keeps
 * the taper intact because every ramp is expressed over (COUNT - 1).
 */
const COUNT = 30;
const LERP = 0.49;

const HEAD_SIZE = 8;
const TAIL_SIZE = 3.65;
const HEAD_BLUR = 6.4;
const TAIL_BLUR = 2.92;
const HEAD_ALPHA = 0.15;
const TAIL_ALPHA = 0.02;

/*
 * Two palettes because the effect is built on blend modes, and no single one
 * works on both themes: `screen` lightens, so it glows on near-black but goes
 * invisible on the light theme's #fafafa. Light mode therefore darkens with
 * `multiply` and a deeper amber, which keeps the warm comet read at a similar
 * strength against a pale background.
 *
 * `gain` scales the measured alphas. Dark sits above 1 because `screen` over a
 * near-black page returns the source colour unchanged, where the reference's
 * lighter background lifted it — same numbers, dimmer result. Both values are
 * tuned so the trail reads at the reference's strength, not to match it on paper.
 */
const PALETTE = {
  dark: { blend: 'screen', glow: '255, 200, 120', lo: '150, 100, 50', hi: '255, 220, 150', gain: 1.7 },
  light: { blend: 'multiply', glow: '190, 110, 20', lo: '120, 70, 10', hi: '210, 150, 60', gain: 2.6 },
} as const;

const lerpValue = (from: number, to: number, t: number): number => from + (to - from) * t;

export const Cursor = () => {
  const finePointer = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const isDark = useIsDarkTheme();
  const enabled = finePointer && !reduced;

  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [visible, setVisible] = useState(false);

  // Per-dot appearance. Independent of position, so it is only recomputed when
  // the theme flips — the animation loop never touches these.
  const dots = useMemo(() => {
    const palette = isDark ? PALETTE.dark : PALETTE.light;

    return Array.from({ length: COUNT }, (_, i) => {
      const t = i / (COUNT - 1);
      const size = lerpValue(HEAD_SIZE, TAIL_SIZE, t);
      const blur = lerpValue(HEAD_BLUR, TAIL_BLUR, t);
      const alpha = lerpValue(HEAD_ALPHA, TAIL_ALPHA, t) * palette.gain;

      return {
        size,
        mixBlendMode: palette.blend,
        boxShadow: [
          `0 0 ${blur.toFixed(2)}px rgba(${palette.glow}, ${alpha.toFixed(3)})`,
          `inset -1px -1px 2px rgba(${palette.lo}, ${(alpha * 0.67).toFixed(3)})`,
          `inset 1px 1px 2px rgba(${palette.hi}, ${alpha.toFixed(3)})`,
        ].join(', '),
      };
    });
  }, [isDark]);

  useEffect(() => {
    if (!enabled) return undefined;

    const start = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pointer = { ...start };
    const trail = Array.from({ length: COUNT }, () => ({ ...start }));

    let frame = 0;
    let running = false;

    const draw = (): void => {
      for (let i = 0; i < COUNT; i++) {
        const node = dotRefs.current[i];
        if (node === null || node === undefined) continue;
        const { x, y } = trail[i];
        node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = (): void => {
      trail[0].x = pointer.x;
      trail[0].y = pointer.y;

      // Each dot chases the one ahead of it; the compounding lag is what makes
      // the tail curve rather than follow a straight line.
      let settled = true;
      for (let i = 1; i < COUNT; i++) {
        const dx = trail[i - 1].x - trail[i].x;
        const dy = trail[i - 1].y - trail[i].y;
        trail[i].x += dx * LERP;
        trail[i].y += dy * LERP;
        if (settled && Math.abs(dx) + Math.abs(dy) > 0.1) settled = false;
      }

      draw();

      // Park the loop once the tail has caught up. It restarts on the next
      // move, so an idle pointer costs no frames.
      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = (): void => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent): void => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setVisible(true);
      wake();
    };

    const onLeave = (): void => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 250ms' }}
    >
      {dots.map((dot, i) => (
        <div
          key={i}
          ref={(node) => {
            dotRefs.current[i] = node;
          }}
          className="absolute top-0 left-0 rounded-full will-change-transform"
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            boxShadow: dot.boxShadow,
            mixBlendMode: dot.mixBlendMode,
          }}
        />
      ))}
    </div>
  );
};
