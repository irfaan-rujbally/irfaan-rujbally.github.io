import { Suspense, lazy, useCallback, useMemo, useRef, useState } from 'react';
import { Boxes, Globe as GlobeIcon } from 'lucide-react';
import { skills as allSkills, categoryLabels, categoryOrder } from '@/data/skills';
import { useInViewport } from '@/hooks/useInViewport';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useIsDarkTheme } from '@/hooks/useIsDarkTheme';
import { FilterChip } from '@/components/ui/Chip';
import { GlobeErrorBoundary } from './GlobeErrorBoundary';
import { GlobeFallbackGrid } from './GlobeFallbackGrid';
import { GlobeSkeleton } from './GlobeSkeleton';
import { SkillDetail } from './SkillDetail';
import type { Skill, SkillCategory } from '@/types';

const GlobeCanvas = lazy(() => import('./GlobeCanvas'));

const supportsWebGL = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return (
      canvas.getContext('webgl2') !== null || canvas.getContext('webgl') !== null
    );
  } catch {
    return false;
  }
};

/* 26 textured planes is a light scene, so the bar here is deliberately low —
   only genuinely constrained hardware skips the canvas. Phones are handled
   separately by the viewport check, which is the case that actually matters. */
const isWeakDevice = (): boolean =>
  typeof navigator !== 'undefined' &&
  typeof navigator.hardwareConcurrency === 'number' &&
  navigator.hardwareConcurrency <= 2;

type Filter = SkillCategory | 'all';

export const SkillsGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(containerRef, '200px');
  const isMobile = useIsMobile();
  const darkMode = useIsDarkTheme();

  const [webglOk] = useState(supportsWebGL);
  const [weak] = useState(isWeakDevice);

  /* Small screens and low-core devices get the grid by default — the canvas is
     opt-in there rather than forced onto a device that will struggle. */
  const prefersGridByDefault = isMobile || weak || !webglOk;
  const [showGlobe, setShowGlobe] = useState(!prefersGridByDefault);

  const [filter, setFilter] = useState<Filter>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* Mobile canvas shows featured skills only — 26 tiles on a 320px sphere is mush. */
  const globeSkills = useMemo(
    () => (isMobile ? allSkills.filter((skill) => skill.featured) : allSkills),
    [isMobile],
  );

  const activeSkill: Skill | null = useMemo(() => {
    const id = hoveredId ?? selectedId;
    return allSkills.find((skill) => skill.id === id) ?? null;
  }, [hoveredId, selectedId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const handleClear = useCallback(() => {
    setSelectedId(null);
    setHoveredId(null);
  }, []);

  const canvasAvailable = webglOk;

  return (
    <div
      ref={containerRef}
      data-hovered={hoveredId ?? ''}
      data-selected={selectedId ?? ''}
      className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12"
    >
      {/* ---- Visual column ------------------------------------------------- */}
      <div className="lg:col-span-7">
        {showGlobe && canvasAvailable ? (
          <GlobeErrorBoundary
            fallback={
              <GlobeFallbackGrid
                skills={allSkills}
                activeCategory={filter}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            }
          >
            <Suspense
              fallback={<GlobeSkeleton className="aspect-square w-full" />}
            >
              <GlobeCanvas
                skills={globeSkills}
                activeCategory={filter}
                hoveredId={hoveredId}
                selectedId={selectedId}
                onHover={setHoveredId}
                onSelect={handleSelect}
                onClear={handleClear}
                paused={!inViewport}
                darkMode={darkMode}
              />
            </Suspense>
          </GlobeErrorBoundary>
        ) : (
          <GlobeFallbackGrid
            skills={allSkills}
            activeCategory={filter}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}

        {canvasAvailable ? (
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-caption text-ink-faint">
              {showGlobe
                ? 'Drag the sphere. Click a logo to pin it.'
                : 'Select a technology to see the detail.'}
            </p>
            <button
              type="button"
              data-magnetic
              onClick={() => setShowGlobe((value) => !value)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.75rem] font-medium text-ink-soft transition-colors hover:border-ink-ghost hover:text-ink"
            >
              {showGlobe ? (
                <>
                  <Boxes className="size-3.5" strokeWidth={1.8} />
                  View as grid
                </>
              ) : (
                <>
                  <GlobeIcon className="size-3.5" strokeWidth={1.8} />
                  View as 3D globe
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>

      {/* ---- Panel column --------------------------------------------------- */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="mono-label mb-3 text-ink-faint">Filter</p>
          <div className="mb-7 flex flex-wrap gap-2">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
              {categoryLabels.all}
            </FilterChip>
            {categoryOrder.map((category) => (
              <FilterChip
                key={category}
                active={filter === category}
                onClick={() => setFilter(category)}
              >
                {categoryLabels[category]}
              </FilterChip>
            ))}
          </div>

          <SkillDetail skill={activeSkill} pinned={selectedId !== null} />

          <p className="mt-6 text-caption text-ink-faint">
            {allSkills.length} technologies across languages, frameworks,
            databases and tooling — the working set from ten years of shipping.
          </p>
        </div>
      </div>

      {/* Canvas content is not in the accessibility tree, so mirror it here. */}
      <div className="sr-only">
        <h3>Full list of technologies</h3>
        {categoryOrder.map((category) => (
          <section key={category}>
            <h4>{categoryLabels[category]}</h4>
            <ul>
              {allSkills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <li key={skill.id}>
                    {skill.name}
                    {skill.note !== '' ? ` — ${skill.note}` : ''}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
