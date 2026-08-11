import { useEffect, useState } from 'react';
import type { SectionId } from '@/types';

export const useActiveSection = (ids: readonly SectionId[]): SectionId => {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return undefined;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.intersectionRatio);
        });

        let bestId = '';
        let bestRatio = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId !== '' && bestRatio > 0.05) {
          setActive(bestId as SectionId);
        }
      },
      { threshold: [0, 0.05, 0.2, 0.4, 0.6, 0.8, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
};
