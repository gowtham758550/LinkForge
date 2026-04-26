using UrlShortener.Core.Models;

namespace UrlShortener.Core.Interfaces;

public interface IUrlRepository
{
    Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode, CancellationToken ct = default);
    Task<IEnumerable<ShortenedUrl>> GetByUserIdAsync(string userId, string filter = "all", CancellationToken ct = default);
    Task CreateAsync(ShortenedUrl url, CancellationToken ct = default);
    Task<bool> DeleteAsync(string shortCode, string userId, CancellationToken ct = default);
    Task IncrementClickCountAsync(string shortCode, CancellationToken ct = default);
    Task<bool> ShortCodeExistsAsync(string shortCode, CancellationToken ct = default);
}
