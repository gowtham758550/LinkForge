namespace UrlShortener.Core.Models;

public sealed class ShortenedUrl
{
    public string Id { get; set; } = default!;
    public string ShortCode { get; set; } = default!;
    public string LongUrl { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    public long ClickCount { get; set; }
    public bool IsCustomAlias { get; set; }
}
