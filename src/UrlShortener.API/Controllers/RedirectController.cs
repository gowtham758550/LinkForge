using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;

namespace UrlShortener.API.Controllers;

[ApiController]
public sealed class RedirectController(
    IUrlRepository urls,
    ICacheService cache,
    IServiceScopeFactory scopeFactory) : ControllerBase
{
    [HttpGet("/{shortCode}")]
    public async Task<IActionResult> Redirect(string shortCode, CancellationToken ct)
    {
        var longUrl = await cache.GetAsync(shortCode, ct);
        string? userId = null;

        if (longUrl is null)
        {
            var url = await urls.GetByShortCodeAsync(shortCode, ct);
            if (url is null || (url.ExpiresAt.HasValue && url.ExpiresAt < DateTime.UtcNow))
                return NotFound();

            longUrl = url.LongUrl;
            userId = url.UserId;

            var ttl = url.ExpiresAt.HasValue ? url.ExpiresAt.Value - DateTime.UtcNow : (TimeSpan?)null;
            await cache.SetAsync(shortCode, longUrl, ttl, ct);
        }

        _ = Task.Run(() => RecordClickAsync(shortCode, userId), CancellationToken.None);

        return RedirectPermanent(longUrl);
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
