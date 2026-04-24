using System.ComponentModel;
using ModelContextProtocol.Server;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;
using UrlShortener.Core.Services;

namespace UrlShortener.MCP.Tools;

[McpServerToolType]
public sealed class UrlShortenerTools(
    IUrlRepository urls,
    ICacheService cache,
    UrlHashService hashService,
    IConfiguration config)
{
    [McpServerTool, Description("Shorten a long URL. Returns the short code and full short URL.")]
    public async Task<object> ShortenUrl(
        [Description("The long URL to shorten")] string longUrl,
        [Description("Optional custom alias (e.g. 'my-link')")] string? customAlias = null,
        [Description("Optional expiry date (ISO 8601)")] string? expiresAt = null)
    {
        var shortCode = customAlias ?? await ResolveUniqueCode(longUrl);
        if (await urls.ShortCodeExistsAsync(shortCode))
            return new { error = "Short code already exists.", shortCode };

        DateTime? expiry = expiresAt is not null ? DateTime.Parse(expiresAt, null, System.Globalization.DateTimeStyles.RoundtripKind) : null;

        var url = new ShortenedUrl
        {
            ShortCode = shortCode,
            LongUrl = longUrl,
            UserId = "mcp-system",
            ExpiresAt = expiry,
            IsCustomAlias = customAlias is not null
        };

        await urls.CreateAsync(url);

        var ttl = expiry.HasValue ? expiry.Value - DateTime.UtcNow : (TimeSpan?)null;
        await cache.SetAsync(shortCode, longUrl, ttl);

        var baseUrl = config["BaseUrl"]!;
        return new { shortCode, shortUrl = $"{baseUrl}/{shortCode}", longUrl, expiresAt = expiry };
    }

    [McpServerTool, Description("Resolve a short code to its original long URL.")]
    public async Task<object> ResolveUrl(
        [Description("The 7-character short code")] string shortCode)
    {
        var longUrl = await cache.GetAsync(shortCode);
        if (longUrl is not null)
            return new { shortCode, longUrl, source = "cache" };

        var url = await urls.GetByShortCodeAsync(shortCode);
        if (url is null)
            return new { error = "Short code not found.", shortCode };

        if (url.ExpiresAt.HasValue && url.ExpiresAt < DateTime.UtcNow)
            return new { error = "Short URL has expired.", shortCode };

        return new { shortCode, longUrl = url.LongUrl, expiresAt = url.ExpiresAt, source = "db" };
    }

    [McpServerTool, Description("Get click analytics for a short code.")]
    public async Task<object> GetAnalytics(
        [Description("The 7-character short code")] string shortCode)
    {
        var url = await urls.GetByShortCodeAsync(shortCode);
        if (url is null)
            return new { error = "Short code not found.", shortCode };

        return new
        {
            shortCode = url.ShortCode,
            longUrl = url.LongUrl,
            clickCount = url.ClickCount,
            createdAt = url.CreatedAt,
            expiresAt = url.ExpiresAt
        };
    }

    private async Task<string> ResolveUniqueCode(string longUrl)
    {
        for (var attempt = 0; attempt < 5; attempt++)
        {
            var code = hashService.Generate(longUrl, attempt);
            if (!await urls.ShortCodeExistsAsync(code))
                return code;
        }
        throw new InvalidOperationException("Failed to generate unique short code.");
    }
}
