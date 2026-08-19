import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsModal } from './SettingsModal';
import { MODES } from '../lib/constants';

function renderModal(overrides: Partial<Parameters<typeof SettingsModal>[0]> = {}) {
  const props = {
    isDarkMode: true,
    onToggleDarkMode: vi.fn(),
    sessionDuration: 900,
    onDurationChange: vi.fn(),
    onResetSessions: vi.fn(),
    userName: 'Norden',
    onSaveName: vi.fn(),
    modes: MODES,
    enabledModeIds: ['reading', 'writing'],
    onToggleModeEnabled: vi.fn(),
    onClose: vi.fn(),
    textColor: '#000',
    secondaryTextColor: '#666',
    ...overrides,
  };
  render(<SettingsModal {...props} />);
  return props;
}

describe('SettingsModal', () => {
  it('saves an edited name', () => {
    const props = renderModal();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByDisplayValue('Norden'), { target: { value: 'Mira' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(props.onSaveName).toHaveBeenCalledWith('Mira');
  });

  it('falls back to the current name when the input is blank', () => {
    const props = renderModal();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByDisplayValue('Norden'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(props.onSaveName).toHaveBeenCalledWith('Norden');
  });

  it('changes the session duration', () => {
    const props = renderModal();
    fireEvent.change(screen.getByLabelText(/session length|duration/i), {
      target: { value: '300' },
    });
    expect(props.onDurationChange).toHaveBeenCalledWith(300);
  });

  it('resets sessions', () => {
    const props = renderModal();
    fireEvent.click(screen.getByText(/reset sessions/i));
    expect(props.onResetSessions).toHaveBeenCalled();
  });

  it('closes on Escape', () => {
    const props = renderModal();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(props.onClose).toHaveBeenCalled();
  });
});
