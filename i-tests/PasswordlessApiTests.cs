using System.Net;
using System.Net.Http.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Tests;

public sealed class PasswordlessApiTests : IDisposable
{
    private readonly string path = Path.Combine(Path.GetTempPath(), $"ismi-passwordless-{Guid.NewGuid():N}.db");
    private readonly Mailbox mailbox = new();
    private readonly GoogleVerifier google = new();
    private readonly TestClock clock = new();
    private readonly WebApplicationFactory<Program> factory;

    public PasswordlessApiTests()
    {
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Development");
            builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Database:Path"] = path, ["DataProtection:KeysPath"] = path + "-keys",
                ["Authentication:Google:ClientId"] = "test.apps.googleusercontent.com",
                ["LoginEmail:DailyLimit"] = "2"
            }));
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<ILoginEmailSender>(); services.AddSingleton<ILoginEmailSender>(mailbox);
                services.RemoveAll<IGoogleIdentityVerifier>(); services.AddSingleton<IGoogleIdentityVerifier>(google);
                services.RemoveAll<TimeProvider>(); services.AddSingleton<TimeProvider>(clock);
            });
        });
    }

    private HttpClient Client() => factory.CreateClient(new() { HandleCookies = true, AllowAutoRedirect = false });
    private static async Task<HttpResponseMessage> Post(HttpClient client, string endpoint, object body)
    {
        var csrf = await client.GetFromJsonAsync<CsrfTokenResponse>("/api/auth/csrf");
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/" + endpoint) { Content = JsonContent.Create(body) };
        request.Headers.Add("X-CSRF-TOKEN", csrf!.Token);
        return await client.SendAsync(request);
    }
    private static async Task<string> SendCode(HttpClient client, string email)
    {
        var response = await Post(client, "email-code/request", new { email });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<Challenge>())!.ChallengeId;
    }

    [Fact]
    public async Task DailyEmailBudgetIsDurableAndRollsOverWithoutRetainingAddresses()
    {
        using var client = Client();
        await SendCode(client, "one@example.test");
        await SendCode(client, "two@example.test");
        Assert.Equal(HttpStatusCode.ServiceUnavailable, (await Post(client, "email-code/request", new { email = "three@example.test" })).StatusCode);
        clock.Now += TimeSpan.FromDays(1);
        await SendCode(client, "three@example.test");
    }

    [Fact]
    public async Task ConcurrentVerificationsConsumeCodeOnce()
    {
        using var client = Client();
        var challenge = await SendCode(client, "race@example.test");
        using var scope1 = factory.Services.CreateScope();
        using var scope2 = factory.Services.CreateScope();
        var results = await Task.WhenAll(
            scope1.ServiceProvider.GetRequiredService<EmailCodeService>().ConsumeAsync(challenge, mailbox.Code, default),
            scope2.ServiceProvider.GetRequiredService<EmailCodeService>().ConsumeAsync(challenge, mailbox.Code, default));
        Assert.Single(results, r => r is not null);
    }

    [Fact]
    public async Task EmailProofCreatesAccountOnlyAfterVerificationAndCodeIsSingleUse()
    {
        using var client = Client();
        var challenge = await SendCode(client, "nadia@example.test");
        Assert.False((await client.GetFromJsonAsync<AuthSessionResponse>("/api/auth/me"))!.IsAuthenticated);
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            Assert.Empty(await db.Users.ToListAsync());
            Assert.DoesNotContain(mailbox.Code, (await db.Set<EmailCodeRecord>().SingleAsync()).CodeHash);
        }
        var verify = await Post(client, "email-code/verify", new { challengeId = challenge, code = mailbox.Code, rememberMe = true });
        Assert.Equal(HttpStatusCode.OK, verify.StatusCode);
        Assert.True((await verify.Content.ReadFromJsonAsync<AuthSessionResponse>())!.IsAuthenticated);
        Assert.Contains(verify.Headers.GetValues("Set-Cookie"), c => c.StartsWith("Ismi.Auth=") && c.Contains("expires=", StringComparison.OrdinalIgnoreCase));
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "email-code/verify", new { challengeId = challenge, code = mailbox.Code })).StatusCode);
    }

    [Fact]
    public async Task EmailCodeRecoversExistingAccountAndPreservesProgress()
    {
        using var client = Client();
        var registered = await Post(client, "register", new { displayName = "Nadia", email = "nadia@example.test", password = "long test password" });
        var original = (await registered.Content.ReadFromJsonAsync<AuthSessionResponse>())!;
        await Post(client, "logout", new { });
        var challenge = await SendCode(client, "NADIA@example.test");
        var response = await Post(client, "email-code/verify", new { challengeId = challenge, code = mailbox.Code });
        var session = (await response.Content.ReadFromJsonAsync<AuthSessionResponse>())!;
        Assert.Equal(original.UserId, session.UserId);
        Assert.Equal("Nadia", session.DisplayName);
        using var scope = factory.Services.CreateScope();
        Assert.True((await scope.ServiceProvider.GetRequiredService<IsmiDbContext>().Users.SingleAsync()).EmailConfirmed);
    }

    [Fact]
    public async Task CodeExpiresAndFiveWrongAttemptsExhaustIt()
    {
        using var client = Client();
        var challenge = await SendCode(client, "expiry@example.test");
        clock.Now += TimeSpan.FromMinutes(11);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "email-code/verify", new { challengeId = challenge, code = mailbox.Code })).StatusCode);
        challenge = await SendCode(client, "attempts@example.test");
        var correct = mailbox.Code;
        var wrong = correct == "00000000" ? "11111111" : "00000000";
        for (var i = 0; i < 5; i++)
            Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "email-code/verify", new { challengeId = challenge, code = wrong })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "email-code/verify", new { challengeId = challenge, code = correct })).StatusCode);
    }

    [Fact]
    public async Task ResendCooldownAndReplacementAreEnforced()
    {
        using var client = Client();
        var first = await SendCode(client, "resend@example.test");
        var firstCode = mailbox.Code;
        Assert.Equal(HttpStatusCode.TooManyRequests, (await Post(client, "email-code/request", new { email = "RESEND@example.test" })).StatusCode);
        clock.Now += TimeSpan.FromSeconds(61);
        var second = await SendCode(client, "resend@example.test");
        Assert.NotEqual(first, second);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "email-code/verify", new { challengeId = first, code = firstCode })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await Post(client, "email-code/verify", new { challengeId = second, code = mailbox.Code })).StatusCode);
    }

    [Fact]
    public async Task CsrfAndDeliveryFailuresFailClosedWithoutCreatingAccounts()
    {
        using var client = Client();
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/email-code/request", new { email = "csrf@example.test" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/google", new { credential = "untrusted" })).StatusCode);
        mailbox.Fail = true;
        Assert.Equal(HttpStatusCode.ServiceUnavailable, (await Post(client, "email-code/request", new { email = "failure@example.test" })).StatusCode);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
        Assert.Empty(await db.Users.ToListAsync());
        Assert.Empty(await db.Set<EmailCodeRecord>().ToListAsync());
    }

    [Fact]
    public async Task GoogleRequiresNonceAndUsesStableSubjectForReturningSignIn()
    {
        using var client = Client();
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "google", new { credential = "valid" })).StatusCode);
        var nonce = (await (await Post(client, "google/nonce", new { })).Content.ReadFromJsonAsync<Nonce>())!.Value;
        google.Identity = new("subject-1", "google@example.test", "Google Learner", nonce);
        var response = await Post(client, "google", new { credential = "valid" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var first = (await response.Content.ReadFromJsonAsync<AuthSessionResponse>())!;
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "google", new { credential = "valid" })).StatusCode);
        await Post(client, "logout", new { });
        nonce = (await (await Post(client, "google/nonce", new { })).Content.ReadFromJsonAsync<Nonce>())!.Value;
        google.Identity = new("subject-1", "changed@example.test", "Changed Name", nonce);
        var returning = await Post(client, "google", new { credential = "valid" });
        Assert.Equal(first.UserId, (await returning.Content.ReadFromJsonAsync<AuthSessionResponse>())!.UserId);
    }

    [Fact]
    public async Task GoogleCannotSilentlyLinkExistingEmailButOwnerCanConnectIt()
    {
        using var client = Client();
        var registered = await Post(client, "register", new { displayName = "Owner", email = "same@example.test", password = "long test password" });
        var original = (await registered.Content.ReadFromJsonAsync<AuthSessionResponse>())!;
        await Post(client, "logout", new { });
        var nonce = (await (await Post(client, "google/nonce", new { })).Content.ReadFromJsonAsync<Nonce>())!.Value;
        google.Identity = new("subject-2", "same@example.test", "Same", nonce);
        Assert.Equal(HttpStatusCode.Conflict, (await Post(client, "google", new { credential = "valid" })).StatusCode);
        await Post(client, "login", new { email = "same@example.test", password = "long test password" });
        nonce = (await (await Post(client, "google/nonce", new { })).Content.ReadFromJsonAsync<Nonce>())!.Value;
        google.Identity = google.Identity with { Nonce = nonce };
        var connected = await Post(client, "google", new { credential = "valid" });
        Assert.Equal(original.UserId, (await connected.Content.ReadFromJsonAsync<AuthSessionResponse>())!.UserId);
    }

    [Fact]
    public async Task InvalidGoogleTokenAndWrongNonceCannotSignIn()
    {
        using var client = Client();
        await Post(client, "google/nonce", new { });
        google.Identity = new("subject-3", "wrong@example.test", "Wrong", "wrong-nonce");
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "google", new { credential = "valid" })).StatusCode);
        await Post(client, "google/nonce", new { });
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(client, "google", new { credential = "invalid" })).StatusCode);
        var real = new GoogleIdentityVerifier(new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            { ["Authentication:Google:ClientId"] = "test.apps.googleusercontent.com" }).Build());
        Assert.Null(await real.VerifyAsync("malformed"));
    }

    [Theory]
    [InlineData("google")]
    [InlineData("email")]
    public async Task PasswordlessAccountsCanDeleteAfterFreshIdentityProof(string method)
    {
        using var client = Client();
        if (method == "google")
        {
            var nonce = (await (await Post(client, "google/nonce", new { })).Content.ReadFromJsonAsync<Nonce>())!.Value;
            google.Identity = new("delete-subject", "delete-google@example.test", "Learner", nonce);
            Assert.Equal(HttpStatusCode.OK, (await Post(client, "google", new { credential = "valid" })).StatusCode);
        }
        else
        {
            var challengeId = await SendCode(client, "delete-email@example.test");
            Assert.Equal(HttpStatusCode.OK, (await Post(client, "email-code/verify", new { challengeId, code = mailbox.Code })).StatusCode);
        }
        Assert.Equal(HttpStatusCode.NoContent, (await Post(client, "delete-account", new { confirmation = "DELETE" })).StatusCode);
        using var scope = factory.Services.CreateScope();
        Assert.Empty(await scope.ServiceProvider.GetRequiredService<IsmiDbContext>().Users.ToListAsync());
    }

    public void Dispose()
    {
        factory.Dispose();
        foreach (var suffix in new[] { "", "-wal", "-shm" }) if (File.Exists(path + suffix)) File.Delete(path + suffix);
        if (Directory.Exists(path + "-keys")) Directory.Delete(path + "-keys", true);
    }
    private sealed record Challenge(string ChallengeId);
    private sealed record Nonce([property: System.Text.Json.Serialization.JsonPropertyName("nonce")] string Value);
    private sealed class TestClock : TimeProvider { public DateTimeOffset Now = DateTimeOffset.UtcNow; public override DateTimeOffset GetUtcNow() => Now; }
    private sealed class Mailbox : ILoginEmailSender
    {
        public bool IsConfigured => true;
        public string Code = "";
        public bool Fail;
        public Task SendAsync(string email, string code, CancellationToken ct) { if (Fail) throw new HttpRequestException("Test failure"); Code = code; return Task.CompletedTask; }
    }
    private sealed class GoogleVerifier : IGoogleIdentityVerifier
    {
        public GoogleIdentity? Identity;
        public Task<GoogleIdentity?> VerifyAsync(string token) => Task.FromResult(token == "valid" ? Identity : null);
    }
}
