using MongoDB.Driver;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;

namespace UrlShortener.Infrastructure.MongoDB;

public sealed class UrlRepository(MongoDbContext context) : IUrlRepository
{
    public async Task<ShortenedUrl?> GetByShortCodeAsync(string shortCode, CancellationToken ct = default) =>
        await context.Urls.Find(u => u.ShortCode == shortCode).FirstOrDefaultAsync(ct);

    public async Task<IEnumerable<ShortenedUrl>> GetByUserIdAsync(string userId, CancellationToken ct = default) =>
        await context.Urls.Find(u => u.UserId == userId)
            .SortByDescending(u => u.CreatedAt)
            .ToListAsync(ct);

    public async Task CreateAsync(ShortenedUrl url, CancellationToken ct = default) =>
        await context.Urls.InsertOneAsync(url, cancellationToken: ct);

    public async Task<bool> DeleteAsync(string shortCode, string userId, CancellationToken ct = default)
    {
        var result = await context.Urls.DeleteOneAsync(
            u => u.ShortCode == shortCode && u.UserId == userId, ct);
        return result.DeletedCount > 0;
    }

    public async Task IncrementClickCountAsync(string shortCode, CancellationToken ct = default)
    {
        var update = Builders<ShortenedUrl>.Update.Inc(u => u.ClickCount, 1);
        await context.Urls.UpdateOneAsync(u => u.ShortCode == shortCode, update, cancellationToken: ct);
    }

    public async Task<bool> ShortCodeExistsAsync(string shortCode, CancellationToken ct = default) =>
        await context.Urls.Find(u => u.ShortCode == shortCode).AnyAsync(ct);
}
