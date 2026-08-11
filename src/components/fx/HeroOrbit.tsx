import { motion } from 'motion/react';
import { skills } from '@/data/skills';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EASE_EXPO } from '@/lib/motionVariants';
import { asset } from '@/lib/cn';

/**
 * Concentric dashed rings with a handful of stack marks riding on them.
 * Balances the left-aligned hero and quietly previews the skills sphere below.
 * Decorative only — the same logos are announced properly in the Skills section.
 */

const ORBITS = [
  { size: 100, duration: 34, ids: ['laravel', 'vuejs'] },
  { size: 74, duration: 26, ids: ['php', 'csharp', 'mysql'] },
  { size: 46, duration: 20, ids: ['reactnative'] },
] as const;

const byId = (id: string) => skills.find((skill) => skill.id === id);

export const HeroOrbit = () => {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: reduced ? 0 : 0.6, duration: 1.1, ease: EASE_EXPO }}
      className="pointer-events-none relative aspect-square w-full max-w-[460px]"
    >
      {/* Core glow */}
      <div
        className="absolute top-1/2 left-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[44px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 34%, transparent), transparent 70%)',
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 grid size-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl font-mono text-lg font-bold text-white shadow-[var(--shadow-lg)]"
        style={{
          background:
            'linear-gradient(135deg, var(--color-accent), var(--color-mint))',
        }}
      >
        IR
      </div>

      {ORBITS.map((orbit, orbitIndex) => (
        <div
          key={orbit.size}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line"
          style={{ width: `${orbit.size}%`, height: `${orbit.size}%` }}
        >
          <motion.div
            className="size-full"
            animate={reduced ? undefined : { rotate: orbitIndex % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: orbit.duration,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {orbit.ids.map((id, index) => {
              const skill = byId(id);
              if (skill === undefined) return null;
              const angle = (360 / orbit.ids.length) * index + orbitIndex * 28;

              return (
                /* Rotate a full-size layer, then park the mark on its top edge —
                   avoids trigonometry and stays correct at any container size. */
                <div
                  key={id}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-line bg-surface shadow-[var(--shadow-md)] dark:bg-white/92"
                    style={{ rotate: -angle }}
                    animate={
                      reduced
                        ? undefined
                        : { rotate: (orbitIndex % 2 === 0 ? -360 : 360) - angle }
                    }
                    transition={{
                      duration: orbit.duration,
                      ease: 'linear',
                      repeat: Infinity,
                    }}
                  >
                    <img
                      src={asset(skill.icon)}
                      alt=""
                      width={22}
                      height={22}
                      className="size-[22px] object-contain"
                    />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
};
