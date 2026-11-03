import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, type Object3D } from 'three';

const INTERACTIVE = 'a, button, input, textarea, select, summary, label, [role="button"], [data-magnetic]';

/*
 * The ship flies behind the page content, so it can never receive DOM events.
 * Instead, window-level pointer events are raycast against it. Anything the page
 * itself makes clickable wins, so a button that happens to sit over the ship
 * still behaves like a button.
 */
export const useShipClick = (
  target: RefObject<Object3D | null>,
  onClick: () => void,
): (() => void) => {
  const camera = useThree((state) => state.camera);
  const raycaster = useMemo(() => new Raycaster(), []);
  const pointer = useRef<Vector2 | null>(null);
  const hovering = useRef(false);

  const hits = useCallback(
    (ndc: Vector2): boolean => {
      const object = target.current;
      if (object === null) return false;
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(object, true).length > 0;
    },
    [camera, raycaster, target],
  );

  useEffect(() => {
    const toNdc = (event: MouseEvent): Vector2 | null => {
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest(INTERACTIVE) != null) return null;
      return new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    };

    const onMove = (event: PointerEvent): void => {
      pointer.current = toNdc(event);
    };
    const onLeave = (): void => {
      pointer.current = null;
    };
    const onClickAnywhere = (event: MouseEvent): void => {
      const ndc = toNdc(event);
      if (ndc !== null && hits(ndc)) onClick();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('click', onClickAnywhere);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('click', onClickAnywhere);
      delete document.body.dataset.shipHover;
    };
  }, [hits, onClick]);

  /* Called every frame: the ship moves under a still pointer, so hover can't
     wait for the next pointermove. */
  return useCallback(() => {
    const over = pointer.current !== null && hits(pointer.current);
    if (over === hovering.current) return;
    hovering.current = over;
    if (over) document.body.dataset.shipHover = 'on';
    else delete document.body.dataset.shipHover;
  }, [hits]);
};
