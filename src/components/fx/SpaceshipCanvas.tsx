import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import { toggleStarWars } from '@/lib/themeStore';
import { startScrollSpeed } from '@/lib/scrollSpeed';
import { useTheme } from '@/hooks/useTheme';
import { useShipClick } from './useShipClick';
import { ShipChoreography } from './ship/ShipChoreography';
import { useShipModel } from './ship/useShipModel';

const SHIP_LENGTH = 1.5; // world units; the visible height at z=0 is ~7.3
const SPEED = 0.55;
const MAX_BANK = 0.9;

/*
 * A closed Lissajous loop scaled to the viewport. The x and y amplitudes overshoot
 * the edges, so the ship leaves the screen now and then instead of circling
 * the middle of the page.
 */
const flightPath = (t: number, width: number, height: number, out: Vector3): Vector3 =>
  out.set(
    Math.sin(t * 0.31) * width * 0.62,
    Math.sin(t * 0.47 + 1.1) * height * 0.44,
    Math.sin(t * 0.23) * 2.2 - 0.8,
  );

const Ship = () => {
  const model = useShipModel(SHIP_LENGTH);
  const viewport = useThree((state) => state.viewport);
  const shipRef = useRef<Group>(null);
  const bankRef = useRef(0);
  const headingRef = useRef<number | null>(null);
  const timeRef = useRef(Math.random() * 40);
  const ahead = useMemo(() => new Vector3(), []);
  const updateHover = useShipClick(shipRef, toggleStarWars);

  useFrame((_state, delta) => {
    const ship = shipRef.current;
    if (ship === null) return;

    const dt = Math.min(delta, 0.05);
    timeRef.current += dt * SPEED;
    const t = timeRef.current;

    flightPath(t, viewport.width, viewport.height, ship.position);
    flightPath(t + 0.04, viewport.width, viewport.height, ahead);

    /* Bank into turns: roll follows how fast the on-screen heading is changing. */
    const heading = Math.atan2(ahead.y - ship.position.y, ahead.x - ship.position.x);
    const previous = headingRef.current ?? heading;
    headingRef.current = heading;
    let turn = heading - previous;
    if (turn > Math.PI) turn -= Math.PI * 2;
    if (turn < -Math.PI) turn += Math.PI * 2;
    const targetBank = MathUtils.clamp((turn / dt) * 0.6, -MAX_BANK, MAX_BANK);
    bankRef.current = MathUtils.damp(bankRef.current, targetBank, 3, dt);

    ship.lookAt(ahead);
    ship.rotateZ(bankRef.current);
    updateHover();
  });

  return (
    <group ref={shipRef}>
      <primitive object={model} />
    </group>
  );
};

const SpaceshipCanvas = () => {
  const { theme } = useTheme();
  const starWars = theme === 'starwars';

  useEffect(startScrollSpeed, []);

  return (
  <Canvas
    dpr={[1, 1.5]}
    camera={{ position: [0, 0, 10], fov: 40 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    style={{ pointerEvents: 'none' }}
  >
    <ambientLight intensity={0.7} />
    <hemisphereLight args={['#dbeafe', '#0f172a', 0.8]} />
    <directionalLight position={[5, 6, 8]} intensity={2.4} />
    <directionalLight position={[-6, -2, -4]} intensity={1.2} color="#60a5fa" />
    {starWars ? <directionalLight position={[-8, -6, 3]} intensity={1.6} color="#ff9a5c" /> : null}
    <Suspense fallback={null}>
      {starWars ? <ShipChoreography /> : <Ship />}
    </Suspense>
  </Canvas>
  );
};

export default SpaceshipCanvas;
