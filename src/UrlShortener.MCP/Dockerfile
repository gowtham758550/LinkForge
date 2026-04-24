FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/UrlShortener.MCP/UrlShortener.MCP.csproj", "src/UrlShortener.MCP/"]
COPY ["src/UrlShortener.Core/UrlShortener.Core.csproj", "src/UrlShortener.Core/"]
COPY ["src/UrlShortener.Infrastructure/UrlShortener.Infrastructure.csproj", "src/UrlShortener.Infrastructure/"]
RUN dotnet restore "src/UrlShortener.MCP/UrlShortener.MCP.csproj"
COPY . .
RUN dotnet publish "src/UrlShortener.MCP/UrlShortener.MCP.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "UrlShortener.MCP.dll"]
