import { effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { patchState, signalStore, withMethods, withState, withHooks } from '@ngrx/signals';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
}

const THEME_KEY = 'preferred_theme';

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState<ThemeState>({
    theme: (localStorage.getItem(THEME_KEY) as Theme) ?? 'system',
  }),
  withMethods((store, document = inject(DOCUMENT)) => ({
    setTheme(theme: Theme): void {
      localStorage.setItem(THEME_KEY, theme);
      patchState(store, { theme });
      applyTheme(theme, document);
    },
    toggle(): void {
      const current = store.theme();
      const next: Theme = current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      patchState(store, { theme: next });
      applyTheme(next, document);
    },
  })),
  withHooks({
    onInit(store, document = inject(DOCUMENT)) {
      applyTheme(store.theme(), document);
    },
  }),
);

function applyTheme(theme: Theme, document: Document): void {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
  } else if (theme === 'light') {
    html.classList.add('light');
    html.classList.remove('dark');
  } else {
    html.classList.remove('dark', 'light');
  }
}
