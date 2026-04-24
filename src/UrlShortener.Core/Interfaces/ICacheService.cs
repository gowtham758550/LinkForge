namespace UrlShortener.Core.Interfaces;

public interface ICacheService
{
    Task<string?> GetAsync(string shortCode, CancellationToken ct = default);
    Task SetAsync(string shortCode, string longUrl, TimeSpan? ttl = null, CancellationToken ct = default);
    Task DeleteAsync(string shortCode, CancellationToken ct = default);
}
