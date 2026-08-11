import { cn } from '@/lib/cn';

type GlobeSkeletonProps = { className?: string };

export const GlobeSkeleton = ({ className }: GlobeSkeletonProps) => (
  <div className={cn('grid place-items-center', className)} aria-hidden="true">
    <div
      className="size-[62%] rounded-full border border-dashed border-line"
      style={{ animation: 'skeleton-breathe 2.4s ease-in-out infinite' }}
    />
  </div>
);
