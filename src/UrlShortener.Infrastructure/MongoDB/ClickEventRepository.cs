using MongoDB.Bson;
using MongoDB.Driver;
using UrlShortener.Core.Interfaces;
using UrlShortener.Core.Models;

namespace UrlShortener.Infrastructure.MongoDB;

public sealed class ClickEventRepository(MongoDbContext context) : IClickEventRepository
{
    public Task AddAsync(ClickEvent evt, CancellationToken ct = default) =>
        context.ClickEvents.InsertOneAsync(evt, cancellationToken: ct);

    public async Task<IReadOnlyList<DailyClickCount>> GetDailyCountsAsync(
        string shortCode,
        string userId,
        DateTime sinceUtc,
        CancellationToken ct = default)
    {
        var pipeline = new[]
        {
            new BsonDocument("$match", new BsonDocument
            {
                { "shortCode", shortCode },
                { "userId", userId },
                { "timestamp", new BsonDocument("$gte", sinceUtc) }
            }),
            new BsonDocument("$group", new BsonDocument
            {
                { "_id", new BsonDocument("$dateToString", new BsonDocument
                    {
                        { "format", "%Y-%m-%d" },
                        { "date", "$timestamp" },
                        { "timezone", "UTC" }
                    })
                },
                { "count", new BsonDocument("$sum", 1) }
            }),
            new BsonDocument("$sort", new BsonDocument("_id", 1))
        };

        var result = await context.ClickEvents
            .Aggregate<BsonDocument>(pipeline, cancellationToken: ct)
            .ToListAsync(ct);

        return result
            .Select(d => new DailyClickCount(
                DateTime.SpecifyKind(DateTime.Parse(d["_id"].AsString), DateTimeKind.Utc),
                d["count"].ToInt64()))
            .ToList();
    }
}
