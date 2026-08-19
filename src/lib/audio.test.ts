import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function makeMockAudioContext() {
  const osc = {
    connect: vi.fn(),
    frequency: { value: 0 },
    type: '',
    start: vi.fn(),
    stop: vi.fn(),
  };
  const gain = {
    connect: vi.fn(),
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  };
  const ctx = {
    currentTime: 0,
    destination: {},
    createOscillator: vi.fn(() => osc),
    createGain: vi.fn(() => gain),
  };
  const Ctor = vi.fn(() => ctx);
  return { Ctor, ctx, osc, gain };
}

describe('playCelebration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules(); // fresh module = fresh cached AudioContext per test
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('plays a two-tone chime through the Web Audio API', async () => {
    const { Ctor, osc } = makeMockAudioContext();
    vi.stubGlobal('AudioContext', Ctor);
    const { playCelebration } = await import('./audio');

    playCelebration();
    vi.advanceTimersByTime(300);

    // Two beeps at 800Hz then 1000Hz.
    expect(osc.start).toHaveBeenCalledTimes(2);
    expect(osc.stop).toHaveBeenCalledTimes(2);
    expect(osc.type).toBe('sine');
  });

  it('never throws even if constructing the AudioContext fails', async () => {
    const throwingCtor = vi.fn(() => {
      throw new Error('no audio device');
    });
    vi.stubGlobal('AudioContext', throwingCtor);
    vi.stubGlobal('webkitAudioContext', undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { playCelebration } = await import('./audio');

    expect(() => playCelebration()).not.toThrow();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
