import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

let lenisInstance: Lenis | null = null;

export const scrollToSection = (id: string): void => {
  const target = document.getElementById(id);
  if (target === null) return;

  if (lenisInstance !== null) {
    lenisInstance.scrollTo(target, { offset: -72 });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: 'smooth' });
};

export const useLenis = (): void => {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      lenisInstance = null;
      return undefined;
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenisInstance = lenis;

    let frame = 0;
    const raf = (time: number): void => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);
};
