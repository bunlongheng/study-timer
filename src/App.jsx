import React, { useState, useEffect } from 'react';
import { BookOpen, Pencil, Hash, Puzzle, Palette, Music, Gamepad2, Settings, X, Moon, Sun } from 'lucide-react';

const TimerApp = () => {
  const [activeMode, setActiveMode] = useState('reading');
  const [timeLeft, setTimeLeft] = useState(900);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userName, setUserName] = useState('Norden Heng');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('Norden Heng');
  const [completedModes, setCompletedModes] = useState({});
  const [sessionDuration, setSessionDuration] = useState(900);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [ripples, setRipples] = useState([]);
  const [milliseconds, setMilliseconds] = useState(0);

  const [modes, setModes] = useState([
    { id: 'reading', name: 'Reading', icon: 'BookOpen', color: '#4A9FF5', bgColor: '#5AB2FF', enabled: true },
    { id: 'writing', name: 'Writing', icon: 'Pencil', color: '#F89057', bgColor: '#FF9A6C', enabled: true },
    { id: 'math', name: 'Math', icon: 'Hash', color: '#D946EF', bgColor: '#E879F9', enabled: true },
    { id: 'puzzle', name: 'Puzzle', icon: 'Puzzle', color: '#9B7EDE', bgColor: '#B494FF', enabled: true },
    { id: 'art', name: 'Art', icon: 'Palette', color: '#EAB308', bgColor: '#FDE047', enabled: true },
    { id: 'music', name: 'Music', icon: 'Music', color: '#5FD68A', bgColor: '#75E89D', enabled: false },
    { id: 'game', name: 'Game', icon: 'Gamepad2', color: '#FF6B9D', bgColor: '#FF8FB3', enabled: false }
  ]);

  const iconMap = { BookOpen, Pencil, Hash, Puzzle, Palette, Music, Gamepad2 };
  const currentMode = modes.find(m => m.id === activeMode);
  const enabledModes = modes.filter(m => m.enabled);

  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[currentDateTime.getDay()];
    const monthName = months[currentDateTime.getMonth()];
    const date = currentDateTime.getDate();
    let hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${dayName}, ${monthName} ${date}, ${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    let interval;
    let msInterval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      msInterval = setInterval(() => setMilliseconds(prev => (prev + 1) % 100), 10);
    } else if (timeLeft === 0 && !completedModes[activeMode]) {
      setIsRunning(false);
      const updatedCompleted = { ...completedModes, [activeMode]: true };
      setCompletedModes(updatedCompleted);
      setShowConfetti(true);
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const playBeep = (freq, delay = 0) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.5);
          }, delay);
        };
        playBeep(800, 0);
        playBeep(1000, 200);
      } catch (e) {}
      
      setTimeout(() => setShowConfetti(false), 4000);
    } else if (!isRunning) {
      setMilliseconds(0);
    }
    return () => {
      clearInterval(interval);
      clearInterval(msInterval);
    };
  }, [isRunning, timeLeft, activeMode, completedModes]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const ms = milliseconds.toString().padStart(2, '0');
    return { main: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`, ms };
  };

  const progress = ((sessionDuration - timeLeft) / sessionDuration) * 534;

  const handleStartStop = () => {
    if (!hasStarted) setHasStarted(true);
    setIsRunning(!isRunning);
  };

  const handleModeChange = (modeId) => {
    if (completedModes[modeId]) return;
    setActiveMode(modeId);
    setTimeLeft(sessionDuration);
    setIsRunning(false);
    setHasStarted(false);
  };

  const handleDurationChange = (newDuration) => {
    setSessionDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
    setHasStarted(false);
    setCompletedModes({});
  };

  const toggleModeEnabled = (modeId) => {
    setModes(modes.map(m => m.id === modeId ? { ...m, enabled: !m.enabled } : m));
  };

  const saveName = () => {
    setUserName(tempName);
    setEditingName(false);
  };

  const createRipple = (e, color) => {
    const x = e.clientX;
    const y = e.clientY;
    const ripple = {
      x,
      y,
      color,
      id: Date.now() + Math.random(),
      isPageRipple: true
    };
    setRipples(prev => [...prev, ripple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 1000);
  };

  const handlePageClick = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.ripple-container')) {
      createRipple(e, currentMode?.color);
    }
  };

  const bgColor = isDarkMode ? '#000000' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const cardBg = isDarkMode ? 'rgba(26, 26, 26, 0.6)' : 'rgba(243, 244, 246, 0.6)';

  return (
    <div 
      className="h-screen flex items-center justify-center p-2 ripple-container" 
      onClick={handlePageClick}
      style={{ 
        fontFamily: 'Poppins, system-ui, sans-serif',
        backgroundColor: bgColor,
        color: textColor,
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}>
      <div className="w-full max-w-6xl flex flex-col items-center h-full py-2 landscape-container">
        {/* Header row */}
        <div className="w-full px-2 mb-2 lg-land:mb-1 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="text-left flex-shrink-0">
              <span className="text-xs" style={{ color: secondaryTextColor }}>{formatDateTime()}</span>
            </div>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-full transition-all hover:scale-110 flex-shrink-0" style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
              <Settings className="w-5 h-5" style={{ color: textColor }} />
            </button>
          </div>
          <div className="text-left">
            <span className="text-xs" style={{ color: secondaryTextColor }}>{userName}</span>
          </div>
        </div>

        {/* Main content area - switches to horizontal on landscape tablets */}
        <div className="flex-1 w-full flex flex-col lg-land:flex-row items-center justify-center lg-land:justify-evenly lg-land:gap-8 min-h-0">
          
          {/* Left side on landscape: title + mode icons + start button */}
          <div className="flex flex-col items-center lg-land:items-center justify-center lg-land:flex-shrink-0">
            <h1 className="font-thin text-center tracking-wide mb-3 lg-land:mb-4 px-4" style={{ 
              color: currentMode?.color,
              fontWeight: '200',
              letterSpacing: '0.05em',
              fontSize: 'clamp(2rem, 6vw, 5rem)'
            }}>
              {currentMode?.name}
            </h1>

            <div className="mb-3 lg-land:mb-4 flex justify-center">
              <div className="flex items-center gap-3 lg-land:gap-3">
                {enabledModes.map((mode) => {
                  const Icon = iconMap[mode.icon];
                  const isActive = mode.id === activeMode;
                  const isCompleted = completedModes[mode.id] === true;
                  
                  return (
                    <button
                      key={mode.id}
                      onClick={(e) => {
                        createRipple(e, mode.color);
                        handleModeChange(mode.id);
                      }}
                      disabled={isCompleted}
                      className="relative transition-all duration-300 overflow-hidden"
                      style={{
                        width: isActive ? '72px' : '52px',
                        height: isActive ? '72px' : '52px',
                        cursor: isCompleted ? 'not-allowed' : 'pointer',
                        filter: isActive && !isCompleted ? `drop-shadow(0 0 10px ${mode.color}) drop-shadow(0 0 5px ${mode.color})` : 'none',
                        transition: 'width 0.3s ease, height 0.3s ease'
                      }}
                    >
                      <div className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden" style={{
                        background: isCompleted ? 'rgba(58, 58, 58, 0.3)' : (isActive && !isCompleted ? `linear-gradient(135deg, ${mode.bgColor} 0%, ${mode.color} 100%)` : mode.bgColor),
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: `1px solid ${isCompleted ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
                        boxShadow: isActive && !isCompleted ? `0 8px 32px ${mode.color}40, inset 0 1px 0 rgba(255, 255, 255, 0.4)` : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        filter: isCompleted ? 'grayscale(100%)' : 'none',
                        opacity: isCompleted ? 0.3 : (isActive ? 1 : 0.6)
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-2xl" style={{
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
                          pointerEvents: 'none'
                        }}></div>
                        <Icon className="w-1/2 h-1/2 relative z-10" strokeWidth={2.5} style={{ color: isCompleted ? '#666666' : 'white' }} />
                        {isCompleted && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={isActive ? "text-2xl" : "text-lg"} style={{ color: '#22C55E', textShadow: '0 0 10px rgba(34, 197, 94, 0.8)', fontWeight: 'bold' }}>✓</div>
                          </div>
                        )}
                        {ripples.filter(r => r.color === mode.color).map(ripple => (
                          <div
                            key={ripple.id}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                              left: ripple.x,
                              top: ripple.y,
                              width: '10px',
                              height: '10px',
                              backgroundColor: mode.color,
                              transform: 'translate(-50%, -50%)',
                              animation: 'rippleEffect 1s ease-out',
                              opacity: 0.2
                            }}
                          />
                        ))}
                        {ripples.filter(r => r.color === mode.color && !r.isPageRipple).map(ripple => (
                          <div
                            key={ripple.id}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                              left: ripple.x,
                              top: ripple.y,
                              width: '10px',
                              height: '10px',
                              backgroundColor: mode.color,
                              transform: 'translate(-50%, -50%)',
                              animation: 'rippleEffect 1s ease-out',
                              opacity: 0.2
                            }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start/Pause button - below icons on landscape */}
            {timeLeft !== 0 && (
              <button 
                onClick={(e) => {
                  createRipple(e, currentMode?.color);
                  handleStartStop();
                }} 
                className="px-8 py-3 rounded-full font-semibold text-white text-base transition-all duration-200 hover:scale-105 flex items-center gap-2 relative overflow-hidden" 
                style={{ 
                  background: 'rgba(75, 85, 99, 0.6)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(75, 85, 99, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                }}>
                <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full" style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)',
                  pointerEvents: 'none'
                }}></div>
                <span className="text-lg">{isRunning ? '⏸' : '▶'}</span>
                <span className="relative z-10">{isRunning ? 'Pause' : 'Start'}</span>
                {ripples.filter(r => r.color === currentMode?.color).map(ripple => (
                  <div
                    key={ripple.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: '15px',
                      height: '15px',
                      backgroundColor: currentMode?.color,
                      transform: 'translate(-50%, -50%)',
                      animation: 'rippleEffect 1s ease-out',
                      opacity: 0.2
                    }}
                  />
                ))}
              </button>
            )}
          </div>

          {/* Right side on landscape: timer circle */}
          <div className="flex items-center justify-center lg-land:flex-shrink-0 mt-2 lg-land:mt-0">
            <button 
              onClick={(e) => {
                createRipple(e, currentMode?.color);
                handleStartStop();
              }} 
              disabled={timeLeft === 0} 
              className="relative transition-all duration-200 overflow-hidden timer-circle" 
              style={{ 
              cursor: timeLeft === 0 ? 'default' : 'pointer',
              opacity: timeLeft === 0 ? 0.5 : 1
            }}>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id={`emptyGradient-${activeMode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: currentMode?.color, stopOpacity: 0.4 }} />
                    <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.25 }} />
                    <stop offset="100%" style={{ stopColor: currentMode?.color, stopOpacity: 0.35 }} />
                  </linearGradient>
                  <linearGradient id={`progressGradient-${activeMode}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                    <stop offset="15%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.7 }} />
                    <stop offset="40%" style={{ stopColor: currentMode?.color, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: currentMode?.color, stopOpacity: 0.85 }} />
                  </linearGradient>
                  <filter id={`gloss-${activeMode}`}>
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="0" dy="-1" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge> 
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="100" cy="100" r="85" fill="none" stroke={`url(#emptyGradient-${activeMode})`} strokeWidth="14" opacity="0.9" />
                <circle cx="100" cy="100" r="85" fill="none" stroke={`url(#progressGradient-${activeMode})`} strokeWidth="16" strokeLinecap="round" strokeDasharray="534" strokeDashoffset={534 - progress} filter={`url(#gloss-${activeMode})`} style={{ 
                  transition: 'stroke-dashoffset 0.5s linear'
                }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl lg-land:text-4xl font-bold" style={{ 
                    color: textColor,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                    fontWeight: '300'
                  }}>
                    {formatTime(timeLeft).main}
                    <span className="text-lg opacity-60">.{formatTime(timeLeft).ms}</span>
                  </div>
                  {!isRunning && timeLeft !== 0 && hasStarted && (
                    <div className="mt-1 text-xs font-medium tracking-wider uppercase px-2 py-0.5 rounded-md" style={{ 
                      color: '#EF4444',
                      background: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(243, 244, 246, 0.8)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid rgba(239, 68, 68, 0.3)`,
                      fontSize: '9px'
                    }}>
                      Paused
                    </div>
                  )}
                </div>
              </div>
              {ripples.filter(r => r.color === currentMode?.color).map(ripple => (
                <div
                  key={ripple.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: '20px',
                    height: '20px',
                    backgroundColor: currentMode?.color,
                    transform: 'translate(-50%, -50%)',
                    animation: 'rippleEffect 1s ease-out',
                    opacity: 0.2
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Global ripple effect */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="absolute rounded-full"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: '20px',
                height: '20px',
                border: `3px solid ${ripple.color}`,
                backgroundColor: 'transparent',
                transform: 'translate(-50%, -50%)',
                animation: 'rippleEffect 1s ease-out'
              }}
            />
          ))}
        </div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="absolute" style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 8}px`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#FF1744', '#00E676', '#2979FF', '#FFD600'][Math.floor(Math.random() * 10)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              opacity: 0.8 + Math.random() * 0.2,
              animation: `confettiFall ${2 + Math.random() * 3}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.3}s`
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes rippleEffect {
          0% {
            width: 20px;
            height: 20px;
            opacity: 0.8;
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }
      `}</style>

      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} onClick={() => setShowSettings(false)}>
          <div className="w-full max-w-lg rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto" style={{ 
            background: cardBg,
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-all" style={{ 
              background: isDarkMode ? 'rgba(42, 42, 42, 0.6)' : 'rgba(229, 231, 235, 0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
              <X className="w-5 h-5" style={{ color: textColor }} />
            </button>
            <h2 className="text-3xl font-bold mb-6" style={{ color: textColor }}>Settings</h2>

            <div className="mb-6 p-4 rounded-2xl" style={{ 
              background: isDarkMode ? 'rgba(42, 42, 42, 0.6)' : 'rgba(229, 231, 235, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="font-medium">Theme</span>
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="relative w-14 h-8 rounded-full transition-all duration-300 overflow-hidden" style={{ 
                  background: isDarkMode ? 'linear-gradient(135deg, #5AB2FF 0%, #4A9FF5 100%)' : 'rgba(156, 163, 175, 0.8)',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.3)'
                }}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full" style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
                    pointerEvents: 'none'
                  }}></div>
                  <div className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 overflow-hidden" style={{ 
                    left: isDarkMode ? '30px' : '4px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}>
                    <div className="absolute top-0 left-0 right-0 h-1/2" style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)'
                    }}></div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-2xl" style={{ 
              background: isDarkMode ? 'rgba(42, 42, 42, 0.6)' : 'rgba(229, 231, 235, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
              <label className="block font-medium mb-3">Session Duration</label>
              <select value={sessionDuration} onChange={(e) => handleDurationChange(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-lg outline-none font-medium" style={{ 
                background: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: textColor, 
                border: '2px solid #5AB2FF' 
              }}>
                <option value={5}>5 seconds (test)</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={900}>15 minutes</option>
              </select>
              <p className="text-xs mt-2" style={{ color: secondaryTextColor }}>Changing duration will reset all timers</p>
            </div>

            <div className="mb-6 p-4 rounded-2xl" style={{ 
              background: isDarkMode ? 'rgba(42, 42, 42, 0.6)' : 'rgba(229, 231, 235, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
              <label className="block font-medium mb-2">Name</label>
              {editingName ? (
                <div className="flex gap-2">
                  <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="flex-1 px-3 py-2 rounded-lg outline-none" style={{ 
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: textColor, 
                    border: '2px solid #5AB2FF',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }} />
                  <button onClick={saveName} className="px-4 py-2 text-white rounded-lg font-medium hover:scale-105 transition-all relative overflow-hidden" style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}>
                    <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-lg" style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)',
                      pointerEvents: 'none'
                    }}></div>
                    <span className="relative z-10">Save</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span style={{ color: textColor }}>{userName}</span>
                  <button onClick={() => { setEditingName(true); setTempName(userName); }} className="px-4 py-2 text-white rounded-lg font-medium hover:scale-105 transition-all relative overflow-hidden" style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}>
                    <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-lg" style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)',
                      pointerEvents: 'none'
                    }}></div>
                    <span className="relative z-10">Edit</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>Manage Modes</h3>
              <div className="space-y-2">
                {modes.map(mode => (
                  <div key={mode.id} className="flex items-center justify-between p-3 rounded-xl" style={{ 
                    background: isDarkMode ? 'rgba(42, 42, 42, 0.6)' : 'rgba(229, 231, 235, 0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: mode.bgColor }}>
                        {React.createElement(iconMap[mode.icon], { className: "w-5 h-5 text-white", strokeWidth: 2.5 })}
                      </div>
                      <span className="font-medium" style={{ color: textColor }}>{mode.name}</span>
                    </div>
                    <button onClick={() => toggleModeEnabled(mode.id)} className="relative w-12 h-7 rounded-full transition-all duration-300 overflow-hidden" style={{ 
                      background: mode.enabled ? 'linear-gradient(135deg, #5FD68A 0%, #4ADE80 100%)' : 'rgba(107, 114, 128, 0.8)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 -1px 2px rgba(255, 255, 255, 0.3)'
                    }}>
                      <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full" style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
                        pointerEvents: 'none'
                      }}></div>
                      <div className="absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all duration-300 overflow-hidden" style={{ 
                        left: mode.enabled ? '22px' : '2px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-1/2" style={{
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)'
                        }}></div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerApp;
