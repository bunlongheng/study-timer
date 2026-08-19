import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('missing', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('hydrates from an existing stored value', () => {
    window.localStorage.setItem('name', JSON.stringify('Norden'));
    const { result } = renderHook(() => useLocalStorage('name', 'default'));
    expect(result.current[0]).toBe('Norden');
  });

  it('persists updates back to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
    expect(window.localStorage.getItem('count')).toBe('5');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 1));
    act(() => result.current[1]((prev) => prev + 2));
    expect(result.current[0]).toBe(3);
  });

  it('falls back to the initial value when the stored JSON is malformed', () => {
    window.localStorage.setItem('broken', '{not json');
    const { result } = renderHook(() => useLocalStorage('broken', 'safe'));
    expect(result.current[0]).toBe('safe');
  });

  it('swallows write failures instead of throwing', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });
    const { result } = renderHook(() => useLocalStorage('key', 'v'));
    expect(() => act(() => result.current[1]('new'))).not.toThrow();
    expect(result.current[0]).toBe('new');
    spy.mockRestore();
  });
});
