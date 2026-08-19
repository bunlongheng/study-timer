import { useEffect, useMemo, useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import {
  DEFAULT_ENABLED_MODE_IDS,
  DEFAULT_SESSION_DURATION,
  DEFAULT_USER_NAME,
  MODES,
  STORAGE_KEYS,
} from './lib/constants';
import { glassCard } from './lib/theme';
import { playCelebration } from './lib/audio';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCountdown } from './hooks/useCountdown';
import { ModeSelector } from './components/ModeSelector';
import { TimerCircle } from './components/TimerCircle';
import { SettingsModal } from './components/SettingsModal';
import { Confetti } from './components/Confetti';
import { RippleLayer, type Ripple } from './components/RippleLayer';

function formatDateTime(date: Date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${dayName}, ${monthName} ${dayNum}, ${hours}:${minutes} ${ampm}`;
}

function App() {
  const [activeMode, setActiveMode] = useState(DEFAULT_ENABLED_MODE_IDS[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const [completedModes, setCompletedModes] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.completedModes, {});
  const [userName, setUserName] = useLocalStorage(STORAGE_KEYS.userName, DEFAULT_USER_NAME);
  const [sessionDuration, setSessionDuration] = useLocalStorage(STORAGE_KEYS.sessionDuration, DEFAULT_SESSION_DURATION);
  const [isDarkMode, setIsDarkMode] = useLocalStorage(STORAGE_KEYS.isDarkMode, true);
  const [enabledModeIds, setEnabledModeIds] = useLocalStorage<string[]>(STORAGE_KEYS.enabledModeIds, DEFAULT_ENABLED_MODE_IDS);

  const enabledModes = useMemo(() => MODES.filter((m) => enabledModeIds.includes(m.id)), [enabledModeIds]);
  const currentMode = MODES.find((m) => m.id === activeMode) ?? MODES[0];

  // Keep the clock in the header ticking.
  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // If the active mode gets disabled in Settings, fall back to the first
  // still-enabled mode instead of leaving the timer pointed at a hidden one.
  useEffect(() => {
    if (!enabledModeIds.includes(activeMode) && enabledModeIds.length > 0) {
      setActiveMode(enabledModeIds[0]);
    }
  }, [enabledModeIds, activeMode]);

  const handleComplete = () => {
    setCompletedModes((prev) => ({ ...prev, [activeMode]: true }));
    setShowConfetti(true);
    setAnnouncement(`${currentMode.name} session complete!`);
    playCelebration();
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const { timeLeft, isRunning, hasStarted, toggleStartStop } = useCountdown(sessionDuration, activeMode, handleComplete);

  const handleModeChange = (modeId: string) => {
    if (completedModes[modeId]) return;
    setActiveMode(modeId);
  };

  const handleDurationChange = (newDuration: number) => {
    setSessionDuration(newDuration);
    setCompletedModes({});
  };

  const handleResetSessions = () => {
    setCompletedModes({});
  };

  const toggleModeEnabled = (modeId: string) => {
    setEnabledModeIds((prev) => {
      const isEnabled = prev.includes(modeId);
      if (isEnabled && prev.length <= 1) return prev; // never disable the last mode
      return isEnabled ? prev.filter((id) => id !== modeId) : [...prev, modeId];
    });
  };

  const createRipple = (x: number, y: number, color?: string) => {
    const ripple: Ripple = { x, y, color, id: Date.now() + Math.random() };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 1000);
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      createRipple(e.clientX, e.clientY, currentMode.color);
    }
  };

  const bgColor = isDarkMode ? '#000000' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';

  return (
    <div
      className="h-screen flex items-center justify-center p-2"
      onClick={handlePageClick}
      style={{
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: bgColor,
        color: textColor,
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ['--focus-color' as string]: currentMode.color,
      }}
    >
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <main className="w-full max-w-6xl flex flex-col items-center h-full py-2 landscape-container">
        <div className="w-full px-2 mb-2 lg-land:mb-1 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="text-left flex-shrink-0">
              <span className="text-xs" style={{ color: secondaryTextColor }}>
                {formatDateTime(currentDateTime)}
              </span>
            </div>
            <button
              ref={settingsButtonRef}
              type="button"
              onClick={() => setShowSettings(true)}
              aria-label="Open settings"
              className="p-2 rounded-full transition-all hover:scale-110 flex-shrink-0 focus-ring"
              style={{ ...glassCard(isDarkMode), boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)' }}
            >
              <Settings className="w-5 h-5" style={{ color: textColor }} />
            </button>
          </div>
          <div className="text-left">
            <span className="text-xs" style={{ color: secondaryTextColor }}>
              {userName}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col lg-land:flex-row items-center justify-center lg-land:justify-evenly lg-land:gap-8 min-h-0">
          <div className="flex flex-col items-center lg-land:items-center justify-center lg-land:flex-shrink-0">
            <h1
              className="font-thin text-center tracking-wide mb-2 lg-land:mb-3 px-4"
              style={{ color: currentMode.color, fontWeight: '200', letterSpacing: '0.05em', fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
            >
              {currentMode.name}
            </h1>

            <ModeSelector
              modes={enabledModes}
              activeMode={activeMode}
              completedModes={completedModes}
              ripples={ripples}
              onSelect={(mode, e) => {
                createRipple(e.clientX, e.clientY, mode.color);
                handleModeChange(mode.id);
              }}
            />
          </div>

          <div className="flex items-center justify-center lg-land:flex-shrink-0 mt-1 lg-land:mt-0">
            <TimerCircle
              mode={currentMode}
              timeLeft={timeLeft}
              sessionDuration={sessionDuration}
              isRunning={isRunning}
              hasStarted={hasStarted}
              textColor={textColor}
              isDarkMode={isDarkMode}
              ripples={ripples}
              onToggle={(e) => {
                createRipple(e.clientX, e.clientY, currentMode.color);
                toggleStartStop();
              }}
            />
          </div>
        </div>

        <RippleLayer ripples={ripples} />
      </main>

      {showConfetti && <Confetti />}

      {showSettings && (
        <SettingsModal
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((v) => !v)}
          sessionDuration={sessionDuration}
          onDurationChange={handleDurationChange}
          onResetSessions={handleResetSessions}
          userName={userName}
          onSaveName={setUserName}
          modes={MODES}
          enabledModeIds={enabledModeIds}
          onToggleModeEnabled={toggleModeEnabled}
          onClose={() => {
            setShowSettings(false);
            settingsButtonRef.current?.focus();
          }}
          textColor={textColor}
          secondaryTextColor={secondaryTextColor}
        />
      )}
    </div>
  );
}

export default App;
