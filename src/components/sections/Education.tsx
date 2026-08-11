import { ArrowUpRight } from 'lucide-react';
import { education } from '@/data/education';
import { SectionShell } from '@/components/layout/SectionShell';
import { Reveal } from '@/components/ui/Reveal';
import { OrgMark } from '@/components/ui/OrgMark';

export const Education = () => (
  <SectionShell
    id="education"
    eyebrow="Education"
    heading="Trained in Mauritius and France."
  >
    <ul className="grid gap-4 md:grid-cols-3">
      {education.map((degree, index) => (
        <Reveal as="li" key={degree.id} delay={index * 0.08}>
          <article className="group relative flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 60%)',
              }}
            />

            <div className="flex items-center justify-between gap-3">
              <OrgMark name={degree.institution} size={36} />
              <span className="mono-label text-ink-faint">
                {degree.start.split(' ')[1]}—{degree.end.split(' ')[1]}
              </span>
            </div>

            <h3 className="mt-5 text-h3 text-ink">{degree.title}</h3>
            {degree.subtitle !== undefined ? (
              <p className="mt-1.5 text-caption text-ink-faint">{degree.subtitle}</p>
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

            <p className="mt-4 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-ink-soft">
              {degree.blurb}
            </p>
          </article>
        </Reveal>
      ))}
    </ul>
  </SectionShell>
);
