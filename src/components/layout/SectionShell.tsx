import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTheme } from '@/hooks/useTheme';
import { ScrambleText } from '@/components/fx/ScrambleText';
import { fadeUp, reducedFade, viewportOnce } from '@/lib/motionVariants';
import { cn } from '@/lib/cn';
import type { SectionId } from '@/types';

type SectionShellProps = {
  id: SectionId;
  eyebrow: string;
  heading: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const SectionShell = ({
  id,
  eyebrow,
  heading,
  intro,
  children,
  className,
  contentClassName,
}: SectionShellProps) => {
  const reduced = usePrefersReducedMotion();
  const { theme } = useTheme();
  const variants = reduced ? reducedFade : fadeUp;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('section-y relative', className)}
    >
      <div className="shell">
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={variants}
          className="mb-12 max-w-[46rem] sm:mb-16"
        >
          <p className="mono-label mb-4 flex items-center gap-2 text-accent">
            <span className="hairline-rule inline-block w-6" />
            {theme === 'starwars' && !reduced ? <ScrambleText text={eyebrow} /> : eyebrow}
          </p>
          <h2 id={headingId} className="text-h2 text-ink">
            {heading}
          </h2>
          {intro !== undefined ? (
            <p className="mt-4 max-w-[38rem] text-body-l text-ink-soft">{intro}</p>
          ) : null}
        </motion.header>

        <div className={cn(contentClassName)}>{children}</div>
      </div>
    </section>
  );
};
