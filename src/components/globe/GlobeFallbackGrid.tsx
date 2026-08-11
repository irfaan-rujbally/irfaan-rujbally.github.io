import { categoryLabels, categoryOrder } from '@/data/skills';
import { asset, cn } from '@/lib/cn';
import type { Skill } from '@/types';

type GlobeFallbackGridProps = {
  skills: Skill[];
  activeCategory: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/**
 * The no-WebGL / small-screen presentation. This is not a degraded state — it
 * has to stand on its own for a visitor on a locked-down laptop or a phone.
 */
export const GlobeFallbackGrid = ({
  skills,
  activeCategory,
  selectedId,
  onSelect,
}: GlobeFallbackGridProps) => {
  const groups = categoryOrder
    .map((category) => ({
      category,
      items: skills.filter((skill) => skill.category === category),
    }))
    .filter((group) => group.items.length > 0)
    .filter(
      (group) => activeCategory === 'all' || group.category === activeCategory,
    );

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.category}>
          <p className="mono-label mb-3 text-ink-faint">
            {categoryLabels[group.category]}
          </p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {group.items.map((skill) => (
              <li key={skill.id}>
                <button
                  type="button"
                  data-magnetic
                  onClick={() => onSelect(skill.id)}
                  aria-pressed={selectedId === skill.id}
                  className={cn(
                    'group flex w-full flex-col items-center gap-2 rounded-card border p-3',
                    'transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-200 ease-[var(--ease-standard)]',
                    selectedId === skill.id
                      ? 'border-accent bg-accent-soft/40 shadow-[var(--shadow-md)]'
                      : 'border-line bg-surface hover:-translate-y-1 hover:shadow-[var(--shadow-md)]',
                  )}
                >
                  <span className="grid size-10 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-110 dark:bg-white/92">
                    <img
                      src={asset(skill.icon)}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      className="size-7 object-contain"
                    />
                  </span>
                  <span className="text-center text-[0.6875rem] leading-tight font-medium text-ink-soft">
                    {skill.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
