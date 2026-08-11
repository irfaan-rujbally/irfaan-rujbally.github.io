import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[transform,background-color,border-color,color,box-shadow] duration-200 ' +
  'ease-[var(--ease-standard)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 ' +
  'whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[var(--shadow-md)] hover:bg-accent-deep hover:shadow-[var(--shadow-lg)] dark:text-canvas',
  secondary:
    'border border-line bg-surface text-ink hover:border-ink-ghost hover:bg-surface-sunk',
  ghost: 'text-ink-soft hover:bg-surface-sunk hover:text-ink',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
};

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    data-magnetic
    className={cn(base, variants[variant], sizes[size], className)}
    {...rest}
  >
    {children}
  </button>
);

export const ButtonLink = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: LinkProps) => (
  <a
    data-magnetic
    className={cn(base, variants[variant], sizes[size], className)}
    {...rest}
  >
    {children}
  </a>
);
