import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Code2, FolderOpen, Mail } from 'lucide-react';
import { visibleProjects } from '@/data/projects';
import { profile } from '@/data/profile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SectionShell } from '@/components/layout/SectionShell';
import { FilterChip, Chip } from '@/components/ui/Chip';
import { ButtonLink } from '@/components/ui/Button';
import { EASE_EXPO } from '@/lib/motionVariants';
import { asset, cn } from '@/lib/cn';
import type { Project } from '@/types';

const ProjectCard = ({ project }: { project: Project }) => {
  const wide = project.featured;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: EASE_EXPO }}
      className={cn(wide && 'sm:col-span-2')}
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
        {project.isPlaceholder ? (
          <span className="absolute top-3 right-3 z-20 rounded-full bg-danger px-2.5 py-1 font-mono text-[0.625rem] font-semibold tracking-wide text-white uppercase">
            Sample — replace
          </span>
        ) : null}

        <div className="relative overflow-hidden bg-surface-sunk">
          <div className={cn('relative w-full', wide ? 'aspect-[2/1]' : 'aspect-[16/10]')}>
            {project.image !== undefined ? (
              <img
                src={asset(project.image)}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-600 ease-[var(--ease-expo)] group-hover:scale-[1.04]"
              />
            ) : (
              <div
                className="grid size-full place-items-center"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, color-mix(in srgb, var(--color-ink) 16%, transparent) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              >
                <FolderOpen
                  className="size-8 text-ink-ghost"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </div>
            )}

            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/90 px-2 py-0.5 font-mono text-[0.625rem] font-medium text-ink"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-h3 text-ink">{project.title}</h3>
          <p className="mt-1.5 text-caption font-medium text-accent">
            {project.outcome}
          </p>
          <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-ink-soft">
            {project.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>

          {project.liveUrl !== undefined || project.codeUrl !== undefined ? (
            <div className="mt-5 flex items-center gap-4 border-t border-line pt-4">
              {project.liveUrl !== undefined ? (
                <a
                  data-magnetic
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/link inline-flex items-center gap-1 text-caption font-medium text-ink hover:text-accent"
                >
                  Live
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </a>
              ) : null}
              {project.codeUrl !== undefined ? (
                <a
                  data-magnetic
                  href={project.codeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/link inline-flex items-center gap-1 text-caption font-medium text-ink hover:text-accent"
                >
                  <Code2 className="size-3.5" strokeWidth={1.8} />
                  Code
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </article>
    </motion.li>
  );
};

const EmptyState = () => (
  <div className="rounded-panel border border-dashed border-line bg-surface-sunk/50 px-6 py-16 text-center">
    <FolderOpen
      className="mx-auto mb-4 size-8 text-ink-ghost"
      strokeWidth={1.4}
      aria-hidden="true"
    />
    <h3 className="text-h3 text-ink">Case studies coming soon</h3>
    <p className="mx-auto mt-3 max-w-[46ch] text-caption text-ink-soft">
      I&rsquo;m writing up recent work. In the meantime, I&rsquo;m happy to walk
      through what I&rsquo;ve built and how — just get in touch.
    </p>
    <ButtonLink
      href={`mailto:${profile.email}`}
      size="md"
      className="mt-6"
      variant="secondary"
    >
      <Mail className="size-4" strokeWidth={1.8} />
      Ask me about my work
    </ButtonLink>
  </div>
);

export const Projects = () => {
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<string>('all');

  const techOptions = useMemo(() => {
    const set = new Set<string>();
    visibleProjects.forEach((project) => project.tech.forEach((t) => set.add(t)));
    return [...set].sort();
  }, []);

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? visibleProjects
        : visibleProjects.filter((project) => project.tech.includes(filter)),
    [filter],
  );

  return (
    <SectionShell
      id="projects"
      eyebrow="Selected work"
      heading="Things I've built."
      intro="Applications that went into daily use — the problem, the approach, and what changed."
    >
      {visibleProjects.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {techOptions.length > 1 ? (
            <div className="mb-8 flex flex-wrap gap-2">
              <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
                All
              </FilterChip>
              {techOptions.map((tech) => (
                <FilterChip
                  key={tech}
                  active={filter === tech}
                  onClick={() => setFilter(tech)}
                >
                  {tech}
                </FilterChip>
              ))}
            </div>
          ) : null}

          <motion.ul
            layout={!reduced}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </>
      )}
    </SectionShell>
  );
};
