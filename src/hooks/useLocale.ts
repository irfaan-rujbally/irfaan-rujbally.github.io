import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  getLocale,
  subscribeLocale,
  toggleLocale,
  type Locale,
  type Localized,
} from '@/i18n/localeStore';
import { ui, type UiStrings } from '@/i18n/ui';

const MONTH_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric', timeZone: 'UTC' };

/* Shared by every component that reads the language, so the store is the one
   source of truth and a switch re-renders the whole page in place. */
export const useLocale = (): {
  locale: Locale;
  t: UiStrings;
  l: <T>(value: Localized<T>) => T;
  month: (isoMonth: string) => string;
  toggle: () => void;
} => {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, () => 'en' as const);

  const l = useCallback(<T,>(value: Localized<T>): T => value[locale], [locale]);

  /** "2024-10" → "Oct 2024" / "oct. 2024". */
  const month = useCallback(
    (isoMonth: string): string => {
      const [year, monthIndex] = isoMonth.split('-').map(Number);
      return new Intl.DateTimeFormat(locale, MONTH_FORMAT).format(
        new Date(Date.UTC(year, monthIndex - 1, 1)),
      );
    },
    [locale],
  );

  return { locale, t: ui[locale], l, month, toggle: toggleLocale };
};

/** Keeps the tab title and meta description in the current language. */
export const useDocumentMeta = (): void => {
  const { t } = useLocale();
  useEffect(() => {
    document.title = t.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.meta.description);
  }, [t]);
};
