// Lazily-created, module-level AudioContext so we never leak a new context
// per completed session (browsers cap the number of live AudioContexts).
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextCtor) return null;

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }

  return audioContext;
}

/** Plays the two-tone completion chime used when a study session finishes. */
export function playCelebration(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playBeep = (freq: number, delay = 0) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }, delay);
    };

    playBeep(800, 0);
    playBeep(1000, 200);
  } catch (e) {
    console.warn('audio unavailable', e);
  }
}
