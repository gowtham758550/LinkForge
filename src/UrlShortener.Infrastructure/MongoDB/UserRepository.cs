using MongoDB.Driver;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;

namespace UrlShortener.Infrastructure.MongoDB;

public sealed class UserRepository(MongoDbContext context) : IUserRepository
{
    public async Task<AppUser?> GetByGoogleIdAsync(string googleId, CancellationToken ct = default) =>
        await context.Users.Find(u => u.GoogleId == googleId).FirstOrDefaultAsync(ct);

    public async Task<AppUser?> GetByIdAsync(string id, CancellationToken ct = default) =>
        await context.Users.Find(u => u.Id == id).FirstOrDefaultAsync(ct);

    public async Task CreateAsync(AppUser user, CancellationToken ct = default) =>
        await context.Users.InsertOneAsync(user, cancellationToken: ct);

    public async Task UpdateAsync(AppUser user, CancellationToken ct = default) =>
        await context.Users.ReplaceOneAsync(u => u.Id == user.Id, user, cancellationToken: ct);
}
