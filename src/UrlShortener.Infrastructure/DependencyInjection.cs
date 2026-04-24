using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using UrlShortener.Core.Interfaces;
using UrlShortener.Infrastructure.MongoDB;
using UrlShortener.Infrastructure.Redis;

namespace UrlShortener.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        var mongoConnStr = config["MongoDB:ConnectionString"]!;
        var mongoDB = config["MongoDB:DatabaseName"]!;
        services.AddSingleton(_ => new MongoDbContext(mongoConnStr, mongoDB));
        services.AddScoped<IUrlRepository, UrlRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IClickEventRepository, ClickEventRepository>();

        var redisConnStr = config["Redis:ConnectionString"]!;
        services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(redisConnStr));
        services.AddScoped<ICacheService, RedisCacheService>();

        return services;
    }
}
