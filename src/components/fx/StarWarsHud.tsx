import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getScrollVelocity, startScrollSpeed } from '@/lib/scrollSpeed';
import type { SectionId } from '@/types';
import { SECTION_ORDER } from './ship/choreography';
import { telemetry } from './ship/telemetry';

const BOOT_LINE_MS = 420;
const BOOT_HOLD_MS = 2600;

const pad = (n: number, width = 2): string => String(n).padStart(width, '0');

/*
 * Star Wars mode cockpit overlay: a boot log when the mode starts, live
 * telemetry bottom left, the section counter bottom right, and lock brackets
 * that follow the Falcon. Numbers are written straight into the DOM from a
 * frame loop; routing sixty updates a second through React state would only
 * re-render this tree for nothing.
 */
export const StarWarsHud = ({ active }: { active: SectionId }) => {
  const { t } = useLocale();
  const reduced = usePrefersReducedMotion();
  const speedRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLSpanElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const [bootLines, setBootLines] = useState(0);
  const [booting, setBooting] = useState(!reduced);

  useEffect(startScrollSpeed, []);

  useEffect(() => {
    if (reduced) return undefined;
    const timers = t.hud.boot.map((_, index) =>
      window.setTimeout(() => setBootLines(index + 1), BOOT_LINE_MS * (index + 1)),
    );
    timers.push(window.setTimeout(() => setBooting(false), BOOT_LINE_MS * t.hud.boot.length + BOOT_HOLD_MS));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reduced, t.hud.boot]);

  useEffect(() => {
    let frame = 0;
    const tick = (): void => {
      const speed = 0.01 + Math.min(0.98, Math.abs(getScrollVelocity()) / 12000);
      if (speedRef.current !== null) speedRef.current.textContent = `${speed.toFixed(2)}C`;
      if (headingRef.current !== null) headingRef.current.textContent = `${pad(telemetry.heading, 3)}°`;

      const lock = lockRef.current;
      const { x, y, size, visible } = telemetry.screen;
      if (lock !== null) {
        const box = Math.max(90, Math.min(size, 420));
        lock.style.opacity = visible ? '1' : '0';
        lock.style.width = `${box}px`;
        lock.style.height = `${box * 0.62}px`;
        lock.style.transform = `translate(${x - box / 2}px, ${y - box * 0.31}px)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const index = Math.max(0, SECTION_ORDER.indexOf(active));
  const corner = 'absolute size-3 border-accent';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 font-mono text-[0.625rem] tracking-[0.12em] uppercase"
    >
      <div
        ref={lockRef}
        className="absolute top-0 left-0 hidden opacity-0 transition-opacity duration-500 md:block"
      >
        <span className={`${corner} top-0 left-0 border-t border-l`} />
        <span className={`${corner} top-0 right-0 border-t border-r`} />
        <span className={`${corner} bottom-0 left-0 border-b border-l`} />
        <span className={`${corner} right-0 bottom-0 border-r border-b`} />
        <span className="absolute -top-5 left-0 whitespace-nowrap text-accent">{t.hud.lock}</span>
        <span className="absolute right-0 -bottom-5 whitespace-nowrap text-ink-faint">{t.hud.rollHint}</span>
      </div>

      {booting ? (
        <div className="absolute top-20 left-5 flex flex-col gap-1">
          {t.hud.boot.slice(0, bootLines).map((line) => (
            <span key={line} className={line.startsWith('[') ? 'text-accent' : 'text-ink-soft'}>
              {line}
            </span>
          ))}
        </div>
      ) : null}

      <div className="absolute bottom-4 left-5 hidden text-ink-faint sm:block">
        <span>
          SPD <span ref={speedRef}>0.01C</span> · HDG <span ref={headingRef}>000°</span> · SECT{' '}
          {pad(index + 1)}
        </span>
      </div>

      <div className="absolute right-5 bottom-4 text-ink-faint">
        <span className="text-accent">{pad(index + 1)}</span>/{pad(SECTION_ORDER.length)} ·{' '}
        {t.sections[active]}
      </div>
    </div>
  );
};
