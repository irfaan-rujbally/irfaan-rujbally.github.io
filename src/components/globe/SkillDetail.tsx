import { AnimatePresence, motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLocale } from '@/hooks/useLocale';
import { EASE_EXPO } from '@/lib/motionVariants';
import { asset } from '@/lib/cn';
import type { Skill } from '@/types';

type SkillDetailProps = {
  skill: Skill | null;
  pinned: boolean;
};

export const SkillDetail = ({ skill, pinned }: SkillDetailProps) => {
  const reduced = usePrefersReducedMotion();
  const { t, l } = useLocale();

  return (
    <div className="min-h-[7rem]">
      <AnimatePresence mode="wait" initial={false}>
        {skill === null ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-card border border-dashed border-line px-5 py-6 text-caption text-ink-faint"
          >
            {t.skills.emptyDetail}
          </motion.p>
        ) : (
          <motion.div
            key={skill.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE_EXPO }}
            className="rounded-card border border-line bg-surface p-5 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl dark:bg-white/92">
                <img
                  src={asset(skill.icon)}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-h3 text-ink">{skill.name}</h3>
                  {pinned ? (
                    <span className="mono-label rounded-full bg-accent-soft px-2 py-0.5 text-[0.5625rem] text-accent-deep">
                      {t.skills.pinned}
                    </span>
                  ) : null}
                </div>
                <p className="mono-label mt-0.5 text-ink-faint">
                  {t.skills.categories[skill.category]}
                </p>
                {l(skill.note) !== '' ? (
                  <p className="mt-2.5 text-caption text-ink-soft">{l(skill.note)}</p>
                ) : null}

                {/* yearsOfUse of 0 means "not yet confirmed" — hide rather than
                    render a meaningless "0 years". */}
                {skill.yearsOfUse > 0 ? (
                  <div className="mt-3.5">
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="mono-label text-ink-faint">{t.skills.experience}</span>
                      <span className="font-mono text-[0.75rem] font-medium text-ink">
                        {t.skills.years(skill.yearsOfUse)}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-surface-sunk">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, (skill.yearsOfUse / 10) * 100)}%`,
                        }}
                        transition={{ duration: reduced ? 0 : 0.6, ease: EASE_EXPO }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
