using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class LessonEvaluator
{
    public LessonAttemptResponse Evaluate(LessonStep step, string answerId)
    {
        var evaluation = step.Evaluation;
        var isCorrect = string.Equals(
            evaluation.CorrectAnswerId,
            answerId.Trim(),
            StringComparison.OrdinalIgnoreCase);

        return isCorrect
            ? new LessonAttemptResponse(
                step.Id,
                true,
                evaluation.CorrectAnswerId,
                evaluation.CorrectTitle,
                evaluation.CorrectExplanation,
                null)
            : new LessonAttemptResponse(
                step.Id,
                false,
                evaluation.CorrectAnswerId,
                evaluation.IncorrectTitle,
                step.Answers.FirstOrDefault(answer => string.Equals(answer.Id, answerId.Trim(), StringComparison.OrdinalIgnoreCase))?.Rationale
                    ?? evaluation.IncorrectExplanation,
                evaluation.RetryHint);
    }
}
