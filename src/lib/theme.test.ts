import { describe, expect, it } from 'vitest';
import { glassCard } from './theme';

describe('glassCard', () => {
  it('uses the dark soft background by default', () => {
    const style = glassCard(true);
    expect(style.background).toBe('rgba(26, 26, 26, 0.6)');
    expect(style.border).toBe('1px solid rgba(255, 255, 255, 0.1)');
  });

  it('uses the light soft background in light mode', () => {
    const style = glassCard(false);
    expect(style.background).toBe('rgba(243, 244, 246, 0.6)');
    expect(style.border).toBe('1px solid rgba(0, 0, 0, 0.1)');
  });

  it('uses the dark strong background when strength is strong', () => {
    expect(glassCard(true, 'strong').background).toBe('rgba(42, 42, 42, 0.6)');
  });

  it('uses the light strong background when strength is strong', () => {
    expect(glassCard(false, 'strong').background).toBe('rgba(229, 231, 235, 0.6)');
  });

  it('always applies the blur backdrop filter', () => {
    const style = glassCard(true);
    expect(style.backdropFilter).toBe('blur(20px)');
    expect(style.WebkitBackdropFilter).toBe('blur(20px)');
  });
});
