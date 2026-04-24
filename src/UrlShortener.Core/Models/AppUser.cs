namespace UrlShortener.Core.Models;

public sealed class AppUser
{
    public string Id { get; set; } = default!;
    public string GoogleId { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Picture { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
