import { useEffect } from 'react';

export const keyboardShortcuts = {
  shortcuts: new Map(),
  
  register(key, callback, description = '') {
    this.shortcuts.set(key, { callback, description });
  },
  
  unregister(key) {
    this.shortcuts.delete(key);
  },
  
  handle(event) {
    const key = event.key.toLowerCase();
    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      event.preventDefault();
      shortcut.callback();
    }
  },
  
  getAll() {
    return Array.from(this.shortcuts.entries()).map(([key, { description }]) => ({
      key,
      description
    }));
  }
};

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