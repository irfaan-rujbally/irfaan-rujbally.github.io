import { ArrowUpRight, GraduationCap, Landmark, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { education } from '@/data/education';
import { SectionShell } from '@/components/layout/SectionShell';
import { Reveal } from '@/components/ui/Reveal';
import { OrgLogo } from '@/components/ui/OrgLogo';

/** What the footer note is *about*, so the icon reads as meaning rather than decoration. */
const blurbIcons: Record<string, LucideIcon> = {
  polytech: GraduationCap,
  supinfo: Landmark,
  mcci: Users,
};

export const Education = () => (
  <SectionShell
    id="education"
    eyebrow="Education"
    heading="Trained in Mauritius and France."
  >
    {/* Two shared rows — card body, then footnote — so the footnote boxes line up
        across all three cards however the copy wraps. Browsers without subgrid
        fall back to auto rows, i.e. the boxes just size to their own content. */}
    <ul className="grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
      {education.map((degree, index) => {
        const BlurbIcon = blurbIcons[degree.id] ?? GraduationCap;

        return (
          <Reveal
            as="li"
            key={degree.id}
            delay={index * 0.08}
            className="md:row-span-2 md:grid md:grid-rows-subgrid"
          >
            <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-6 transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] md:row-span-2 md:grid md:grid-rows-subgrid">
              {/* The institution's own colour, kept low enough to stay a wash
                  rather than a panel — the card still reads as bg-surface. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(155deg, color-mix(in srgb, ${degree.accent} 11%, transparent), color-mix(in srgb, ${degree.accent} 4%, transparent) 45%, transparent 72%)`,
                }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, ${degree.accent}, color-mix(in srgb, ${degree.accent} 30%, transparent) 65%, transparent)`,
                }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, ${degree.accent} 10%, transparent), transparent 60%)`,
                }}
              />

              {/* Exactly one in-flow child per subgrid row: the body is row 1,
                  the footnote below is row 2. */}
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span className="mono-label rounded-full bg-accent-soft px-2.5 py-1 text-accent-deep">
                    {degree.start.split(' ')[1]}–{degree.end.split(' ')[1]}
                  </span>
                  <span className="shrink-0 [perspective:600px]">
                    {/* The disc stays white in both themes — several of these logos
                        are solid black and would vanish against the dark surface. */}
                    <span className="group/disc grid size-20 transform-3d place-items-center rounded-full bg-white ring-1 ring-line hover:animate-disc-flip">
                      <OrgLogo
                        name={degree.institution}
                        src={degree.logo}
                        size={48}
                        className="group-hover/disc:animate-disc-flip-face"
                      />
                    </span>
                  </span>
                </div>

                <p className="mt-5 text-caption font-medium text-accent">
                  {degree.credential}
                </p>
                <h3 className="mt-1 text-h3 text-ink">{degree.field}</h3>

                {degree.subtitle !== undefined ? (
                  <p className="mt-2.5 text-caption text-ink-faint">{degree.subtitle}</p>
                ) : null}

                <div className="mt-4 mb-auto">
                  {degree.institutionUrl !== undefined ? (
                    <a
                      data-magnetic
                      href={degree.institutionUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-0.5 text-caption font-medium text-accent hover:text-accent-deep hover:underline"
                    >
                      {degree.institution}
                      <ArrowUpRight className="size-3" strokeWidth={2} />
                    </a>
                  ) : (
                    <span className="text-caption font-medium text-ink">
                      {degree.institution}
                    </span>
                  )}
                  <p className="text-[0.75rem] text-ink-ghost">{degree.location}</p>
                </div>
              </div>

              <div className="relative mt-5 flex gap-3 rounded-xs border border-line bg-surface-sunk p-3.5">
                <BlurbIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  strokeWidth={1.75}
                />
                <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
                  {degree.blurb}
                </p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </ul>
  </SectionShell>
);
