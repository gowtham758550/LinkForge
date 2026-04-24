# UrlShortener.API

## Role
ASP.NET Core Web API. HTTP layer: routing, auth middleware, request validation. Delegates all logic to Core/Infrastructure.

## Key Packages
- `Microsoft.AspNetCore.Authentication.Google` — Google OAuth
- `Microsoft.AspNetCore.Authentication.JwtBearer` — JWT validation
- `System.IdentityModel.Tokens.Jwt` — JWT generation
- `MongoDB.Driver` (via Infrastructure)
- `StackExchange.Redis` (via Infrastructure)

## Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/urls` | JWT | Shorten URL |
| GET | `/{shortCode}` | Public | Redirect (302) |
| GET | `/api/urls` | JWT | List user's URLs |
| DELETE | `/api/urls/{shortCode}` | JWT | Delete URL |
| GET | `/api/urls/{shortCode}/analytics` | JWT | Click count |
| GET | `/api/auth/google` | Public | Google OAuth initiate |
| GET | `/api/auth/callback` | Public | Google OAuth callback → JWT |
| GET | `/api/auth/me` | JWT | Current user info |

## Auth Flow
1. Client → `GET /api/auth/google` → redirect to Google consent
2. Google → `GET /api/auth/callback?code=...` → exchange → create/find user → return JWT
3. Client stores JWT → sends `Authorization: Bearer {token}` on subsequent requests

## JWT Claims
- `sub` — userId (MongoDB ObjectId)
- `email` — user email
- `name` — display name
- `exp` — expiry (24h default)

## Redirect Flow (hot path)
1. `GET /{shortCode}`
2. Check Redis → hit → 302 redirect + async increment click
3. Miss → check MongoDB → found → populate Redis → 302 redirect
4. Not found → 404

## Config Keys
```
Google:ClientId
Google:ClientSecret
Jwt:Secret
Jwt:Issuer
Jwt:Audience
MongoDB:ConnectionString
MongoDB:DatabaseName
Redis:ConnectionString
BaseUrl   # e.g. https://localhost:5001 — used to build short URLs
```

## Rules
- Controllers thin — no business logic inline
- CORS configured for Angular client origin
- All secrets via env vars / `.env` — never in appsettings.json committed
