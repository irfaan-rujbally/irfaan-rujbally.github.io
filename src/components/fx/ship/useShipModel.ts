import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Vector3 } from 'three';
import { asset } from '@/lib/cn';

export const SHIP_MODEL = asset('models/millennium-falcon.glb');

/** The Falcon, centred on its origin with the nose along +Z, scaled to `length` world units. */
export const useShipModel = (length: number): Group => {
  const { scene } = useGLTF(SHIP_MODEL, false);

  return useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    clone.position.sub(box.getCenter(new Vector3()));
    const wrapper = new Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(length / Math.max(size.x, size.z));
    return wrapper;
  }, [scene, length]);
};
