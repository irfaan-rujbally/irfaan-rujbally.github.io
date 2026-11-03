import { useSyncExternalStore } from 'react';
import {
  getTheme,
  subscribeTheme,
  toggleLightDark,
  toggleStarWars,
  type Theme,
} from '@/lib/themeStore';

export type { Theme };

/* Backed by a module store so the nav toggle and the spaceship share one theme. */
export const useTheme = (): {
  theme: Theme;
  toggle: () => void;
  toggleStarWars: () => void;
} => {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'light' as const);
  return { theme, toggle: toggleLightDark, toggleStarWars };
};
