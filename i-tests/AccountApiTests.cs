using System.Net;
using Ismi.Api.Models;
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
        if (Directory.Exists(_databasePath + "-keys")) Directory.Delete(_databasePath + "-keys", true);
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
        Assert.Equal(5, dashboard.DailyPlan.CompletedMinutes);
        Assert.Equal("levantine-day-02", dashboard.DailyPlan.NextLessonId);

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
        Assert.Equal(5, restoredDashboard.DailyPlan.CompletedMinutes);
        Assert.Equal("levantine-day-02", restoredDashboard.DailyPlan.NextLessonId);
    }

    [Fact]
    public async Task RegistrationRequiresAntiforgeryToken()
    {
        using var client = CreateClient(_factory);

        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            displayName = "Knafeh",
            email = "knafeh@example.test",
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

    [Fact]
    public async Task ExistingSessionSurvivesHostRestartWithPersistedKeys()
    {
        string cookie;
        using (var client = CreateClient(_factory))
        {
            var registration = await PostWithCsrfAsync(client, "/api/auth/register", new
            {
                displayName = "Restart test",
                email = "restart@example.test",
                password = "long test password"
            });
            Assert.Equal(HttpStatusCode.OK, registration.StatusCode);
            cookie = registration.Headers.GetValues("Set-Cookie")
                .Single(value => value.StartsWith("Ismi.Auth=", StringComparison.Ordinal)).Split(';')[0];
        }
        Assert.NotEmpty(Directory.GetFiles(_databasePath + "-keys", "*.xml"));
        _factory.Dispose();
        _factory = CreateFactory();
        using var restarted = CreateClient(_factory);
        restarted.DefaultRequestHeaders.Add("Cookie", cookie);
        var session = await restarted.GetFromJsonAsync<AuthSession>("/api/auth/me");
        Assert.True(session?.IsAuthenticated);
        Assert.Equal("Restart test", session?.DisplayName);
    }

    [Fact]
    public async Task StudySettingsPersistAndRejectConflictingEditsWithoutCrossingAccounts()
    {
        using var owner = CreateClient(_factory);
        using var other = CreateClient(_factory);
        Assert.Equal(HttpStatusCode.Unauthorized, (await other.GetAsync("/api/study-settings")).StatusCode);
        await PostWithCsrfAsync(owner, "/api/auth/register", new { displayName = "Plan", email = "plan@example.test", password = "long test password" });
        var initial = (await owner.GetFromJsonAsync<StudySettingsResponse>("/api/study-settings"))!;
        Assert.Equal(0, initial.Revision);
        Assert.Equal(15, initial.Preferences.GoalMinutes);
        var preferences = new StudyPreferences(30, ["quranic", "levantine"], "quranic");
        Assert.Equal(HttpStatusCode.BadRequest, (await owner.PostAsJsonAsync("/api/study-settings", new SaveStudySettingsRequest(preferences, 0))).StatusCode);
        var saved = await PostWithCsrfAsync(owner, "/api/study-settings", new SaveStudySettingsRequest(preferences, 0));
        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        var first = (await saved.Content.ReadFromJsonAsync<StudySettingsResponse>())!;
        Assert.Equal(1, first.Revision);
        Assert.Equal(new[] { "levantine", "quranic" }, first.Preferences.SelectedTrackIds);
        Assert.Equal(HttpStatusCode.OK, (await PostWithCsrfAsync(owner, "/api/study-settings", new SaveStudySettingsRequest(preferences, 0))).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await PostWithCsrfAsync(owner, "/api/study-settings", new SaveStudySettingsRequest(StudyPreferences.Default, 0))).StatusCode);
        await PostWithCsrfAsync(other, "/api/auth/register", new { displayName = "Other", email = "other-plan@example.test", password = "long test password" });
        Assert.Equal(15, (await other.GetFromJsonAsync<StudySettingsResponse>("/api/study-settings"))!.Preferences.GoalMinutes);
        var dashboard = (await owner.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.Equal(30, dashboard.DailyPlan.GoalMinutes);
        _factory.Dispose();
        _factory = CreateFactory();
        using var restarted = CreateClient(_factory);
        await PostWithCsrfAsync(restarted, "/api/auth/login", new { email = "plan@example.test", password = "long test password", rememberMe = false });
        var restored = (await restarted.GetFromJsonAsync<StudySettingsResponse>("/api/study-settings"))!;
        Assert.Equal(30, restored.Preferences.GoalMinutes);
        Assert.Equal("quranic", restored.Preferences.PrimaryTrack);
        Assert.Equal(1, restored.Revision);
    }

    [Fact]
    public async Task InvalidStudySettingsNeverReplaceSavedPreferences()
    {
        using var client = CreateClient(_factory);
        await PostWithCsrfAsync(client, "/api/auth/register", new { displayName = "Validation", email = "validate-plan@example.test", password = "long test password" });
        foreach (var preferences in new[] {
            new StudyPreferences(7, ["levantine"], "levantine"),
            new StudyPreferences(15, [], "levantine"),
            new StudyPreferences(15, ["unknown"], "unknown"),
            new StudyPreferences(15, ["levantine", "levantine"], "levantine"),
            new StudyPreferences(15, ["msa"], "levantine"),
            new StudyPreferences(15, null!, "levantine")
        })
            Assert.Equal(HttpStatusCode.BadRequest, (await PostWithCsrfAsync(client, "/api/study-settings", new SaveStudySettingsRequest(preferences, 0))).StatusCode);
        Assert.Equal(0, (await client.GetFromJsonAsync<StudySettingsResponse>("/api/study-settings"))!.Revision);
    }

    private WebApplicationFactory<Program> CreateFactory() =>
        new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Development");
            builder.ConfigureAppConfiguration((_, configuration) =>
                configuration.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Database:Path"] = _databasePath,
                    ["DataProtection:KeysPath"] = _databasePath + "-keys"
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

    private sealed record DailyPlanSnapshot(int CompletedMinutes, string NextLessonId);

    private sealed record ApiErrorSnapshot(string Code, string Message);
}
