using System.Text.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

// No learner identity, microphone data or general attempt history is collected.
// Only a learner's explicit report stores their response and optional explanation.
public sealed class RecallReportService(IsmiDbContext database)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    public static Task EnsureSchemaAsync(IsmiDbContext database) => database.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS "RecallReviewCases" (
            "Id" TEXT NOT NULL PRIMARY KEY, "CaseJson" TEXT NOT NULL
        );
        """);

    public async Task<RecallReviewCase?> SubmitAsync(RecallReportRequest request, CancellationToken ct)
    {
        if (!Guid.TryParse(request.Id, out _) || request.InputMode is not ("arabic" or "arabizi")
            || string.IsNullOrWhiteSpace(request.Response) || request.Response.Length > 500
            || request.Explanation is null || request.Explanation.Length > 500
            || new[] { request.LessonId, request.Version, request.TargetId, request.VariantId }.Any(string.IsNullOrWhiteSpace))
            return null;
        var prior = (await ListAsync(ct)).FirstOrDefault(c => c.Id == request.Id);
        if (prior is not null) return prior.Report == request ? prior : null;
        // Reports may reference a superseded, formerly published download, never a private draft.
        var versions = await database.CurriculumVersions.Include(v => v.Sources).AsNoTracking()
            .Where(v => v.LessonId == request.LessonId && v.PublishedAtUtc != null).ToListAsync(ct);
        foreach (var version in versions)
        {
            var lesson = JsonSerializer.Deserialize<LessonResponse>(version.ContentJson, JsonOptions)!;
            var target = lesson.Recall?.FirstOrDefault(t => t.Id == request.TargetId);
            if (lesson.Version != request.Version || target is null || !target.Variants.Any(v => v.Id == request.VariantId)) continue;
            var sources = version.Sources.Select(s => new CurriculumSourceInput(s.SourceType, s.Title, s.Locator, s.Rights, s.Notes)).ToList();
            var review = new RecallReviewCase(request.Id, "open", DateTime.UtcNow, request, target.Dialect,
                target.Register, "Deterministic authored comparison: " + RecallEvaluator.Evaluate(target, request.Response, request.InputMode) + "; no AI decision.", target, sources, null, null, null);
            var json = JsonSerializer.Serialize(review, JsonOptions);
            await database.Database.ExecuteSqlInterpolatedAsync($"INSERT OR IGNORE INTO RecallReviewCases (Id, CaseJson) VALUES ({request.Id}, {json})", ct);
            var saved = (await ListAsync(ct)).Single(c => c.Id == request.Id);
            return saved.Report == request ? saved : null;
        }
        return null;
    }

    public async Task<List<RecallReviewCase>> ListAsync(CancellationToken ct)
    {
        var records = await database.Database.SqlQueryRaw<string>("SELECT CaseJson AS Value FROM RecallReviewCases").ToListAsync(ct);
        return records.Select(json => JsonSerializer.Deserialize<RecallReviewCase>(json, JsonOptions)!).OrderByDescending(c => c.CreatedAtUtc).ToList();
    }

    public async Task<RecallReviewCase?> ResolveAsync(string id, string resolution, string actor, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(resolution) || resolution.Length > 1000) return null;
        var prior = (await ListAsync(ct)).FirstOrDefault(c => c.Id == id);
        if (prior is null) return null;
        if (prior.Status == "resolved") return prior;
        var updated = prior with { Status = "resolved", Resolution = resolution, ResolvedBy = actor, ResolvedAtUtc = DateTime.UtcNow };
        var json = JsonSerializer.Serialize(updated, JsonOptions);
        await database.Database.ExecuteSqlInterpolatedAsync($"UPDATE RecallReviewCases SET CaseJson = {json} WHERE Id = {id}", ct);
        return updated;
    }
}
