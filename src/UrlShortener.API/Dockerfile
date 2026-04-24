FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/UrlShortener.API/UrlShortener.API.csproj", "src/UrlShortener.API/"]
COPY ["src/UrlShortener.Core/UrlShortener.Core.csproj", "src/UrlShortener.Core/"]
COPY ["src/UrlShortener.Infrastructure/UrlShortener.Infrastructure.csproj", "src/UrlShortener.Infrastructure/"]
RUN dotnet restore "src/UrlShortener.API/UrlShortener.API.csproj"
COPY . .
RUN dotnet publish "src/UrlShortener.API/UrlShortener.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "UrlShortener.API.dll"]
