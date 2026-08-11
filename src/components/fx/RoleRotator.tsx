import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EASE_EXPO } from '@/lib/motionVariants';
import { cn } from '@/lib/cn';

type RoleRotatorProps = {
  roles: readonly string[];
  interval?: number;
  className?: string;
};

/**
 * Height-stable mask + slide. Deliberately not a blinking-caret typewriter —
 * that effect reads dated and causes layout shift on every keystroke.
 */
export const RoleRotator = ({
  roles,
  interval = 2600,
  className,
}: RoleRotatorProps) => {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || roles.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % roles.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [reduced, roles.length, interval]);

  const longest = roles.reduce((a, b) => (a.length >= b.length ? a : b), '');

  return (
    <span className={cn('relative inline-grid overflow-hidden align-bottom', className)}>
      {/* Invisible sizer keeps the box from resizing as the text changes. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longest}
      </span>

      <span className="col-start-1 row-start-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={roles[index]}
            className="inline-block whitespace-nowrap"
            initial={reduced ? { opacity: 0 } : { y: '110%', opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: '-110%', opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE_EXPO }}
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};
