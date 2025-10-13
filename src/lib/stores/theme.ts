import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  if (!browser) return 'light';
  
  // Check localStorage first
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) {
    // Immediately apply the theme to avoid flash
    document.documentElement.setAttribute('data-theme', stored);
    return stored;
  }
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme = prefersDark ? 'dark' : 'light';
  
  // Immediately apply the theme
  document.documentElement.setAttribute('data-theme', systemTheme);
  
  return systemTheme;
}

// Create the store
const createThemeStore = () => {
  const { subscribe, set, update } = writable<Theme>(getInitialTheme());

  return {
    subscribe,
    toggle: () => update(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      if (browser) {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      return newTheme;
    }),
    set: (theme: Theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
      set(theme);
    },
    init: () => {
      if (browser) {
        const theme = getInitialTheme();
        set(theme);
      }
    }
  };
}

export const theme = createThemeStore();