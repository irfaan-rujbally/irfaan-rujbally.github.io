import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { maskedChar, staggerParent } from '@/lib/motionVariants';
import { cn } from '@/lib/cn';

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  /** Rendered as one word per line-safe group so long names wrap cleanly. */
  stagger?: number;
};

/**
 * Splits into characters, masks each behind its own overflow-hidden wrapper and
 * slides them up. The whole string stays in the accessibility tree as one label.
 */
export const TextReveal = ({
  text,
  className,
  delay = 0,
  stagger = 0.03,
}: TextRevealProps) => {
  const reduced = usePrefersReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  let charIndex = 0;

  return (
    <motion.span
      aria-label={text}
      className={cn('inline-block', className)}
      initial="hidden"
      animate="visible"
      variants={staggerParent(stagger, delay)}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
        >
          {[...word].map((char) => {
            charIndex += 1;
            return (
              <span
                key={`${char}-${charIndex}`}
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
              >
                <motion.span className="inline-block" variants={maskedChar}>
                  {char}
                </motion.span>
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? (
            <span className="inline-block">&nbsp;</span>
          ) : null}
        </span>
      ))}
    </motion.span>
  );
};
