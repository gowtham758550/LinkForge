using UrlShortener.Core.Models;

namespace UrlShortener.Core.Interfaces;

public interface IUserRepository
{
    Task<AppUser?> GetByGoogleIdAsync(string googleId, CancellationToken ct = default);
    Task<AppUser?> GetByIdAsync(string id, CancellationToken ct = default);
    Task CreateAsync(AppUser user, CancellationToken ct = default);
    Task UpdateAsync(AppUser user, CancellationToken ct = default);
}
