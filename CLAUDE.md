# URL Shortener — Root

## Project Overview
Resume-grade URL shortener. Backend-heavy focus. Demonstrates distributed system design, OAuth, MCP protocol, Docker.

## Stack
| Layer | Technology |
|---|---|
| API | ASP.NET Core (.NET 9) |
| Frontend | Angular 18+ |
| Database | MongoDB |
| Cache | Redis |
| User Auth | Google OAuth 2.0 → JWT |
| MCP Auth | OAuth 2.0 (MCP spec 2025-03-26) |
| Containers | Docker + docker-compose |

## Architecture
```
client (Angular)
    ↓ Google OAuth → JWT
UrlShortener.API  ←→  Redis (hot redirect cache)
    ↓                   ↓ miss
UrlShortener.Infrastructure → MongoDB
    
UrlShortener.MCP (separate service)
    ↑ OAuth 2.0 (MCP spec)
AI clients (Claude, etc.)
```

## URL Generation
Hash-based: `MD5(longUrl) → base62 → first 7 chars`. Collision: append counter, retry.

## Short Code Format
7-char base62 `[a-zA-Z0-9]` = 62^7 ≈ 3.5 trillion combinations.

## Project Structure
```
url-shortener/
├── CLAUDE.md
├── docker-compose.yml
├── .env
└── src/
    ├── UrlShortener.Core/        # domain models, interfaces
    ├── UrlShortener.Infrastructure/  # MongoDB + Redis impl
    ├── UrlShortener.API/         # ASP.NET Core Web API
    ├── UrlShortener.MCP/         # MCP Server
    └── client/                   # Angular app
```

## Build Order
1. Core (models, interfaces)
2. Infrastructure (MongoDB repos, Redis cache)
3. API (endpoints, Google OAuth, JWT)
4. Client (Angular, Google sign-in, dashboard)
5. MCP server + OAuth
6. Docker + compose

## Docker
- `docker-compose up` starts: api, mcp, client, mongodb, redis
- `.env` holds secrets (never commit)

## Key Design Decisions
- Redis cache-aside for redirects (fast path, skip DB on hit)
- MongoDB chosen over PostgreSQL: flexible schema, horizontal scale demo
- MCP OAuth separate from user Google OAuth — two distinct auth flows
- Custom aliases + link expiration + click analytics supported
