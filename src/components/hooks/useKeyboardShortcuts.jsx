import { useEffect } from 'react';
import { keyboardShortcuts } from '@/utils';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      keyboardShortcuts.handle(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return keyboardShortcuts;
}

export function useRegisterShortcut(key, callback, description) {
  useEffect(() => {
    keyboardShortcuts.register(key, callback, description);
  }, [key, callback, description]);
}