namespace Ismi.Api.Models;
public sealed record StorySource(string LessonId, string Version);
public sealed record StoryLine(string SpeakerId, LessonPrompt Text, int SourceIndex);
public sealed record StoryScene(string Title, string Situation, StoryLine[] Lines);
public sealed record StoryChoice(string Id, string Text, string Rationale, string Help = "", string Meaning = "");
public sealed record StoryCheck(string Id, string Kind, string Prompt, StoryChoice[] Choices, string AcceptedId, string Explanation, int SourceIndex, string Target);
public sealed record StoryPack(string Id, string CourseId, string UnitId, string ArcId, int Episode, string Title, string Summary,
    StorySource[] Sources, StoryScene[] Scenes, StoryCheck[] Checks, string Reviewer, string ReviewEvidence, string RightsEvidence);
public sealed record StoryDraft(StoryPack Pack, long? ExpectedRevision = null);
public sealed record StoryCommand(long ExpectedRevision, int Version, string Reason = "");
public sealed record StoryValidation(bool IsValid, string[] Errors);
public sealed record StoryAudit(string Action, int Version, string Actor, DateTime AtUtc, string Reason);
public sealed record StoryVersion(int Number, string Status, StoryPack Pack, string Hash, string? ApprovedBy, DateTime? PublishedAtUtc, bool TextPreview = false, string? PreviewAuthorizedBy = null);
public sealed record StoryState(StoryVersion[] Versions, int? PublishedVersion, StoryAudit[] Audit);
public sealed record StoryDetail(string Id, long Revision, StoryState State);
public sealed record StorySummary(string Id, string CourseId, string Title, long Revision, int LatestVersion, string Status, int? PublishedVersion);
public sealed record StoryPublicationNotice(string ReleaseId, string Label, string Details);
public sealed record StoryPublicPack(string Id, string CourseId, string UnitId, string ArcId, int Episode, int Version, string ContentHash,
    string Title, string Summary, StorySource[] Sources, StoryScene[] Scenes, StoryCheck[] Checks,
    [property: System.Text.Json.Serialization.JsonIgnore(Condition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull)] StoryPublicationNotice? PublicationNotice = null);
public sealed record StoryCatalog(StoryPublicPack[] Episodes);
