using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

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
}
