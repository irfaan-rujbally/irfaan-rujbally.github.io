import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Billboard, useTexture } from '@react-three/drei';
import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type Texture,
} from 'three';
import { clamp, damp, fibonacciSphere } from '@/lib/fibonacciSphere';
import { asset } from '@/lib/cn';
import type { Skill } from '@/types';

const SPHERE_RADIUS = 2.6;
const TILE_SIZE = 0.72;
const IDLE_SPIN = 0.08;
const TILT_AMPLITUDE = (6 * Math.PI) / 180;

/* Depth-cue endpoints. */
const OPACITY_BACK = 0.25;
const OPACITY_FRONT = 1;
const SCALE_BACK = 0.55;
const SCALE_FRONT = 1;

const GREY = new Color('#9aa0a8');

export type GlobeSceneProps = {
  skills: Skill[];
  activeCategory: string;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  /** Drag state is owned by the DOM wrapper so it works outside the canvas too. */
  dragRef: React.RefObject<{ velocityX: number; velocityY: number; dragging: boolean }>;
  /** Normalised device coords of the pointer, or null when it's off the canvas.
      Hit-testing is done here rather than through R3F's event system: the wrapper
      already owns pointer state for dragging, and pointer capture during a drag
      would otherwise swallow the events R3F needs. */
  pointerRef: React.RefObject<{ x: number; y: number } | null>;
  paused: boolean;
  /** When true: no idle spin and no tilt oscillation. Drag still works. */
  reducedMotion: boolean;
  /** Several brand marks are near-black and vanish on a dark canvas, so each
      tile gets a light chip behind it in dark mode. */
  darkMode: boolean;
};

type TileState = {
  mesh: Mesh | null;
  material: MeshBasicMaterial | null;
  chip: MeshBasicMaterial | null;
  chipMesh: Mesh | null;
  baseColor: Color;
  opacity: number;
  scale: number;
  grey: number;
};

