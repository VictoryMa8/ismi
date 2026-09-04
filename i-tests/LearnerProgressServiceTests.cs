using Ismi.Api.Models;
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
        var publishedLessons = curriculum.GetInitialLessons().Select(item => new LessonDefinition(item)).ToList();

        Assert.NotNull(lesson);
        var first = progress.Complete("guest-a", curriculum, publishedLessons, lesson, "completion-1", DateTimeOffset.UtcNow);
        var repeated = progress.Complete("guest-a", curriculum, publishedLessons, lesson, "completion-1", DateTimeOffset.UtcNow);
        var dashboard = progress.GetDashboard("guest-a", curriculum, publishedLessons);

        Assert.True(first.Accepted);
        Assert.False(first.AlreadyRecorded);
        Assert.True(repeated.AlreadyRecorded);
        Assert.Equal(5, dashboard.DailyPlan.CompletedMinutes);
        Assert.Equal("levantine-day-02", dashboard.DailyPlan.NextLessonId);
        Assert.Equal(17, dashboard.Tracks.Single(track => track.Id == "levantine").ProgressPercent);
    }

    [Fact]
    public void Complete_DoesNotAwardTheSameLessonTwice()
    {
        var curriculum = new SeedCurriculum();
        var progress = new LearnerProgressService();
        var lesson = curriculum.FindLesson("levantine-day-01");
        var publishedLessons = curriculum.GetInitialLessons().Select(item => new LessonDefinition(item)).ToList();

        Assert.NotNull(lesson);
        progress.Complete("guest-a", curriculum, publishedLessons, lesson, "completion-1", DateTimeOffset.UtcNow);
        var replay = progress.Complete("guest-a", curriculum, publishedLessons, lesson, "completion-2", DateTimeOffset.UtcNow);

        Assert.True(replay.AlreadyRecorded);
        Assert.Equal(5, replay.CompletedMinutes);
    }

    [Fact]
    public void GuestProgress_IsIsolatedByBrowserIdentity()
    {
        var curriculum = new SeedCurriculum();
        var progress = new LearnerProgressService();
        var lesson = curriculum.FindLesson("levantine-day-01");
        var publishedLessons = curriculum.GetInitialLessons().Select(item => new LessonDefinition(item)).ToList();

        Assert.NotNull(lesson);
        progress.Complete("guest-a", curriculum, publishedLessons, lesson, "completion-1", DateTimeOffset.UtcNow);

        var firstGuest = progress.GetDashboard("guest-a", curriculum, publishedLessons);
        var secondGuest = progress.GetDashboard("guest-b", curriculum, publishedLessons);

        Assert.Equal(5, firstGuest.DailyPlan.CompletedMinutes);
        Assert.Equal(0, secondGuest.DailyPlan.CompletedMinutes);
        Assert.Equal("levantine-day-01", secondGuest.DailyPlan.NextLessonId);
    }

    [Fact]
    public void CompletingTheWeek_AdvancesInOrderAndCapsTheDailyGoal()
    {
        var curriculum = new SeedCurriculum();
        var progress = new LearnerProgressService();
        var publishedLessons = curriculum.GetInitialLessons().Select(item => new LessonDefinition(item)).ToList();

        foreach (var lesson in publishedLessons)
        {
            progress.Complete(
                "guest-a",
                curriculum,
                publishedLessons,
                lesson,
                $"completion-{lesson.Response.CourseOrder}",
                DateTimeOffset.UtcNow);
        }

        var dashboard = progress.GetDashboard("guest-a", curriculum, publishedLessons);

        Assert.Equal(15, dashboard.DailyPlan.CompletedMinutes);
        Assert.Equal("levantine-day-06", dashboard.DailyPlan.NextLessonId);
        Assert.All(dashboard.DailyPlan.Lessons, lesson => Assert.True(lesson.IsCompleted));
        Assert.Equal(100, dashboard.Tracks.Single(track => track.Id == "levantine").ProgressPercent);
    }
}
