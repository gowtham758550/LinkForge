import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { User } from '../../core/models/user.model';
import { AuthService } from './auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const TOKEN_KEY = 'auth_token';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null,
  }),
  withComputed(({ user, token }) => ({
    isAuthenticated: computed(() => !!token() && !!user()),
    userName: computed(() => user()?.name ?? ''),
    userEmail: computed(() => user()?.email ?? ''),
    userPicture: computed(() => user()?.picture ?? null),
    firstName: computed(() => (user()?.name ?? '').trim().split(/\s+/)[0] ?? ''),
    initials: computed(() => {
      const name = user()?.name ?? '';
      return (
        name
          .split(/\s+/)
          .map(n => n[0] ?? '')
          .join('')
          .toUpperCase()
          .slice(0, 2) || '?'
      );
    }),
  })),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    setToken(token: string): void {
      localStorage.setItem(TOKEN_KEY, token);
      patchState(store, { token });
    },

    logout(): void {
      localStorage.removeItem(TOKEN_KEY);
      patchState(store, { user: null, token: null });
      router.navigate(['/']);
    },

    loadUser: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          authService.getMe().pipe(
            tapResponse({
              next: user => patchState(store, { user, loading: false }),
              error: () => {
                localStorage.removeItem(TOKEN_KEY);
                patchState(store, { user: null, token: null, loading: false, error: 'Session expired' });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
