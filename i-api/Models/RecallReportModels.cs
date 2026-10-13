namespace Ismi.Api.Models;

public sealed record RecallReportRequest(string Id, string LessonId, string Version, string TargetId,
    string VariantId, string InputMode, string Response, string Explanation);
public sealed record RecallReviewCase(string Id, string Status, DateTime CreatedAtUtc,
    RecallReportRequest Report, string Dialect, string Register, string Evaluation,
    RecallTarget Target, IReadOnlyList<CurriculumSourceInput> Sources, string? Resolution,
    string? ResolvedBy, DateTime? ResolvedAtUtc);
public sealed record RecallResolutionRequest(string Resolution);
