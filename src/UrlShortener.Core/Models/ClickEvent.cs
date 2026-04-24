namespace UrlShortener.Core.Models;

public sealed class ClickEvent
{
    public string Id { get; set; } = default!;
    public string ShortCode { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
