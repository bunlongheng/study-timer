interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
  title?: string;
  size?: 'md' | 'sm';
  onGradient?: [string, string];
}

const SIZES = {
  md: { track: 'w-14 h-8', knob: 'w-6 h-6', knobTop: 'top-1', knobOn: '30px', knobOff: '4px' },
  sm: { track: 'w-12 h-7', knob: 'w-6 h-6', knobTop: 'top-0.5', knobOn: '22px', knobOff: '2px' },
};

const DEFAULT_ON_GRADIENT: [string, string] = ['#5FD68A', '#4ADE80'];

/** Glassmorphism on/off switch shared by the theme toggle and per-mode enable toggles. */
export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled,
  title,
  size = 'md',
  onGradient = DEFAULT_ON_GRADIENT,
}: ToggleSwitchProps) {
  const s = SIZES[size];
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      title={title}
      className={`relative ${s.track} rounded-full transition-all duration-300 overflow-hidden focus-ring`}
      style={{
        background: checked ? `linear-gradient(135deg, ${onGradient[0]} 0%, ${onGradient[1]} 100%)` : 'rgba(107, 114, 128, 0.8)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full"
        style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)', pointerEvents: 'none' }}
      />
      <div
        className={`absolute ${s.knobTop} ${s.knob} bg-white rounded-full transition-all duration-300 overflow-hidden`}
        style={{ left: checked ? s.knobOn : s.knobOff, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2" style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)' }} />
      </div>
    </button>
  );
}
