import { computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { patchState, signalStore, withComputed, withMethods, withState, withHooks } from '@ngrx/signals';

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
  withComputed((store) => ({
    isDark: computed(() =>
      store.theme() === 'dark' ||
      (store.theme() === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ),
  })),
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

      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', () => {
        if (store.theme() === 'system') applyTheme('system', document);
      });
    },
  }),
);

function applyTheme(theme: Theme, document: Document): void {
  const html = document.documentElement;
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = theme === 'dark' || (theme === 'system' && sysDark);
  html.classList.toggle('dark', dark);
  html.classList.toggle('light', !dark);
}
