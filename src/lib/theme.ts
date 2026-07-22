import type { CSSProperties } from 'react';

/**
 * Shared glassmorphism panel style (frosted background + border), used for
 * the settings modal sections, header buttons, and badges. `strength`
 * controls the background opacity/shade to match the original two variants
 * that were previously duplicated inline across the component.
 */
export function glassCard(isDarkMode: boolean, strength: 'soft' | 'strong' = 'soft'): CSSProperties {
  const background =
    strength === 'strong'
      ? isDarkMode
        ? 'rgba(42, 42, 42, 0.6)'
        : 'rgba(229, 231, 235, 0.6)'
      : isDarkMode
        ? 'rgba(26, 26, 26, 0.6)'
        : 'rgba(243, 244, 246, 0.6)';

  return {
    background,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  };
}
