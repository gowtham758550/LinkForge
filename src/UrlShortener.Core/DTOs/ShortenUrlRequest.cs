using System.ComponentModel.DataAnnotations;

namespace UrlShortener.Core.DTOs;

public sealed record ShortenUrlRequest(
    [Required, Url] string LongUrl,
    string? CustomAlias,
    DateTime? ExpiresAt,
    bool TrackEveryClick = false
);
