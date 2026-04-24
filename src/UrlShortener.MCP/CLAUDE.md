# UrlShortener.MCP

## Role
MCP (Model Context Protocol) server. Exposes URL shortener tools to AI clients (Claude, etc.). Separate HTTP service with its own OAuth 2.0 auth flow per MCP spec 2025-03-26.

## Key Packages
- `ModelContextProtocol` — MCP server SDK for .NET
- `Microsoft.AspNetCore.Authentication.JwtBearer` — validate MCP OAuth tokens

## MCP Tools
| Tool | Input | Output | Description |
|---|---|---|---|
| `shorten_url` | `longUrl`, `customAlias?`, `expiresAt?` | `shortUrl`, `shortCode` | Create short URL |
| `resolve_url` | `shortCode` | `longUrl`, `expiresAt?` | Look up original URL |
| `get_analytics` | `shortCode` | `clickCount`, `createdAt`, `shortCode` | Get click stats |

## OAuth Flow (MCP spec)
MCP server acts as OAuth 2.0 Authorization Server + Resource Server:
1. AI client discovers `/.well-known/oauth-authorization-server`
2. Client requests authorization → MCP issues token
3. Client sends `Authorization: Bearer {token}` on tool calls
4. MCP validates token → executes tool → returns result

Note: This OAuth is separate from Google OAuth used for web users. MCP tokens authorize AI clients, not human users.

## Structure
```
UrlShortener.MCP/
├── Program.cs                    # MCP server setup, OAuth middleware
├── Tools/
│   ├── ShortenUrlTool.cs
│   ├── ResolveUrlTool.cs
│   └── GetAnalyticsTool.cs
└── Auth/
    ├── McpOAuthController.cs     # /oauth/token, /oauth/authorize
    └── McpTokenService.cs        # token issuance + validation
```

## Config Keys
```
MCP:ClientId          # registered MCP client IDs
MCP:ClientSecret
MCP:TokenSecret       # signing key for MCP-issued tokens
API:BaseUrl           # internal URL of UrlShortener.API
```

## Rules
- Tools call UrlShortener.API internally (HTTP) or share Infrastructure directly
- All tool inputs validated before execution
- Tool errors returned as MCP error responses, not exceptions
- Runs on separate port (e.g. 5002) from API (5001)
