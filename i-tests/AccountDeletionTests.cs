using System.Net;
using System.Net.Http.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Ismi.Api.Tests;

public sealed class AccountDeletionTests : IDisposable
{
    private readonly string path = Path.Combine(Path.GetTempPath(), $"ismi-delete-{Guid.NewGuid():N}.db");
    private readonly Clock clock = new();
    private readonly WebApplicationFactory<Program> factory;
    public AccountDeletionTests()
    {
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Development");
            builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Database:Path"] = path, ["DataProtection:KeysPath"] = path + "-keys", ["RateLimits:AuthPermitLimit"] = "100"
            }));
            builder.ConfigureServices(services => { services.RemoveAll<TimeProvider>(); services.AddSingleton<TimeProvider>(clock); });
        });
    }

    [Fact]
    public async Task DeletionCascadesOnlyOwnedDataAndRevokesEverySession()
    {
        using var account = Client(); using var secondDevice = Client(); using var other = Client();
        var owner = await Register(account, "delete@example.test");
        var survivor = await Register(other, "keep@example.test");
        Assert.Equal(HttpStatusCode.OK, (await Post(secondDevice, "/api/auth/login", new { email = owner.Email, password = "long test password", rememberMe = true })).StatusCode);
        var receipt = (await secondDevice.GetFromJsonAsync<Receipt>("/api/auth/account-state"))!;
        Assert.False((await (await Post(secondDevice, "/api/auth/account-state", receipt)).Content.ReadFromJsonAsync<State>())!.Deleted);
        await Post(account, "/api/lessons/levantine-day-01/completions", new { completionId = "delete-completion", completedAt = DateTimeOffset.UtcNow });
        await Post(other, "/api/lessons/levantine-day-01/completions", new { completionId = "keep-completion", completedAt = DateTimeOffset.UtcNow });
        await account.GetAsync("/api/study-settings");
        await other.GetAsync("/api/study-settings");
        int curriculumCount;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var user = (await users.FindByIdAsync(owner.UserId!))!;
            await users.AddLoginAsync(user, new UserLoginInfo("Google", "delete-subject", "Google"));
            await users.AddClaimAsync(user, new System.Security.Claims.Claim("example", "owned"));
            await users.SetAuthenticationTokenAsync(user, "test", "owned-token", "value");
            await db.Database.ExecuteSqlRawAsync("INSERT INTO EmailCodes VALUES ('DELETE@EXAMPLE.TEST','pending','hash',0,9999999999,0)");
            curriculumCount = await db.CurriculumVersions.CountAsync();
        }
        Assert.Equal(HttpStatusCode.NoContent, (await Post(account, "/api/auth/delete-account", new { confirmation = "DELETE" })).StatusCode);
        Assert.False((await account.GetFromJsonAsync<AuthSessionResponse>("/api/auth/me"))!.IsAuthenticated);
        Assert.Equal(HttpStatusCode.Unauthorized, (await secondDevice.GetAsync("/api/study-settings")).StatusCode);
        // The cleanup receipt remains usable without a login cookie, including expiry/logout.
        using var expired = Client();
        var state = await Post(expired, "/api/auth/account-state", receipt);
        Assert.Equal("no-store", state.Headers.CacheControl?.ToString());
        Assert.True((await state.Content.ReadFromJsonAsync<State>())!.Deleted);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(account, "/api/auth/login", new { email = owner.Email, password = "long test password", rememberMe = false })).StatusCode);
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            Assert.False(await db.Users.AnyAsync(u => u.Id == owner.UserId));
            Assert.False(await db.LearnerProgress.AnyAsync(u => u.UserId == owner.UserId));
            Assert.False(await db.LessonCompletions.AnyAsync(u => u.UserId == owner.UserId));
            Assert.False(await db.StudySettings.AnyAsync(u => u.UserId == owner.UserId));
            Assert.False(await db.UserLogins.AnyAsync(u => u.UserId == owner.UserId));
            Assert.False(await db.UserClaims.AnyAsync(u => u.UserId == owner.UserId));
            Assert.False(await db.UserTokens.AnyAsync(u => u.UserId == owner.UserId));
            Assert.Empty(await db.Set<EmailCodeRecord>().ToListAsync());
            Assert.True(await db.LessonCompletions.AnyAsync(u => u.UserId == survivor.UserId));
            Assert.Equal(curriculumCount, await db.CurriculumVersions.CountAsync());
        }
        var replacement = await Register(account, owner.Email!);
        Assert.NotEqual(owner.UserId, replacement.UserId);
    }

    [Fact]
    public async Task RequiresCsrfExactConfirmationAndRecentProofEvenAfterCookieRefresh()
    {
        using var guest = Client(); using var client = Client();
        Assert.Equal(HttpStatusCode.Unauthorized, (await Post(guest, "/api/auth/delete-account", new { confirmation = "DELETE" })).StatusCode);
        await Register(client, "proof@example.test");
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/delete-account", new { confirmation = "DELETE" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "/api/auth/delete-account", new { confirmation = "delete" })).StatusCode);
        clock.Now += TimeSpan.FromMinutes(11);
        await client.GetAsync("/api/auth/me"); // Security-stamp refresh must not renew proof.
        Assert.Equal(HttpStatusCode.Forbidden, (await Post(client, "/api/auth/delete-account", new { confirmation = "DELETE" })).StatusCode);
        Assert.True((await client.GetFromJsonAsync<AuthSessionResponse>("/api/auth/me"))!.IsAuthenticated);
        await Post(client, "/api/auth/logout", new { });
        await Post(client, "/api/auth/login", new { email = "proof@example.test", password = "long test password", rememberMe = false });
        Assert.Equal(HttpStatusCode.NoContent, (await Post(client, "/api/auth/delete-account", new { confirmation = "DELETE" })).StatusCode);
    }

    [Fact]
    public async Task DatabaseFailureRollsBackCodesAndAccountAndCanBeRetried()
    {
        using var client = Client();
        await Register(client, "failure@example.test");
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            await db.Database.ExecuteSqlRawAsync("INSERT INTO EmailCodes VALUES ('FAILURE@EXAMPLE.TEST','pending','hash',0,9999999999,0)");
            await db.Database.ExecuteSqlRawAsync("CREATE TRIGGER fail_delete BEFORE DELETE ON AspNetUsers BEGIN SELECT RAISE(ABORT, 'test failure'); END");
        }
        Assert.Equal(HttpStatusCode.ServiceUnavailable, (await Post(client, "/api/auth/delete-account", new { confirmation = "DELETE" })).StatusCode);
        Assert.True((await client.GetFromJsonAsync<AuthSessionResponse>("/api/auth/me"))!.IsAuthenticated);
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            Assert.Single(await db.Set<EmailCodeRecord>().ToListAsync());
            await db.Database.ExecuteSqlRawAsync("DROP TRIGGER fail_delete");
        }
        Assert.Equal(HttpStatusCode.NoContent, (await Post(client, "/api/auth/delete-account", new { confirmation = "DELETE" })).StatusCode);
    }

    [Fact]
    public async Task StateReceiptsRequireCsrfAndRejectTampering()
    {
        using var client = Client();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/auth/account-state")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/account-state", new { token = "invalid" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "/api/auth/account-state", new { token = "invalid" })).StatusCode);
    }

    private HttpClient Client() => factory.CreateClient(new() { HandleCookies = true, AllowAutoRedirect = false });
    private static async Task<AuthSessionResponse> Register(HttpClient client, string email)
    {
        var result = await Post(client, "/api/auth/register", new { displayName = "Deletion test", email, password = "long test password" });
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        return (await result.Content.ReadFromJsonAsync<AuthSessionResponse>())!;
    }
    private static async Task<HttpResponseMessage> Post(HttpClient client, string url, object body)
    {
        var csrf = (await client.GetFromJsonAsync<CsrfTokenResponse>("/api/auth/csrf"))!;
        using var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = JsonContent.Create(body) };
        request.Headers.Add("X-CSRF-TOKEN", csrf.Token);
        return await client.SendAsync(request);
    }
    public void Dispose()
    {
        factory.Dispose();
        foreach (var suffix in new[] { "", "-wal", "-shm" }) if (File.Exists(path + suffix)) File.Delete(path + suffix);
        if (Directory.Exists(path + "-keys")) Directory.Delete(path + "-keys", true);
    }
    private sealed class Clock : TimeProvider { public DateTimeOffset Now = DateTimeOffset.UtcNow; public override DateTimeOffset GetUtcNow() => Now; }
    private sealed record Receipt(string Token);
    private sealed record State(bool Deleted);
}
