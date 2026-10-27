using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace Ismi.Api.Services;
public sealed class StoryException(string message, int status = 409) : Exception(message) { public int Status { get; } = status; }
public sealed class StoryService(IsmiDbContext db, CurriculumPublishingService curriculum, TimeProvider clock, StoryTextPreviewPolicy previews)
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
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
    private static StoryState State(StoryPackRecord r) => JsonSerializer.Deserialize<StoryState>(r.StateJson, Json)!;
    private static StoryDetail Detail(StoryPackRecord r) => new(r.Id, r.Revision, State(r));
    public static Task EnsureSchemaAsync(IsmiDbContext db) => db.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS StoryPacks (Id TEXT NOT NULL PRIMARY KEY, CourseId TEXT NOT NULL, Revision INTEGER NOT NULL, StateJson TEXT NOT NULL);
        """);
    public async Task<StorySummary[]> ListAsync(CancellationToken ct) => (await db.StoryPacks.AsNoTracking().ToListAsync(ct)).Select(r => {
        var s = State(r); var v = s.Versions.Last(); return new StorySummary(r.Id, r.CourseId, v.Pack.Title, r.Revision, v.Number, v.Status, s.PublishedVersion); }).ToArray();
    private async Task<StoryPackRecord> Find(string id, CancellationToken ct) => await db.StoryPacks.SingleOrDefaultAsync(r => r.Id == id, ct) ?? throw new StoryException("That episode is unavailable.", 404);
    public async Task<StoryDetail> GetAsync(string id, CancellationToken ct) => Detail(await Find(id, ct));
    private static void Expected(StoryPackRecord r, long? n) { if (r.Revision != n) throw new StoryException("This episode changed. Reload before continuing."); }
    private async Task<StoryDetail> Write(StoryPackRecord r, StoryState s, string action, int version, string actor, string reason, CancellationToken ct)
    {
        r.Revision++; r.StateJson = Serialize(s with { Audit = [.. s.Audit, new(action, version, actor, clock.GetUtcNow().UtcDateTime, reason)] });
        try { await db.SaveChangesAsync(ct); } catch (DbUpdateException) { throw new StoryException("Another request changed this episode. Reload before continuing."); }
        return Detail(r);
    }
    public static bool Bounded(StoryPack? p) {
        if (p is null) return false;
        var raw = Serialize(p);
        // Bound the full payload, then check required nested fields before traversal.
        // Drafts may leave review evidence empty; optional prompt metadata may be null.
        using var doc = JsonDocument.Parse(raw);
        bool Shape(JsonElement e) => e.ValueKind switch {
            JsonValueKind.Null => true,
            JsonValueKind.Object => e.EnumerateObject().All(x => Shape(x.Value)),
            JsonValueKind.Array => e.GetArrayLength() <= 40 && e.EnumerateArray().All(Shape),
            JsonValueKind.String => e.GetString()!.Length <= 4000,
            _ => true };
        // Optional prompt metadata may be null; validate the required graph explicitly.
        return raw.Length <= 100000 && Shape(doc.RootElement) && Regex.IsMatch(p.Id ?? "", "^[a-z0-9][a-z0-9-]{0,79}$")
            && p.CourseId == "levantine" && !string.IsNullOrWhiteSpace(p.Title) && !string.IsNullOrWhiteSpace(p.UnitId)
            && !string.IsNullOrWhiteSpace(p.ArcId) && p.Episode is >= 1 and <= 3 && p.Summary is not null
            && p.Reviewer is not null && p.ReviewEvidence is not null && p.RightsEvidence is not null
            && p.Sources is { Length: > 0 and <= 10 } && p.Sources.All(s => s is not null && !string.IsNullOrWhiteSpace(s.LessonId) && !string.IsNullOrWhiteSpace(s.Version))
            && p.Scenes is { Length: > 0 and <= 6 } && p.Scenes.All(s => s is not null && !string.IsNullOrWhiteSpace(s.Title) && !string.IsNullOrWhiteSpace(s.Situation)
                && s.Lines is { Length: > 0 and <= 12 } && s.Lines.All(l => l is not null && l.SpeakerId is "fattoush" or "knafeh"
                    && l.Text is not null && !string.IsNullOrWhiteSpace(l.Text.Arabic) && !string.IsNullOrWhiteSpace(l.Text.Arabizi) && !string.IsNullOrWhiteSpace(l.Text.Meaning)
                    && l.Text.AudioUrl is null && l.Text.Recording is null && l.SourceIndex >= 0 && l.SourceIndex < p.Sources.Length))
            && p.Checks is { Length: 3 } && p.Checks.All(c => c is not null && c.Id is not null && c.Prompt is not null && c.AcceptedId is not null && c.Explanation is not null && c.Target is not null
                && c.Choices is { Length: >= 2 and <= 5 } && c.Choices.All(x => x is not null && x.Id is not null && x.Text is not null && x.Rationale is not null && x.Help is not null && x.Meaning is not null)
                && c.SourceIndex >= 0 && c.SourceIndex < p.Sources.Length);
    }
    public async Task<StoryDetail> SaveAsync(StoryDraft request, string actor, CancellationToken ct)
    {
        var p = request.Pack;
        if (!Bounded(p)) throw new StoryException("Use a bounded Levantine text episode with complete scene, source and check fields.", 400);
        var row = await db.StoryPacks.SingleOrDefaultAsync(r => r.Id == p.Id, ct); StoryState s;
        if (row is null) {
            if (request.ExpectedRevision is not null) throw new StoryException("That episode no longer exists.");
            row = new() { Id = p.Id, CourseId = p.CourseId }; s = new([], null, []); db.StoryPacks.Add(row);
        } else { Expected(row, request.ExpectedRevision); s = State(row); }
        var last = s.Versions.LastOrDefault(); var n = last?.Status == "draft" ? last.Number : (last?.Number ?? 0) + 1;
        s = s with { Versions = [.. s.Versions.Where(v => v.Number != n), new(n, "draft", p, Hash(p), null, null)] };
        return await Write(row, s, "draft-saved", n, actor, "", ct);
    }
    private static StoryVersion Version(StoryState s, int n) => s.Versions.FirstOrDefault(v => v.Number == n) ?? throw new StoryException("Version unavailable.", 404);
    private async Task<StoryValidation> Validate(StoryVersion v, CancellationToken ct, bool review = true) {
        var p = v.Pack; var errors = new List<string>();
        if (!Bounded(p)) return new(false, ["Invalid episode structure."]);
        if (review && (string.IsNullOrWhiteSpace(p.Reviewer) || string.IsNullOrWhiteSpace(p.ReviewEvidence) || string.IsNullOrWhiteSpace(p.RightsEvidence))) errors.Add("Record exact human linguistic/check/role review and source/rights acceptance before approval.");
        if (p.Checks.Count(c => c.Kind == "comprehension") != 2 || p.Checks.Last().Kind != "response") errors.Add("Use two comprehension checks followed by one assisted response.");
        if (p.Checks.Select(c => c.Id).Distinct().Count() != 3) errors.Add("Check IDs must be unique.");
        foreach (var c in p.Checks) if (string.IsNullOrWhiteSpace(c.Id) || string.IsNullOrWhiteSpace(c.Prompt) || string.IsNullOrWhiteSpace(c.Explanation) || string.IsNullOrWhiteSpace(c.Target)
            || c.Choices.Select(x => x.Id).Distinct().Count() != c.Choices.Length || c.Choices.All(x => x.Id != c.AcceptedId)
            || c.Choices.Any(x => string.IsNullOrWhiteSpace(x.Id) || string.IsNullOrWhiteSpace(x.Text) || string.IsNullOrWhiteSpace(x.Rationale))) errors.Add($"{c.Id}: supply target, explanation, choices and answer rationales.");
        for (var i = 0; i < p.Sources.Length; i++) {
            var source = p.Sources[i]; var lesson = (await curriculum.FindPublishedLessonAsync(source.LessonId, ct))?.Response;
            if (lesson is null || lesson.Version != source.Version || lesson.TrackId != p.CourseId || lesson.UnitId != p.UnitId || lesson.PublicationNotice is not null) { errors.Add($"{source.LessonId}: exact regular published source version/unit required."); continue; }
            var phrases = lesson.Introduction?.Dialogue.Select(d => d.Line).Concat(lesson.Introduction.Expressions).Concat(lesson.Introduction.TeachingCards?.Select(t => t.Phrase) ?? []) ?? [];
            phrases = phrases.Concat(lesson.Steps.Select(s => s.Prompt)).Concat(lesson.Steps.SelectMany(s => s.Answers).Select(a => new LessonPrompt(a.Arabic, a.Arabizi, a.Meaning, null)));
            var taught = phrases.ToArray();
            foreach (var l in p.Scenes.SelectMany(s => s.Lines).Where(l => l.SourceIndex == i)) {
                if (!taught.Any(t => t.Arabic == l.Text.Arabic && t.Arabizi == l.Text.Arabizi && t.Meaning == l.Text.Meaning)) errors.Add($"{source.LessonId}: story text must exactly match taught source text/help/meaning.");
                var roles = lesson.Introduction?.Dialogue.Where(d => d.Line.Arabic == l.Text.Arabic && d.SpeakerId is not null).ToArray() ?? [];
                if (roles.Length > 0 && !roles.Any(d => d.SpeakerId == l.SpeakerId)) errors.Add($"{source.LessonId}: preserve authored speaker roles.");
            }
            foreach (var c in p.Checks.Where(c => c.SourceIndex == i)) {
                if (!lesson.Steps.Any(step => step.Id == c.Target)) errors.Add($"{c.Id}: reference an exact taught step target.");
                if (c.Kind == "response" && c.Choices.Any(choice => !taught.Any(t => t.Arabic == choice.Text && t.Arabizi == choice.Help && t.Meaning == choice.Meaning))) errors.Add($"{c.Id}: response choices must reuse exact taught text.");
            }
        }
        if (v.Hash != Hash(p)) errors.Add("Saved content integrity failed.");
        return new(errors.Count == 0, errors.Distinct().ToArray());
    }
    public async Task<StoryValidation> ValidateAsync(string id, int n, CancellationToken ct) => await Validate(Version(State(await Find(id, ct)), n), ct);
    public async Task<StoryDetail> PrepareSourceUpdateAsync(string id, StoryCommand request, string actor, CancellationToken ct) {
        var row = await Find(id, ct); Expected(row, request.ExpectedRevision);
        var state = State(row); var version = Version(state, request.Version);
        if (version.Number != state.Versions.Last().Number) throw new StoryException("Select the latest story version before preparing a source update.");
        var sources = new List<StorySource>();
        foreach (var source in version.Pack.Sources) {
            var lesson = (await curriculum.FindPublishedLessonAsync(source.LessonId, ct))?.Response;
            if (lesson is null || lesson.PublicationNotice is not null || lesson.TrackId != version.Pack.CourseId || lesson.UnitId != version.Pack.UnitId)
                throw new StoryException($"{source.LessonId}: a regular published source in the same course/unit is required.", 400);
            sources.Add(source with { Version = lesson.Version });
        }
        if (sources.SequenceEqual(version.Pack.Sources)) throw new StoryException("Source versions are already current. No draft was changed.", 400);
        var pack = version.Pack with { Sources = sources.ToArray(), Reviewer = "", ReviewEvidence = "", RightsEvidence = "" };
        var candidate = new StoryVersion(0, "draft", pack, Hash(pack), null, null);
        var check = await Validate(candidate, ct, false);
        if (!check.IsValid) throw new StoryException("Source update needs manual reconciliation. " + string.Join(" ", check.Errors), 400);
        // Save through the normal concurrency/version path. Never carry approval or
        // the exact old preview exception into the new source snapshot.
        return await SaveAsync(new(pack, request.ExpectedRevision), actor, ct);
    }
    public async Task<StoryDetail> CommandAsync(string id, string action, StoryCommand request, string actor, CancellationToken ct) {
        if (request.Reason is null || request.Reason.Length > 1000) throw new StoryException("Use a brief reason.", 400);
        var r = await Find(id, ct); Expected(r, request.ExpectedRevision); var s = State(r); var v = Version(s, request.Version);
        if (action is "approve" or "publish" or "rollback" or "authorize-text-preview") {
            var preview = action == "authorize-text-preview" || v.TextPreview && action != "approve";
            if (preview && !previews.IsAuthorized(v.Pack)) throw new StoryException("Only the exact owner-authorized story may use the enabled development text-preview exception.", 400);
            var check = await Validate(v, ct, !preview); if (!check.IsValid) throw new StoryException(string.Join(" ", check.Errors), 400);
        }
        switch (action) {
            case "authorize-text-preview":
                if (v.Status != "draft") throw new StoryException("Authorize a saved exact preview draft.");
                s = s with { Versions = s.Versions.Select(x => x.Number == v.Number ? x with { Status = "authorized-text-preview", TextPreview = true, PreviewAuthorizedBy = actor } : x).ToArray() }; break;
            case "approve":
                if (v.Status != "draft") throw new StoryException("Approve a saved draft.");
                s = s with { Versions = s.Versions.Select(x => x.Number == v.Number ? x with { Status = "approved", ApprovedBy = actor } : x).ToArray() }; break;
            case "publish": case "rollback":
                if ((v.TextPreview ? v.PreviewAuthorizedBy is null : v.ApprovedBy is null) || (action == "publish" ? v.Status != (v.TextPreview ? "authorized-text-preview" : "approved") : v.PublishedAtUtc is null)) throw new StoryException("Publish an approved version or restore a prior publication.");
                s = s with { PublishedVersion = v.Number, Versions = s.Versions.Select(x => x.Number == v.Number ? x with { Status = "published", PublishedAtUtc = x.PublishedAtUtc ?? clock.GetUtcNow().UtcDateTime } : x.Status == "published" ? x with { Status = "superseded" } : x).ToArray() }; break;
            case "withdraw":
                if (s.PublishedVersion != v.Number || string.IsNullOrWhiteSpace(request.Reason)) throw new StoryException("Withdraw the current episode with a reason.", 400);
                s = s with { PublishedVersion = null, Versions = s.Versions.Select(x => x.Number == v.Number ? x with { Status = "withdrawn" } : x).ToArray() }; break;
            default: throw new StoryException("Unknown story command.", 400);
        }
        return await Write(r, s, action, v.Number, actor, request.Reason, ct);
    }
    public static StoryPublicPack Public(StoryVersion v) { var p = v.Pack; var result = new StoryPublicPack(p.Id, p.CourseId, p.UnitId, p.ArcId, p.Episode, v.Number, "", p.Title, p.Summary, p.Sources, p.Scenes, p.Checks, v.TextPreview ? StoryTextPreviewPolicy.NoticeFor(p) : null); return result with { ContentHash = Hash(result) }; }
    public async Task<StoryPublicPack?> PublicAsync(string id, CancellationToken ct) {
        var r = await db.StoryPacks.AsNoTracking().SingleOrDefaultAsync(r => r.Id == id, ct); if (r is null) return null;
        var s = State(r); if (s.PublishedVersion is not int n) return null; var v = Version(s, n);
        if (v.TextPreview && !previews.IsAuthorized(v.Pack)) return null;
        return (await Validate(v, ct, false)).IsValid ? Public(v) : null;
    }
    public Task<StoryDetail> PublishExactTextPreviewAsync(string actor, CancellationToken ct) => PublishExactPackage(previews.ExactPackage(), actor, ct);
    private async Task CheckExactPackage(StoryPack p, CancellationToken ct) {
        if (!previews.IsAuthorized(p)) throw new StoryException("The exact story text-preview exception is disabled.", 400);
        var check = await Validate(new(0, "draft", p, Hash(p), null, null), ct, false);
        if (!check.IsValid) throw new StoryException(string.Join(" ", check.Errors), 400);
        var row = await db.StoryPacks.AsNoTracking().SingleOrDefaultAsync(r => r.Id == p.Id, ct);
        if (row is not null && State(row).Versions.Any(v => !previews.IsAuthorized(v.Pack))) throw new StoryException("Existing story differs from the authorized package; no replacement performed.");
    }
    private async Task<StoryDetail> PublishExactPackage(StoryPack p, string actor, CancellationToken ct) {
        await CheckExactPackage(p, ct);
        var row = await db.StoryPacks.AsNoTracking().SingleOrDefaultAsync(r => r.Id == p.Id, ct);
        var d = row is null ? await SaveAsync(new(p), actor, ct) : Detail(row);
        if (d.State.PublishedVersion is int published && d.State.Versions.Single(v => v.Number == published) is { TextPreview: true } current && current.Hash == Hash(p)) return d;
        if (d.State.Versions.Last().Hash != Hash(p)) d = await SaveAsync(new(p, d.Revision), actor, ct);
        var v = d.State.Versions.Last();
        if (v.Status == "draft") d = await CommandAsync(p.Id, "authorize-text-preview", new(d.Revision, v.Number, "Owner explicitly requested this exact unreviewed text-only preview; review/rights remain pending."), actor, ct);
        if (d.State.Versions.Last().Status == "authorized-text-preview") return await CommandAsync(p.Id, "publish", new(d.Revision, v.Number, "Exact owner-authorized development preview; no beta inclusion."), actor, ct);
        if (v.TextPreview && v.PublishedAtUtc is not null) return await CommandAsync(p.Id, "rollback", new(d.Revision, v.Number, "Restore exact owner-authorized preview."), actor, ct);
        throw new StoryException("This existing episode is not an authorized preview draft/publication.");
    }
    public async Task<StoryDetail[]> PublishExactArcTextPreviewsAsync(string actor, CancellationToken ct) {
        if (!previews.ArcEnabled) throw new StoryException("The exact October 27 story-arc text-preview exception is disabled.", 400);
        var packages = previews.ExactArcPackages();
        // A missing source or changed owner draft must not leave a partly published arc.
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        foreach (var p in packages) await CheckExactPackage(p, ct);
        var results = new List<StoryDetail>();
        foreach (var p in packages) results.Add(await PublishExactPackage(p, actor, ct));
        await transaction.CommitAsync(ct);
        return results.ToArray();
    }
    public async Task<StoryCatalog> CatalogAsync(CancellationToken ct) {
        var ids = await db.StoryPacks.AsNoTracking().Select(r => r.Id).ToArrayAsync(ct); var episodes = new List<StoryPublicPack>();
        foreach (var id in ids) if (await PublicAsync(id, ct) is {} p) episodes.Add(p);
        return new(episodes.OrderBy(p => p.ArcId).ThenBy(p => p.Episode).ToArray());
    }
}
