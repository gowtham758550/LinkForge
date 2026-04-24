using StackExchange.Redis;
using UrlShortener.Core.Interfaces;

namespace UrlShortener.Infrastructure.Redis;

public sealed class RedisCacheService(IConnectionMultiplexer redis) : ICacheService
{
    private readonly IDatabase _db = redis.GetDatabase();
    private const string KeyPrefix = "url:";

    public async Task<string?> GetAsync(string shortCode, CancellationToken ct = default)
    {
        var value = await _db.StringGetAsync(KeyPrefix + shortCode);
        return value.HasValue ? value.ToString() : null;
    }

    public async Task SetAsync(string shortCode, string longUrl, TimeSpan? ttl = null, CancellationToken ct = default) =>
        await _db.StringSetAsync(KeyPrefix + shortCode, longUrl, ttl ?? TimeSpan.FromHours(24));

    public async Task DeleteAsync(string shortCode, CancellationToken ct = default) =>
        await _db.KeyDeleteAsync(KeyPrefix + shortCode);
}
