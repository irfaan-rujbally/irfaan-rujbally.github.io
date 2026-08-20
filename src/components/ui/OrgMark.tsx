import { useMemo } from 'react';
import { cn } from '@/lib/cn';

const initialsOf = (name: string): string =>
  name
    .replace(/[^\p{L}\p{N} ]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0 && !/^(ltd|the|of|de|du|la|le)$/i.test(word))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

/** Deterministic hue per organisation so marks are stable across reloads. */
const hueOf = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }
  return hash;
};

type OrgMarkProps = {
  name: string;
  size?: number;
  className?: string;
};

/**
 * A deliberate monogram, not a broken-image fallback.
 *
 * Real company logos are copyrighted trademarks, so only the ones deliberately
 * placed in public/logos/org/ are used. To show one, prefer <OrgLogo>, which
 * renders the file when it exists and falls back to this monogram when it does
 * not. Keep logos ≤40px, always beside the organisation's name, and keep the
 * footer trademark note.
 */
export const OrgMark = ({ name, size = 32, className }: OrgMarkProps) => {
  const { initials, hue } = useMemo(
    () => ({ initials: initialsOf(name), hue: hueOf(name) }),
    [name],
  );

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-[10px] border border-line',
        'font-mono font-semibold tracking-tight select-none',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color: `oklch(0.48 0.13 ${hue})`,
        background: `linear-gradient(140deg, oklch(0.97 0.02 ${hue}), oklch(0.93 0.045 ${hue}))`,
      }}
    >
      {initials}
    </span>
  );
};
