import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks whether an element is currently near the viewport. Used to pause the
 * WebGL render loop when the globe is off-screen — the biggest single win for
 * battery life and scroll smoothness.
 */
export const useInViewport = <T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = '200px',
): boolean => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
};
