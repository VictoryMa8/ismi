FROM mcr.microsoft.com/dotnet/sdk:10.0.301 AS build
WORKDIR /source
COPY global.json ./
COPY i-api/Ismi.Api.csproj i-api/
RUN dotnet restore i-api/Ismi.Api.csproj
COPY i-api/ i-api/
RUN dotnet publish i-api/Ismi.Api.csproj --no-restore -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    ASPNETCORE_HTTP_PORTS=8080 \
    Database__Path=/var/data/ismi.db \
    Recordings__Path=/var/data/recordings \
    DataProtection__KeysPath=/var/data/keys
RUN mkdir -p /var/data && chown app:app /var/data
USER app
EXPOSE 8080
ENTRYPOINT ["dotnet", "Ismi.Api.dll"]
