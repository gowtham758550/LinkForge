namespace UrlShortener.Core.DTOs;

public sealed record UrlAnalyticsResponse(
    string ShortCode,
    string ShortUrl,
    string LongUrl,
    long ClickCount,
    DateTime CreatedAt,
    DateTime? ExpiresAt,
    IReadOnlyList<DailyClickPoint> ClicksByDay,
    bool TrackEveryClick
);

public sealed record DailyClickPoint(DateTime Date, long Count);
