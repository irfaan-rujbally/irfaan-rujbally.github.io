import { useState } from 'react';
import { asset, cn } from '@/lib/cn';
import { OrgMark } from './OrgMark';

type OrgLogoProps = {
  name: string;
  /** Path under public/, e.g. "logos/org/polytech.svg". */
  src?: string;
  size?: number;
  className?: string;
};

/**
 * A real institution logo when one is on disk, the <OrgMark> monogram when not.
 *
 * The fallback runs on a missing file too, not just a missing `src`, so a logo
 * can be dropped into public/logos/org/ later with no code change — and a typo
 * degrades to a monogram instead of a broken-image icon.
 */
export const OrgLogo = ({ name, src, size = 40, className }: OrgLogoProps) => {
  const [failed, setFailed] = useState(false);

  if (src === undefined || failed) {
    return <OrgMark name={name} size={size} className={className} />;
  }

  return (
    <img
      src={asset(src)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-contain', className)}
      /* A cap rather than a fixed square: institution logos are mostly wordmarks
         wider than they are tall, and squaring them shrinks them to a smudge. */
      style={{ maxWidth: size * 1.3, maxHeight: size }}
    />
  );
};
