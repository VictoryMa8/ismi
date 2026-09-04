using Ismi.Api.Services;

namespace Ismi.Api.Tests;

public sealed class LearnerProgressServiceTests
{
    [Fact]
    public void Complete_IsIdempotentAndUpdatesDashboard()
    {
        var curriculum = new SeedCurriculum();
        var progress = new LearnerProgressService();
        var lesson = curriculum.FindLesson("levantine-day-01");

        Assert.NotNull(lesson);
        var first = progress.Complete(curriculum, lesson, "completion-1");
        var repeated = progress.Complete(curriculum, lesson, "completion-1");
        var dashboard = progress.GetDashboard(curriculum);

        Assert.True(first.Accepted);
        Assert.False(first.AlreadyRecorded);
        Assert.True(repeated.AlreadyRecorded);
        Assert.Equal(14, dashboard.DailyPlan.CompletedMinutes);
    }

    [Fact]
    public void Complete_DoesNotAwardTheSameLessonTwice()
    {
        var curriculum = new SeedCurriculum();
        var progress = new LearnerProgressService();
        var lesson = curriculum.FindLesson("levantine-day-01");

        Assert.NotNull(lesson);
        progress.Complete(curriculum, lesson, "completion-1");
        var replay = progress.Complete(curriculum, lesson, "completion-2");

        Assert.True(replay.AlreadyRecorded);
        Assert.Equal(14, replay.CompletedMinutes);
    }
}
