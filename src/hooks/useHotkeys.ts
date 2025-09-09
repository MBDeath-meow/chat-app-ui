import { useEffect } from 'react';

interface Hotkey {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  preventDefault?: boolean;
}

export function useHotkeys(hotkeys: Hotkey[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const hotkey of hotkeys) {
        const matchesKey = event.key.toLowerCase() === hotkey.key.toLowerCase();
        const matchesCtrl = !!hotkey.ctrlKey === event.ctrlKey;
        const matchesShift = !!hotkey.shiftKey === event.shiftKey;
        const matchesAlt = !!hotkey.altKey === event.altKey;
        const matchesMeta = !!hotkey.metaKey === event.metaKey;

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
          if (hotkey.preventDefault !== false) {
            event.preventDefault();
          }
          hotkey.callback();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hotkeys]);
}

// Common hotkey combinations
export const commonHotkeys = {
  commandPalette: { key: 'k', ctrlKey: true },
  search: { key: 'f', ctrlKey: true },
  newDM: { key: 'n', ctrlKey: true, shiftKey: true },
  toggleMute: { key: 'm', ctrlKey: true },
  toggleDeafen: { key: 'd', ctrlKey: true },
  quickSwitcher: { key: 'Tab', ctrlKey: true },
  markAsRead: { key: 'Enter', shiftKey: true },
};