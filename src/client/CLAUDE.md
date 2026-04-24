# client (Angular)

## Stack
| Concern | Choice |
|---|---|
| Framework | Angular 20 (standalone, no NgModules) |
| State | NgRx Signal Store (`@ngrx/signals` v20) |
| Styling | Tailwind CSS v4 + SCSS (PostCSS via `@tailwindcss/postcss`) |
| UI primitives | `@spartan-ng/brain` (headless) + custom helm-style components |
| Lint | ESLint flat config (`eslint.config.mjs`) + Prettier |
| TypeScript | Strict mode (all flags enabled in tsconfig.json) |

## Architecture Rules
- **OnPush** everywhere — no exceptions
- **Signals** for state: `input()`, `output()`, `computed()`, `effect()`
- **inject()** only — never constructor injection
- **Smart/Dumb** pattern: feature/ = smart (injects stores), ui/ = dumb (inputs/outputs only)
- **`@if` / `@else` / `@for`** new control flow — no `*ngIf` / `*ngFor`
- **Typed reactive forms** — never untyped `FormControl`
- **Domain-based** structure — not technical layers

## Domain Structure
```
src/app/
├── core/
│   ├── guards/auth.guard.ts         # authGuard functional guard
│   ├── interceptors/jwt.interceptor.ts  # attach Bearer token
│   └── models/                      # shared interfaces (no classes)
│       ├── url.model.ts
│       └── user.model.ts
├── auth/                            # auth domain
│   ├── data-access/
│   │   ├── auth.service.ts          # HTTP: getMe(), initiateGoogleLogin()
│   │   └── auth.store.ts            # SignalStore: user, token, isAuthenticated
│   ├── feature/
│   │   ├── login/login.component.ts     # SMART: triggers Google OAuth
│   │   └── callback/callback.component.ts # SMART: extracts token, loads user
│   └── ui/
│       └── login-card/login-card.component.ts # DUMB: login UI
├── urls/                            # urls domain
│   ├── data-access/
│   │   ├── url.service.ts           # HTTP: getAll, shorten, delete, analytics
│   │   └── url.store.ts             # SignalStore: urls[], loading, submitting
│   ├── feature/
│   │   ├── dashboard/dashboard.component.ts   # SMART: loads URLs, delegates
│   │   └── analytics/analytics.component.ts   # SMART: loads analytics by code
│   └── ui/
│       ├── shorten-form/            # DUMB: typed reactive form
│       ├── url-card/                # DUMB: single URL row
│       └── url-list/                # DUMB: list + empty/loading states
└── shared/
    ├── data-access/theme.store.ts   # ThemeStore: light/dark/system
    └── ui/
        ├── header/                  # app-header with auth-aware nav
        └── theme-toggle/            # cycles system → dark → light
```

## Theme / Colors
- Primary: `#970747` (dark pink)
- Dark mode: system preference (`prefers-color-scheme`) + manual toggle (`.dark` class on `<html>`)
- `.light` class forces light mode regardless of system
- CSS custom properties: `--bg`, `--fg`, `--card-bg`, `--border`, `--muted`, etc.
- Tailwind class: `bg-primary` = `#970747`

## Auth Flow
1. User clicks "Continue with Google" → `AuthService.initiateGoogleLogin()` → redirect to API
2. API redirects back to `/auth/callback?token=...`
3. `CallbackComponent` calls `authStore.setToken()` + `authStore.loadUser()` → navigate to `/dashboard`
4. `jwtInterceptor` attaches `Authorization: Bearer {token}` to all API requests
5. Token stored in `localStorage` under key `auth_token`

## Stores Pattern
All stores use NgRx Signal Store:
```ts
export const MyStore = signalStore(
  { providedIn: 'root' },
  withState<MyState>({ ... }),
  withComputed(({ ... }) => ({ derived: computed(() => ...) })),
  withMethods((store, service = inject(MyService)) => ({
    load: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true })),
      switchMap(() => service.get().pipe(tapResponse({ ... })))
    ))
  }))
)
```

## Tailwind + SCSS Note
Tailwind v4 uses `@import "tailwindcss"` in `styles.scss`. Sass emits a deprecation warning (not error). Known issue — harmless, build succeeds.

## Commands
```bash
npm start          # dev server (http://localhost:4200)
npm run build      # production build
npm run lint       # eslint
npm run format     # prettier
```

## Routing (lazy-loaded)
| Path | Component | Guard |
|---|---|---|
| `/` | LoginComponent | — |
| `/auth/callback` | CallbackComponent | — |
| `/dashboard` | DashboardComponent | authGuard |
| `/dashboard/analytics/:shortCode` | AnalyticsComponent | authGuard |
