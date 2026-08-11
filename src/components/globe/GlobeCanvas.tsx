import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GlobeScene } from './GlobeScene';
import { GlobeSkeleton } from './GlobeSkeleton';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Skill } from '@/types';

const DRAG_SENSITIVITY = 0.0055;

export type GlobeCanvasProps = {
  skills: Skill[];
  activeCategory: string;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onClear: () => void;
  paused: boolean;
  darkMode: boolean;
};

export const GlobeCanvas = ({
  skills,
  activeCategory,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  onClear,
  paused,
  darkMode,
}: GlobeCanvasProps) => {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);

  const dragRef = useRef({ velocityX: 0, velocityY: 0, dragging: false });
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  /* Pointer in normalised device coords, read by the scene's per-frame raycast. */
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  /* Mirrors the hovered id so a tap can select without a state round-trip. */
  const hoveredRef = useRef<string | null>(null);
  hoveredRef.current = hoveredId;

  const updatePointer = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePointer(event);
    dragRef.current.dragging = true;
    dragRef.current.velocityX = 0;
    dragRef.current.velocityY = 0;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    movedRef.current = false;
    setGrabbing(true);
  }, [updatePointer]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    updatePointer(event);

    if (!dragRef.current.dragging || lastPointer.current === null) return;

    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
    lastPointer.current = { x: event.clientX, y: event.clientY };

    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;

    dragRef.current.velocityX = dx * DRAG_SENSITIVITY;
    dragRef.current.velocityY = dy * DRAG_SENSITIVITY;
  }, [updatePointer]);

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragRef.current.dragging = false;
      lastPointer.current = null;
      setGrabbing(false);

      /* A press that never moved is a tap: select whatever is under the pointer,
         or clear the pinned selection when that's empty space. */
      if (!movedRef.current) {
        const hit = hoveredRef.current;
        if (hit === null) onClear();
        else onSelect(hit);
      }
    },
    [onClear, onSelect],
  );

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = null;
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClear();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClear]);

  return (
    <div
      ref={wrapRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={handlePointerLeave}
      role="img"
      aria-label={`An interactive sphere of ${skills.length} technology logos. Drag to rotate. The full list is also available as text below.`}
      className="relative mx-auto aspect-square w-full max-w-[480px] touch-none select-none"
      style={{ cursor: grabbing ? 'grabbing' : 'grab' }}
    >
      {/* Soft glow behind the sphere. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-full blur-[70px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%)',
        }}
      />

      <Canvas
        dpr={[1, 2]}
        frameloop={paused ? 'never' : 'always'}
        camera={{ position: [0, 0, 9.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <GlobeScene
            skills={skills}
            activeCategory={activeCategory}
            hoveredId={hoveredId}
            selectedId={selectedId}
            onHover={onHover}
            dragRef={dragRef}
            pointerRef={pointerRef}
            paused={paused}
            reducedMotion={reduced}
            darkMode={darkMode}
          />
        </Suspense>
      </Canvas>

      <GlobeSkeleton className="pointer-events-none absolute inset-0 -z-10" />
    </div>
  );
};

export default GlobeCanvas;
