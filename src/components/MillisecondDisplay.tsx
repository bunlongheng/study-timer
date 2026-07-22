import { useEffect, useRef, useState } from 'react';

interface MillisecondDisplayProps {
  isRunning: boolean;
}

/**
 * Renders the fast-spinning ".NN" fraction of the timer on its own state,
 * driven by requestAnimationFrame, so the ~100 updates/sec it needs do not
 * re-render the rest of the app (timer circle, mode selector, settings...).
 */
export function MillisecondDisplay({ isRunning }: MillisecondDisplayProps) {
  const [ms, setMs] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setMs(0);
      return undefined;
    }

    let last = performance.now();

    const loop = (now: number) => {
      const elapsed = now - last;
      if (elapsed >= 10) {
        const steps = Math.floor(elapsed / 10);
        setMs((prev) => (prev + steps) % 100);
        last += steps * 10;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  return <span className="text-lg opacity-60">.{ms.toString().padStart(2, '0')}</span>;
}
