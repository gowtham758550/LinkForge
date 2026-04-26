using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;

namespace UrlShortener.API.Controllers;

[ApiController]
public sealed class RedirectController(
    IUrlRepository urls,
    ICacheService cache,
    IServiceScopeFactory scopeFactory,
    IConfiguration config) : ControllerBase
{
    [HttpGet("/{shortCode}")]
    public async Task<IActionResult> Redirect(string shortCode, CancellationToken ct)
    {
        var cached = await cache.GetAsync(shortCode, ct);
        string? userId = null;
        bool trackEveryClick;
        string longUrl;

        if (cached is null)
        {
            var url = await urls.GetByShortCodeAsync(shortCode, ct);
            if (url is null || (url.ExpiresAt.HasValue && url.ExpiresAt < DateTime.UtcNow))
                return Redirect($"{config["ClientUrl"]}/not-found");

            longUrl = url.LongUrl;
            userId = url.UserId;
            trackEveryClick = url.TrackEveryClick;

            var ttl = url.ExpiresAt.HasValue ? url.ExpiresAt.Value - DateTime.UtcNow : (TimeSpan?)null;
            await cache.SetAsync(shortCode, EncodeCacheValue(longUrl, trackEveryClick), ttl, ct);
        }
        else
        {
            (longUrl, trackEveryClick) = DecodeCacheValue(cached);
        }

        _ = Task.Run(() => RecordClickAsync(shortCode, userId), CancellationToken.None);

        if (trackEveryClick)
        {
            Response.Headers.CacheControl = "no-store, no-cache, must-revalidate, max-age=0";
            Response.Headers.Pragma = "no-cache";
            Response.Headers.Expires = "0";
            return Redirect(longUrl);
        }

        return RedirectPermanent(longUrl);
    }

    private static string EncodeCacheValue(string longUrl, bool trackEveryClick) =>
        $"{(trackEveryClick ? '1' : '0')}|{longUrl}";

    private static (string longUrl, bool trackEveryClick) DecodeCacheValue(string cached)
    {
        if (cached.Length > 2 && cached[1] == '|')
            return (cached[2..], cached[0] == '1');
        return (cached, false);
    }

    private async Task RecordClickAsync(string shortCode, string? userId)
    {
        using var scope = scopeFactory.CreateScope();
        var urlRepo = scope.ServiceProvider.GetRequiredService<IUrlRepository>();
        var clickRepo = scope.ServiceProvider.GetRequiredService<IClickEventRepository>();

        await urlRepo.IncrementClickCountAsync(shortCode);

        if (userId is null)
        {
            var url = await urlRepo.GetByShortCodeAsync(shortCode);
            userId = url?.UserId;
            if (userId is null) return;
        }

        await clickRepo.AddAsync(new ClickEvent
        {
            ShortCode = shortCode,
            UserId = userId,
            Timestamp = DateTime.UtcNow
        });
    }
}
