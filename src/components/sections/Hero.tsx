import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { profile } from '@/data/profile';
import { scrollToSection } from '@/hooks/useLenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLocale } from '@/hooks/useLocale';
import { MeshGradient } from '@/components/fx/MeshGradient';
import { HeroOrbit } from '@/components/fx/HeroOrbit';
import { TextReveal } from '@/components/fx/TextReveal';
import { RoleRotator } from '@/components/fx/RoleRotator';
import { CountUp } from '@/components/fx/CountUp';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EASE_EXPO } from '@/lib/motionVariants';
import { asset } from '@/lib/cn';

export const Hero = () => {
  const reduced = usePrefersReducedMotion();
  const { t, l } = useLocale();

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduced ? 0 : delay, duration: 0.8, ease: EASE_EXPO },
  });

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      <MeshGradient />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[-6%] hidden w-[42vw] max-w-[520px] -translate-y-[54%] lg:block xl:right-[2%]"
      >
        <HeroOrbit />
      </div>

      <div className="shell relative">
        <motion.div {...rise(0.05)}>
          <span className="glass mono-label inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-ink-soft shadow-[var(--shadow-sm)]">
            <span
              className="size-1.5 rounded-full bg-live"
              style={{ animation: reduced ? undefined : 'pulse-dot 2.2s ease-in-out infinite' }}
            />
            {l(profile.availability)}
            <span className="hidden sm:inline">
              {' '}
              — {t.hero.region} ({profile.timezone})
            </span>
          </span>
        </motion.div>

        <h1
          id="hero-heading"
          className="mt-7 max-w-[16ch] text-display text-ink lg:max-w-[10ch]"
        >
          <TextReveal text={profile.firstName} delay={0.15} />{' '}
          <span className="block sm:inline">
            <TextReveal text={profile.lastName} delay={0.32} />
          </span>
        </h1>

        <motion.p
          {...rise(0.55)}
          className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-h2 text-ink-faint"
        >
          <span className="text-ink-ghost">{t.hero.iAmA}</span>
          <RoleRotator roles={l(profile.roles)} className="text-accent" />
        </motion.p>

        <motion.p
          {...rise(0.68)}
          className="mt-7 max-w-[42ch] text-body-l text-ink-soft"
        >
          {l(profile.heroLine)}
        </motion.p>

        <motion.div {...rise(0.8)} className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => scrollToSection('projects')}>
            {t.hero.seeWork}
            <ArrowUpRight className="size-[18px]" strokeWidth={2} />
          </Button>
          <ButtonLink
            variant="secondary"
            size="lg"
            href={asset(l(profile.cvPath))}
            download
          >
            <Download className="size-[18px]" strokeWidth={1.8} />
            {t.hero.downloadCv}
          </ButtonLink>
        </motion.div>

        <motion.dl
          {...rise(0.95)}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
        >
          {profile.stats.map((stat) => (
            <div key={stat.value + stat.label.en} className="border-l border-line pl-4">
              <dt className="mono-label mb-1.5 text-ink-faint">{l(stat.label)}</dt>
              <dd className="font-mono text-[1.75rem] leading-none font-semibold tracking-tight text-ink">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToSection('about')}
        aria-label={t.hero.scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-ghost transition-colors hover:text-ink-soft sm:flex"
      >
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            style={{ animation: reduced ? undefined : 'scroll-cue 2.4s ease-in-out infinite' }}
          />
        </span>
        <ArrowDown className="size-3.5" strokeWidth={1.8} />
      </motion.button>
    </section>
  );
};
