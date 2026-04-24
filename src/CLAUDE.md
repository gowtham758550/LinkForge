# src/

## Contents
| Project | Role |
|---|---|
| `UrlShortener.Core` | Domain models, interfaces, business logic. No external dependencies. |
| `UrlShortener.Infrastructure` | MongoDB + Redis implementations of Core interfaces. |
| `UrlShortener.API` | ASP.NET Core Web API. HTTP layer only — delegates to Infrastructure. |
| `UrlShortener.MCP` | MCP server exposing tools to AI clients. Separate HTTP service. |
| `client` | Angular 18+ SPA. |

## Dependency Rule
```
API → Core ← Infrastructure
MCP → Core ← Infrastructure
client → (API via HTTP)
```
Core has zero dependencies on other projects. Infrastructure depends only on Core.
