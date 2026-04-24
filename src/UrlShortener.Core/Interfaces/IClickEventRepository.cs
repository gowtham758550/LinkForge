using UrlShortener.Core.Models;

namespace UrlShortener.Core.Interfaces;

public interface IClickEventRepository
{
    Task AddAsync(ClickEvent evt, CancellationToken ct = default);

    Task<IReadOnlyList<DailyClickCount>> GetDailyCountsAsync(
        string shortCode,
        string userId,
        DateTime sinceUtc,
        CancellationToken ct = default);
}

public sealed record DailyClickCount(DateTime Date, long Count);
