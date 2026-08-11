import { useSyncExternalStore } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const subscribe = (callback: () => void): (() => void) => {
    if (typeof window === 'undefined') return () => undefined;
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };

  const getSnapshot = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};

export const useIsMobile = (): boolean => useMediaQuery('(max-width: 639px)');

export const useHasFinePointer = (): boolean =>
  useMediaQuery('(pointer: fine) and (hover: hover)');
