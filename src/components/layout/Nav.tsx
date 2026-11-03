import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, Moon, Rocket, Sun, X } from 'lucide-react';
import { profile } from '@/data/profile';
import { scrollToSection } from '@/hooks/useLenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTheme } from '@/hooks/useTheme';
import { EASE_EXPO } from '@/lib/motionVariants';
import { cn } from '@/lib/cn';
import type { SectionId } from '@/types';

const LINKS: Array<{ id: SectionId; label: string }> = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
];

const MENU_LINKS: Array<{ id: SectionId; label: string }> = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

type NavProps = { active: SectionId };

export const Nav = ({ active }: NavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggle } = useTheme();
  const reduced = usePrefersReducedMotion();

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 40));

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id: SectionId): void => {
    setMenuOpen(false);
    window.setTimeout(() => scrollToSection(id), menuOpen ? 220 : 0);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 duration-400 ease-[var(--ease-standard)]',
          'transition-[padding,background-color,border-color,backdrop-filter]',
          scrolled ? 'glass border-b border-line/70 py-2' : 'border-b border-transparent py-4',
        )}
      >
        <nav aria-label="Primary" className="shell flex items-center justify-between gap-4">
          <button
            type="button"
            data-magnetic
            onClick={() => go('hero')}
            aria-label={`${profile.name} — back to top`}
            className="group flex items-center gap-2.5"
          >
            <span
              className="grid size-8 place-items-center rounded-[10px] font-mono text-[0.7rem] font-bold text-white shadow-[var(--shadow-sm)]"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-accent), var(--color-mint))',
              }}
            >
              {profile.initials}
            </span>
            <span className="hidden text-[0.9375rem] font-semibold tracking-tight text-ink sm:inline">
              {profile.firstName}
              <span className="text-ink-faint"> {profile.lastName}</span>
            </span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  data-magnetic
                  onClick={() => go(link.id)}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[0.875rem] font-medium transition-colors duration-200',
                    active === link.id ? 'text-ink' : 'text-ink-faint hover:text-ink',
                  )}
                >
                  {link.label}
                  {active === link.id ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-accent"
                      transition={{ duration: reduced ? 0 : 0.35, ease: EASE_EXPO }}
                    />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              data-magnetic
              onClick={toggle}
              aria-label={
                theme === 'starwars'
                  ? 'Leave Star Wars mode'
                  : `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`
              }
              className="grid size-9 place-items-center rounded-full text-ink-faint transition-colors duration-200 hover:bg-surface-sunk hover:text-ink"
            >
              {theme === 'starwars' ? (
                <Rocket className="size-[18px]" strokeWidth={1.8} />
              ) : theme === 'dark' ? (
                <Sun className="size-[18px]" strokeWidth={1.8} />
              ) : (
                <Moon className="size-[18px]" strokeWidth={1.8} />
              )}
            </button>

            <button
              type="button"
              data-magnetic
              onClick={() => go('contact')}
              className="hidden h-9 items-center rounded-full bg-ink px-4 text-[0.8125rem] font-medium text-canvas transition-transform duration-200 hover:scale-[1.03] active:scale-100 sm:inline-flex"
            >
              Let&rsquo;s talk
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-surface-sunk md:hidden"
            >
              <Menu className="size-5" strokeWidth={1.8} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="glass fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="shell flex h-16 items-center justify-end">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-full text-ink hover:bg-surface-sunk"
              >
                <X className="size-5" strokeWidth={1.8} />
              </button>
            </div>

            <ul className="shell mt-8 flex flex-col gap-1">
              {MENU_LINKS.map(
                (link, index) => (
                  <motion.li
                    key={link.id}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduced ? 0 : 0.06 + index * 0.05,
                      duration: 0.45,
                      ease: EASE_EXPO,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => go(link.id)}
                      className="w-full py-3 text-left text-[2rem] font-semibold tracking-tight text-ink"
                    >
                      {link.label}
                    </button>
                  </motion.li>
                ),
              )}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
