import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, CanvasTexture, SRGBColorSpace, type Sprite } from 'three';
import { getScrollVelocity } from '@/lib/scrollSpeed';

const TRAIL = 6;

const glowTexture = (): CanvasTexture => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
    glow.addColorStop(0.18, 'rgba(190, 235, 255, 0.95)');
    glow.addColorStop(0.45, 'rgba(70, 170, 255, 0.45)');
    glow.addColorStop(1, 'rgba(20, 80, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

/**
 * The Falcon's blue sublight glow, at the stern (-Z). Sprites always face the
 * camera, so the glow reads from any angle; a trail of fading copies behind it
 * stretches with scroll speed, which is what sells the thrust.
 */
export const EngineGlow = ({ length }: { length: number }) => {
  const texture = useMemo(glowTexture, []);
  const sprites = useRef<Array<Sprite | null>>([]);
  const stern = -length * 0.47;

  useFrame(({ clock }) => {
    const thrust = Math.min(1, Math.abs(getScrollVelocity()) / 2500);
    const flicker = 0.92 + Math.sin(clock.elapsedTime * 38) * 0.05 + Math.sin(clock.elapsedTime * 17) * 0.03;
    sprites.current.forEach((sprite, index) => {
      if (sprite === null) return;
      const fade = 1 - index / TRAIL;
      const spread = length * (0.05 + thrust * 0.22);
      sprite.position.z = stern - index * spread;
      const width = length * (0.62 - index * 0.06) * (0.9 + thrust * 0.4);
      sprite.scale.set(width * flicker, length * (0.2 - index * 0.015) * flicker, 1);
      sprite.material.opacity = (index === 0 ? 0.95 : 0.55 * fade * (0.35 + thrust)) * flicker;
    });
  });

  return (
    <group>
      {Array.from({ length: TRAIL }, (_, index) => (
        <sprite
          key={index}
          ref={(sprite) => {
            sprites.current[index] = sprite;
          }}
          position={[0, length * 0.02, stern]}
        >
          <spriteMaterial
            map={texture}
            blending={AdditiveBlending}
            depthWrite={false}
            transparent
            toneMapped={false}
          />
        </sprite>
      ))}
      <pointLight position={[0, 0, stern - length * 0.1]} color="#6cc6ff" intensity={6} distance={length * 2.5} />
    </group>
  );
};
