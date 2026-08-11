import { useEffect, useRef, useState } from 'react';
import { useHasFinePointer } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const MAGNET_RADIUS = 60;
const RING_LERP = 0.15;

/**
 * Dot + trailing ring. The ring eases toward the pointer and snaps toward
 * nearby [data-magnetic] targets. Desktop / fine-pointer only — never shown to
 * touch or keyboard users, and the native cursor is only hidden while active.
 */
export const Cursor = () => {
  const finePointer = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = finePointer && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.body.removeAttribute('data-custom-cursor');
      return undefined;
    }

    document.body.setAttribute('data-custom-cursor', 'on');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    let ringScale = 1;
    let targetScale = 1;
    let frame = 0;

    const onMove = (event: PointerEvent): void => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setVisible(true);

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-magnetic], a, button, input, textarea, select',
      );

      if (target === null || target === undefined) {
        targetScale = 1;
        return;
      }

      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - pointer.x;
      const dy = cy - pointer.y;

      if (Math.hypot(dx, dy) < MAGNET_RADIUS + Math.max(rect.width, rect.height) / 2) {
        targetScale = 1.9;
        pointer.x += dx * 0.22;
        pointer.y += dy * 0.22;
      } else {
        targetScale = 1;
      }
    };

    const onLeave = (): void => setVisible(false);
    const onDown = (): void => {
      targetScale = 0.75;
    };
    const onUp = (): void => {
      targetScale = 1;
    };

    const tick = (): void => {
      ring.x += (pointer.x - ring.x) * RING_LERP;
      ring.y += (pointer.y - ring.y) * RING_LERP;
      ringScale += (targetScale - ringScale) * 0.14;

      if (dotRef.current !== null) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current !== null) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.body.removeAttribute('data-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 250ms' }}
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 size-8 rounded-full border border-ink/25 will-change-transform"
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 size-[7px] rounded-full bg-accent will-change-transform"
      />
    </div>
  );
};
