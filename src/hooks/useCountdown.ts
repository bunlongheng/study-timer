import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCountdownResult {
  timeLeft: number;
  isRunning: boolean;
  hasStarted: boolean;
  toggleStartStop: () => void;
}

/**
 * Wall-clock-anchored countdown. Instead of trusting a 1s setInterval tick
 * count (which drifts and gets throttled in background tabs), each tick
 * recomputes timeLeft from `endTime - Date.now()`. Re-syncs on
 * `visibilitychange` so returning to the tab immediately reflects the real
 * elapsed time instead of a stretched/throttled one.
 *
 * `resetToken` is any value that should restart the timer from `duration`
 * when it changes (e.g. the active mode id, so switching modes resets the
 * clock without needing a separate effect in the caller).
 */
export function useCountdown(
  duration: number,
  resetToken: string | number,
  onComplete: () => void
): UseCountdownResult {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const endTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Reset whenever the duration or the caller-supplied token changes.
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setHasStarted(false);
    endTimeRef.current = null;
    completedRef.current = false;
  }, [duration, resetToken]);

  const tick = useCallback(() => {
    if (endTimeRef.current === null) return;
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setTimeLeft(remaining);
    if (remaining <= 0 && !completedRef.current) {
      completedRef.current = true;
      setIsRunning(false);
      onCompleteRef.current();
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + timeLeft * 1000;
    }

    tick();
    const interval = setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- timeLeft is only read to seed endTimeRef on start
  }, [isRunning, tick]);

  const toggleStartStop = useCallback(() => {
    setIsRunning((running) => {
      if (!running && timeLeft <= 0) return running;
      const next = !running;
      if (!next) {
        // Pausing: drop the anchor so resuming recomputes it from the
        // timeLeft that was on screen, instead of the stale end time.
        endTimeRef.current = null;
      }
      return next;
    });
    setHasStarted(true);
  }, [timeLeft]);

  return { timeLeft, isRunning, hasStarted, toggleStartStop };
}
