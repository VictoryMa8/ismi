namespace Ismi.Api.Models;

public static class CurriculumStatuses
{
    public const string Draft = "draft";
    public const string Approved = "approved";
    public const string Published = "published";
    public const string Superseded = "superseded";
}

public sealed record CurriculumSourceInput(
    string SourceType,
    string Title,
    string Locator,
    string Rights,
    string Notes);

public sealed record CurriculumDraftRequest(
    LessonResponse Lesson,
    IReadOnlyList<CurriculumSourceInput> Sources);

public sealed record CurriculumVersionSummary(
    long Id,
    string LessonId,
    string Title,
    int VersionNumber,
    string Status,
    DateTime CreatedAtUtc,
    string CreatedBy,
    DateTime? PublishedAtUtc);

public sealed record CurriculumAuditEntry(
    long Id,
    string Action,
    string Actor,
    DateTime OccurredAtUtc,
    string Details);

public sealed record CurriculumVersionDetail(
    long Id,
    int VersionNumber,
    string Status,
    LessonResponse Lesson,
    IReadOnlyList<CurriculumSourceInput> Sources,
    IReadOnlyList<CurriculumAuditEntry> Audit,
    DateTime CreatedAtUtc,
    string CreatedBy,
    DateTime? ApprovedAtUtc,
    string? ApprovedBy,
    DateTime? PublishedAtUtc,
    string? PublishedBy);

public sealed record CurriculumValidationResult(
    bool IsValid,
    IReadOnlyList<string> Errors);

public sealed record CurriculumRollbackRequest(long TargetVersionId);
