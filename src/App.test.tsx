import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('App core flow', () => {
  it('locks a mode with a checkmark after completion and prevents reselecting it', () => {
    render(<App />);

    // Use a short session so the test can run it to completion.
    fireEvent.click(screen.getByLabelText('Open settings'));
    fireEvent.change(screen.getByLabelText('Session Duration'), { target: { value: '5' } });
    fireEvent.click(screen.getByLabelText('Close settings'));

    fireEvent.click(screen.getByLabelText('Switch to Writing mode'));
    expect(screen.getByRole('heading', { name: 'Writing' })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Start session'));
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const completedButton = screen.getByLabelText('Writing (completed)');
    expect(completedButton).toBeDisabled();

    fireEvent.click(completedButton);
    expect(screen.getByRole('heading', { name: 'Writing' })).toBeInTheDocument();
  });

  it('resets timeLeft and clears completedModes when the duration changes', () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByLabelText('Open settings'));
    fireEvent.change(screen.getByLabelText('Session Duration'), { target: { value: '5' } });
    fireEvent.click(screen.getByLabelText('Close settings'));

    fireEvent.click(screen.getByLabelText('Start session'));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByLabelText('Reading (completed)')).toBeDisabled();

    fireEvent.click(screen.getByLabelText('Open settings'));
    fireEvent.change(screen.getByLabelText('Session Duration'), { target: { value: '60' } });
    fireEvent.click(screen.getByLabelText('Close settings'));

    expect(container.textContent).toContain('01:00');
    expect(screen.getByLabelText('Switch to Reading mode')).toBeInTheDocument();
  });

  it('restores completed modes and session duration from localStorage after a remount', () => {
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByLabelText('Open settings'));
    fireEvent.change(screen.getByLabelText('Session Duration'), { target: { value: '5' } });
    fireEvent.click(screen.getByLabelText('Close settings'));

    fireEvent.click(screen.getByLabelText('Start session'));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByLabelText('Reading (completed)')).toBeDisabled();

    unmount();

    // Re-render a fresh App instance; useLocalStorage should hydrate from
    // the values the first instance persisted, not the module defaults.
    const { container } = render(<App />);

    expect(screen.getByLabelText('Reading (completed)')).toBeDisabled();
    expect(container.textContent).toContain('00:05');
  });

  it('guards against disabling the last enabled mode', () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText('Open settings'));
    for (const name of ['Writing', 'Math', 'Puzzle', 'Art']) {
      fireEvent.click(screen.getByLabelText(`Disable ${name} mode`));
    }

    const lastToggle = screen.getByLabelText('Disable Reading mode');
    expect(lastToggle).toBeDisabled();
  });
});
