export type Locale = 'en' | 'fr';

/** A value written once per language, side by side in the data files. */
export type Localized<T = string> = Record<Locale, T>;

const STORAGE_KEY = 'ir-locale';

const listeners = new Set<() => void>();

const isLocale = (value: string | null): value is Locale => value === 'en' || value === 'fr';

/* A ?lang= link wins, so a French URL can be shared; then the saved choice,
   then the browser's own language. */
const readInitial = (): Locale => {
  if (typeof window === 'undefined') return 'en';
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLocale(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* Blocked storage: fall through to the browser language. */
  }
  return window.navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
};

let current: Locale = readInitial();

const apply = (locale: Locale): void => {
  document.documentElement.lang = locale;
};

export const getLocale = (): Locale => current;

export const subscribeLocale = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setLocale = (locale: Locale): void => {
  if (locale === current) return;
  current = locale;
  apply(locale);
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* Private mode: the switch still applies for this visit. */
  }
  listeners.forEach((listener) => listener());
};

export const toggleLocale = (): void => setLocale(current === 'en' ? 'fr' : 'en');

if (typeof document !== 'undefined') apply(current);
