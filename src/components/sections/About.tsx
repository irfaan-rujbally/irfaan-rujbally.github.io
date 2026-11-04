import { MapPin, Mountain, Code2, Waves, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { profile } from '@/data/profile';
import { SectionShell } from '@/components/layout/SectionShell';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTheme } from '@/hooks/useTheme';
import { useLocale } from '@/hooks/useLocale';

const INTEREST_ICONS: Record<string, LucideIcon> = {
  football: Trophy,
  webdev: Code2,
  diving: Waves,
  hiking: Mountain,
};

export const About = () => {
  const reduced = usePrefersReducedMotion();
  const { theme } = useTheme();
  const { t, l } = useLocale();

  const facts: Array<{ label: string; value: string }> = [
    { label: t.about.basedIn, value: l(profile.location) },
    {
      label: t.about.languages,
      value: profile.languages
        .map((language) => `${l(language.name)} (${l(language.level)})`)
        .join(' · '),
    },
    { label: t.about.education, value: t.about.educationValue },
    { label: t.about.experience, value: t.about.experienceValue },
  ];

  return (
  <SectionShell
    id="about"
    eyebrow={t.about.eyebrow}
    heading={t.about.heading}
  >
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <motion.div
          className="relative"
          initial={reduced ? { opacity: 0 } : { opacity: 0, rotateY: -18, rotateZ: -2 }}
          whileInView={{ opacity: 1, rotateY: 0, rotateZ: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0.2 : 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200, transformOrigin: 'center center' }}
        >
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
              src={asset(
                theme === 'starwars' ? profile.starWarsPortraitSrc : profile.portraitSrc,
              )}
              alt={t.about.portraitAlt(profile.name)}
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
                <p className="mono-label text-ink-faint">{t.about.portraitPending}</p>
                <p className="mt-2 text-caption text-ink-ghost">
                  {t.about.portraitPendingHint}
                </p>
              </div>
            </div>
          )}

          <div className="glass mt-4 flex items-center gap-2.5 rounded-card px-4 py-3 shadow-[var(--shadow-sm)]">
            <MapPin className="size-4 shrink-0 text-accent" strokeWidth={1.9} />
            <span className="text-caption text-ink-soft">
              {l(profile.location)} · {profile.timezone}
            </span>
          </div>
        </motion.div>
      </Reveal>

      <div className="lg:col-span-7">
        <div className="flex flex-col gap-5">
          {l(profile.about).map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={index * 0.08}>
              <p className="max-w-[62ch] text-body-l text-ink-soft">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.24}>
          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-8 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="mono-label mb-1 text-ink-faint">{fact.label}</dt>
                <dd className="text-caption text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8">
            <p className="mono-label mb-3 text-ink-faint">{t.about.outsideWork}</p>
            <ul className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => {
                const Icon = INTEREST_ICONS[interest.id] ?? Code2;
                return (
                  <li key={interest.id}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-soft">
                      <Icon className="size-3.5 text-accent" strokeWidth={1.8} />
                      {l(interest.label)}
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
};
