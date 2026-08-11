import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ChipProps = {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'accent' | 'live';
};

export const Chip = ({ children, className, tone = 'neutral' }: ChipProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium',
      tone === 'neutral' && 'bg-surface-sunk text-ink-soft',
      tone === 'accent' && 'bg-accent-soft text-accent-deep',
      tone === 'live' && 'bg-surface-sunk text-ink-soft',
      className,
    )}
  >
    {children}
  </span>
);

type FilterChipProps = {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
};

export const FilterChip = ({
  children,
  active,
  onClick,
  className,
}: FilterChipProps) => (
  <button
    type="button"
    data-magnetic
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      'rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium',
      'transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-200 ease-[var(--ease-standard)]',
      active
        ? 'border-accent bg-accent text-white shadow-[var(--shadow-sm)] dark:text-canvas'
        : 'border-line bg-surface text-ink-soft hover:border-ink-ghost hover:text-ink',
      className,
    )}
  >
    {children}
  </button>
);
