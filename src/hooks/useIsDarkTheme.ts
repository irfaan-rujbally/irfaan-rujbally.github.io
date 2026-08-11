import { useEffect, useState } from 'react';

/**
 * Reads the `dark` class off <html>. Kept separate from useTheme so that
 * consumers can observe the theme without owning the toggle.
 */
export const useIsDarkTheme = (): boolean => {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    const root = document.documentElement;
    const update = (): void => setIsDark(root.classList.contains('dark'));

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};
