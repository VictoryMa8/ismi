using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ismi.Api.Tests;
public sealed class AlphabetTests : IDisposable
{
    private readonly string root = Path.Combine(Path.GetTempPath(), $"ismi-alphabet-{Guid.NewGuid():N}");
    private readonly WebApplicationFactory<Program> factory;
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    public AlphabetTests()
    {
        Directory.CreateDirectory(root);
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(b => {
            b.UseEnvironment("Development"); b.ConfigureAppConfiguration((_, c) => c.AddInMemoryCollection(new Dictionary<string, string?> {
                ["Database:Path"] = Path.Combine(root, "test.db"), ["Recordings:Path"] = Path.Combine(root, "audio"),
                ["Curriculum:ApproverEmail"] = "alphabet-owner@example.test", ["RateLimits:AuthPermitLimit"] = "100" })); });
    }
    public void Dispose() { factory.Dispose(); Directory.Delete(root, true); }
    private HttpClient Client() => factory.CreateClient(new() { HandleCookies = true, AllowAutoRedirect = false });
    private static async Task<HttpResponseMessage> Post(HttpClient c, string url, object data) {
        var csrf = (await c.GetFromJsonAsync<JsonElement>("/api/auth/csrf")).GetProperty("token").GetString();
        var r = new HttpRequestMessage(HttpMethod.Post, url) { Content = JsonContent.Create(data) }; r.Headers.Add("X-CSRF-TOKEN", csrf); return await c.SendAsync(r); }
    private async Task<HttpClient> Owner() { var c = Client(); (await Post(c, "/api/auth/register", new { displayName = "Owner", email = "alphabet-owner@example.test", password = "Test-password-123!" })).EnsureSuccessStatusCode(); return c; }
    private static AlphabetPack Fixture(string course = "levantine") => JsonSerializer.Deserialize<AlphabetPack>(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Fixtures", $"alphabet-{course}.json")), Json)!;
    private static byte[] Wave() { using var m = new MemoryStream(); using var w = new BinaryWriter(m); w.Write("RIFF"u8); w.Write(36 + 1600); w.Write("WAVEfmt "u8); w.Write(16); w.Write((short)1); w.Write((short)1); w.Write(8000); w.Write(16000); w.Write((short)2); w.Write((short)16); w.Write("data"u8); w.Write(1600); w.Write(new byte[1600]); return m.ToArray(); }
    private async Task<AlphabetPack> WithAudio(HttpClient c, AlphabetPack? pack = null) {
        var csrf = (await c.GetFromJsonAsync<JsonElement>("/api/auth/csrf")).GetProperty("token").GetString();
        var r = new HttpRequestMessage(HttpMethod.Post, "/api/admin/curriculum/recordings") { Content = new ByteArrayContent(Wave()) }; r.Headers.Add("X-CSRF-TOKEN", csrf);
        var response = await c.SendAsync(r); response.EnsureSuccessStatusCode(); var url = (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("audioUrl").GetString()!;
        return JsonSerializer.Deserialize<AlphabetPack>(JsonSerializer.Serialize(pack ?? Fixture(), Json).Replace("/api/recordings/" + new string('0',64) + ".wav", url), Json)! with { EngineeringFixture = false };
    }
    private static async Task<AlphabetDetail> Save(HttpClient c, AlphabetPack p, long? revision = null) { var r = await Post(c, "/api/admin/alphabet/drafts", new AlphabetDraft(p, revision)); r.EnsureSuccessStatusCode(); return (await r.Content.ReadFromJsonAsync<AlphabetDetail>())!; }
    private static async Task<HttpResponseMessage> Cmd(HttpClient c, AlphabetDetail d, string action, int? n = null) => await Post(c, $"/api/admin/alphabet/packs/{d.Id}/{action}", new AlphabetCommand(d.Revision, n ?? d.State.Versions.Last().Number, "Synthetic test command"));
    private static async Task<AlphabetDetail> Command(HttpClient c, AlphabetDetail d, string action, int? n = null) { var r = await Cmd(c,d,action,n); r.EnsureSuccessStatusCode(); return (await r.Content.ReadFromJsonAsync<AlphabetDetail>())!; }

    [Fact] public async Task DraftsPreviewsAndAudioStayPrivateWithOwnerAndCsrfGates() {
        using var guest = Client(); Assert.Equal(HttpStatusCode.Unauthorized, (await guest.GetAsync("/api/admin/alphabet/packs")).StatusCode);
        using var owner = await Owner(); var p = await WithAudio(owner); var d = await Save(owner,p);
        Assert.Equal(HttpStatusCode.BadRequest, (await owner.PostAsJsonAsync("/api/admin/alphabet/drafts", new AlphabetDraft(p,d.Revision))).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/alphabet/packs/{p.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync(p.Entries[0].NameAudio.Url)).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await guest.GetAsync($"/api/admin/alphabet/packs/{p.Id}/preview/1")).StatusCode);
        Assert.DoesNotContain("PRIVATE", await owner.GetStringAsync($"/api/admin/alphabet/packs/{p.Id}/preview/1"));
        (await Post(guest,"/api/auth/register",new { displayName="Learner",email="alphabet-learner@example.test",password="Test-password-123!" })).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Forbidden, (await guest.GetAsync("/api/admin/alphabet/packs")).StatusCode);
    }
    [Fact] public async Task PublicationVersioningWithdrawalRollbackAndAudioAccessAreAtomic() {
        using var c = await Owner(); using var guest = Client(); var p = await WithAudio(c); var d = await Save(c,p);
        Assert.Equal(HttpStatusCode.Conflict,(await Cmd(c,d,"publish")).StatusCode); d=await Command(c,d,"approve"); d=await Command(c,d,"publish");
        var published = await guest.GetFromJsonAsync<AlphabetPublicPack>($"/api/alphabet/packs/{p.Id}"); Assert.Equal(1,published!.Version);
        Assert.Equal(HttpStatusCode.OK,(await guest.GetAsync(p.Entries[0].NameAudio.Url)).StatusCode);
        var json = await guest.GetStringAsync($"/api/alphabet/packs/{p.Id}"); Assert.DoesNotContain("PRIVATE",json); Assert.DoesNotContain("approvedBy",json);
        d=await Save(c,p with { Title="Corrected synthetic test" },d.Revision); Assert.Equal(1,d.State.PublishedVersion);
        Assert.Equal(HttpStatusCode.Conflict,(await Cmd(c,d,"publish")).StatusCode); d=await Command(c,d,"approve"); d=await Command(c,d,"publish");
        var second = await guest.GetFromJsonAsync<AlphabetPublicPack>($"/api/alphabet/packs/{p.Id}"); Assert.NotEqual(published.ContentHash,second!.ContentHash);
        d=await Command(c,d,"rollback",1); Assert.Equal(1,d.State.PublishedVersion); d=await Command(c,d,"withdraw",1);
        Assert.Equal(HttpStatusCode.NotFound,(await guest.GetAsync(p.Entries[0].NameAudio.Url)).StatusCode);
        var catalog=await guest.GetFromJsonAsync<AlphabetCatalog>("/api/alphabet"); Assert.Contains(p.Id,catalog!.WithdrawnIds); Assert.Null(catalog.Courses.Single(c=>c.CourseId==p.CourseId).PackId);
        Assert.Contains(d.State.Audit,a=>a.Action=="rollback"); Assert.Contains(d.State.Audit,a=>a.Action=="withdraw");
    }
    [Fact] public async Task MissingAudioReviewRightsAndRestrictedTracksCannotPublish() {
        using var c = await Owner(); var p=await WithAudio(c);
        foreach(var invalid in new[] { p with { EngineeringFixture=true }, p with { Reviewer="" }, p with { CourseId="msa",Id="msa-test" }, p with { CourseId="quranic",Id="quranic-test" }, p with { Sources=[p.Sources[0] with { OfflineCleared=false }] } }) {
            var check=new AlphabetValidator().Validate(invalid); Assert.False(check.IsValid);
        }
        var d=await Save(c,Fixture() with { EngineeringFixture=false }); Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"approve")).StatusCode);
        var malformed=await Post(c,"/api/admin/alphabet/drafts",new { pack=p with { Entries=[p.Entries[0] with { Activities=[null!] }] } }); Assert.Equal(HttpStatusCode.BadRequest,malformed.StatusCode);
    }
    [Fact] public async Task StaleAndConcurrentEditsCannotOverwriteApprovedContent() {
        using var c=await Owner(); var p=await WithAudio(c); var d=await Save(c,p);
        var r=await Task.WhenAll(Post(c,"/api/admin/alphabet/drafts",new AlphabetDraft(p with { Title="A" },d.Revision)),Post(c,"/api/admin/alphabet/drafts",new AlphabetDraft(p with { Title="B" },d.Revision)));
        Assert.Single(r,x=>x.IsSuccessStatusCode); Assert.Single(r,x=>x.StatusCode==HttpStatusCode.Conflict);
        Assert.Equal(HttpStatusCode.Conflict,(await Cmd(c,d,"approve")).StatusCode);
    }
    [Fact] public async Task ApprovedInventoryVersionsCannotSilentlyChange() {
        using var c=await Owner(); var p=await WithAudio(c); var d=await Save(c,p); d=await Command(c,d,"approve");
        var changed=p with { Inventory=p.Inventory with { ReviewEvidence="Changed synthetic review" } };
        d=await Save(c,changed,d.Revision); Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"approve")).StatusCode);
        d=await Save(c,changed with { Inventory=changed.Inventory with { Version=2 } },d.Revision);
        d=await Command(c,d,"approve"); Assert.Equal("approved",d.State.Versions.Last().Status);
    }
    [Fact] public async Task ExactInventoryPreviewExceptionPreservesNormalGatesAndReviewTruth() {
        using var enabled=factory.WithWebHostBuilder(b=>b.ConfigureAppConfiguration((_,config)=>config.AddInMemoryCollection(new Dictionary<string,string?> { ["Curriculum:AllowAlphabetTextPreview"]="true" })));
        using var c=enabled.CreateClient(new() { HandleCookies=true,AllowAutoRedirect=false });
        (await Post(c,"/api/auth/register",new { displayName="Owner",email="alphabet-owner@example.test",password="Test-password-123!" })).EnsureSuccessStatusCode();
        var policy=new AlphabetTextPreviewPolicy(new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string,string?> { ["Curriculum:AllowAlphabetTextPreview"]="true" }).Build());
        foreach(var p in policy.ExactPackages()) {
            Assert.True(policy.IsAuthorized(p)); Assert.False(policy.IsAuthorized(p with { Title=p.Title+" changed" }));
            var d=await Save(c,p); Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"approve")).StatusCode);
            d=await Command(c,d,"approve-text-preview"); Assert.Equal("approved-text-preview",d.State.Versions[0].Status);
            d=await Command(c,d,"publish"); var pub=await c.GetFromJsonAsync<AlphabetPublicPack>($"/api/alphabet/packs/{p.Id}");
            Assert.Equal(AlphabetTextPreviewPolicy.Notice,pub!.PublicationNotice); Assert.Contains("UNICODE LICENSE V3",pub.LicenseText);
            Assert.Empty(d.State.Versions[0].Pack.Reviewer); Assert.All(d.State.Versions[0].Pack.Sources,source=>Assert.False(source.TextCleared));
            Assert.All(pub.Entries,e=>{Assert.Empty(e.NameAudio.Url);Assert.Empty(e.SoundAudio.Url);Assert.Empty(e.Examples);Assert.Empty(e.Activities);});
            Assert.DoesNotContain(d.State.Audit,a=>a.Action=="approve");
            d=await Save(c,p with { Title="Changed text" },d.Revision); Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"approve-text-preview")).StatusCode);
            Assert.Equal(1,(await c.GetFromJsonAsync<AlphabetPublicPack>($"/api/alphabet/packs/{p.Id}"))!.Version);
        }
        using var disabled=Client(); Assert.Equal(HttpStatusCode.NotFound,(await disabled.GetAsync("/api/alphabet/packs/levantine-alphabet")).StatusCode);
        Assert.All((await disabled.GetFromJsonAsync<AlphabetCatalog>("/api/alphabet"))!.Courses,c=>Assert.Null(c.PackId));
    }
    [Fact] public async Task OperatorPublicationUsesPinnedAuditFlowAndDoesNotOverwriteChangedPacks() {
        using var enabled=factory.WithWebHostBuilder(b=>b.ConfigureAppConfiguration((_,config)=>config.AddInMemoryCollection(new Dictionary<string,string?> { ["Curriculum:AllowAlphabetTextPreview"]="true" })));
        using var c=enabled.CreateClient();
        using var scope=enabled.Services.CreateScope(); var service=scope.ServiceProvider.GetRequiredService<AlphabetService>();
        var published=await service.PublishExactTextPreviewsAsync("synthetic operator test",CancellationToken.None); Assert.Equal(5,published.Length);
        Assert.All(published,d=>{Assert.Equal(1,d.State.PublishedVersion);Assert.Equal(new[]{"draft-saved","approve-text-preview","publish"},d.State.Audit.Select(a=>a.Action));});
        var repeated=await service.PublishExactTextPreviewsAsync("synthetic operator test",CancellationToken.None); Assert.All(repeated,d=>Assert.Equal(3,d.Revision));
        var first=published[0]; await service.SaveAsync(new(first.State.Versions[0].Pack with { Title="Changed private candidate" },first.Revision),"test",CancellationToken.None);
        await Assert.ThrowsAsync<AlphabetException>(()=>service.PublishExactTextPreviewsAsync("test",CancellationToken.None));
        Assert.Equal(5,(await c.GetFromJsonAsync<AlphabetCatalog>("/api/alphabet"))!.Courses.Count(c=>c.PackId is not null));
        Assert.Equal(5,(await service.WithdrawExactTextPreviewsAsync("test withdrawal",CancellationToken.None)).Length);
        Assert.All((await c.GetFromJsonAsync<AlphabetCatalog>("/api/alphabet"))!.Courses,c=>Assert.Null(c.PackId));
    }
    [Fact] public void UnicodeTargetsAndCoverageAreExactAndAllActivitiesNeedRationales() {
        var v=new AlphabetValidator(); var p=Fixture() with { EngineeringFixture=false }; Assert.True(v.Validate(p).IsValid);
        foreach(var course in new[] { "khmer","french" }) Assert.True(v.Validate(Fixture(course) with { EngineeringFixture=false }).IsValid);
        var e=p.Entries[0]; var w=e.Examples[0];
        Assert.False(AlphabetValidator.ValidTargets(w with { Text="بَ",Target="ب",Occurrences=[0] }));
        Assert.True(AlphabetValidator.ValidTargets(w with { Text="بَبَ",Target="بَ",Occurrences=[0,2] }));
        Assert.False(AlphabetValidator.ValidTargets(w with { Text="កា",Target="ក",Occurrences=[0] }));
        Assert.True(AlphabetValidator.ValidTargets(w with { Text="កា",Target="កា",Occurrences=[0] }));
        Assert.False(v.Validate(p with { Entries=[e] }).IsValid);
        Assert.False(v.Validate(p with { Entries=[e with { Activities=e.Activities.Select(a=>a with { Rationale="" }).ToArray() },p.Entries[1]] }).IsValid);
        Assert.False(v.Validate(p with { Entries=[e with { Examples=[w,w] },p.Entries[1]] }).IsValid);
    }

    private static AlphabetPack TextFixture() {
        var p = Fixture() with { EngineeringFixture = false, TextOnly = true };
        AlphabetClip Empty(string transcript) => new("",transcript,"","","","","",false,false);
        return p with { Entries = p.Entries.Select(e => e with {
            NameAudio = Empty(e.Name), SoundAudio = Empty(""),
            Examples = e.Examples.Select(w => w with { Audio = Empty(w.Text) }).ToArray(),
            Activities = e.Activities.Where(a => a.Kind is "shape" or "spot").Select(a => a with { AudioUrl = null }).ToArray()
        }).ToArray() };
    }
    [Fact] public async Task ReviewedTextOnlyPacksPublishWithoutAudioButKeepAllOtherGates() {
        using var c = await Owner(); var p = TextFixture();
        Assert.True(new AlphabetValidator().Validate(p).IsValid);
        var d = await Save(c,p); d = await Command(c,d,"approve"); d = await Command(c,d,"publish");
        var pub = (await c.GetFromJsonAsync<AlphabetPublicPack>($"/api/alphabet/packs/{p.Id}"))!;
        Assert.True(pub.TextOnly); Assert.All(pub.Entries,e => Assert.All(e.Activities,a => Assert.Contains(a.Kind,new[]{"shape","spot"})));
        Assert.Equal(64,pub.ContentHash.Length);
        var validator = new AlphabetValidator();
        foreach (var invalid in new[] { p with { Reviewer="" }, p with { Sources=[p.Sources[0] with { OfflineCleared=false }] },
            p with { CourseId="msa" }, p with { CourseId="quranic" }, p with { TextOnly=false },
            p with { Entries=[p.Entries[0] with { NameAudio=Fixture().Entries[0].NameAudio },p.Entries[1]] },
            p with { Entries=[p.Entries[0] with { Activities=Fixture().Entries[0].Activities },p.Entries[1]] } }) Assert.False(validator.Validate(invalid).IsValid);
    }
    [Fact] public async Task FullTextDraftsHaveExactCoverageTargetsAndActivitiesButCannotBeApproved() {
        using var c = await Owner(); var validator = new AlphabetValidator();
        var inventories = new List<string>();
        var counts = new Dictionary<string,int> { ["levantine"]=28,["msa"]=28,["quranic"]=28,["khmer"]=33,["french"]=26 };
        foreach (var (course,count) in counts) {
            var p=JsonSerializer.Deserialize<AlphabetPack>(File.ReadAllText(Path.Combine(AppContext.BaseDirectory,"alphabet-text-only",course+".pack.json")),Json)!;
            Assert.True(AlphabetValidator.Bounded(p)); Assert.True(p.TextOnly); Assert.False(p.EngineeringFixture);
            if(course is "levantine" or "msa" or "quranic") inventories.Add(JsonSerializer.Serialize(p.Inventory,Json));
            Assert.Equal(count,p.Inventory.BasicEntryIds.Length); Assert.Equal(p.Entries.Length,p.Inventory.Entries.Length);
            Assert.Equal(p.Entries.Length,p.Entries.Select(e=>e.Id).Distinct().Count());
            Assert.All(p.Entries,e=> {
                Assert.False(string.IsNullOrWhiteSpace(e.Name)); Assert.False(string.IsNullOrWhiteSpace(e.SoundContext));
                Assert.InRange(e.Examples.Length,p.Inventory.BasicEntryIds.Contains(e.Id)?2:1,3);
                Assert.All(e.Examples,w=>Assert.True(AlphabetValidator.ValidTargets(w),$"{course}/{e.Id}/{w.Text}/{w.Target}"));
                Assert.Equal(new[]{"shape","spot"},e.Activities.Select(a=>a.Kind));
            });
            Assert.All(AlphabetService.Clips(p),clip=>{ Assert.Empty(clip.Url);Assert.False(clip.HumanRecording);Assert.Empty(clip.Reviewer); });
            // Remove no review gate: authored coverage is complete, acceptance is absent.
            var validation=validator.Validate(p); Assert.False(validation.IsValid);
            Assert.All(validation.Errors,error=>Assert.True(error.Contains("linguistic review") || error.Contains("reviewed script inventory")
                || error.Contains("rights are required") || error.Contains("track-specific"),error));
            var d=await Save(c,p); Assert.Equal(HttpStatusCode.BadRequest,(await Cmd(c,d,"approve")).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound,(await c.GetAsync($"/api/alphabet/packs/{p.Id}")).StatusCode);
            var preview=(await c.GetFromJsonAsync<AlphabetPublicPack>($"/api/admin/alphabet/packs/{p.Id}/preview/1"))!;
            Assert.True(preview.TextOnly); Assert.Equal(p.Entries.Length,preview.Entries.Length);
        }
        Assert.Single(inventories.Distinct());
    }
}
