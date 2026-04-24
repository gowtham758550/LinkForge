# UrlShortener.Core

## Role
Pure domain layer. No infrastructure, no HTTP, no DB drivers. Referenced by all other projects.

## Contents

### Models
- `ShortenedUrl` — main entity: shortCode, longUrl, userId, createdAt, expiresAt?, clickCount
- `AppUser` — user entity: googleId, email, name, createdAt

### Interfaces
- `IUrlRepository` — CRUD for ShortenedUrl (implemented in Infrastructure)
- `IUserRepository` — user lookup/create (implemented in Infrastructure)
- `ICacheService` — get/set/delete short→long mappings (implemented in Infrastructure via Redis)

### Services
- `UrlHashService` — MD5(longUrl) → base62 → 7 chars, collision retry logic

### DTOs / Requests
- `ShortenUrlRequest` — longUrl, customAlias?, expiresAt?
- `ShortenUrlResponse` — shortCode, shortUrl, expiresAt?
- `UrlAnalyticsResponse` — shortCode, clickCount, createdAt

## Rules
- No NuGet packages except `System.*`
- No `async` infrastructure concerns — interfaces use `Task<>` but no drivers
- All models are records or sealed classes
