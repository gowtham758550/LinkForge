using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UrlShortener.Core.DTOs;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;
using UrlShortener.Core.Services;

namespace UrlShortener.API.Controllers;

[ApiController]
[Route("api/urls")]
[Authorize]
public sealed class UrlsController(
    IUrlRepository urls,
    IClickEventRepository clickEvents,
    ICacheService cache,
    UrlHashService hashService,
    IConfiguration config) : ControllerBase
{
    private const int AnalyticsWindowDays = 30;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    private string BaseUrl => config["BaseUrl"]!;

    [HttpPost]
    public async Task<ActionResult<ShortenUrlResponse>> Shorten(ShortenUrlRequest request, CancellationToken ct)
    {
        string shortCode;

        if (!string.IsNullOrWhiteSpace(request.CustomAlias))
        {
            if (await urls.ShortCodeExistsAsync(request.CustomAlias, ct))
                return Conflict("Custom alias already taken.");
            shortCode = request.CustomAlias;
        }
        else
        {
            shortCode = await ResolveUniqueCode(request.LongUrl, ct);
        }

        var url = new ShortenedUrl
        {
            ShortCode = shortCode,
            LongUrl = request.LongUrl,
            UserId = UserId,
            ExpiresAt = request.ExpiresAt,
            IsCustomAlias = !string.IsNullOrWhiteSpace(request.CustomAlias)
        };

        await urls.CreateAsync(url, ct);

        var ttl = request.ExpiresAt.HasValue
            ? request.ExpiresAt.Value - DateTime.UtcNow
            : (TimeSpan?)null;
        await cache.SetAsync(shortCode, request.LongUrl, ttl, ct);

        return CreatedAtAction(nameof(GetAnalytics), new { shortCode }, ToResponse(url));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShortenUrlResponse>>> List(CancellationToken ct)
    {
        var list = await urls.GetByUserIdAsync(UserId, ct);
        return Ok(list.Select(ToResponse));
    }

    [HttpDelete("{shortCode}")]
    public async Task<IActionResult> Delete(string shortCode, CancellationToken ct)
    {
        var deleted = await urls.DeleteAsync(shortCode, UserId, ct);
        if (!deleted) return NotFound();
        await cache.DeleteAsync(shortCode, ct);
        return NoContent();
    }

    [HttpGet("{shortCode}/analytics")]
    public async Task<ActionResult<UrlAnalyticsResponse>> GetAnalytics(string shortCode, CancellationToken ct)
    {
        var url = await urls.GetByShortCodeAsync(shortCode, ct);
        if (url is null || url.UserId != UserId) return NotFound();

        var sinceUtc = DateTime.UtcNow.Date.AddDays(-(AnalyticsWindowDays - 1));
        var raw = await clickEvents.GetDailyCountsAsync(shortCode, UserId, sinceUtc, ct);
        var series = BuildFilledSeries(raw, sinceUtc, AnalyticsWindowDays);

        return Ok(new UrlAnalyticsResponse(
            url.ShortCode,
            BuildShortUrl(url.ShortCode),
            url.LongUrl,
            url.ClickCount,
            url.CreatedAt,
            url.ExpiresAt,
            series));
    }

    private ShortenUrlResponse ToResponse(ShortenedUrl u) =>
        new(u.ShortCode, BuildShortUrl(u.ShortCode), u.LongUrl, u.CreatedAt, u.ExpiresAt, u.ClickCount);

    private string BuildShortUrl(string shortCode) => $"{BaseUrl}/{shortCode}";

    private static IReadOnlyList<DailyClickPoint> BuildFilledSeries(
        IReadOnlyList<DailyClickCount> raw, DateTime sinceUtc, int days)
    {
        var map = raw.ToDictionary(d => d.Date.Date, d => d.Count);
        var result = new List<DailyClickPoint>(days);
        for (var i = 0; i < days; i++)
        {
            var date = DateTime.SpecifyKind(sinceUtc.AddDays(i), DateTimeKind.Utc);
            result.Add(new DailyClickPoint(date, map.GetValueOrDefault(date, 0)));
        }
        return result;
    }

    private async Task<string> ResolveUniqueCode(string longUrl, CancellationToken ct)
    {
        for (var attempt = 0; attempt < 5; attempt++)
        {
            var code = hashService.Generate(longUrl, attempt);
            if (!await urls.ShortCodeExistsAsync(code, ct))
                return code;
        }
        throw new InvalidOperationException("Failed to generate unique short code after 5 attempts.");
    }
}
