namespace Ismi.Api.Models;

public sealed record CulturalResource(
    string Id, string Purpose, string Platform, string Url, int DurationSeconds,
    string Access, string AccessNotes, string Region, bool? LoginRequired,
    string[] CaptionLanguages, string CaptionOrigin, string? TranscriptUrl,
    string SupportNotes, DateTime CheckedAtUtc, string Evidence,
    int? StartSeconds = null, int? EndSeconds = null);

public sealed record CulturalItem(
    string Id, string Slot, string Title, string? ArabicTitle, string Creator,
    int? Year, int DurationSeconds, string Language, string Dialect, string Register,
    string Difficulty, string DifficultyReason, string Description, string Prompt,
    string TextAlternative, string ContentNotes, string SourceEvidence,
    string ReviewNotes, CulturalResource[] Resources);

public sealed record CulturalEdition(
    string Id, string Title, DateTime WeekStartUtc, string Theme, CulturalItem[] Items);
public sealed record CulturalDraftRequest(CulturalEdition Edition, long? ExpectedRevision = null);
public sealed record CulturalCommand(long ExpectedRevision, int Version, string Reason = "");
public sealed record CulturalLinkCheck(long ExpectedRevision, int Version, string ResourceId, bool Available, string Note);
public sealed record CulturalAudit(string Action, int Version, string Actor, DateTime AtUtc, string Note);
public sealed record CulturalObservation(string ResourceId, string Url, bool Available, DateTime AtUtc, string Note);
public sealed record CulturalVersion(int Number, string Status, CulturalEdition Edition,
    string ContentHash, string? ApprovedBy, DateTime? ApprovedAtUtc, DateTime? PublishedAtUtc);
public sealed record CulturalState(CulturalVersion[] Versions, int? PublishedVersion,
    CulturalAudit[] Audit, CulturalObservation[] Observations);
public sealed record CulturalDetail(string Id, long Revision, CulturalState State);
public sealed record CulturalSummary(string Id, string Title, DateTime WeekStartUtc,
    long Revision, int LatestVersion, string Status, int? PublishedVersion);
public sealed record CulturalValidation(bool IsValid, string[] Errors);

// Deliberate allowlist: internal evidence, audit actors and approval notes never enter public DTOs.
public sealed record CulturalPublicResource(string Id, string Purpose, string Platform,
    string? Url, int DurationSeconds, string Access, string AccessNotes, string Region,
    bool? LoginRequired, string[] CaptionLanguages, string CaptionOrigin, string? TranscriptUrl,
    string SupportNotes, DateTime CheckedAtUtc, int? StartSeconds, int? EndSeconds,
    bool Available, string AvailabilityNote);
public sealed record CulturalPublicItem(string Id, string Slot, string Title, string? ArabicTitle,
    string Creator, int? Year, int DurationSeconds, string Language, string Dialect,
    string Register, string Difficulty, string DifficultyReason, string Description,
    string Prompt, string TextAlternative, string ContentNotes, CulturalPublicResource[] Resources);
public sealed record CulturalPublicEdition(string Id, int Version, string ContentHash,
    string Title, DateTime WeekStartUtc, string Theme, CulturalPublicItem[] Items);
public sealed record CulturalCatalog(int SchemaVersion, DateTime ServerTimeUtc,
    string CatalogRevision, string? CurrentId, bool IsCurrentWeek,
    CulturalPublicEdition[] Editions, string[] WithdrawnIds, int Offset, bool HasMore);
