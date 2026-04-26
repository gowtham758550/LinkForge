using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using UrlShortener.Core.Models;

namespace UrlShortener.Infrastructure.MongoDB;

public sealed class MongoDbContext
{
    private readonly IMongoDatabase _db;

    static MongoDbContext()
    {
        BsonClassMap.RegisterClassMap<ShortenedUrl>(cm =>
        {
            cm.AutoMap();
            cm.MapIdProperty(u => u.Id)
              .SetIdGenerator(StringObjectIdGenerator.Instance)
              .SetSerializer(new StringSerializer(BsonType.ObjectId));
            cm.MapProperty(u => u.ShortCode).SetElementName("shortCode");
            cm.MapProperty(u => u.LongUrl).SetElementName("longUrl");
            cm.MapProperty(u => u.UserId).SetElementName("userId");
            cm.MapProperty(u => u.CreatedAt).SetElementName("createdAt");
            cm.MapProperty(u => u.ExpiresAt).SetElementName("expiresAt");
            cm.MapProperty(u => u.ClickCount).SetElementName("clickCount");
            cm.MapProperty(u => u.IsCustomAlias).SetElementName("isCustomAlias");
            cm.MapProperty(u => u.TrackEveryClick).SetElementName("trackEveryClick");
        });

        BsonClassMap.RegisterClassMap<AppUser>(cm =>
        {
            cm.AutoMap();
            cm.MapIdProperty(u => u.Id)
              .SetIdGenerator(StringObjectIdGenerator.Instance)
              .SetSerializer(new StringSerializer(BsonType.ObjectId));
            cm.MapProperty(u => u.GoogleId).SetElementName("googleId");
            cm.MapProperty(u => u.Email).SetElementName("email");
            cm.MapProperty(u => u.Name).SetElementName("name");
            cm.MapProperty(u => u.Picture).SetElementName("picture");
            cm.MapProperty(u => u.CreatedAt).SetElementName("createdAt");
        });

        BsonClassMap.RegisterClassMap<ClickEvent>(cm =>
        {
            cm.AutoMap();
            cm.MapIdProperty(e => e.Id)
              .SetIdGenerator(StringObjectIdGenerator.Instance)
              .SetSerializer(new StringSerializer(BsonType.ObjectId));
            cm.MapProperty(e => e.ShortCode).SetElementName("shortCode");
            cm.MapProperty(e => e.UserId).SetElementName("userId");
            cm.MapProperty(e => e.Timestamp).SetElementName("timestamp");
        });
    }

    public MongoDbContext(string connectionString, string databaseName)
    {
        var client = new MongoClient(connectionString);
        _db = client.GetDatabase(databaseName);
        EnsureIndexes();
    }

    public IMongoCollection<ShortenedUrl> Urls => _db.GetCollection<ShortenedUrl>("urls");
    public IMongoCollection<AppUser> Users => _db.GetCollection<AppUser>("users");
    public IMongoCollection<ClickEvent> ClickEvents => _db.GetCollection<ClickEvent>("click_events");

    private void EnsureIndexes()
    {
        var urlIndexes = Urls.Indexes;

        urlIndexes.CreateOne(new CreateIndexModel<ShortenedUrl>(
            Builders<ShortenedUrl>.IndexKeys.Ascending(u => u.ShortCode),
            new CreateIndexOptions { Unique = true }));

        urlIndexes.CreateOne(new CreateIndexModel<ShortenedUrl>(
            Builders<ShortenedUrl>.IndexKeys.Ascending(u => u.UserId)));

        urlIndexes.CreateOne(new CreateIndexModel<ShortenedUrl>(
            Builders<ShortenedUrl>.IndexKeys.Ascending(u => u.ExpiresAt),
            new CreateIndexOptions { Sparse = true }));

        var userIndexes = Users.Indexes;

        userIndexes.CreateOne(new CreateIndexModel<AppUser>(
            Builders<AppUser>.IndexKeys.Ascending(u => u.GoogleId),
            new CreateIndexOptions { Unique = true }));

        userIndexes.CreateOne(new CreateIndexModel<AppUser>(
            Builders<AppUser>.IndexKeys.Ascending(u => u.Email),
            new CreateIndexOptions { Unique = true }));

        var clickIndexes = ClickEvents.Indexes;

        clickIndexes.CreateOne(new CreateIndexModel<ClickEvent>(
            Builders<ClickEvent>.IndexKeys
                .Ascending(e => e.ShortCode)
                .Ascending(e => e.Timestamp)));

        clickIndexes.CreateOne(new CreateIndexModel<ClickEvent>(
            Builders<ClickEvent>.IndexKeys.Ascending(e => e.UserId)));
    }
}
