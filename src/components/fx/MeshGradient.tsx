import { motion, useScroll, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Two blurred colour fields plus a faint dot grid. This is the entire "futurist"
 * atmosphere — no images, no canvas, negligible cost. Deliberately restrained:
 * the page should read as white with colour in the corners, not as a blue wash.
 */
export const MeshGradient = () => {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const blobAY = useTransform(scrollYProgress, [0, 0.4], ['0%', '30%']);
  const blobBY = useTransform(scrollYProgress, [0, 0.4], ['0%', '-20%']);
  const fade = useTransform(scrollYProgress, [0, 0.35], [1, 0.2]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={reduced ? undefined : { y: blobAY, opacity: fade }}
        className="absolute -top-[26%] -left-[14%] h-[42vw] max-h-[560px] min-h-[300px] w-[42vw] max-w-[560px] min-w-[300px]"
      >
        <div
          className="size-full rounded-full blur-[90px]"
          style={{
            background:
              'radial-gradient(circle at 40% 40%, color-mix(in srgb, var(--color-accent) 26%, transparent), transparent 66%)',
            animation: reduced ? undefined : 'drift-a 22s ease-in-out infinite',
          }}
        />
      </motion.div>

      <motion.div
        style={reduced ? undefined : { y: blobBY, opacity: fade }}
        className="absolute -top-[18%] right-[-16%] h-[40vw] max-h-[520px] min-h-[280px] w-[40vw] max-w-[520px] min-w-[280px]"
      >
        <div
          className="size-full rounded-full blur-[100px]"
          style={{
            background:
              'radial-gradient(circle at 55% 45%, color-mix(in srgb, var(--color-mint) 22%, transparent), transparent 68%)',
            animation: reduced ? undefined : 'drift-b 26s ease-in-out infinite',
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--color-ink) 24%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.045,
          maskImage:
            'radial-gradient(ellipse 68% 58% at 45% 38%, black, transparent 76%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 68% 58% at 45% 38%, black, transparent 76%)',
        }}
      />
    </div>
  );
};
