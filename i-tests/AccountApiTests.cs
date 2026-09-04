using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace Ismi.Api.Tests;

public sealed class AccountApiTests : IAsyncLifetime
{
    private readonly string _databasePath = Path.Combine(
        Path.GetTempPath(),
        $"ismi-account-tests-{Guid.NewGuid():N}.db");
    private WebApplicationFactory<Program> _factory = null!;

    public Task InitializeAsync()
    {
        _factory = CreateFactory();
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        _factory.Dispose();
        DeleteDatabaseFile(_databasePath);
        DeleteDatabaseFile($"{_databasePath}-shm");
        DeleteDatabaseFile($"{_databasePath}-wal");
        return Task.CompletedTask;
    }

    [Fact]
    public async Task RegisterLoginLogoutAndProgressRoundTrip()
    {
        using var client = CreateClient(_factory);

        var registration = await PostWithCsrfAsync(client, "/api/auth/register", new
        {
            displayName = "Nadia",
            email = "nadia@example.test",
            password = "long test password"
        });

        Assert.True(
            registration.StatusCode == HttpStatusCode.OK,
            await registration.Content.ReadAsStringAsync());
        var registeredSession = await registration.Content.ReadFromJsonAsync<AuthSession>();
        Assert.NotNull(registeredSession);
        Assert.True(registeredSession.IsAuthenticated);
        Assert.Equal("Nadia", registeredSession.DisplayName);

        var completion = await PostWithCsrfAsync(
            client,
            "/api/lessons/levantine-day-01/completions",
            new
            {
                completionId = "account-completion-1",
                completedAt = DateTimeOffset.UtcNow
            });
        Assert.Equal(HttpStatusCode.OK, completion.StatusCode);

        var dashboard = await client.GetFromJsonAsync<DashboardSnapshot>("/api/dashboard");
        Assert.NotNull(dashboard);
        Assert.Equal("Nadia", dashboard.Learner.DisplayName);
        Assert.Equal(14, dashboard.DailyPlan.CompletedMinutes);

        var logout = await PostWithCsrfAsync(client, "/api/auth/logout", new { });
        Assert.Equal(HttpStatusCode.NoContent, logout.StatusCode);

        var guestSession = await client.GetFromJsonAsync<AuthSession>("/api/auth/me");
        Assert.NotNull(guestSession);
        Assert.False(guestSession.IsAuthenticated);

        var invalidLogin = await PostWithCsrfAsync(client, "/api/auth/login", new
        {
            email = "nadia@example.test",
            password = "wrong password",
            rememberMe = false
        });
        Assert.Equal(HttpStatusCode.BadRequest, invalidLogin.StatusCode);

        var login = await PostWithCsrfAsync(client, "/api/auth/login", new
        {
            email = "nadia@example.test",
            password = "long test password",
            rememberMe = false
        });
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);

        var restoredDashboard = await client.GetFromJsonAsync<DashboardSnapshot>("/api/dashboard");
        Assert.NotNull(restoredDashboard);
        Assert.Equal("Nadia", restoredDashboard.Learner.DisplayName);
        Assert.Equal(14, restoredDashboard.DailyPlan.CompletedMinutes);
    }

    [Fact]
    public async Task RegistrationRequiresAntiforgeryToken()
    {
        using var client = CreateClient(_factory);

        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            displayName = "Omar",
            email = "omar@example.test",
            password = "long test password"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ApiErrorSnapshot>();
        Assert.Equal("invalid_csrf_token", error?.Code);
    }

    [Fact]
    public async Task RegistrationRejectsDuplicateEmail()
    {
        using var client = CreateClient(_factory);
        var account = new
        {
            displayName = "Leila",
            email = "leila@example.test",
            password = "long test password"
        };

        var first = await PostWithCsrfAsync(client, "/api/auth/register", account);
        Assert.True(
            first.StatusCode == HttpStatusCode.OK,
            await first.Content.ReadAsStringAsync());

        var logout = await PostWithCsrfAsync(client, "/api/auth/logout", new { });
        Assert.Equal(HttpStatusCode.NoContent, logout.StatusCode);

        var duplicate = await PostWithCsrfAsync(client, "/api/auth/register", account);
        Assert.Equal(HttpStatusCode.BadRequest, duplicate.StatusCode);
    }

    private WebApplicationFactory<Program> CreateFactory() =>
        new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Development");
            builder.ConfigureAppConfiguration((_, configuration) =>
                configuration.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Database:Path"] = _databasePath
                }));
        });

    private static HttpClient CreateClient(WebApplicationFactory<Program> factory) =>
        factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            HandleCookies = true
        });

    private static async Task<HttpResponseMessage> PostWithCsrfAsync<T>(
        HttpClient client,
        string path,
        T body)
    {
        var csrf = await client.GetFromJsonAsync<CsrfToken>("/api/auth/csrf");
        Assert.NotNull(csrf);

        using var request = new HttpRequestMessage(HttpMethod.Post, path)
        {
            Content = JsonContent.Create(body)
        };
        request.Headers.Add("X-CSRF-TOKEN", csrf.Token);
        return await client.SendAsync(request);
    }

    private static void DeleteDatabaseFile(string path)
    {
        if (File.Exists(path)) File.Delete(path);
    }

    private sealed record CsrfToken(string Token);

    private sealed record AuthSession(
        bool IsAuthenticated,
        string? UserId,
        string? DisplayName,
        string? Email);

    private sealed record DashboardSnapshot(
        LearnerSnapshot Learner,
        DailyPlanSnapshot DailyPlan);

    private sealed record LearnerSnapshot(string DisplayName);

    private sealed record DailyPlanSnapshot(int CompletedMinutes);

    private sealed record ApiErrorSnapshot(string Code, string Message);
}
