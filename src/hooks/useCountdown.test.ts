import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ticks down while running', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useCountdown(10, 'reading', onComplete));

    expect(result.current.timeLeft).toBe(10);

    act(() => {
      result.current.toggleStartStop();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(7);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('fires completion exactly once when it reaches zero', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useCountdown(3, 'reading', onComplete));

    act(() => {
      result.current.toggleStartStop();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timeLeft).toBe(0);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(result.current.isRunning).toBe(false);

    // Further ticks (e.g. a lingering visibilitychange) must not fire again.
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('holds timeLeft steady while paused and resumes from the same value', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useCountdown(10, 'reading', onComplete));

    act(() => {
      result.current.toggleStartStop(); // start
    });
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.timeLeft).toBe(6);

    act(() => {
      result.current.toggleStartStop(); // pause
    });
    expect(result.current.isRunning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.timeLeft).toBe(6); // unchanged while paused

    act(() => {
      result.current.toggleStartStop(); // resume
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(5);
  });

  it('resets timeLeft, isRunning, and hasStarted when the duration changes', () => {
    const onComplete = vi.fn();
    const { result, rerender } = renderHook(({ duration }) => useCountdown(duration, 'reading', onComplete), {
      initialProps: { duration: 10 },
    });

    act(() => {
      result.current.toggleStartStop();
    });
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.timeLeft).toBe(6);
    expect(result.current.hasStarted).toBe(true);

    rerender({ duration: 20 });

    expect(result.current.timeLeft).toBe(20);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.hasStarted).toBe(false);
  });
});
