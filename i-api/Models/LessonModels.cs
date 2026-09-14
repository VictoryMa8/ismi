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
    string ReviewStatus);

public sealed record LessonStep(
    string Id,
    string Instruction,
    LessonPrompt Prompt,
    IReadOnlyList<LessonAnswer> Answers,
    LessonEvaluation Evaluation);

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
    string Meaning);

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
