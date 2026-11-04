import { scrollToSection } from '@/hooks/useLenis';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/cn';
import type { SectionId } from '@/types';

const ITEMS: SectionId[] = ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'contact'];

type SectionIndexProps = { active: SectionId };

export const SectionIndex = ({ active }: SectionIndexProps) => {
  const { t } = useLocale();

  return (
  <nav
    aria-label={t.nav.sectionIndex}
    className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 lg:block"
  >
    <ul className="flex flex-col items-end gap-3">
      {ITEMS.map((id) => ({ id, label: t.sections[id] })).map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => scrollToSection(item.id)}
            aria-label={t.nav.goTo(item.label)}
            aria-current={active === item.id ? 'true' : undefined}
            className="group flex items-center gap-2"
          >
            <span
              className={cn(
                'mono-label text-[0.625rem] text-ink-faint opacity-0 transition-opacity duration-200',
                'group-hover:opacity-100 group-focus-visible:opacity-100',
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                'block rounded-full transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-300 ease-[var(--ease-expo)]',
                active === item.id
                  ? 'h-5 w-[3px] bg-accent'
                  : 'h-[3px] w-[3px] bg-ink-ghost group-hover:bg-ink-soft',
              )}
            />
          </button>
        </li>
      ))}
    </ul>
  </nav>
  );
};
