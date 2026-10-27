using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ismi.Api.Data;
using Microsoft.EntityFrameworkCore;
namespace Ismi.Api.Tests;
public sealed class StoryTests : IDisposable {
    private readonly string root = Path.Combine(Path.GetTempPath(), $"ismi-stories-{Guid.NewGuid():N}");
    private readonly WebApplicationFactory<Program> factory;
    public StoryTests() {
        Directory.CreateDirectory(root);
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(b => { b.UseEnvironment("Development"); b.ConfigureAppConfiguration((_,c) => c.AddInMemoryCollection(new Dictionary<string,string?> {
            ["Database:Path"] = Path.Combine(root,"test.db"), ["Recordings:Path"] = Path.Combine(root,"audio"), ["Curriculum:ApproverEmail"] = "story-owner@example.test", ["RateLimits:AuthPermitLimit"] = "100", ["Curriculum:AllowStoryTextPreview"] = "true" })); });
    }
    public void Dispose() { factory.Dispose(); Directory.Delete(root,true); }
    private HttpClient Client() => factory.CreateClient(new() { HandleCookies=true, AllowAutoRedirect=false });
    private static async Task<HttpResponseMessage> Post(HttpClient c,string path, object body) {
        var token=(await c.GetFromJsonAsync<JsonElement>("/api/auth/csrf")).GetProperty("token").GetString();
        var r=new HttpRequestMessage(HttpMethod.Post,path) { Content=JsonContent.Create(body) };r.Headers.Add("X-CSRF-TOKEN",token);return await c.SendAsync(r);
    }
    private async Task<HttpClient> Owner(WebApplicationFactory<Program>? app = null) { var c=app is null ? Client() : app.CreateClient(new() { HandleCookies=true, AllowAutoRedirect=false });(await Post(c,"/api/auth/register",new { displayName="Owner",email="story-owner@example.test",password="Test-password-123!" })).EnsureSuccessStatusCode();return c; }
    private static StoryPack Fixture() {
        var l=new SeedCurriculum().GetInitialLesson();var text=l.Steps[0].Prompt;
        return new("story-test","levantine",l.UnitId,"test-arc",1,"Synthetic story test","Not authored curriculum.", [new(l.Id,$"curriculum-{l.Id}-v1")],
            [new("Scene","A synthetic check-in.",[new("fattoush",text,0)])],
            [new("one","comprehension","What happened?",[new("a","A check-in","Synthetic rationale."),new("b","A plan","Synthetic rationale.")],"a","Synthetic explanation.",0,l.Steps[0].Id),
             new("two","comprehension","What is the intent?",[new("a","Check in","Synthetic rationale."),new("b","Plan","Synthetic rationale.")],"a","Synthetic explanation.",0,l.Steps[0].Id),
             new("three","response","Reply.",l.Steps[0].Answers.Select(a=>new StoryChoice(a.Id,a.Arabic,"Synthetic rationale.",a.Arabizi,a.Meaning)).ToArray(),l.Steps[0].Evaluation.CorrectAnswerId,"Synthetic explanation.",0,l.Steps[0].Id)],"TEST REVIEWER","SYNTHETIC REVIEW EVIDENCE","SYNTHETIC RIGHTS EVIDENCE");
    }
    private static async Task<StoryDetail> Save(HttpClient c,StoryPack p,long? revision=null) { var r=await Post(c,"/api/admin/stories/drafts",new StoryDraft(p,revision));r.EnsureSuccessStatusCode();return (await r.Content.ReadFromJsonAsync<StoryDetail>())!; }
    private static Task<HttpResponseMessage> Cmd(HttpClient c,StoryDetail d,string action,int? v=null) => Post(c,$"/api/admin/stories/packs/{d.Id}/{action}",new StoryCommand(d.Revision,v??d.State.Versions.Last().Number,"Synthetic test"));
    private static async Task<StoryDetail> Command(HttpClient c,StoryDetail d,string a,int? n=null) {var r=await Cmd(c,d,a,n);r.EnsureSuccessStatusCode();return (await r.Content.ReadFromJsonAsync<StoryDetail>())!;}
    private static async Task SeedArcSources(IServiceProvider services, int firstVersion = 5) {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
        var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        var paths = new[] { ("phrase-anatomy-release", "01-lesson.json"), ("recall", "03-lesson.json"), ("recall", "06-lesson.json") };
        for (var i = 0; i < paths.Length; i++) {
            var source = JsonSerializer.Deserialize<CurriculumDraftRequest>(await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, paths[i].Item1, paths[i].Item2)), json)!;
            var version = i == 0 ? firstVersion : 3;
            db.CurriculumVersions.Add(new() { LessonId = source.Lesson.Id, VersionNumber = version, Status = CurriculumStatuses.Published,
                ContentJson = JsonSerializer.Serialize(source.Lesson with { Version = $"curriculum-{source.Lesson.Id}-v{version}" }, json), CreatedBy = "SYNTHETIC SOURCE SNAPSHOT TEST" });
        }
        await db.SaveChangesAsync();
    }
    [Fact] public async Task ExactArcPublicationIsAtomicIdempotentAndPreservesLegacyPreview() {
        using var app = factory.WithWebHostBuilder(b => b.ConfigureAppConfiguration((_, cfg) => cfg.AddInMemoryCollection(new Dictionary<string, string?> { ["Curriculum:AllowStoryArcTextPreview"] = "true" })));
        using var owner = await Owner(app); using var guest = app.CreateClient();
        var policy = app.Services.GetRequiredService<StoryTextPreviewPolicy>(); var packages = policy.ExactArcPackages();
        Assert.Equal(new[] { 1, 2, 3 }, packages.Select(p => p.Episode));
        Assert.All(packages, p => { Assert.True(policy.IsAuthorized(p)); Assert.False(policy.IsAuthorized(p with { Summary = p.Summary + " changed" })); });
        var disabled = new StoryTextPreviewPolicy(new ConfigurationBuilder().Build()); Assert.All(packages, p => Assert.False(disabled.IsAuthorized(p)));
        await SeedArcSources(app.Services, 4);
        var old = await Command(owner, await Command(owner, await Save(owner, policy.ExactPackage()), "authorize-text-preview"), "publish");
        var legacy = JsonSerializer.Serialize(old.State.Versions[0]);
        await using (var scope = app.Services.CreateAsyncScope()) {
            var service = scope.ServiceProvider.GetRequiredService<StoryService>();
            await Assert.ThrowsAsync<StoryException>(() => service.PublishExactArcTextPreviewsAsync("synthetic test operator", CancellationToken.None));
            Assert.Single(await service.ListAsync(CancellationToken.None));
        }
        Assert.Equal(old.Revision, (await owner.GetFromJsonAsync<StoryDetail>($"/api/admin/stories/packs/{old.Id}"))!.Revision);
        // Reproduce the real first-source transition v4 → v5 without changing its taught text.
        await using (var scope = app.Services.CreateAsyncScope()) {
            var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            var source = await db.CurriculumVersions.SingleAsync(v => v.LessonId == packages[0].Sources[0].LessonId && v.Status == CurriculumStatuses.Published);
            var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
            var lesson = JsonSerializer.Deserialize<LessonResponse>(source.ContentJson, json)!;
            source.Status = "superseded";
            db.CurriculumVersions.Add(new() { LessonId = source.LessonId, VersionNumber = 5, Status = CurriculumStatuses.Published,
                ContentJson = JsonSerializer.Serialize(lesson with { Version = packages[0].Sources[0].Version }, json), CreatedBy = "SYNTHETIC SOURCE SNAPSHOT TEST" });
            await db.SaveChangesAsync();
        }
        StoryDetail[] published;
        await using (var scope = app.Services.CreateAsyncScope()) published = await scope.ServiceProvider.GetRequiredService<StoryService>().PublishExactArcTextPreviewsAsync("synthetic test operator", CancellationToken.None);
        Assert.Equal(new[] { 2, 1, 1 }, published.Select(d => d.State.PublishedVersion!.Value));
        Assert.Equal(legacy, JsonSerializer.Serialize(published[0].State.Versions[0] with { Status = "published" }));
        var catalog = (await guest.GetFromJsonAsync<StoryCatalog>("/api/stories"))!;
        Assert.Equal(new[] { 1, 2, 3 }, catalog.Episodes.Select(p => p.Episode));
        Assert.All(catalog.Episodes, p => { Assert.Equal("story-arc-text-preview-2026-10-27", p.PublicationNotice!.ReleaseId); Assert.Contains("source-rights acceptance are pending", p.PublicationNotice.Details); });
        foreach (var detail in published) {
            var current = detail.State.Versions.Single(v => v.Number == detail.State.PublishedVersion);
            Assert.Null(current.ApprovedBy); Assert.NotNull(current.PreviewAuthorizedBy); Assert.True(current.TextPreview);
            Assert.Empty(current.Pack.Reviewer); Assert.Empty(current.Pack.ReviewEvidence); Assert.Empty(current.Pack.RightsEvidence);
            Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, detail, "approve", current.Number)).StatusCode);
        }
        await using (var scope = app.Services.CreateAsyncScope()) {
            var again = await scope.ServiceProvider.GetRequiredService<StoryService>().PublishExactArcTextPreviewsAsync("synthetic test operator", CancellationToken.None);
            Assert.Equal(published.Select(d => d.Revision), again.Select(d => d.Revision));
        }
        var changed = await Save(owner, packages[1] with { Title = "An owner draft that must be preserved" }, published[1].Revision);
        await using (var scope = app.Services.CreateAsyncScope()) await Assert.ThrowsAsync<StoryException>(() => scope.ServiceProvider.GetRequiredService<StoryService>().PublishExactArcTextPreviewsAsync("synthetic test operator", CancellationToken.None));
        Assert.Equal(changed.Revision, (await owner.GetFromJsonAsync<StoryDetail>($"/api/admin/stories/packs/{changed.Id}"))!.Revision);
        Assert.Equal(published[0].Revision, (await owner.GetFromJsonAsync<StoryDetail>($"/api/admin/stories/packs/{published[0].Id}"))!.Revision);
        using var hidden = app.WithWebHostBuilder(b => b.ConfigureAppConfiguration((_, cfg) => cfg.AddInMemoryCollection(new Dictionary<string, string?> { ["Curriculum:AllowStoryArcTextPreview"] = "false" })));
        using var hiddenGuest = hidden.CreateClient(); Assert.Empty((await hiddenGuest.GetFromJsonAsync<StoryCatalog>("/api/stories"))!.Episodes);
    }
    [Theory]
    [InlineData(2, 3)]
    [InlineData(3, 6)]
    public async Task AuthoredArcDraftMatchesRecordedSourcesButCannotBeApprovedOrPublished(int episode, int lessonNumber) {
        using var owner = await Owner(); using var guest = Client();
        var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        var pack = JsonSerializer.Deserialize<StoryPack>(await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "story-drafts", $"{episode:00}.pack.json")), json)!;
        var source = JsonSerializer.Deserialize<CurriculumDraftRequest>(await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "recall", $"{lessonNumber:00}-lesson.json")), json)!;
        Assert.True(StoryService.Bounded(pack));
        Assert.Equal(episode, pack.Episode); Assert.Equal("after-a-long-day", pack.ArcId);
        Assert.Empty(pack.Reviewer); Assert.Empty(pack.ReviewEvidence); Assert.Empty(pack.RightsEvidence);
        // Reproduce the recorded v3 source only in this disposable test database.
        // This fixture does not accept or publish any authored story candidate.
        await using (var scope = factory.Services.CreateAsyncScope()) {
            var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            db.CurriculumVersions.Add(new() { LessonId = source.Lesson.Id, VersionNumber = 3, Status = CurriculumStatuses.Published,
                ContentJson = JsonSerializer.Serialize(source.Lesson with { Version = pack.Sources[0].Version }, json), CreatedBy = "SYNTHETIC SOURCE SNAPSHOT TEST" });
            await db.SaveChangesAsync();
        }
        var detail = await Save(owner, pack);
        var validationResponse = await Cmd(owner, detail, "validate"); validationResponse.EnsureSuccessStatusCode();
        var validation = (await validationResponse.Content.ReadFromJsonAsync<StoryValidation>())!;
        Assert.False(validation.IsValid); Assert.Single(validation.Errors);
        Assert.Contains("human linguistic/check/role review and source/rights acceptance", validation.Errors[0]);
        Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, detail, "approve")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, detail, "publish")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, detail, "authorize-text-preview")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/stories/packs/{pack.Id}")).StatusCode);
        var preview = (await owner.GetFromJsonAsync<StoryPublicPack>($"/api/admin/stories/packs/{pack.Id}/preview/1"))!;
        Assert.Equal(pack.Title, preview.Title); Assert.Equal(episode, preview.Episode);
        var after = (await owner.GetFromJsonAsync<StoryDetail>($"/api/admin/stories/packs/{pack.Id}"))!;
        Assert.Equal(detail.Revision, after.Revision); Assert.Null(after.State.PublishedVersion);
        Assert.Null(after.State.Versions[0].ApprovedBy); Assert.False(after.State.Versions[0].TextPreview);
    }
    [Fact] public async Task OwnerCsrfAndPublicPrivacyGates() {
        using var guest=Client();Assert.Equal(HttpStatusCode.Unauthorized,(await guest.GetAsync("/api/admin/stories/packs")).StatusCode);
        using var owner=await Owner();var p=Fixture();var d=await Save(owner,p);
        Assert.Equal(HttpStatusCode.BadRequest,(await owner.PostAsJsonAsync("/api/admin/stories/drafts",new StoryDraft(p,d.Revision))).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound,(await guest.GetAsync($"/api/stories/packs/{p.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized,(await guest.GetAsync($"/api/admin/stories/packs/{p.Id}/preview/1")).StatusCode);
        var preview=await owner.GetStringAsync($"/api/admin/stories/packs/{p.Id}/preview/1");Assert.DoesNotContain("SYNTHETIC REVIEW",preview);Assert.DoesNotContain("approvedBy",preview);
        (await Post(guest,"/api/auth/register",new {displayName="Learner",email="learner@example.test",password="Test-password-123!"})).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Forbidden,(await guest.GetAsync("/api/admin/stories/packs")).StatusCode);
    }
    [Fact] public async Task ImmutableVersionsStaleEditsRollbackAndWithdrawal() {
        using var c=await Owner();using var guest=Client();var p=Fixture();var d=await Save(c,p);
        Assert.Equal(HttpStatusCode.Conflict,(await Cmd(c,d,"publish")).StatusCode);
        d=await Command(c,d,"approve");d=await Command(c,d,"publish");var original=await guest.GetFromJsonAsync<StoryPublicPack>($"/api/stories/packs/{p.Id}");
        var old=d;d=await Save(c,p with {Title="Revision two"},d.Revision);
        Assert.Equal(HttpStatusCode.Conflict,(await Cmd(c,old,"withdraw")).StatusCode);
        Assert.Equal(1,d.State.PublishedVersion);Assert.Equal("Synthetic story test",d.State.Versions.First().Pack.Title);
        d=await Command(c,d,"approve");d=await Command(c,d,"publish");var revised=await guest.GetFromJsonAsync<StoryPublicPack>($"/api/stories/packs/{p.Id}");Assert.NotEqual(original!.ContentHash,revised!.ContentHash);
        d=await Command(c,d,"rollback",1);Assert.Equal(1,d.State.PublishedVersion);d=await Command(c,d,"withdraw",1);
        Assert.Empty((await guest.GetFromJsonAsync<StoryCatalog>("/api/stories"))!.Episodes);Assert.Equal(HttpStatusCode.NotFound,(await guest.GetAsync($"/api/stories/packs/{p.Id}")).StatusCode);
        Assert.Contains(d.State.Audit,a=>a.Action=="rollback");Assert.Contains(d.State.Audit,a=>a.Action=="withdraw");
    }
    [Fact] public async Task ReviewExactSourceResponseTargetsAndStructureAreRequired() {
        using var c=await Owner();var p=Fixture();
        foreach(var bad in new[] {p with {Reviewer=""},p with {RightsEvidence=""},p with {Sources=[p.Sources[0] with {Version="changed"}]},
            p with {Scenes=[p.Scenes[0] with {Lines=[p.Scenes[0].Lines[0] with {Text=p.Scenes[0].Lines[0].Text with {Arabic="untaught"}}]}]},
            p with {Checks=[p.Checks[0] with {Target="missing"},p.Checks[1],p.Checks[2]]},
            p with {Checks=[p.Checks[0],p.Checks[1],p.Checks[2] with {Choices=[new("a","untaught","Explanation"),new("b","other","Explanation")]}]} }) {
            var d=await Save(c,bad with { Id = "invalid-" + Guid.NewGuid().ToString("N") });Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"approve")).StatusCode);
        }
        foreach(var malformed in new[] {p with {Scenes=[null!]},p with {Checks=[null!,p.Checks[1],p.Checks[2]]},p with {CourseId="quranic"}})
            Assert.Equal(HttpStatusCode.BadRequest,(await Post(c,"/api/admin/stories/drafts",new StoryDraft(malformed))).StatusCode);
    }
    [Fact] public async Task ConcurrentDraftUpdatesDoNotOverwrite() {
        using var c=await Owner();var p=Fixture();var d=await Save(c,p);
        var results=await Task.WhenAll(Post(c,"/api/admin/stories/drafts",new StoryDraft(p with {Title="A"},d.Revision)),Post(c,"/api/admin/stories/drafts",new StoryDraft(p with {Title="B"},d.Revision)));
        Assert.Single(results,r=>r.IsSuccessStatusCode);Assert.Single(results,r=>r.StatusCode==HttpStatusCode.Conflict);
    }
    private async Task ReplaceSource(Func<LessonResponse, LessonResponse>? change = null) {
        await using var scope = factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
        var source = await db.CurriculumVersions.SingleAsync(v => v.LessonId == Fixture().Sources[0].LessonId && v.Status == CurriculumStatuses.Published);
        var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        var lesson = JsonSerializer.Deserialize<LessonResponse>(source.ContentJson, json)!;
        source.Status = "superseded";
        lesson = (change?.Invoke(lesson) ?? lesson) with { Version = $"curriculum-{lesson.Id}-v2" };
        db.CurriculumVersions.Add(new() { LessonId = lesson.Id, VersionNumber = 2, Status = CurriculumStatuses.Published,
            ContentJson = JsonSerializer.Serialize(lesson, json), CreatedBy = "SYNTHETIC TEST SOURCE" });
        await db.SaveChangesAsync();
    }
    [Fact] public async Task SourceUpdateCreatesPrivateUnreviewedDraftAndPreservesPublication() {
        using var owner = await Owner(); using var guest = Client();
        var d = await Command(owner, await Command(owner, await Save(owner, Fixture()), "approve"), "publish");
        var original = d.State.Versions[0];
        Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, d, "prepare-source-update")).StatusCode);
        await ReplaceSource();
        Assert.Empty((await guest.GetFromJsonAsync<StoryCatalog>("/api/stories"))!.Episodes);
        Assert.Equal(HttpStatusCode.Unauthorized, (await Cmd(guest, d, "prepare-source-update")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await owner.PostAsJsonAsync($"/api/admin/stories/packs/{d.Id}/prepare-source-update", new StoryCommand(d.Revision, 1))).StatusCode);
        var updated = await Command(owner, d, "prepare-source-update");
        var draft = updated.State.Versions.Last();
        Assert.Equal(2, draft.Number); Assert.Equal("draft", draft.Status);
        Assert.Null(draft.ApprovedBy); Assert.Null(draft.PublishedAtUtc); Assert.False(draft.TextPreview); Assert.Null(draft.PreviewAuthorizedBy);
        Assert.Empty(draft.Pack.Reviewer); Assert.Empty(draft.Pack.ReviewEvidence); Assert.Empty(draft.Pack.RightsEvidence);
        Assert.Equal("curriculum-levantine-day-01-v2", draft.Pack.Sources[0].Version);
        Assert.Equal(JsonSerializer.Serialize(original), JsonSerializer.Serialize(updated.State.Versions[0])); Assert.Equal(1, updated.State.PublishedVersion);
        Assert.Equal(HttpStatusCode.Conflict, (await Cmd(owner, d, "prepare-source-update")).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await Cmd(owner, updated, "prepare-source-update", 1)).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, updated, "approve")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, updated, "publish")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await Cmd(owner, updated, "authorize-text-preview")).StatusCode);
        Assert.Empty((await guest.GetFromJsonAsync<StoryCatalog>("/api/stories"))!.Episodes);
        Assert.Equal("draft-saved", updated.State.Audit.Last().Action);
    }
    [Theory]
    [InlineData("text")]
    [InlineData("help")]
    [InlineData("meaning")]
    [InlineData("role")]
    [InlineData("answer")]
    [InlineData("target")]
    [InlineData("unit")]
    [InlineData("course")]
    [InlineData("preview")]
    [InlineData("withdrawn")]
    public async Task SourceUpdateRejectsUnreconciledContentWithoutChangingStory(string changed) {
        using var owner = await Owner();
        var p = Fixture();
        // Synthetic mismatches exercise every exact-reference check using a current
        // source version. No automatic rewriting is allowed to repair these.
        p = changed switch {
            "text" => p with { Scenes = [p.Scenes[0] with { Lines = [p.Scenes[0].Lines[0] with { Text = p.Scenes[0].Lines[0].Text with { Arabic = "untaught" } }] }] },
            "help" => p with { Scenes = [p.Scenes[0] with { Lines = [p.Scenes[0].Lines[0] with { Text = p.Scenes[0].Lines[0].Text with { Arabizi = "changed" } }] }] },
            "meaning" => p with { Scenes = [p.Scenes[0] with { Lines = [p.Scenes[0].Lines[0] with { Text = p.Scenes[0].Lines[0].Text with { Meaning = "changed" } }] }] },
            "role" => p with { Scenes = [p.Scenes[0] with { Lines = [p.Scenes[0].Lines[0] with { SpeakerId = "knafeh" }] }] },
            "answer" => p with { Checks = [p.Checks[0], p.Checks[1], p.Checks[2] with { Choices = [new("a", "untaught", "Synthetic rationale"), new("b", "other", "Synthetic rationale")] }] },
            "target" => p with { Checks = [p.Checks[0] with { Target = "missing" }, p.Checks[1], p.Checks[2]] },
            _ => p
        };
        var d = await Save(owner, p);
        await ReplaceSource(l => changed switch {
            "role" => l with { Introduction = new("Synthetic roles", [new("Fattoush", l.Steps[0].Prompt, "fattoush")], [], "Test", "Test", "Test", []) },
            "unit" => l with { UnitId = "other-unit" },
            "course" => l with { TrackId = "msa" },
            "preview" => l with { PublicationNotice = new("synthetic", "Synthetic preview", "Not a regular source") },
            _ => l
        });
        if (changed == "withdrawn") {
            await using var scope = factory.Services.CreateAsyncScope(); var db = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            var source = await db.CurriculumVersions.SingleAsync(v => v.LessonId == p.Sources[0].LessonId && v.Status == CurriculumStatuses.Published);
            source.Status = CurriculumStatuses.Withdrawn; await db.SaveChangesAsync();
        }
        var response = await Cmd(owner, d, "prepare-source-update");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var after = (await owner.GetFromJsonAsync<StoryDetail>($"/api/admin/stories/packs/{d.Id}"))!;
        Assert.Equal(d.Revision, after.Revision); Assert.Single(after.State.Versions);
        Assert.Equal(d.State.Versions[0].Hash, after.State.Versions[0].Hash);
    }
    [Fact] public async Task ChangedOrWithdrawnSourcesHideStoriesAndBlockRollback() {
        using var c=await Owner();using var guest=Client();var p=Fixture();var d=await Save(c,p);
        d=await Command(c,d,"approve");d=await Command(c,d,"publish");
        await using(var scope=factory.Services.CreateAsyncScope()) {
            var db=scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
            var source=await db.CurriculumVersions.SingleAsync(v=>v.LessonId==p.Sources[0].LessonId);
            source.Status=CurriculumStatuses.Withdrawn;await db.SaveChangesAsync();
        }
        Assert.Empty((await guest.GetFromJsonAsync<StoryCatalog>("/api/stories"))!.Episodes);
        Assert.Equal(HttpStatusCode.NotFound,(await guest.GetAsync($"/api/stories/packs/{p.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"rollback",1)).StatusCode);
    }

    [Fact] public async Task ExactOwnerPreviewRetainsPendingReviewAndRejectsChangedPackages() {
        using var c=await Owner();using var guest=Client();
        var policy=new StoryTextPreviewPolicy(new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string,string?> { ["Curriculum:AllowStoryTextPreview"]="true" }).Build());
        var p=policy.ExactPackage();Assert.True(policy.IsAuthorized(p));Assert.False(policy.IsAuthorized(p with {Title=p.Title+" changed"}));
        Assert.False(new StoryTextPreviewPolicy(new ConfigurationBuilder().Build()).IsAuthorized(p));
        var d=await Save(c,p);Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"approve")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"authorize-text-preview")).StatusCode); // missing exact source is still a gate
        await using(var scope=factory.Services.CreateAsyncScope()) {
            var db=scope.ServiceProvider.GetRequiredService<IsmiDbContext>();var seed=new SeedCurriculum().GetInitialLesson();
            // Synthetic source fixture in a disposable database; this is not real review evidence.
            var source=seed with {Id=p.Sources[0].LessonId,Version=p.Sources[0].Version,UnitId=p.UnitId,
                Introduction=new("Synthetic source fixture",p.Scenes.SelectMany(s=>s.Lines).Select(l=>new DialogueTurn(l.SpeakerId,l.Text,l.SpeakerId)).ToArray(),[],"Test","Test","Test",[]),
                Steps=p.Checks.Select(x=>x.Target).Distinct().Select(id=>seed.Steps[0] with {Id=id}).ToArray()};
            db.CurriculumVersions.Add(new() {LessonId=source.Id,VersionNumber=4,Status="published",ContentJson=JsonSerializer.Serialize(source,new JsonSerializerOptions(JsonSerializerDefaults.Web)),CreatedBy="SYNTHETIC TEST SOURCE"});await db.SaveChangesAsync();
        }
        d=await Command(c,d,"authorize-text-preview");Assert.Null(d.State.Versions[0].ApprovedBy);Assert.True(d.State.Versions[0].TextPreview);Assert.NotNull(d.State.Versions[0].PreviewAuthorizedBy);
        Assert.Empty(d.State.Versions[0].Pack.Reviewer);Assert.Empty(d.State.Versions[0].Pack.ReviewEvidence);Assert.Empty(d.State.Versions[0].Pack.RightsEvidence);
        d=await Command(c,d,"publish");
        var live=await guest.GetFromJsonAsync<StoryPublicPack>($"/api/stories/packs/{p.Id}");Assert.Equal("Unreviewed · text-only preview",live!.PublicationNotice!.Label);Assert.Contains("source-rights acceptance are pending",live.PublicationNotice.Details);
        await using(var scope=factory.Services.CreateAsyncScope()) {
            var repeated=await scope.ServiceProvider.GetRequiredService<StoryService>().PublishExactTextPreviewAsync("test operator",CancellationToken.None);Assert.Equal(d.Revision,repeated.Revision);
        }
        using(var disabled=factory.WithWebHostBuilder(b=>b.ConfigureAppConfiguration((_,cfg)=>cfg.AddInMemoryCollection(new Dictionary<string,string?> {["Curriculum:AllowStoryTextPreview"]="false"})))) {
            using var hidden=disabled.CreateClient();Assert.Equal(HttpStatusCode.NotFound,(await hidden.GetAsync($"/api/stories/packs/{p.Id}")).StatusCode);
        }
        d=await Command(c,d,"withdraw",1);d=await Command(c,d,"rollback",1);
        d=await Save(c,p with {Title="Changed text needs new authorization"},d.Revision);Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"authorize-text-preview")).StatusCode);Assert.Equal(1,d.State.PublishedVersion);
    }

}
