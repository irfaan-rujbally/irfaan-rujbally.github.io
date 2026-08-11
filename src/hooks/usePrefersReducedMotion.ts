import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
};

export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);
