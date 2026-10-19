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
    private async Task<HttpClient> Owner() { var c=Client();(await Post(c,"/api/auth/register",new { displayName="Owner",email="story-owner@example.test",password="Test-password-123!" })).EnsureSuccessStatusCode();return c; }
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
