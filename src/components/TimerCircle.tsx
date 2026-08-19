import type { Mode } from '../lib/constants';
import { CIRCUMFERENCE } from '../lib/constants';
import { MillisecondDisplay } from './MillisecondDisplay';
import type { Ripple } from './RippleLayer';

interface TimerCircleProps {
  mode: Mode;
  timeLeft: number;
  sessionDuration: number;
  isRunning: boolean;
  hasStarted: boolean;
  textColor: string;
  isDarkMode: boolean;
  ripples: Ripple[];
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function formatSeconds(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function TimerCircle({
  mode,
  timeLeft,
  sessionDuration,
  isRunning,
  hasStarted,
  textColor,
  isDarkMode,
  ripples,
  onToggle,
}: TimerCircleProps) {
  const progress = ((sessionDuration - timeLeft) / sessionDuration) * CIRCUMFERENCE;
  const isFinished = timeLeft === 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isFinished}
      aria-label={isFinished ? `${mode.name} session complete` : isRunning ? 'Pause session' : hasStarted ? 'Resume session' : 'Start session'}
      className="relative transition-all duration-200 overflow-hidden timer-circle focus-ring"
      style={
        {
          '--focus-color': mode.color,
          cursor: isFinished ? 'default' : 'pointer',
          opacity: isFinished ? 0.5 : 1,
        } as React.CSSProperties
      }
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <defs>
          <linearGradient id={`emptyGradient-${mode.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: mode.color, stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.25 }} />
            <stop offset="100%" style={{ stopColor: mode.color, stopOpacity: 0.35 }} />
          </linearGradient>
          <linearGradient id={`progressGradient-${mode.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
            <stop offset="15%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.7 }} />
            <stop offset="40%" style={{ stopColor: mode.color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: mode.color, stopOpacity: 0.85 }} />
          </linearGradient>
          <filter id={`gloss-${mode.id}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="-1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="85" fill="none" stroke={`url(#emptyGradient-${mode.id})`} strokeWidth="14" opacity="0.9" />
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke={`url(#progressGradient-${mode.id})`}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE - progress}
          filter={`url(#gloss-${mode.id})`}
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="flex flex-col items-center gap-1">
          <div
            className="text-3xl sm:text-4xl lg-land:text-4xl font-bold"
            style={{
              color: textColor,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              fontWeight: '300',
            }}
          >
            {formatSeconds(timeLeft)}
            <MillisecondDisplay isRunning={isRunning} />
          </div>
          {!isRunning && !isFinished && hasStarted && (
            <div
              className="text-xs font-medium tracking-wider uppercase px-2 py-0.5 rounded-md"
              style={{
                color: '#EF4444',
                background: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(243, 244, 246, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '12px',
              }}
            >
              Paused
            </div>
          )}
          {!isFinished && (
            <div
              className="mt-1 text-xs font-medium tracking-widest uppercase"
              style={{
                color: mode.color,
                opacity: 0.8,
                letterSpacing: '0.15em',
                textShadow: `0 0 12px ${mode.color}40`,
              }}
            >
              {isRunning ? 'Tap to Pause' : hasStarted ? 'Tap to Resume' : 'Tap to Start'}
            </div>
          )}
        </div>
      </div>
      {ripples
        .filter((r) => r.color === mode.color)
        .map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none ripple-anim"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              backgroundColor: mode.color,
              transform: 'translate(-50%, -50%)',
              opacity: 0.2,
            }}
          />
        ))}
    </button>
  );
}
