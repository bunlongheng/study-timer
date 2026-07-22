import { useEffect, useRef, useState } from 'react';
import { Moon, Sun, X } from 'lucide-react';
import type { Mode } from '../lib/constants';
import { SESSION_DURATION_OPTIONS } from '../lib/constants';
import { glassCard } from '../lib/theme';
import { ToggleSwitch } from './ToggleSwitch';

const THEME_ON_GRADIENT: [string, string] = ['#5AB2FF', '#4A9FF5'];

interface SettingsModalProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  sessionDuration: number;
  onDurationChange: (duration: number) => void;
  onResetSessions: () => void;
  userName: string;
  onSaveName: (name: string) => void;
  modes: Mode[];
  enabledModeIds: string[];
  onToggleModeEnabled: (modeId: string) => void;
  onClose: () => void;
  textColor: string;
  secondaryTextColor: string;
}

const DURATION_SELECT_ID = 'session-duration-select';
const NAME_INPUT_ID = 'user-name-input';

export function SettingsModal({
  isDarkMode,
  onToggleDarkMode,
  sessionDuration,
  onDurationChange,
  onResetSessions,
  userName,
  onSaveName,
  modes,
  enabledModeIds,
  onToggleModeEnabled,
  onClose,
  textColor,
  secondaryTextColor,
}: SettingsModalProps) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleSaveName = () => {
    onSaveName(tempName.trim() || userName);
    setEditingName(false);
  };

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className={`w-full max-w-lg rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto ${isDarkMode ? 'settings-scroll-dark' : 'settings-scroll-light'}`}
        style={{ ...glassCard(isDarkMode), backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-all focus-ring"
          style={glassCard(isDarkMode, 'strong')}
        >
          <X className="w-5 h-5" style={{ color: textColor }} />
        </button>
        <h2 className="text-3xl font-bold mb-6" style={{ color: textColor }}>
          Settings
        </h2>

        <div className="mb-6 p-4 rounded-2xl" style={glassCard(isDarkMode, 'strong')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium">Theme</span>
            </div>
            <ToggleSwitch checked={isDarkMode} onChange={onToggleDarkMode} label="Toggle dark mode" onGradient={THEME_ON_GRADIENT} />
          </div>
        </div>

        <div className="mb-6 p-4 rounded-2xl" style={glassCard(isDarkMode, 'strong')}>
          <label htmlFor={DURATION_SELECT_ID} className="block font-medium mb-3">
            Session Duration
          </label>
          <select
            id={DURATION_SELECT_ID}
            value={sessionDuration}
            onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}
            className="w-full px-4 py-3 rounded-lg outline-none font-medium focus-ring"
            style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: textColor,
              border: '2px solid #5AB2FF',
            }}
          >
            {SESSION_DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs mt-2" style={{ color: secondaryTextColor }}>
            Changing duration will reset all timers
          </p>
        </div>

        <div className="mb-6 p-4 rounded-2xl" style={glassCard(isDarkMode, 'strong')}>
          <label htmlFor={NAME_INPUT_ID} className="block font-medium mb-2">
            Name
          </label>
          {editingName ? (
            <div className="flex gap-2">
              <input
                id={NAME_INPUT_ID}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg outline-none focus-ring"
                style={{
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: textColor,
                  border: '2px solid #5AB2FF',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="px-4 py-2 text-white rounded-lg font-medium hover:scale-105 transition-all relative overflow-hidden focus-ring"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' }}
              >
                <span className="relative z-10">Save</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span style={{ color: textColor }}>
                {userName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditingName(true);
                  setTempName(userName);
                }}
                className="px-4 py-2 text-white rounded-lg font-medium hover:scale-105 transition-all relative overflow-hidden focus-ring"
                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' }}
              >
                <span className="relative z-10">Edit</span>
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>
            Manage Modes
          </h3>
          <div className="space-y-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isEnabled = enabledModeIds.includes(mode.id);
              const isOnlyEnabled = isEnabled && enabledModeIds.length <= 1;

              return (
                <div key={mode.id} className="flex items-center justify-between p-3 rounded-xl" style={glassCard(isDarkMode, 'strong')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: mode.bgColor }}>
                      <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-medium" style={{ color: textColor }}>
                      {mode.name}
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={isEnabled}
                    onChange={() => onToggleModeEnabled(mode.id)}
                    label={`${isEnabled ? 'Disable' : 'Enable'} ${mode.name} mode`}
                    disabled={isOnlyEnabled}
                    title={isOnlyEnabled ? 'At least one mode must stay enabled' : undefined}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onResetSessions}
          aria-label="Reset all completed sessions"
          className="w-full px-4 py-3 text-white rounded-lg font-medium hover:scale-[1.02] transition-all relative overflow-hidden focus-ring"
          style={{ background: 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' }}
        >
          <span className="relative z-10">Reset sessions</span>
        </button>
      </div>
    </div>
  );
}
