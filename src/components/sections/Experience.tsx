import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { experience } from '@/data/experience';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLocale } from '@/hooks/useLocale';
import { SectionShell } from '@/components/layout/SectionShell';
import { OrgMark } from '@/components/ui/OrgMark';
import { reducedFade, slideInLeft, viewportOnce } from '@/lib/motionVariants';
import { cn } from '@/lib/cn';
import type { Role } from '@/types';

type RoleCardProps = { role: Role; index: number; showYear: boolean };

const RoleCard = ({ role, index, showYear }: RoleCardProps) => {
  const reduced = usePrefersReducedMotion();
  const { t, l, month } = useLocale();
  const isInternship = role.type === 'internship';

  /* A tight hot arc rather than a slow fade: the colour is only near-full over
     about a twelfth of the sweep, which reads as one travelling light instead
     of two vague bright sides. Everything else sits at the normal border grey. */
  const orbit = `conic-gradient(from var(--border-angle) at 50% 50%, ${role.accent} 0%, ${role.accent} 3%, var(--color-line) 16%, var(--color-line) 84%, ${role.accent} 97%, ${role.accent} 100%)`;
  // Negative delay starts each card mid-cycle, so the eight lights drift apart
  // instead of pulsing in lockstep down the page.
  const orbitDelay = `${-index * 0.45}s`;

  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduced ? reducedFade : slideInLeft}
      transition={reduced ? undefined : { delay: Math.min(index, 5) * 0.06 }}
      className="relative grid gap-3 md:grid-cols-[6.5rem_1fr] md:gap-8"
    >
      {/* Year rail — only the first role of each year is labelled, so the
          column reads as a timeline rather than a repeated column of numbers. */}
      <div className="hidden md:block">
        {showYear ? (
          <span className="sticky top-28 block font-mono text-[1.375rem] leading-none font-semibold tracking-tight text-ink-ghost">
            {role.year}
          </span>
        ) : null}
      </div>

      <div className="group relative transition-transform duration-200 ease-[var(--ease-standard)] hover:-translate-y-1">
        {/* The halo. Same gradient and phase as the ring, but oversized and
            blurred, so the light bleeds past the card edge the way a real one
            would. Dialled up in dark mode, where there's contrast to carry it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 animate-border-orbit rounded-[calc(var(--radius-card)+0.25rem)] opacity-45 blur-[10px] dark:opacity-80"
          style={{ background: orbit, animationDelay: orbitDelay }}
        />

        {/* The ring: the gradient paints the whole box and the opaque card below
            covers all but the outer 2px. */}
        <div
          className="relative animate-border-orbit rounded-card p-[2px] transition-shadow duration-200 ease-[var(--ease-standard)] group-hover:shadow-[var(--shadow-lg)]"
          style={{ background: orbit, animationDelay: orbitDelay }}
        >
          <article
            className={cn(
              'relative rounded-[calc(var(--radius-card)-2px)] bg-surface transition-[background-color,color,opacity] duration-200 ease-[var(--ease-standard)]',
              isInternship ? 'p-4 sm:p-5' : 'p-5 sm:p-6',
            )}
          >
          {role.current ? (
            <span
              aria-hidden="true"
              className="absolute inset-y-4 left-0 w-[3px] rounded-full bg-accent"
            />
          ) : null}
        <span
          aria-hidden="true"
          className="absolute inset-x-5 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-300 group-hover:scale-x-100"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <OrgMark
              name={role.company}
              size={isInternship ? 26 : 32}
              className="mt-0.5 opacity-70 transition-opacity duration-200 group-hover:opacity-100"
            />
            <div className="min-w-0">
              <h3
                className={cn(
                  'text-ink',
                  isInternship ? 'text-[0.9375rem] font-semibold' : 'text-h3',
                )}
              >
                {l(role.title)}
              </h3>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                {role.companyUrl !== undefined ? (
                  <a
                    data-magnetic
                    href={role.companyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-0.5 text-caption font-medium text-accent hover:text-accent-deep hover:underline"
                  >
                    {role.company}
                    <ArrowUpRight className="size-3" strokeWidth={2} />
                  </a>
                ) : (
                  <span className="text-caption font-medium text-ink-soft">
                    {role.company}
                  </span>
                )}

                {role.current ? (
                  <span className="mono-label inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[0.5625rem] text-accent-deep">
                    <span className="size-1 rounded-full bg-live" />
                    {t.experience.current}
                  </span>
                ) : null}

                {isInternship ? (
                  <span className="mono-label rounded-full bg-surface-sunk px-2 py-0.5 text-[0.5625rem] text-ink-faint">
                    {t.experience.internship}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="shrink-0 sm:text-right">
            <p className="mono-label text-ink-faint">
              {month(role.start)} — {role.end !== undefined ? month(role.end) : t.experience.present}
            </p>
            <p className="mt-1 text-[0.75rem] text-ink-ghost">{l(role.location)}</p>
          </div>
        </div>

        {!isInternship ? (
          <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {l(role.highlights).map((highlight) => (
              <li
                key={highlight}
                className="flex gap-2.5 text-caption text-ink-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.5em] size-1 shrink-0 rounded-full bg-ink-ghost"
                />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}
          </article>
        </div>
      </div>
    </motion.li>
  );
};

export const Experience = () => {
  const { t } = useLocale();

  return (
  <SectionShell
    id="experience"
    eyebrow={t.experience.eyebrow}
    heading={t.experience.heading}
    intro={t.experience.intro}
  >
    <ol className="flex max-w-5xl flex-col gap-4">
      {experience.map((role, index) => (
        <RoleCard
          key={role.id}
          role={role}
          index={index}
          showYear={index === 0 || experience[index - 1].year !== role.year}
        />
      ))}
    </ol>
  </SectionShell>
  );
};
