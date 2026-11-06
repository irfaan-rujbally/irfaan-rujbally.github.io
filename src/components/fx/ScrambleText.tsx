import { useEffect, useRef, useState } from 'react';

const GLYPHS = '#%&@*+=<>/\\_ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
const DURATION_MS = 750;

/**
 * Text that "decodes" the first time it scrolls into view: random glyphs that
 * settle into the real characters from left to right. Screen readers get the
 * real text throughout; the scrambled copy is hidden from them.
 */
export const ScrambleText = ({ text }: { text: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [output, setOutput] = useState(text);

  useEffect(() => {
    const element = ref.current;
    if (element === null) return undefined;
    let frame = 0;
    let start = 0;

    const run = (now: number): void => {
      if (start === 0) start = now;
      const progress = (now - start) / DURATION_MS;
      const settled = Math.floor(progress * text.length);
      setOutput(
        [...text]
          .map((char, i) =>
            i < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      );
      if (progress < 1) frame = requestAnimationFrame(run);
      else setOutput(text);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(run);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [text]);

  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
    </span>
  );
};
