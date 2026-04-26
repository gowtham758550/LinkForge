import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { ShortenedUrl, UrlAnalytics } from '../../core/models/url.model';
import { UrlService } from './url.service';
import { httpErrorMessage } from '../../shared/utils/http-error';

export type UrlFilter = 'active' | 'expired' | 'all';

interface UrlState {
  urls: ShortenedUrl[];
  filter: UrlFilter;
  initialized: boolean;
  selectedAnalytics: UrlAnalytics | null;
  loading: boolean;
  analyticsLoading: boolean;
  submitting: boolean;
  error: string | null;
}

export const UrlStore = signalStore(
  { providedIn: 'root' },
  withState<UrlState>({
    urls: [],
    filter: 'active',
    initialized: false,
    selectedAnalytics: null,
    loading: false,
    analyticsLoading: false,
    submitting: false,
    error: null,
  }),
  withComputed(({ urls }) => ({
    urlCount: computed(() => urls().length),
  })),
  withMethods((store, urlService = inject(UrlService)) => ({
    setError(message: string | null): void {
      patchState(store, { error: message });
    },

    clearError(): void {
      patchState(store, { error: null });
    },

    setSubmitting(value: boolean): void {
      patchState(store, { submitting: value });
    },

    setFilter(filter: UrlFilter): void {
      patchState(store, { filter });
    },

    prependUrl(url: ShortenedUrl): void {
      patchState(store, s => ({ urls: [url, ...s.urls] }));
    },

    removeUrl(shortCode: string): void {
      patchState(store, s => ({ urls: s.urls.filter(u => u.shortCode !== shortCode) }));
    },

    loadUrls: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          urlService.getAll(store.filter()).pipe(
            tapResponse({
              next: urls => patchState(store, { urls, loading: false, initialized: true }),
              error: (err) => patchState(store, { loading: false, error: httpErrorMessage(err) }),
            }),
          ),
        ),
      ),
    ),

    loadAnalytics: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { analyticsLoading: true, selectedAnalytics: null, error: null })),
        switchMap(shortCode =>
          urlService.getAnalytics(shortCode).pipe(
            tapResponse({
              next: analytics => patchState(store, { selectedAnalytics: analytics, analyticsLoading: false }),
              error: (err) => patchState(store, { analyticsLoading: false, error: httpErrorMessage(err) }),
            }),
          ),
        ),
      ),
    ),
  })),
);
