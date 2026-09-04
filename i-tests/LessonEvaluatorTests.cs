using Ismi.Api.Services;

namespace Ismi.Api.Tests;

public sealed class LessonEvaluatorTests
{
    private readonly SeedCurriculum _curriculum = new();
    private readonly LessonEvaluator _evaluator = new();

    [Fact]
    public void Evaluate_ReturnsReviewedExplanation_ForCorrectAnswer()
    {
        var lesson = _curriculum.FindLesson("levantine-day-01");

        Assert.NotNull(lesson);
        var step = lesson.FindStep("respond");
        Assert.NotNull(step);
        var result = _evaluator.Evaluate(step, "a");

        Assert.True(result.IsCorrect);
        Assert.Equal("respond", result.StepId);
        Assert.Equal("a", result.CorrectAnswerId);
        Assert.Contains("describes how the day was", result.Explanation);
        Assert.Null(result.RetryHint);
    }

    [Fact]
    public void Evaluate_ReturnsContextualHint_ForNaturalButIncorrectAnswer()
    {
        var lesson = _curriculum.FindLesson("levantine-day-01");

        Assert.NotNull(lesson);
        var step = lesson.FindStep("respond");
        Assert.NotNull(step);
        var result = _evaluator.Evaluate(step, "b");

        Assert.False(result.IsCorrect);
        Assert.Contains("different question", result.FeedbackTitle);
        Assert.Contains("kīf", result.Explanation);
        Assert.NotNull(result.RetryHint);
    }

    [Fact]
    public void Lesson_ContainsCompleteFourStepSequence()
    {
        var lesson = _curriculum.FindLesson("levantine-day-01");

        Assert.NotNull(lesson);
        Assert.Equal(4, lesson.Response.Steps.Count);
        Assert.All(lesson.Response.Steps, step =>
        {
            Assert.Equal(3, step.Answers.Count);
            Assert.Contains(step.Answers, answer => answer.Id == step.Evaluation.CorrectAnswerId);
            Assert.False(string.IsNullOrWhiteSpace(step.Evaluation.CorrectExplanation));
            Assert.False(string.IsNullOrWhiteSpace(step.Evaluation.IncorrectExplanation));
        });
    }
}
