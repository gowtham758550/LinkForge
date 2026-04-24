namespace UrlShortener.Core.DTOs;

public sealed record ShortenUrlResponse(
    string ShortCode,
    string ShortUrl,
    string LongUrl,
    DateTime CreatedAt,
    DateTime? ExpiresAt,
    long ClickCount
);
