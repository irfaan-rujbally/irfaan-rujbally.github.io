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
 * Real company logos are copyrighted trademarks and could not be bundled here.
 * To use them instead: drop files in public/logos/org/<id>.svg and render an
 * <img> in place of this component. Keep them ≤32px, always beside the
 * organisation's name, and keep the footer trademark note.
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
