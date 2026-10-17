using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;
public sealed class AlphabetException(string message, int status = 409) : Exception(message) { public int Status { get; } = status; }
public sealed class AlphabetService(IsmiDbContext db, AlphabetValidator validator, RecordingStore recordings, TimeProvider clock, AlphabetTextPreviewPolicy previews)
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping };
    private static string Serialize<T>(T o) => JsonSerializer.Serialize(o, Json);
    private static string Hash<T>(T o)
    {
        using var doc = JsonDocument.Parse(Serialize(o));
        using var stream = new MemoryStream();
        using (var writer = new Utf8JsonWriter(stream, new() { Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping }))
        { WriteCanonical(doc.RootElement, writer); }
        return Convert.ToHexStringLower(SHA256.HashData(stream.ToArray()));
    }
    private static void WriteCanonical(JsonElement e, Utf8JsonWriter w)
    {
        if (e.ValueKind == JsonValueKind.Object)
        { w.WriteStartObject(); foreach (var p in e.EnumerateObject().OrderBy(p => p.Name, StringComparer.Ordinal)) { w.WritePropertyName(p.Name); WriteCanonical(p.Value, w); } w.WriteEndObject(); }
        else if (e.ValueKind == JsonValueKind.Array) { w.WriteStartArray(); foreach (var x in e.EnumerateArray()) WriteCanonical(x, w); w.WriteEndArray(); }
        else if (e.ValueKind == JsonValueKind.String) w.WriteRawValue("\"" + string.Concat(e.GetString()!.Select(c => "\\u" + ((int)c).ToString("X4"))) + "\"");
        else e.WriteTo(w);
    }
    private static AlphabetState State(AlphabetPackRecord r) => JsonSerializer.Deserialize<AlphabetState>(r.StateJson, Json)!;
    private static AlphabetDetail Detail(AlphabetPackRecord r) => new(r.Id, r.Revision, State(r));
    public static Task EnsureSchemaAsync(IsmiDbContext db) => db.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS AlphabetPacks (Id TEXT NOT NULL PRIMARY KEY, CourseId TEXT NOT NULL,
            Revision INTEGER NOT NULL, StateJson TEXT NOT NULL);
        CREATE UNIQUE INDEX IF NOT EXISTS IX_AlphabetPacks_CourseId ON AlphabetPacks(CourseId);
        """);
    public async Task<AlphabetSummary[]> ListAsync(CancellationToken ct) => (await db.AlphabetPacks.AsNoTracking().ToListAsync(ct)).Select(r => {
        var s = State(r); var v = s.Versions.Last(); return new AlphabetSummary(r.Id, r.CourseId, v.Pack.Title, r.Revision, v.Number, v.Status, s.PublishedVersion); }).ToArray();
    private async Task<AlphabetPackRecord> Find(string id, CancellationToken ct) => await db.AlphabetPacks.SingleOrDefaultAsync(r => r.Id == id, ct) ?? throw new AlphabetException("That alphabet pack is unavailable.", 404);
    public async Task<AlphabetDetail> GetAsync(string id, CancellationToken ct) => Detail(await Find(id, ct));
    private static void Expected(AlphabetPackRecord r, long? n) { if (r.Revision != n) throw new AlphabetException("This pack changed. Reload before continuing."); }
    private async Task<AlphabetDetail> Write(AlphabetPackRecord r, AlphabetState s, string action, int version, string actor, string reason, CancellationToken ct)
    {
        r.Revision++; r.StateJson = Serialize(s with { Audit = [.. s.Audit, new(action, version, actor, clock.GetUtcNow().UtcDateTime, reason)] });
        try { await db.SaveChangesAsync(ct); } catch (DbUpdateException) { throw new AlphabetException("Another request changed this pack or course. Reload before continuing."); }
        return Detail(r);
    }
    public async Task<AlphabetDetail> SaveAsync(AlphabetDraft request, string actor, CancellationToken ct)
    {
        var p = request.Pack;
        if (p is not null && p.Fonts is null) p = p with { Fonts = p.CourseId == "khmer"
            ? [new("/fonts/NotoSansKhmer.ttf", "f37a8431a0c5d5ed2f81a767417546aca576a81fb7eff9c924d46aecf828f2ca")] : [] };
        if (p is null || !AlphabetValidator.Bounded(p)) throw new AlphabetException("Use a bounded, structurally complete pack object.", 400);
        var row = await db.AlphabetPacks.SingleOrDefaultAsync(r => r.Id == p.Id, ct);
        AlphabetState s;
        if (row is null)
        {
            if (request.ExpectedRevision is not null) throw new AlphabetException("That pack no longer exists. Reload.");
            row = new() { Id = p.Id, CourseId = p.CourseId }; s = new([], null, []); db.AlphabetPacks.Add(row);
        }
        else { Expected(row, request.ExpectedRevision); s = State(row); if (row.CourseId != p.CourseId) throw new AlphabetException("A pack's course is fixed."); }
        var last = s.Versions.LastOrDefault(); var n = last?.Status == "draft" ? last.Number : (last?.Number ?? 0) + 1;
        s = s with { Versions = [.. s.Versions.Where(v => v.Number != n), new(n, "draft", p, Hash(p), null, null)] };
        return await Write(row, s, "draft-saved", n, actor, "", ct);
    }
    private static AlphabetVersion Version(AlphabetState s, int n) => s.Versions.FirstOrDefault(v => v.Number == n) ?? throw new AlphabetException("That version is unavailable.", 404);
    public static IEnumerable<AlphabetClip> Clips(AlphabetPack p) => p.Entries.SelectMany(e => new[] { e.NameAudio, e.SoundAudio }.Concat(e.Examples.Select(w => w.Audio)));
    public Task<AlphabetValidation> ValidateTextPreviewAsync(AlphabetPack p) => Task.FromResult(
        new AlphabetValidation(previews.IsAuthorized(p), previews.IsAuthorized(p) ? [] : ["Only the exact five owner-authorized inventory-only packages may use the development text-preview exception."]));
    private async Task<AlphabetValidation> Validate(AlphabetVersion v, CancellationToken ct)
    {
        var result = validator.Validate(v.Pack); var errors = result.Errors.ToList();
        foreach (var url in Clips(v.Pack).Select(c => c.Url).Where(url => !v.Pack.TextOnly || !string.IsNullOrEmpty(url)).Distinct())
        {
            var path = recordings.Find(url);
            if (path is null) { errors.Add($"{url}: recording bytes are missing."); continue; }
            var bytes = await File.ReadAllBytesAsync(path, ct);
            if (url != "/api/recordings/" + Convert.ToHexStringLower(SHA256.HashData(bytes)) + ".wav") errors.Add($"{url}: recording integrity failed.");
        }
        if (v.Hash != Hash(v.Pack)) errors.Add("Saved content integrity failed.");
        var states = (await db.AlphabetPacks.AsNoTracking().ToListAsync(ct)).Select(State);
        if (states.SelectMany(s => s.Versions).Any(other => other.ApprovedBy is not null
            && other.Pack.Inventory.Id == v.Pack.Inventory.Id && other.Pack.Inventory.Version == v.Pack.Inventory.Version
            && Hash(other.Pack.Inventory) != Hash(v.Pack.Inventory)))
            errors.Add("This script inventory version already has different approved content. Advance its version for changed forms or review records.");
        return new(errors.Count == 0, errors.Distinct().ToArray());
    }
    public async Task<AlphabetValidation> ValidateAsync(string id, int n, CancellationToken ct) => await Validate(Version(State(await Find(id, ct)), n), ct);
    public async Task<AlphabetDetail> CommandAsync(string id, string action, AlphabetCommand request, string actor, CancellationToken ct)
    {
        if (request.Reason is null || request.Reason.Length > 1000) throw new AlphabetException("Use a brief command reason.", 400);
        var r = await Find(id, ct); Expected(r, request.ExpectedRevision); var s = State(r); var v = Version(s, request.Version);
        if (action is "approve" or "publish" or "rollback" or "approve-text-preview")
        { var check = (action == "approve-text-preview" || v.TextPreview && action != "approve") ? await ValidateTextPreviewAsync(v.Pack) : await Validate(v, ct); if (!check.IsValid) throw new AlphabetException(string.Join(" ", check.Errors), 400); }
        switch (action)
        {
            case "approve-text-preview":
                if (v.Status != "draft") throw new AlphabetException("Approve a saved exact text-preview draft.");
                s = s with { Versions = s.Versions.Select(x => x.Number == v.Number ? x with { Status = "approved-text-preview", ApprovedBy = actor, TextPreview = true } : x).ToArray() }; break;
            case "approve":
                if (v.Status != "draft") throw new AlphabetException("Approve a saved draft.");
                s = s with { Versions = s.Versions.Select(x => x.Number == v.Number ? x with { Status = "approved", ApprovedBy = actor } : x).ToArray() }; break;
            case "publish": case "rollback":
                if (v.ApprovedBy is null || (action == "publish" ? v.Status != (v.TextPreview ? "approved-text-preview" : "approved") : v.PublishedAtUtc is null)) throw new AlphabetException("Publish an approved version, or restore a previously published one.");
                s = s with { PublishedVersion = v.Number, Versions = s.Versions.Select(x => x.Number == v.Number
                    ? x with { Status = "published", PublishedAtUtc = x.PublishedAtUtc ?? clock.GetUtcNow().UtcDateTime }
                    : x.Status == "published" ? x with { Status = "superseded" } : x).ToArray() }; break;
            case "withdraw":
                if (s.PublishedVersion != v.Number || string.IsNullOrWhiteSpace(request.Reason)) throw new AlphabetException("Withdraw the current publication with a reason.", 400);
                s = s with { PublishedVersion = null, Versions = s.Versions.Select(x => x.Number == v.Number ? x with { Status = "withdrawn" } : x).ToArray() }; break;
            default: throw new AlphabetException("Unknown alphabet command.", 400);
        }
        return await Write(r, s, action, v.Number, actor, request.Reason, ct);
    }
    private static AlphabetPublicClip PublicClip(AlphabetClip c) => new(c.Url, c.Transcript);
    public static AlphabetPublicPack Public(AlphabetVersion v)
    {
        var p = v.Pack;
        var result = new AlphabetPublicPack(p.Id, p.CourseId, v.Number, "", p.Title, p.Variety, p.HelpConvention,
            p.Inventory.Id, p.Inventory.Version, p.Inventory.BasicEntryIds, p.Inventory.Entries,
            p.Entries.Select(e => new AlphabetPublicEntry(e.Id, e.Name, e.Help, e.Note, e.SoundContext, e.SourceIds,
                PublicClip(e.NameAudio), PublicClip(e.SoundAudio), e.Examples.Select(w => new AlphabetPublicExample(w.Id, w.Text,
                    w.Meaning, w.Help, w.Target, w.Occurrences, w.Note, w.SourceIds, PublicClip(w.Audio))).ToArray(), e.Activities)).ToArray(),
            p.Sources.Select(s => new AlphabetPublicSource(s.Id, s.Citation, s.Locator, s.Version)).ToArray(),
            p.Fonts ?? [], v.TextPreview ? AlphabetTextPreviewPolicy.Notice : null, v.TextPreview ? AlphabetTextPreviewPolicy.LicenseText : null, p.TextOnly);
        // Clients verify the exact projected payload, excluding its own hash field.
        return result with { ContentHash = Hash(result) };
    }
    public async Task<AlphabetPublicPack?> PublicAsync(string id, CancellationToken ct)
    {
        var r = await db.AlphabetPacks.AsNoTracking().SingleOrDefaultAsync(r => r.Id == id, ct);
        if (r is null) return null; var s = State(r); return s.PublishedVersion is int n && (!Version(s, n).TextPreview || previews.Enabled) ? Public(Version(s, n)) : null;
    }
    public async Task<AlphabetCatalog> CatalogAsync(CancellationToken ct)
    {
        var rows = await db.AlphabetPacks.AsNoTracking().ToListAsync(ct);
        var published = rows.Select(State).Where(s => s.PublishedVersion is not null).Where(s => !Version(s, s.PublishedVersion!.Value).TextPreview || previews.Enabled).Select(s => Public(Version(s, s.PublishedVersion!.Value))).ToArray();
        return new(1, CourseCatalog.All.Select(c => { var p = published.FirstOrDefault(p => p.CourseId == c.Id); return new AlphabetCatalogItem(c.Id, p?.Id, p?.Version, p?.ContentHash); }).ToArray(),
            rows.Where(r => State(r).PublishedVersion is null && State(r).Versions.Any(v => v.PublishedAtUtc is not null)).Select(r => r.Id).ToArray());
    }
    public async Task<AlphabetDetail[]> PublishExactTextPreviewsAsync(string actor, CancellationToken ct)
    {
        var packages = previews.ExactPackages();
        if (!previews.Enabled || packages.Any(p => !previews.IsAuthorized(p))) throw new AlphabetException("The exact development preview exception is disabled.",400);
        // Inspect all existing rows first. Never overwrite a changed or unrelated course pack.
        var rows = await db.AlphabetPacks.AsNoTracking().ToListAsync(ct);
        foreach (var p in packages)
        {
            var row = rows.FirstOrDefault(r => r.CourseId == p.CourseId);
            if (row is not null && (row.Id != p.Id || State(row).Versions.Any(v => !previews.IsAuthorized(v.Pack))))
                throw new AlphabetException("An existing alphabet pack differs from the authorized preview. No replacement was performed.");
        }
        var result = new List<AlphabetDetail>();
        foreach (var p in packages)
        {
            var existing = await db.AlphabetPacks.AsNoTracking().SingleOrDefaultAsync(r => r.Id == p.Id,ct);
            var d = existing is null ? await SaveAsync(new(p),actor,ct) : Detail(existing);
            if (d.State.PublishedVersion is int current && d.State.Versions.Single(v=>v.Number==current).TextPreview) { result.Add(d); continue; }
            var v = d.State.Versions.Last();
            if (v.Status == "draft") d = await CommandAsync(p.Id,"approve-text-preview",new(d.Revision,v.Number,"Owner requested these inventory-only previews despite absent review/audio; no linguistic acceptance."),actor,ct);
            if (d.State.Versions.Last().Status == "approved-text-preview") d = await CommandAsync(p.Id,"publish",new(d.Revision,v.Number,"Owner-authorized development text preview."),actor,ct);
            else if (v.PublishedAtUtc is not null) d = await CommandAsync(p.Id,"rollback",new(d.Revision,v.Number,"Owner-authorized preview restoration."),actor,ct);
            result.Add(d);
        }
        return result.ToArray();
    }
    public async Task<AlphabetDetail[]> WithdrawExactTextPreviewsAsync(string actor, CancellationToken ct)
    {
        var results = new List<AlphabetDetail>();
        foreach (var p in previews.ExactPackages())
        {
            var r = await db.AlphabetPacks.AsNoTracking().SingleOrDefaultAsync(r=>r.Id==p.Id,ct);
            if (r is null) continue;
            var s = State(r);
            if (s.PublishedVersion is int n && Version(s,n).TextPreview)
                results.Add(await CommandAsync(p.Id,"withdraw",new(r.Revision,n,"Owner operator withdrawal of inventory-only text preview."),actor,ct));
        }
        return results.ToArray();
    }
    public async Task<bool> RecordingPublishedAsync(string url, CancellationToken ct) =>
        (await db.AlphabetPacks.AsNoTracking().ToListAsync(ct)).Select(State).Any(s => s.PublishedVersion is int n && Clips(Version(s, n).Pack).Any(c => c.Url == url));
}
