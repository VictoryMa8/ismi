namespace Ismi.Api.Models;

// Exact display text is never normalized. Script IDs/versions can be shared; teaching stays course-specific.
public sealed record AlphabetForm(string Label, string Text, string Note);
public sealed record AlphabetScriptEntry(string Id, string Category, string Text, AlphabetForm[] Forms);
public sealed record AlphabetInventory(string Id, int Version, string[] BasicEntryIds, AlphabetScriptEntry[] Entries,
    string Reviewer, string ReviewEvidence);
public sealed record AlphabetSource(string Id, string Citation, string Locator, string Version,
    string RightsEvidence, bool TextCleared, bool AdaptationCleared, bool OfflineCleared);
public sealed record AlphabetClip(string Url, string Transcript, string Speaker, string Variety,
    string Reviewer, string ReviewEvidence, string RightsEvidence, bool HumanRecording, bool OfflineCleared);
public sealed record AlphabetExample(string Id, string Text, string Meaning, string Help,
    string Target, int[] Occurrences, string Note, string[] SourceIds, AlphabetClip Audio);
public sealed record AlphabetChoice(string Id, string Text);
public sealed record AlphabetActivity(string Id, string Kind, string Prompt, AlphabetChoice[] Choices,
    string[] AcceptedIds, string Explanation, string Rationale, string? ExampleId, string? AudioUrl);
public sealed record AlphabetEntry(string Id, string Name, string Help, string Note, string SoundContext,
    string[] SourceIds, AlphabetClip NameAudio, AlphabetClip SoundAudio,
    AlphabetExample[] Examples, AlphabetActivity[] Activities);
public sealed record AlphabetPack(string Id, string CourseId, string Title, string Variety, string HelpConvention,
    AlphabetInventory Inventory, AlphabetEntry[] Entries, AlphabetSource[] Sources,
    string Reviewer, string ReviewEvidence, bool EngineeringFixture = false, AlphabetFont[]? Fonts = null);
public sealed record AlphabetDraft(AlphabetPack Pack, long? ExpectedRevision = null);
public sealed record AlphabetCommand(long ExpectedRevision, int Version, string Reason = "");
public sealed record AlphabetValidation(bool IsValid, string[] Errors);
public sealed record AlphabetAudit(string Action, int Version, string Actor, DateTime AtUtc, string Reason);
public sealed record AlphabetVersion(int Number, string Status, AlphabetPack Pack, string Hash,
    string? ApprovedBy, DateTime? PublishedAtUtc, bool TextPreview = false);
public sealed record AlphabetState(AlphabetVersion[] Versions, int? PublishedVersion, AlphabetAudit[] Audit);
public sealed record AlphabetDetail(string Id, long Revision, AlphabetState State);
public sealed record AlphabetSummary(string Id, string CourseId, string Title, long Revision, int LatestVersion, string Status, int? PublishedVersion);

// Public projection omits reviewer identities, evidence, rights documents, audits and private drafts.
public sealed record AlphabetPublicClip(string Url, string Transcript);
public sealed record AlphabetPublicExample(string Id, string Text, string Meaning, string Help,
    string Target, int[] Occurrences, string Note, string[] SourceIds, AlphabetPublicClip Audio);
public sealed record AlphabetPublicEntry(string Id, string Name, string Help, string Note, string SoundContext,
    string[] SourceIds, AlphabetPublicClip NameAudio, AlphabetPublicClip SoundAudio,
    AlphabetPublicExample[] Examples, AlphabetActivity[] Activities);
public sealed record AlphabetPublicSource(string Id, string Citation, string Locator, string Version);
public sealed record AlphabetFont(string Url, string Hash);
public sealed record AlphabetPublicationNotice(string Id, string Title, string Detail);
public sealed record AlphabetPublicPack(string Id, string CourseId, int Version, string ContentHash, string Title,
    string Variety, string HelpConvention, string InventoryId, int InventoryVersion, string[] BasicEntryIds,
    AlphabetScriptEntry[] ScriptEntries, AlphabetPublicEntry[] Entries, AlphabetPublicSource[] Sources, AlphabetFont[] Fonts, AlphabetPublicationNotice? PublicationNotice = null, string? LicenseText = null);
public sealed record AlphabetCatalogItem(string CourseId, string? PackId, int? Version, string? ContentHash);
public sealed record AlphabetCatalog(int SchemaVersion, AlphabetCatalogItem[] Courses, string[] WithdrawnIds);
