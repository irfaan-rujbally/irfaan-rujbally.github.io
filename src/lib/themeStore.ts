export type Theme = 'light' | 'dark' | 'starwars';
type BaseTheme = Exclude<Theme, 'starwars'>;

const STORAGE_KEY = 'ir-theme';
const PREVIOUS_KEY = 'ir-theme-before-starwars';

const listeners = new Set<() => void>();

const readStored = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStored = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Private mode or blocked storage: the theme still applies, it just won't persist. */
  }
};

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark' || value === 'starwars';

const readInitial = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const stored = readStored(STORAGE_KEY);
  if (isTheme(stored)) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

let current: Theme = readInitial();
let previous: BaseTheme = readStored(PREVIOUS_KEY) === 'light' ? 'light' : 'dark';

/* Star Wars mode is a dark theme with its own palette on top, so every existing
   `dark:` variant keeps working and only the tokens it overrides change. */
const apply = (theme: Theme): void => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme !== 'light');
  root.classList.toggle('starwars', theme === 'starwars');
  root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
};

export const getTheme = (): Theme => current;

export const subscribeTheme = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setTheme = (theme: Theme): void => {
  if (theme === current) return;
  if (theme === 'starwars' && current !== 'starwars') {
    previous = current;
    writeStored(PREVIOUS_KEY, previous);
  }
  current = theme;
  apply(theme);
  writeStored(STORAGE_KEY, theme);
  listeners.forEach((listener) => listener());
};

export const toggleLightDark = (): void =>
  setTheme(current === 'starwars' ? previous : current === 'dark' ? 'light' : 'dark');

export const toggleStarWars = (): void =>
  setTheme(current === 'starwars' ? previous : 'starwars');

if (typeof document !== 'undefined') apply(current);
