namespace Ismi.Api.Models;

public sealed record LessonResponse(
    string Id,
    string TrackId,
    string Title,
    string Scenario,
    IReadOnlyList<LessonStep> Steps,
    int EstimatedMinutes,
    string Version,
    string UnitId,
    string UnitTitle,
    int CourseOrder,
    string ReviewStatus,
    LessonIntroduction? Introduction = null,
    bool EnglishHelpInitiallyHidden = false,
    LessonCast? Characters = null,
    [property: System.Text.Json.Serialization.JsonIgnore(Condition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull)]
    IReadOnlyList<LessonVocabulary>? Vocabulary = null);

public sealed record LessonCast(string RegistryVersion, IReadOnlyList<string> CharacterIds);
public sealed record CharacterRoles(string? SpeakerId = null, string? AddresseeId = null,
    string? ResponseSpeakerId = null, string? ResponseAddresseeId = null);

public sealed record LessonIntroduction(
    string Goal,
    IReadOnlyList<DialogueTurn> Dialogue,
    IReadOnlyList<LessonPrompt> Expressions,
    string UsageNote,
    string DialectNote,
    string RecordingNote,
    IReadOnlyList<string> SourceLocators,
    IReadOnlyList<LessonTeachingCard>? TeachingCards = null);

public sealed record LessonTeachingCard(string Title, LessonPrompt Phrase, string Note, IReadOnlyList<LessonPhraseChunk> Chunks,
    string? RecallCue = null, IReadOnlyList<string>? SourceLocators = null,
    string? SpeakerId = null, string? AddresseeId = null);
public sealed record LessonPhraseChunk(string Arabic, string Arabizi, string Meaning);

public sealed record DialogueTurn(string Speaker, LessonPrompt Line, string? SpeakerId = null, string? AddresseeId = null);

public sealed record LessonStep(
    string Id,
    string Instruction,
    LessonPrompt Prompt,
    IReadOnlyList<LessonAnswer> Answers,
    LessonEvaluation Evaluation,
    CharacterRoles? Characters = null);

public sealed record LessonPrompt(
    string Arabic,
    string Arabizi,
    string Meaning,
    string? AudioUrl,
    LessonRecording? Recording = null);

public sealed record LessonRecording(
    string Transcript,
    string Speaker,
    string Dialect,
    string SourceLocator,
    string ReviewNotes);

public sealed record LessonAnswer(
    string Id,
    string Arabic,
    string Arabizi,
    string Meaning,
    string? Rationale = null);

public sealed record LessonEvaluation(
    string CorrectAnswerId,
    string CorrectTitle,
    string CorrectExplanation,
    string IncorrectTitle,
    string IncorrectExplanation,
    string RetryHint);

public sealed record LessonAttemptRequest(string StepId, string AnswerId);

public sealed record LessonAttemptResponse(
    string StepId,
    bool IsCorrect,
    string CorrectAnswerId,
    string FeedbackTitle,
    string Explanation,
    string? RetryHint);

public sealed record LessonCompletionRequest(
    string CompletionId,
    DateTimeOffset CompletedAt);

public sealed record LessonCompletionResponse(
    bool Accepted,
    bool AlreadyRecorded,
    int CompletedMinutes,
    int GoalMinutes);

public sealed record ApiError(string Code, string Message);

public sealed record LessonDefinition(LessonResponse Response)
{
    public LessonResponse ToResponse() => Response;

    public LessonStep? FindStep(string stepId) =>
        Response.Steps.FirstOrDefault(step =>
            string.Equals(step.Id, stepId, StringComparison.OrdinalIgnoreCase));
}

// Explicit, source-linked senses; morphology is supplied by authors, never inferred.
public sealed record LessonVocabulary(string Id, string SenseId, string Kind,
    string Arabic, string Arabizi, string Meaning, string Dialect, string Register,
    IReadOnlyList<string> Forms, string Note, IReadOnlyList<string> SourceLocators,
    int TeachingCardIndex);
