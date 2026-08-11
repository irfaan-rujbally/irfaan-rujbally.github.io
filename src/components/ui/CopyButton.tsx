import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

type CopyButtonProps = {
  value: string;
  label: string;
  className?: string;
};

export const CopyButton = ({ value, label, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-lg text-ink-faint',
        'transition-colors duration-200 hover:bg-surface-sunk hover:text-ink',
        className,
      )}
    >
      {copied ? (
        <Check className="size-4 text-live" strokeWidth={2.4} />
      ) : (
        <Copy className="size-4" strokeWidth={1.8} />
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ''}
      </span>
    </button>
  );
};
