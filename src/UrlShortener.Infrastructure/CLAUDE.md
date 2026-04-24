# UrlShortener.Infrastructure

## Role
Implements Core interfaces. Owns all external I/O: MongoDB, Redis.

## Key Packages
- `MongoDB.Driver` — MongoDB client
- `StackExchange.Redis` — Redis client

## Structure
```
UrlShortener.Infrastructure/
├── MongoDB/
│   ├── MongoDbContext.cs          # connection + collection accessors
│   ├── UrlRepository.cs           # IUrlRepository impl
│   └── UserRepository.cs          # IUserRepository impl
└── Redis/
    └── RedisCacheService.cs       # ICacheService impl
```

## MongoDB Collections
| Collection | Index |
|---|---|
| `urls` | `shortCode` (unique), `userId`, `expiresAt` (TTL index) |
| `users` | `googleId` (unique), `email` (unique) |

## Redis Cache
- Key pattern: `url:{shortCode}` → longUrl string
- TTL: match url expiry, or 24h default for non-expiring
- Cache-aside: API checks Redis → miss → MongoDB → populate Redis

## Config (from appsettings / env)
- `MongoDB:ConnectionString`
- `MongoDB:DatabaseName`
- `Redis:ConnectionString`

## Rules
- No HTTP, no business logic — pure data access
- Increment `clickCount` atomically in MongoDB on redirect
- Redis set only on confirmed DB read (no speculative caching)
