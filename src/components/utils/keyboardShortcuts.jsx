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