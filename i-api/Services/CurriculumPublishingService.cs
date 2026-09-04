using System.Text.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public sealed class CurriculumPublishingService(
    IsmiDbContext database,
    CurriculumValidator validator)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task EnsureSeededAsync(
        LessonResponse initialLesson,
        CancellationToken cancellationToken = default)
    {
        if (await database.CurriculumVersions.AnyAsync(cancellationToken)) return;

        var now = DateTime.UtcNow;
        var version = new CurriculumVersionRecord
        {
            LessonId = initialLesson.Id,
            VersionNumber = 1,
            Status = CurriculumStatuses.Published,
            ContentJson = Serialize(initialLesson with { Version = $"curriculum-{initialLesson.Id}-v1" }),
            CreatedAtUtc = now,
            CreatedBy = "system migration",
            ApprovedAtUtc = now,
            ApprovedBy = "system migration",
            PublishedAtUtc = now,
            PublishedBy = "system migration",
            Sources =
            [
                new CurriculumSourceRecord
                {
                    SourceType = "internal-demonstration",
                    Title = "Original Ismi demonstrative lesson",
                    Locator = "internal:seed/levantine-day-01",
                    Rights = "Internal demonstrative material; not reviewed launch curriculum.",
                    Notes = "Migrated from the original runtime seed so future changes use the publication workflow."
                }
            ],
            AuditEvents =
            [
                Audit("migrated", "system migration", now, "Initial demonstrative lesson migrated into the versioned curriculum store."),
                Audit("published", "system migration", now, "Established the initial published learner version.")
            ]
        };

        database.CurriculumVersions.Add(version);
        await database.SaveChangesAsync(cancellationToken);
    }

    public async Task<LessonDefinition?> FindPublishedLessonAsync(
        string lessonId,
        CancellationToken cancellationToken = default)
    {
        var content = await database.CurriculumVersions
            .AsNoTracking()
            .Where(version => version.LessonId == lessonId
                && version.Status == CurriculumStatuses.Published)
            .Select(version => version.ContentJson)
            .SingleOrDefaultAsync(cancellationToken);

        var lesson = content is null ? null : Deserialize(content);
        return lesson is null ? null : new LessonDefinition(lesson);
    }

    public async Task<IReadOnlyList<CurriculumVersionSummary>> ListAsync(
        CancellationToken cancellationToken = default)
    {
        var records = await database.CurriculumVersions
            .AsNoTracking()
            .OrderBy(version => version.LessonId)
            .ThenByDescending(version => version.VersionNumber)
            .ToListAsync(cancellationToken);

        return records.Select(version =>
        {
            var lesson = Deserialize(version.ContentJson);
            return new CurriculumVersionSummary(
                version.Id,
                version.LessonId,
                lesson.Title,
                version.VersionNumber,
                version.Status,
                version.CreatedAtUtc,
                version.CreatedBy,
                version.PublishedAtUtc);
        }).ToList();
    }

    public async Task<CurriculumVersionDetail?> GetAsync(
        long versionId,
        CancellationToken cancellationToken = default)
    {
        var version = await database.CurriculumVersions
            .AsNoTracking()
            .Include(record => record.Sources)
            .Include(record => record.AuditEvents)
            .SingleOrDefaultAsync(record => record.Id == versionId, cancellationToken);
        return version is null ? null : ToDetail(version);
    }

    public async Task<CurriculumVersionDetail> CreateDraftAsync(
        CurriculumDraftRequest request,
        string actor,
        CancellationToken cancellationToken = default)
    {
        var lessonId = request.Lesson.Id.Trim();
        if (string.IsNullOrWhiteSpace(lessonId) || lessonId.Length > 100)
        {
            throw new CurriculumWorkflowException("invalid_lesson_id", "Use a lesson ID between 1 and 100 characters.");
        }

        if (await database.CurriculumVersions.AnyAsync(
            version => version.LessonId == lessonId && version.Status == CurriculumStatuses.Draft,
            cancellationToken))
        {
            throw new CurriculumWorkflowException("draft_exists", "Finish or update the existing draft for this lesson first.");
        }

        var nextVersion = (await database.CurriculumVersions
            .Where(version => version.LessonId == lessonId)
            .MaxAsync(version => (int?)version.VersionNumber, cancellationToken) ?? 0) + 1;
        var now = DateTime.UtcNow;
        var lesson = request.Lesson with
        {
            Id = lessonId,
            TrackId = request.Lesson.TrackId.Trim(),
            Version = $"draft-{lessonId}-v{nextVersion}"
        };
        var record = new CurriculumVersionRecord
        {
            LessonId = lessonId,
            VersionNumber = nextVersion,
            Status = CurriculumStatuses.Draft,
            ContentJson = Serialize(lesson),
            CreatedAtUtc = now,
            CreatedBy = actor,
            Sources = ToSourceRecords(request.Sources),
            AuditEvents = [Audit("created", actor, now, $"Created draft version {nextVersion}.")]
        };

        database.CurriculumVersions.Add(record);
        await database.SaveChangesAsync(cancellationToken);
        return ToDetail(record);
    }

    public async Task<CurriculumVersionDetail> UpdateDraftAsync(
        long versionId,
        CurriculumDraftRequest request,
        string actor,
        CancellationToken cancellationToken = default)
    {
        var record = await database.CurriculumVersions
            .Include(version => version.Sources)
            .Include(version => version.AuditEvents)
            .SingleOrDefaultAsync(version => version.Id == versionId, cancellationToken)
            ?? throw NotFound();
        RequireStatus(record, CurriculumStatuses.Draft, "Only a draft can be edited.");
        if (!string.Equals(record.LessonId, request.Lesson.Id.Trim(), StringComparison.Ordinal))
        {
            throw new CurriculumWorkflowException("lesson_id_immutable", "A draft's lesson ID cannot be changed.");
        }

        record.ContentJson = Serialize(request.Lesson with
        {
            Id = record.LessonId,
            Version = $"draft-{record.LessonId}-v{record.VersionNumber}"
        });
        database.CurriculumSources.RemoveRange(record.Sources);
        record.Sources = ToSourceRecords(request.Sources);
        record.AuditEvents.Add(Audit("updated", actor, DateTime.UtcNow, "Updated draft content and provenance."));
        await database.SaveChangesAsync(cancellationToken);
        return ToDetail(record);
    }

    public async Task<CurriculumValidationResult> ValidateAsync(
        long versionId,
        string actor,
        CancellationToken cancellationToken = default)
    {
        var record = await LoadAsync(versionId, cancellationToken);
        var result = validator.Validate(
            Deserialize(record.ContentJson),
            record.Sources.Select(ToSource).ToList());
        record.AuditEvents.Add(Audit(
            "validated",
            actor,
            DateTime.UtcNow,
            result.IsValid ? "Validation passed." : $"Validation found {result.Errors.Count} issue(s)."));
        await database.SaveChangesAsync(cancellationToken);
        return result;
    }

    public async Task<CurriculumVersionDetail> ApproveAsync(
        long versionId,
        string actor,
        CancellationToken cancellationToken = default)
    {
        var record = await LoadAsync(versionId, cancellationToken);
        RequireStatus(record, CurriculumStatuses.Draft, "Only a draft can be approved.");
        var validation = validator.Validate(
            Deserialize(record.ContentJson),
            record.Sources.Select(ToSource).ToList());
        if (!validation.IsValid)
        {
            throw new CurriculumValidationException(validation.Errors);
        }

        var now = DateTime.UtcNow;
        record.Status = CurriculumStatuses.Approved;
        record.ApprovedAtUtc = now;
        record.ApprovedBy = actor;
        record.AuditEvents.Add(Audit("approved", actor, now, "Approved after deterministic validation passed."));
        await database.SaveChangesAsync(cancellationToken);
        return ToDetail(record);
    }

    public async Task<CurriculumVersionDetail> PublishAsync(
        long versionId,
        string actor,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        var record = await LoadAsync(versionId, cancellationToken);
        RequireStatus(record, CurriculumStatuses.Approved, "Only an approved version can be published.");
        var validation = validator.Validate(
            Deserialize(record.ContentJson),
            record.Sources.Select(ToSource).ToList());
        if (!validation.IsValid) throw new CurriculumValidationException(validation.Errors);

        var now = DateTime.UtcNow;
        var current = await database.CurriculumVersions
            .Include(version => version.AuditEvents)
            .SingleOrDefaultAsync(version => version.LessonId == record.LessonId
                && version.Status == CurriculumStatuses.Published, cancellationToken);
        if (current is not null)
        {
            current.Status = CurriculumStatuses.Superseded;
            current.AuditEvents.Add(Audit("superseded", actor, now, $"Superseded by version {record.VersionNumber}."));
        }

        record.Status = CurriculumStatuses.Published;
        record.ContentJson = Serialize(Deserialize(record.ContentJson) with
        {
            Version = $"curriculum-{record.LessonId}-v{record.VersionNumber}"
        });
        record.PublishedAtUtc = now;
        record.PublishedBy = actor;
        record.AuditEvents.Add(Audit("published", actor, now, "Published to the learner API and offline package feed."));
        await database.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return ToDetail(record);
    }

    public async Task<CurriculumVersionDetail> RollbackAsync(
        string lessonId,
        long targetVersionId,
        string actor,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        var versions = await database.CurriculumVersions
            .Include(version => version.Sources)
            .Include(version => version.AuditEvents)
            .Where(version => version.LessonId == lessonId
                && (version.Id == targetVersionId || version.Status == CurriculumStatuses.Published))
            .ToListAsync(cancellationToken);
        var target = versions.SingleOrDefault(version => version.Id == targetVersionId)
            ?? throw NotFound();
        if (target.Status != CurriculumStatuses.Superseded)
        {
            throw new CurriculumWorkflowException("invalid_rollback_target", "Rollback can restore only a previously published version.");
        }

        var current = versions.SingleOrDefault(version => version.Status == CurriculumStatuses.Published)
            ?? throw new CurriculumWorkflowException("published_version_missing", "There is no current published version to roll back.");
        var now = DateTime.UtcNow;
        current.Status = CurriculumStatuses.Superseded;
        current.AuditEvents.Add(Audit("rolled_back", actor, now, $"Replaced by rollback to version {target.VersionNumber}."));
        target.Status = CurriculumStatuses.Published;
        target.PublishedAtUtc = now;
        target.PublishedBy = actor;
        target.AuditEvents.Add(Audit("restored", actor, now, $"Restored from version {current.VersionNumber}."));
        await database.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return ToDetail(target);
    }

    private async Task<CurriculumVersionRecord> LoadAsync(
        long versionId,
        CancellationToken cancellationToken)
    {
        return await database.CurriculumVersions
            .Include(version => version.Sources)
            .Include(version => version.AuditEvents)
            .SingleOrDefaultAsync(version => version.Id == versionId, cancellationToken)
            ?? throw NotFound();
    }

    private static CurriculumVersionDetail ToDetail(CurriculumVersionRecord version) =>
        new(
            version.Id,
            version.VersionNumber,
            version.Status,
            Deserialize(version.ContentJson),
            version.Sources.OrderBy(source => source.Id).Select(ToSource).ToList(),
            version.AuditEvents.OrderByDescending(audit => audit.OccurredAtUtc)
                .Select(audit => new CurriculumAuditEntry(
                    audit.Id,
                    audit.Action,
                    audit.Actor,
                    audit.OccurredAtUtc,
                    audit.Details))
                .ToList(),
            version.CreatedAtUtc,
            version.CreatedBy,
            version.ApprovedAtUtc,
            version.ApprovedBy,
            version.PublishedAtUtc,
            version.PublishedBy);

    private static List<CurriculumSourceRecord> ToSourceRecords(
        IReadOnlyList<CurriculumSourceInput> sources) =>
        sources.Select(source => new CurriculumSourceRecord
        {
            SourceType = source.SourceType.Trim(),
            Title = source.Title.Trim(),
            Locator = source.Locator.Trim(),
            Rights = source.Rights.Trim(),
            Notes = source.Notes.Trim()
        }).ToList();

    private static CurriculumSourceInput ToSource(CurriculumSourceRecord source) =>
        new(source.SourceType, source.Title, source.Locator, source.Rights, source.Notes);

    private static CurriculumAuditRecord Audit(
        string action,
        string actor,
        DateTime occurredAtUtc,
        string details) =>
        new()
        {
            Action = action,
            Actor = actor,
            OccurredAtUtc = occurredAtUtc,
            Details = details
        };

    private static string Serialize(LessonResponse lesson) =>
        JsonSerializer.Serialize(lesson, JsonOptions);

    private static LessonResponse Deserialize(string json) =>
        JsonSerializer.Deserialize<LessonResponse>(json, JsonOptions)
        ?? throw new InvalidOperationException("Stored curriculum content could not be read.");

    private static void RequireStatus(
        CurriculumVersionRecord record,
        string status,
        string message)
    {
        if (record.Status != status)
        {
            throw new CurriculumWorkflowException("invalid_workflow_state", message);
        }
    }

    private static CurriculumWorkflowException NotFound() =>
        new("curriculum_version_not_found", "That curriculum version does not exist.", true);
}

public sealed class CurriculumWorkflowException(
    string code,
    string message,
    bool isNotFound = false) : Exception(message)
{
    public string Code { get; } = code;

    public bool IsNotFound { get; } = isNotFound;
}

public sealed class CurriculumValidationException(IReadOnlyList<string> errors)
    : Exception("The curriculum version did not pass deterministic validation.")
{
    public IReadOnlyList<string> Errors { get; } = errors;
}
