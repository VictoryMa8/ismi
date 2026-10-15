using System.Net;
using System.Net.Http.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ismi.Api.Tests;

public sealed class CulturalMediaTests : IDisposable
{
    private readonly string path = Path.Combine(Path.GetTempPath(), $"ismi-culture-{Guid.NewGuid():N}.db");
    private readonly TestClock clock = new();
    private readonly WebApplicationFactory<Program> factory;
    public CulturalMediaTests()
    {
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Development");
            builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?>
            { ["Database:Path"] = path, ["Curriculum:ApproverEmail"] = "culture-owner@example.test", ["RateLimits:AuthPermitLimit"] = "100" }));
            builder.ConfigureServices(services => services.AddSingleton<TimeProvider>(clock));
        });
    }
    private sealed class TestClock : TimeProvider
    {
        public DateTimeOffset At = new(2026, 10, 15, 12, 0, 0, TimeSpan.Zero);
        public override DateTimeOffset GetUtcNow() => At;
    }
    public void Dispose()
    {
        factory.Dispose();
        foreach (var suffix in new[] { "", "-wal", "-shm" }) if (File.Exists(path + suffix)) File.Delete(path + suffix);
    }
    private HttpClient Client() => factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true, AllowAutoRedirect = false });
    private async Task<HttpResponseMessage> Post(HttpClient c, string url, object payload)
    {
        var csrf = await c.GetFromJsonAsync<Token>("/api/auth/csrf");
        var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = JsonContent.Create(payload) };
        request.Headers.Add("X-CSRF-TOKEN", csrf!.TokenValue);
        return await c.SendAsync(request);
    }
    private sealed record Token([property: System.Text.Json.Serialization.JsonPropertyName("token")] string TokenValue);
    private async Task<HttpClient> Owner()
    {
        var c = Client();
        (await Post(c, "/api/auth/register", new { displayName = "Owner", email = "culture-owner@example.test", password = "Culture-test-123!" })).EnsureSuccessStatusCode();
        return c;
    }
    private async Task<CulturalDetail> Draft(HttpClient c, CulturalEdition edition, long? revision = null)
    {
        var response = await Post(c, "/api/admin/culture/drafts", new CulturalDraftRequest(edition, revision)); response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CulturalDetail>())!;
    }
    private async Task<CulturalDetail> Command(HttpClient c, CulturalDetail d, string action, int? version = null, string reason = "")
    {
        var response = await Post(c, $"/api/admin/culture/editions/{d.Id}/{action}", new CulturalCommand(d.Revision, version ?? d.State.Versions.Last().Number, reason));
        response.EnsureSuccessStatusCode(); return (await response.Content.ReadFromJsonAsync<CulturalDetail>())!;
    }
    private static CulturalEdition Edition(string id = "arabic-week", string week = "2026-10-12T00:00:00Z")
    {
        CulturalResource Resource(string id, string purpose, string url, string access = "free") => new(id, purpose, "Test publisher", url,
            180, access, "Synthetic fixture; not real media.", "Synthetic test region", false, ["English"], "publisher", null,
            "Synthetic caption evidence.", DateTime.Parse("2026-10-15T00:00:00Z").ToUniversalTime(), "PRIVATE resource evidence");
        CulturalItem Item(string slot, string url) => new(slot, slot, slot + " title", "عنوان", "Test creator", 2020, 180,
            "Arabic", "Egyptian", "Conversation", "stretch", "Natural speed", "Original description", "Notice a greeting.",
            "Read an existing downloaded lesson and identify a greeting.", "", "PRIVATE source evidence", "PRIVATE reviewer notes",
            slot == "film" ? [Resource("film-primary", "primary", url, "rental"), Resource("film-companion", "free-companion", "https://www.youtube.com/watch?v=film-companion")]
            : [Resource(slot + "-primary", "primary", url)]);
        return new(id, "Arabic discoveries", DateTime.Parse(week).ToUniversalTime(), "Everyday moments",
            [Item("youtube-video", "https://www.youtube.com/watch?v=video-fixture"), Item("film", "https://publisher.example.com/film"), Item("song", "https://www.youtube.com/watch?v=song-fixture")]);
    }

    [Fact]
    public void ValidationRejectsIncompleteSetsUnsafeUrlsAndUnclearSupport()
    {
        var validator = new CulturalMediaValidator(); var e = Edition(); Assert.True(validator.Validate(e).IsValid);
        Assert.False(validator.Validate(e with { Items = e.Items[..2] }).IsValid);
        Assert.False(validator.Validate(e with { Items = [e.Items[0], e.Items[0], e.Items[2]] }).IsValid);
        Assert.False(validator.Validate(e with { Items = [null!, e.Items[1], e.Items[2]] }).IsValid);
        Assert.False(validator.Validate(e with { WeekStartUtc = e.WeekStartUtc.AddDays(1) }).IsValid);
        foreach (var url in new[] { "javascript:alert(1)", "https://localhost/a", "https://127.0.0.1/a", "https://[::1]/a", "https://x.internal/a", "https://user:pass@example.com/a", "http://example.com/a", "https://example.com:123/a" })
            Assert.False(CulturalMediaValidator.SafeUrl(url));
        var video = e.Items[0]; var resource = video.Resources[0];
        foreach (var invalid in new[] { resource with { Access = "unknown" }, resource with { CaptionOrigin = "none" },
            resource with { EndSeconds = 181 }, resource with { Url = "https://example.com/not-youtube" }, resource with { CaptionLanguages = null! } })
            Assert.False(validator.Validate(e with { Items = [video with { Resources = [invalid] }, e.Items[1], e.Items[2]] }).IsValid);
        Assert.False(validator.Validate(e with { Items = [video, e.Items[1] with { Resources = [e.Items[1].Resources[0]] }, e.Items[2]] }).IsValid);
        Assert.False(validator.Validate(e with { Items = [video, e.Items[1], e.Items[2] with {
            Resources = [e.Items[2].Resources[0] with { Url = "https://youtu.be/video-fixture?t=20" }] }] }).IsValid);
    }

    [Fact]
    public async Task OwnerGateCsrfAndInvalidPublicationAreEnforced()
    {
        using var anonymous = Client(); Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/admin/culture/editions")).StatusCode);
        (await Post(anonymous, "/api/auth/register", new { displayName = "Learner", email = "learner@example.test", password = "Culture-test-123!" })).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Forbidden, (await anonymous.GetAsync("/api/admin/culture/editions")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await Post(anonymous, "/api/admin/culture/drafts", new CulturalDraftRequest(Edition()))).StatusCode);
        using var owner = await Owner();
        Assert.Equal(HttpStatusCode.BadRequest, (await owner.PostAsJsonAsync("/api/admin/culture/drafts", new CulturalDraftRequest(Edition()))).StatusCode);
        var d = await Draft(owner, Edition() with { Items = Edition().Items[..2] });
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(owner, $"/api/admin/culture/editions/{d.Id}/approve", new CulturalCommand(d.Revision, 1))).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(owner, $"/api/admin/culture/editions/{d.Id}/publish", new CulturalCommand(d.Revision, 1))).StatusCode);
        var catalog = await owner.GetFromJsonAsync<CulturalCatalog>("/api/culture/weekly"); Assert.Empty(catalog!.Editions);
    }

    [Fact]
    public async Task FutureEditionsStayPrivateAndServerTimeSelectsMondayAndLatest()
    {
        using var c = await Owner(); var d = await Draft(c, Edition()); d = await Command(c, d, "approve"); d = await Command(c, d, "publish");
        var future = await Draft(c, Edition("future-week", "2026-10-19T00:00:00Z")); future = await Command(c, future, "approve"); await Command(c, future, "publish");
        var before = (await c.GetFromJsonAsync<CulturalCatalog>("/api/culture/weekly"))!;
        Assert.Single(before.Editions); Assert.Equal(d.Id, before.CurrentId); Assert.True(before.IsCurrentWeek);
        Assert.Equal(HttpStatusCode.NotFound, (await c.GetAsync("/api/culture/editions/future-week")).StatusCode);
        var json = await c.GetStringAsync("/api/culture/weekly"); Assert.DoesNotContain("PRIVATE", json); Assert.DoesNotContain("future-week", json);
        clock.At = new(2026, 10, 18, 23, 59, 59, TimeSpan.Zero); Assert.Single((await c.GetFromJsonAsync<CulturalCatalog>("/api/culture/weekly"))!.Editions);
        clock.At = clock.At.AddSeconds(1); var at = (await c.GetFromJsonAsync<CulturalCatalog>("/api/culture/weekly"))!;
        Assert.Equal("future-week", at.CurrentId); Assert.Equal(2, at.Editions.Length); Assert.NotEqual(before.CatalogRevision, at.CatalogRevision);
        clock.At = clock.At.AddDays(7); Assert.False((await c.GetFromJsonAsync<CulturalCatalog>("/api/culture/weekly"))!.IsCurrentWeek);
    }

    [Fact]
    public async Task CorrectionsRequireNewApprovalAndWithdrawalAndRollbackAreAudited()
    {
        using var c = await Owner(); var e = Edition(); var d = await Draft(c, e); d = await Command(c, d, "approve"); d = await Command(c, d, "publish");
        var first = d; d = await Draft(c, e with { Title = "Corrected collection" }, d.Revision);
        Assert.Equal(2, d.State.Versions.Length); Assert.Equal(1, d.State.PublishedVersion);
        Assert.Equal(HttpStatusCode.Conflict, (await Post(c, $"/api/admin/culture/editions/{d.Id}/approve", new CulturalCommand(first.Revision, 2))).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await Post(c, $"/api/admin/culture/editions/{d.Id}/publish", new CulturalCommand(d.Revision, 2))).StatusCode);
        d = await Command(c, d, "approve"); d = await Command(c, d, "publish");
        var suppression = await Post(c, $"/api/admin/culture/editions/{d.Id}/check-link", new CulturalLinkCheck(d.Revision, 2, "film-primary", false, "Unavailable at checked destination."));
        suppression.EnsureSuccessStatusCode(); d = (await suppression.Content.ReadFromJsonAsync<CulturalDetail>())!;
        var publicEdition = (await c.GetFromJsonAsync<CulturalPublicEdition>($"/api/culture/editions/{d.Id}"))!;
        var film = publicEdition.Items.Single(i => i.Slot == "film"); Assert.Null(film.Resources[0].Url); Assert.True(film.Resources[1].Available);
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(c, $"/api/admin/culture/editions/{d.Id}/rollback", new CulturalCommand(d.Revision, 1))).StatusCode);
        var recheck = await Post(c, $"/api/admin/culture/editions/{d.Id}/check-link", new CulturalLinkCheck(d.Revision, 1, "film-primary", true, "Destination available again; access labels unchanged."));
        recheck.EnsureSuccessStatusCode(); d = (await recheck.Content.ReadFromJsonAsync<CulturalDetail>())!;
        d = await Command(c, d, "rollback", 1); Assert.Equal(1, d.State.PublishedVersion);
        d = await Command(c, d, "withdraw", 1, "Owner withdrawal.");
        var catalog = (await c.GetFromJsonAsync<CulturalCatalog>("/api/culture/weekly"))!;
        Assert.Empty(catalog.Editions); Assert.Contains(d.Id, catalog.WithdrawnIds);
        Assert.Equal(HttpStatusCode.NotFound, (await c.GetAsync($"/api/culture/editions/{d.Id}")).StatusCode);
        Assert.Contains(d.State.Audit, a => a.Action == "rollback"); Assert.Contains(d.State.Audit, a => a.Action == "withdraw");
        Assert.Equal(2, d.State.Observations.Length);
    }

    [Fact]
    public async Task ConcurrentSavesAndWeekConflictsCannotOverwriteACollection()
    {
        using var c = await Owner(); var e = Edition(); var d = await Draft(c, e);
        var saves = await Task.WhenAll(Post(c, "/api/admin/culture/drafts", new CulturalDraftRequest(e with { Title = "First" }, d.Revision)),
            Post(c, "/api/admin/culture/drafts", new CulturalDraftRequest(e with { Title = "Second" }, d.Revision)));
        Assert.Single(saves, r => r.IsSuccessStatusCode); Assert.Single(saves, r => r.StatusCode == HttpStatusCode.Conflict);
        Assert.Equal(HttpStatusCode.Conflict, (await Post(c, "/api/admin/culture/drafts", new CulturalDraftRequest(e with { Id = "other-edition-same-week" }))).StatusCode);
        clock.At = clock.At.AddDays(8); var current = (await c.GetFromJsonAsync<CulturalDetail>($"/api/admin/culture/editions/{d.Id}"))!;
        Assert.Equal(HttpStatusCode.BadRequest, (await Post(c, $"/api/admin/culture/editions/{d.Id}/approve", new CulturalCommand(current.Revision, 1))).StatusCode);
    }
}
