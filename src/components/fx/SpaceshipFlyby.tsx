import { Suspense, lazy, useEffect, useState } from 'react';
import { GlobeErrorBoundary } from '@/components/globe/GlobeErrorBoundary';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SpaceshipCanvas = lazy(() => import('./SpaceshipCanvas'));

/*
 * A ship flying loops behind the page content. Decorative only, so it waits
 * until the page has loaded and gone idle before pulling in the model, and
 * never renders for reduced motion.
 */
export const SpaceshipFlyby = () => {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const start = (): void => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 3000 });
      } else {
        timeoutId = window.setTimeout(() => setReady(true), 1200);
      }
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      window.removeEventListener('load', start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [reduced]);

  if (reduced || !ready) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5]">
      <GlobeErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <SpaceshipCanvas />
        </Suspense>
      </GlobeErrorBoundary>
    </div>
  );
};
