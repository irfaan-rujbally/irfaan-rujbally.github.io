import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler, Group, MathUtils, Quaternion, Vector3 } from 'three';
import { getScrollVelocity } from '@/lib/scrollSpeed';
import { useShipClick } from '../useShipClick';
import { EngineGlow } from './EngineGlow';
import { LAUNCH, POSES, SECTION_ORDER, blendFor, type Pose } from './choreography';
import { telemetry } from './telemetry';
import { useShipModel } from './useShipModel';

const LENGTH = 3.2;
/* On portrait screens the text spans the full width, so the ship shrinks out of its way. */
const PORTRAIT_SCALE = 0.5;
const ROLL_SECONDS = 0.9;

const toQuaternion = (pose: Pose): Quaternion =>
  new Quaternion().setFromEuler(new Euler(pose.pitch, pose.yaw, pose.roll, 'YXZ'));

const QUATERNIONS = SECTION_ORDER.map((id) => toQuaternion(POSES[id]));

/* Section tops in page pixels. Re-measured on a timer as well as on resize,
   because lazy sections (the contact form, the globe) change the layout late. */
const useSectionTops = () => {
  const tops = useRef<number[]>([]);
  useEffect(() => {
    const measure = (): void => {
      tops.current = SECTION_ORDER.map((id) => {
        const element = document.getElementById(id);
        return element === null ? 0 : element.getBoundingClientRect().top + window.scrollY;
      });
    };
    measure();
    const timer = window.setInterval(measure, 1000);
    window.addEventListener('resize', measure);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);
  return tops;
};

const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Star Wars mode: the Falcon flies a pose per section instead of looping.
 * Scroll picks a pair of poses and a blend between them; the ship eases toward
 * that target with inertia, banks with its sideways speed, and does a barrel
 * roll when clicked.
 */
export const ShipChoreography = () => {
  const model = useShipModel(LENGTH);
  const viewport = useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const shipRef = useRef<Group>(null);
  const bankRef = useRef<Group>(null);
  const rollStart = useRef(-1);
  const launched = useRef(false);
  const tops = useSectionTops();

  const scratch = useMemo(
    () => ({ target: new Vector3(), quat: new Quaternion(), last: new Vector3(), forward: new Vector3(), screen: new Vector3() }),
    [],
  );

  const updateHover = useShipClick(shipRef, () => {
    if (rollStart.current < 0) rollStart.current = performance.now();
  });

  useFrame(({ clock }, delta) => {
    const ship = shipRef.current;
    const bank = bankRef.current;
    if (ship === null || bank === null || tops.current.length === 0) return;
    const dt = Math.min(delta, 0.05);

    /* First frame: start far behind the scene, so the ship launches in. */
    if (!launched.current) {
      launched.current = true;
      ship.position.set(LAUNCH.x * viewport.width, LAUNCH.y * viewport.height, LAUNCH.z);
      ship.quaternion.copy(QUATERNIONS[0]);
      scratch.last.copy(ship.position);
    }

    const { from, to, t } = blendFor(tops.current, window.scrollY + window.innerHeight * 0.45);
    const a = POSES[SECTION_ORDER[from]];
    const b = POSES[SECTION_ORDER[to]];
    const halfW = viewport.width / 2;
    const halfH = viewport.height / 2;
    const bob = Math.sin(clock.elapsedTime * 0.9) * 0.08;

    scratch.target.set(
      MathUtils.lerp(a.x, b.x, t) * halfW,
      MathUtils.lerp(a.y, b.y, t) * halfH + bob,
      MathUtils.lerp(a.z, b.z, t),
    );
    scratch.quat.copy(QUATERNIONS[from]).slerp(QUATERNIONS[to], t);

    ship.position.lerp(scratch.target, 1 - Math.exp(-2.4 * dt));
    ship.quaternion.slerp(scratch.quat, 1 - Math.exp(-2.8 * dt));
    const fit = viewport.width < viewport.height ? PORTRAIT_SCALE : 1;
    ship.scale.setScalar(MathUtils.damp(ship.scale.x, MathUtils.lerp(a.scale, b.scale, t) * fit, 2.4, dt));

    /* Bank into sideways motion, and lean a little harder while the page is flying by. */
    const sideways = (ship.position.x - scratch.last.x) / Math.max(dt, 1e-3);
    scratch.last.copy(ship.position);
    const thrust = Math.min(1, Math.abs(getScrollVelocity()) / 2500);
    let roll = MathUtils.clamp(-sideways * 0.12, -0.7, 0.7) + Math.sin(clock.elapsedTime * 0.7) * 0.05 * (1 + thrust);

    if (rollStart.current >= 0) {
      const progress = (performance.now() - rollStart.current) / (ROLL_SECONDS * 1000);
      if (progress >= 1) rollStart.current = -1;
      else roll += easeInOut(progress) * Math.PI * 2;
    }
    bank.rotation.z = rollStart.current >= 0 ? roll : MathUtils.damp(bank.rotation.z % (Math.PI * 2), roll, 4, dt);

    scratch.forward.set(0, 0, 1).applyQuaternion(ship.quaternion);
    telemetry.heading = (Math.round(MathUtils.radToDeg(Math.atan2(scratch.forward.x, scratch.forward.z))) + 360) % 360;

    scratch.screen.copy(ship.position).project(camera);
    const distance = camera.position.distanceTo(ship.position);
    const span = (LENGTH * ship.scale.x) / (2 * Math.tan(MathUtils.degToRad(40) / 2) * distance);
    telemetry.screen = {
      x: (scratch.screen.x * 0.5 + 0.5) * size.width,
      y: (-scratch.screen.y * 0.5 + 0.5) * size.height,
      size: span * size.height * 0.8,
      visible: Math.abs(scratch.screen.x) < 1 && Math.abs(scratch.screen.y) < 1 && distance > 3,
    };

    updateHover();
  });

  return (
    <group ref={shipRef}>
      <group ref={bankRef}>
        <primitive object={model} />
        <EngineGlow length={LENGTH} />
      </group>
    </group>
  );
};
