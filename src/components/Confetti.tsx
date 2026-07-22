import { useMemo } from 'react';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#FF1744', '#00E676', '#2979FF', '#FFD600'];
const PARTICLE_COUNT = 100;

interface Particle {
  id: number;
  left: number;
  size: number;
  color: string;
  rounded: boolean;
  opacity: number;
  duration: number;
  delay: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rounded: Math.random() > 0.5,
    opacity: 0.8 + Math.random() * 0.2,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 0.3,
  }));
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Only rendered while a burst is active (`{showConfetti && <Confetti />}`),
 * so this mounts fresh per burst - the particle list is memoized once per
 * mount rather than re-randomized/restarted on every parent re-render.
 */
export function Confetti() {
  const particles = useMemo(() => generateParticles(), []);

  if (prefersReducedMotion()) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.rounded ? '50%' : '0',
            opacity: p.opacity,
            animation: `confettiFall ${p.duration}s ease-out forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
