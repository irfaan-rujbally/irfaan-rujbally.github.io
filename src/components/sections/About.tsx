import { MapPin, Mountain, Code2, Waves, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { profile } from '@/data/profile';
import { SectionShell } from '@/components/layout/SectionShell';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/cn';

const INTEREST_ICONS: Record<string, LucideIcon> = {
  Football: Trophy,
  'Web Development': Code2,
  Diving: Waves,
  Hiking: Mountain,
};

const FACTS: Array<{ label: string; value: string }> = [
  { label: 'Based in', value: profile.location },
  {
    label: 'Languages',
    value: profile.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(' · '),
  },
  { label: 'Education', value: "MSc MIAGE — Polytech Lyon, France" },
  { label: 'Experience', value: 'Since 2015 — Mauritius & France' },
];

export const About = () => (
  <SectionShell
    id="about"
    eyebrow="About"
    heading="Ten years of building things that have to keep working."
  >
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-panel blur-2xl"
            style={{
              background:
                'radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 70%)',
            }}
          />

          {profile.portraitSrc !== '' ? (
            <img
              src={asset(profile.portraitSrc)}
              alt={`${profile.name}, software engineer`}
              width={640}
              height={800}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-panel border border-line object-cover shadow-[var(--shadow-lg)]"
            />
          ) : (
            <div className="grid aspect-[4/5] w-full place-items-center rounded-panel border border-dashed border-line bg-surface-sunk text-center shadow-[var(--shadow-md)]">
              <div className="px-6">
                <span
                  className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl font-mono text-xl font-bold text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-accent), var(--color-mint))',
                  }}
                >
                  {profile.initials}
                </span>
                <p className="mono-label text-ink-faint">Portrait pending</p>
                <p className="mt-2 text-caption text-ink-ghost">
                  Add a photo to <code className="font-mono">public/img/</code> and
                  set <code className="font-mono">portraitSrc</code>.
                </p>
              </div>
            </div>
          )}

          <div className="glass mt-4 flex items-center gap-2.5 rounded-card px-4 py-3 shadow-[var(--shadow-sm)]">
            <MapPin className="size-4 shrink-0 text-accent" strokeWidth={1.9} />
            <span className="text-caption text-ink-soft">
              {profile.location} · {profile.timezone}
            </span>
          </div>
        </div>
      </Reveal>

      <div className="lg:col-span-7">
        <div className="flex flex-col gap-5">
          {profile.about.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={index * 0.08}>
              <p className="max-w-[62ch] text-body-l text-ink-soft">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.24}>
          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-8 sm:grid-cols-2">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="mono-label mb-1 text-ink-faint">{fact.label}</dt>
                <dd className="text-caption text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8">
            <p className="mono-label mb-3 text-ink-faint">Outside work</p>
            <ul className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => {
                const Icon = INTEREST_ICONS[interest] ?? Code2;
                return (
                  <li key={interest}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-soft">
                      <Icon className="size-3.5 text-accent" strokeWidth={1.8} />
                      {interest}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  </SectionShell>
);