export const GlobeScene = ({
  skills,
  activeCategory,
  hoveredId,
  selectedId,
  onHover,
  dragRef,
  pointerRef,
  paused,
  reducedMotion,
  darkMode,
}: GlobeSceneProps) => {
  const groupRef = useRef<Group>(null);
  const tiltRef = useRef(0);
  const rotationRef = useRef({ x: 0, y: 0 });

  const positions = useMemo(
    () => fibonacciSphere(skills.length, SPHERE_RADIUS),
    [skills.length],
  );

  const textureUrls = useMemo(
    () => skills.map((skill) => asset(skill.texture)),
    [skills],
  );

  const textures = useTexture(textureUrls) as Texture[];
  const chipTexture = useTexture(asset('logos/tex/_chip.png')) as Texture;

  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 4;
    });
  }, [textures]);

  const tiles = useRef<TileState[]>(
    skills.map(() => ({
      mesh: null,
      material: null,
      chip: null,
      chipMesh: null,
      baseColor: new Color('#ffffff'),
      opacity: 0,
      scale: 0,
      grey: 0,
    })),
  );

  const worldPos = useMemo(() => new Vector3(), []);
  const raycaster = useMemo(() => new Raycaster(), []);
  const ndc = useMemo(() => new Vector2(), []);
  const camera = useThree((state) => state.camera);
  const hoverRef = useRef<string | null>(null);

  /* The frame loop stops while paused, so it can't clear a hover itself. */
  useEffect(() => {
    if (!paused || hoverRef.current === null) return;
    hoverRef.current = null;
    onHover(null);
  }, [paused, onHover]);

  useFrame((_state, delta) => {
    if (paused) return;

    const group = groupRef.current;
    if (group === null) return;

    const dt = Math.min(delta, 0.05);
    const drag = dragRef.current;
    const slowed = hoveredId !== null || selectedId !== null;

    /* ---- Rotation: drag velocity decays back into the idle spin ------------ */
    if (drag !== null) {
      if (drag.dragging) {
        rotationRef.current.y += drag.velocityX;
        rotationRef.current.x = clamp(
          rotationRef.current.x + drag.velocityY,
          -0.61,
          0.61,
        );
      } else {
        rotationRef.current.y += drag.velocityX;
        rotationRef.current.x = clamp(
          rotationRef.current.x + drag.velocityY,
          -0.61,
          0.61,
        );
        drag.velocityX *= 0.94;
        drag.velocityY *= 0.94;
        if (Math.abs(drag.velocityX) < 0.0001) drag.velocityX = 0;
        if (Math.abs(drag.velocityY) < 0.0001) drag.velocityY = 0;

        if (!reducedMotion) {
          rotationRef.current.y += IDLE_SPIN * dt * (slowed ? 0.2 : 1);
        }
      }
    }

    if (!reducedMotion) tiltRef.current += dt * 0.35;
    group.rotation.y = rotationRef.current.y;
    group.rotation.x =
      rotationRef.current.x +
      (reducedMotion ? 0 : Math.sin(tiltRef.current) * TILT_AMPLITUDE);

    /* ---- Hit testing ------------------------------------------------------
       One raycast per frame against the tile planes. Cheaper and far more
       predictable than per-object DOM-driven events, and it lets a drag suppress
       hover without fighting pointer capture. */
    const pointer = pointerRef.current;
    let nextHover: string | null = null;

    if (pointer !== null && drag !== null && !drag.dragging) {
      ndc.set(pointer.x, pointer.y);
      raycaster.setFromCamera(ndc, camera);

      const meshes: Mesh[] = [];
      for (const tile of tiles.current) {
        if (tile.mesh !== null) meshes.push(tile.mesh);
      }

      const hits = raycaster.intersectObjects(meshes, false);
      for (const hit of hits) {
        const index = meshes.indexOf(hit.object as Mesh);
        if (index === -1) continue;
        const skill = skills[index];
        /* Filtered-out tiles are visually faded; don't let them catch the pointer. */
        if (activeCategory !== 'all' && skill.category !== activeCategory) continue;
        nextHover = skill.id;
        break;
      }
    }

    if (nextHover !== hoverRef.current) {
      hoverRef.current = nextHover;
      onHover(nextHover);
    }

    /* ---- Per-tile compositing --------------------------------------------
       Depth, hover, featured, filter and selection all want a say in scale and
       opacity. Each factor is computed separately and MULTIPLIED — assigning any
       one of them directly would clobber the others on the next frame.        */
    const smoothing = damp(9, dt);

    for (let i = 0; i < tiles.current.length; i += 1) {
      const tile = tiles.current[i];
      const skill = skills[i];
      if (tile.mesh === null || tile.material === null) continue;

      tile.mesh.getWorldPosition(worldPos);
      const depth = clamp((worldPos.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2), 0, 1);

      const depthOpacity = OPACITY_BACK + (OPACITY_FRONT - OPACITY_BACK) * depth;
      const depthScale = SCALE_BACK + (SCALE_FRONT - SCALE_BACK) * depth;

      const matchesFilter =
        activeCategory === 'all' || skill.category === activeCategory;
      const filterOpacity = matchesFilter ? 1 : 0.15;

      const selectionOpacity =
        selectedId === null || selectedId === skill.id ? 1 : 0.3;

      const featuredScale = skill.featured ? 1.16 : 1;
      const hoverScale = hoveredId === skill.id ? 1.25 : 1;

      const targetOpacity = depthOpacity * filterOpacity * selectionOpacity;
      const targetScale = depthScale * featuredScale * hoverScale;
      const targetGrey = matchesFilter ? (1 - depth) * 0.55 : 0.8;

      tile.opacity += (targetOpacity - tile.opacity) * smoothing;
      tile.scale += (targetScale - tile.scale) * smoothing;
      tile.grey += (targetGrey - tile.grey) * smoothing;

      tile.material.opacity = tile.opacity;
      tile.mesh.scale.setScalar(tile.scale);
      /* The chip must track the tile's depth scale too, or near tiles get a
         correctly-sized backing while far ones float on an oversized one. */
      if (tile.chip !== null) tile.chip.opacity = darkMode ? tile.opacity * 0.88 : 0;
      if (tile.chipMesh !== null) tile.chipMesh.scale.setScalar(tile.scale * 1.24);

      /* meshBasicMaterial can't desaturate without a custom shader, so lerp the
         tint toward grey instead — same read, no shader cost. */
      tile.material.color.copy(tile.baseColor).lerp(GREY, tile.grey);
    }

  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => {
        const position = positions[index];
        return (
          <Billboard key={skill.id} position={position}>
            <mesh
              ref={(mesh) => {
                tiles.current[index].chipMesh = mesh;
              }}
              position={[0, 0, -0.01]}
              scale={0.01}
              renderOrder={-1}
              raycast={() => null}
            >
              <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
              <meshBasicMaterial
                ref={(material) => {
                  tiles.current[index].chip = material;
                }}
                map={chipTexture}
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh
              ref={(mesh) => {
                tiles.current[index].mesh = mesh;
              }}
              scale={0.01}
            >
              <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
              <meshBasicMaterial
                ref={(material) => {
                  tiles.current[index].material = material;
                }}
                map={textures[index]}
                transparent
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </Billboard>
        );
      })}

      {/* Faint shell that implies the surface the tiles sit on. */}
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS * 0.98, 18, 12]} />
        <meshBasicMaterial
          color={darkMode ? '#7dd3fc' : '#2563eb'}
          wireframe
          transparent
          opacity={darkMode ? 0.07 : 0.035}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
