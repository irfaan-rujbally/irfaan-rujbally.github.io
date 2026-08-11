import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { fadeUp, reducedFade, viewportOnce } from '@/lib/motionVariants';
import { cn } from '@/lib/cn';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
};

export const Reveal = ({
  children,
  delay = 0,
  className,
  as = 'div',
}: RevealProps) => {
  const reduced = usePrefersReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduced ? reducedFade : fadeUp}
      transition={reduced ? undefined : { delay }}
    >
      {children}
    </Comp>
  );
};
