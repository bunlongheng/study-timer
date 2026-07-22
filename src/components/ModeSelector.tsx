import type { Mode } from '../lib/constants';
import type { Ripple } from './RippleLayer';

interface ModeSelectorProps {
  modes: Mode[];
  activeMode: string;
  completedModes: Record<string, boolean>;
  ripples: Ripple[];
  onSelect: (mode: Mode, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ModeSelector({ modes, activeMode, completedModes, ripples, onSelect }: ModeSelectorProps) {
  return (
    <div className="mb-2 lg-land:mb-3 flex justify-center">
      <div className="flex items-center gap-2 lg-land:gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = mode.id === activeMode;
          const isCompleted = completedModes[mode.id] === true;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={(e) => onSelect(mode, e)}
              disabled={isCompleted}
              aria-label={isCompleted ? `${mode.name} (completed)` : `Switch to ${mode.name} mode`}
              aria-pressed={isActive}
              className="relative transition-all duration-300 overflow-hidden focus-ring"
              style={{
                '--focus-color': mode.color,
                width: isActive ? '64px' : '46px',
                height: isActive ? '64px' : '46px',
                cursor: isCompleted ? 'not-allowed' : 'pointer',
                filter: isActive && !isCompleted ? `drop-shadow(0 0 10px ${mode.color}) drop-shadow(0 0 5px ${mode.color})` : 'none',
                transition: 'width 0.3s ease, height 0.3s ease',
              } as React.CSSProperties}
            >
              <div
                className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: isCompleted
                    ? 'rgba(58, 58, 58, 0.3)'
                    : isActive
                      ? `linear-gradient(135deg, ${mode.bgColor} 0%, ${mode.color} 100%)`
                      : mode.bgColor,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${isCompleted ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
                  boxShadow:
                    isActive && !isCompleted
                      ? `0 8px 32px ${mode.color}40, inset 0 1px 0 rgba(255, 255, 255, 0.4)`
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)',
                  filter: isCompleted ? 'grayscale(100%)' : 'none',
                  opacity: isCompleted ? 0.3 : isActive ? 1 : 0.6,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1/3 rounded-t-2xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <Icon className="w-1/2 h-1/2 relative z-10" strokeWidth={2.5} style={{ color: isCompleted ? '#666666' : 'white' }} />
                {isCompleted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={isActive ? 'text-2xl' : 'text-lg'}
                      style={{ color: '#22C55E', textShadow: '0 0 10px rgba(34, 197, 94, 0.8)', fontWeight: 'bold' }}
                    >
                      ✓
                    </div>
                  </div>
                )}
                {ripples
                  .filter((r) => r.color === mode.color)
                  .map((ripple) => (
                    <div
                      key={ripple.id}
                      className="absolute rounded-full pointer-events-none ripple-anim"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '10px',
                        height: '10px',
                        backgroundColor: mode.color,
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.2,
                      }}
                    />
                  ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
