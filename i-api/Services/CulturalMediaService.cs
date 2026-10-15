using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public sealed class CulturalMediaException(string message, int status = 409) : Exception(message)
{
    public int Status { get; } = status;
}

public sealed class CulturalMediaService(IsmiDbContext database, CulturalMediaValidator validator, TimeProvider clock)
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    private DateTime Now => clock.GetUtcNow().UtcDateTime;
    private static string Serialize<T>(T value) => JsonSerializer.Serialize(value, Json);
    private static string Hash<T>(T value) => Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(Serialize(value))));
    private static CulturalState State(CulturalCollectionRecord record) => JsonSerializer.Deserialize<CulturalState>(record.StateJson, Json)!;
    private static CulturalDetail Detail(CulturalCollectionRecord r) => new(r.Id, r.Revision, State(r));

    public static Task EnsureSchemaAsync(IsmiDbContext db) => db.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS CulturalCollections (
            Id TEXT NOT NULL PRIMARY KEY, WeekStartUtc TEXT NOT NULL,
            Revision INTEGER NOT NULL, StateJson TEXT NOT NULL);
        CREATE UNIQUE INDEX IF NOT EXISTS IX_CulturalCollections_WeekStartUtc ON CulturalCollections(WeekStartUtc);
        """);

    public async Task<CulturalSummary[]> ListAsync(CancellationToken ct)
    {
        var rows = await database.CulturalCollections.AsNoTracking().OrderByDescending(r => r.WeekStartUtc).ToListAsync(ct);
        return rows.Select(r => { var s = State(r); var v = s.Versions.Last();
            return new CulturalSummary(r.Id, v.Edition.Title, r.WeekStartUtc, r.Revision, v.Number, v.Status, s.PublishedVersion); }).ToArray();
    }
    public async Task<CulturalDetail> GetAsync(string id, CancellationToken ct) => Detail(await Find(id, ct));
    private async Task<CulturalCollectionRecord> Find(string id, CancellationToken ct) =>
        await database.CulturalCollections.SingleOrDefaultAsync(r => r.Id == id, ct)
        ?? throw new CulturalMediaException("That collection is not available.", 404);
    private static void Expected(CulturalCollectionRecord r, long? expected)
    {
        if (r.Revision != expected) throw new CulturalMediaException("This collection changed. Reload it before saving or publishing.");
    }
    private async Task<CulturalDetail> Write(CulturalCollectionRecord r, CulturalState state, CancellationToken ct)
    {
        r.Revision++; r.StateJson = Serialize(state);
        try { await database.SaveChangesAsync(ct); }
        catch (DbUpdateException) { throw new CulturalMediaException("The collection or its week changed in another request. Reload before continuing."); }
        return Detail(r);
    }
    private CulturalState Audit(CulturalState s, string action, int version, string actor, string note = "") =>
        s with { Audit = [..s.Audit, new(action, version, actor, Now, note)] };

    public async Task<CulturalDetail> SaveDraftAsync(CulturalDraftRequest request, string actor, CancellationToken ct)
    {
        var e = request.Edition;
        if (e is null || !System.Text.RegularExpressions.Regex.IsMatch(e.Id ?? "", "^[a-z0-9][a-z0-9-]{0,79}$")
            || e.WeekStartUtc.Kind != DateTimeKind.Utc || e.WeekStartUtc.DayOfWeek != DayOfWeek.Monday
            || e.WeekStartUtc.TimeOfDay != TimeSpan.Zero || e.WeekStartUtc.Year < 2026
            || e.Items is null || e.Items.Length > 3 || e.Items.Any(i => i is null || i.Resources is null || i.Resources.Length > 5 || i.Resources.Any(r => r is null))
            || Serialize(e).Length > 120000)
            throw new CulturalMediaException("Use a valid edition ID, Monday 00:00 UTC week, and a bounded edition object.", 400);
        var record = await database.CulturalCollections.SingleOrDefaultAsync(r => r.Id == e.Id, ct);
        CulturalState state;
        if (record is null)
        {
            if (request.ExpectedRevision is not null) throw new CulturalMediaException("That edition no longer exists. Reload before continuing.");
            record = new() { Id = e.Id!, WeekStartUtc = e.WeekStartUtc };
            state = new([], null, [], []); database.CulturalCollections.Add(record);
        }
        else
        {
            Expected(record, request.ExpectedRevision); state = State(record);
            if (e.WeekStartUtc != record.WeekStartUtc) throw new CulturalMediaException("An edition's week is fixed. Create a new edition for a different week.");
        }
        var last = state.Versions.LastOrDefault();
        var n = last?.Status == "draft" ? last.Number : (last?.Number ?? 0) + 1;
        state = state with { Versions = [..state.Versions.Where(v => v.Number != n), new(n, "draft", e, Hash(e), null, null, null)] };
        return await Write(record, Audit(state, "draft-saved", n, actor), ct);
    }

    public async Task<CulturalValidation> ValidateAsync(string id, int version, CancellationToken ct)
    {
        var state = State(await Find(id, ct));
        return ValidateVersion(state, Version(state, version));
    }
    private static CulturalVersion Version(CulturalState state, int n) => state.Versions.FirstOrDefault(v => v.Number == n)
        ?? throw new CulturalMediaException("That revision is not available.", 404);
    private CulturalValidation ValidateVersion(CulturalState state, CulturalVersion version)
    {
        var validation = validator.Validate(version.Edition);
        if (!validation.IsValid) return validation;
        var errors = new List<string>();
        foreach (var r in version.Edition.Items.SelectMany(i => i.Resources))
        {
            var check = state.Observations.LastOrDefault(o => o.ResourceId == r.Id && o.Url == r.Url);
            var at = check?.AtUtc ?? r.CheckedAtUtc;
            if (check?.Available == false) errors.Add($"{r.Id}: unavailable; replace or recheck before approval/publication.");
            if (at > Now || at < Now.AddDays(-7)) errors.Add($"{r.Id}: availability needs a check within the last seven days.");
        }
        return new(errors.Count == 0, [..errors]);
    }

    public async Task<CulturalDetail> CommandAsync(string id, string action, CulturalCommand request, string actor, CancellationToken ct)
    {
        if (request.Reason is null || request.Reason.Length > 500 || request.Reason.Contains('<') || request.Reason.Contains('>'))
            throw new CulturalMediaException("Use a brief plain-text command note.", 400);
        var row = await Find(id, ct); Expected(row, request.ExpectedRevision);
        var state = State(row); var version = Version(state, request.Version);
        if (action is "approve" or "publish" or "rollback")
        {
            var valid = ValidateVersion(state, version);
            if (!valid.IsValid) throw new CulturalMediaException(string.Join(" ", valid.Errors), 400);
            if (version.ContentHash != Hash(version.Edition)) throw new CulturalMediaException("Content integrity check failed.");
        }
        switch (action)
        {
            case "approve":
                if (version.Status != "draft") throw new CulturalMediaException("Only a saved draft can be approved.");
                version = version with { Status = "approved", ApprovedBy = actor, ApprovedAtUtc = Now };
                state = state with { Versions = state.Versions.Select(v => v.Number == version.Number ? version : v).ToArray() };
                break;
            case "publish":
            case "rollback":
                if (action == "publish" && version.Status != "approved" || action == "rollback" && version.PublishedAtUtc is null
                    || version.ApprovedAtUtc is null) throw new CulturalMediaException("Publish an approved revision, or restore a previously published revision.");
                state = state with { PublishedVersion = version.Number, Versions = state.Versions.Select(v =>
                    v.Number == version.Number ? v with { Status = "published", PublishedAtUtc = v.PublishedAtUtc ?? Now }
                    : v.Status == "published" ? v with { Status = "superseded" } : v).ToArray() };
                break;
            case "withdraw":
                if (state.PublishedVersion != version.Number) throw new CulturalMediaException("Withdraw the currently published revision.");
                if (string.IsNullOrWhiteSpace(request.Reason) || request.Reason.Length > 500) throw new CulturalMediaException("Give a brief withdrawal reason.", 400);
                state = state with { PublishedVersion = null, Versions = state.Versions.Select(v => v.Number == version.Number ? v with { Status = "withdrawn" } : v).ToArray() };
                break;
            default: throw new CulturalMediaException("Unknown collection command.", 400);
        }
        return await Write(row, Audit(state, action, version.Number, actor, request.Reason), ct);
    }

    public async Task<CulturalDetail> CheckLinkAsync(string id, CulturalLinkCheck request, string actor, CancellationToken ct)
    {
        var row = await Find(id, ct); Expected(row, request.ExpectedRevision); var state = State(row);
        var resource = Version(state, request.Version).Edition.Items.SelectMany(i => i.Resources ?? []).FirstOrDefault(r => r.Id == request.ResourceId)
            ?? throw new CulturalMediaException("That resource does not exist.", 404);
        if (string.IsNullOrWhiteSpace(request.Note) || request.Note.Length > 500 || request.Note.Contains('<') || request.Note.Contains('>'))
            throw new CulturalMediaException("Record a plain-text availability check (up to 500 characters).", 400);
        var observation = new CulturalObservation(resource.Id, resource.Url, request.Available, Now, request.Note);
        state = state with { Observations = [..state.Observations, observation] };
        return await Write(row, Audit(state, request.Available ? "link-checked" : "link-suppressed", request.Version, actor, request.Note), ct);
    }

    private static CulturalPublicEdition Public(CulturalVersion v, CulturalState state) => new(v.Edition.Id, v.Number, v.ContentHash,
        v.Edition.Title, v.Edition.WeekStartUtc, v.Edition.Theme, v.Edition.Items.Select(i => new CulturalPublicItem(
            i.Id, i.Slot, i.Title, i.ArabicTitle, i.Creator, i.Year, i.DurationSeconds, i.Language, i.Dialect, i.Register,
            i.Difficulty, i.DifficultyReason, i.Description, i.Prompt, i.TextAlternative, i.ContentNotes,
            i.Resources.Select(r => {
                var check = state.Observations.LastOrDefault(o => o.ResourceId == r.Id && o.Url == r.Url);
                var available = check?.Available != false;
                return new CulturalPublicResource(r.Id, r.Purpose, r.Platform, available ? r.Url : null,
                    r.DurationSeconds, r.Access, r.AccessNotes, r.Region, r.LoginRequired, r.CaptionLanguages,
                    r.CaptionOrigin, available ? r.TranscriptUrl : null, r.SupportNotes, check?.AtUtc ?? r.CheckedAtUtc,
                    r.StartSeconds, r.EndSeconds, available, available ? "" : "This link is currently unavailable. Use an alternative below.");
            }).ToArray())).ToArray());

    public async Task<CulturalCatalog> CatalogAsync(int offset, CancellationToken ct)
    {
        offset = Math.Clamp(offset, 0, 10000);
        var now = Now;
        var rows = await database.CulturalCollections.AsNoTracking().Where(r => r.WeekStartUtc <= now).OrderByDescending(r => r.WeekStartUtc).ToListAsync(ct);
        var visible = new List<CulturalPublicEdition>(); var withdrawn = new List<string>();
        foreach (var row in rows)
        {
            var state = State(row);
            if (state.PublishedVersion is int n) visible.Add(Public(Version(state, n), state));
            else if (state.Versions.Any(v => v.PublishedAtUtc is not null)) withdrawn.Add(row.Id);
        }
        var current = visible.FirstOrDefault();
        var revision = Hash(new { Editions = visible, Withdrawn = withdrawn });
        return new(1, now, revision, current?.Id, current is not null && current.WeekStartUtc >= now.Date.AddDays(-((7 + (int)now.DayOfWeek - 1) % 7)),
            visible.Skip(offset).Take(8).ToArray(), [..withdrawn], offset, visible.Count > offset + 8);
    }

    public async Task<CulturalPublicEdition?> PublicDetailAsync(string id, CancellationToken ct)
    {
        var row = await database.CulturalCollections.AsNoTracking().SingleOrDefaultAsync(r => r.Id == id && r.WeekStartUtc <= Now, ct);
        if (row is null) return null;
        var s = State(row); return s.PublishedVersion is int n ? Public(Version(s, n), s) : null;
    }
}
