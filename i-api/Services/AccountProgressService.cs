using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public sealed class AccountProgressService(IsmiDbContext database)
{
    public async Task<DashboardResponse> GetDashboardAsync(
        SeedCurriculum curriculum,
        ApplicationUser user,
        CancellationToken cancellationToken = default)
    {
        var dashboard = curriculum.GetDashboard();
        var earnedMinutes = await database.LearnerProgress
            .Where(progress => progress.UserId == user.Id)
            .Select(progress => progress.EarnedMinutes)
            .SingleOrDefaultAsync(cancellationToken);

        return dashboard with
        {
            Learner = dashboard.Learner with { DisplayName = user.DisplayName },
            DailyPlan = dashboard.DailyPlan with
            {
                CompletedMinutes = Math.Min(
                    dashboard.DailyPlan.GoalMinutes,
                    dashboard.DailyPlan.CompletedMinutes + earnedMinutes)
            }
        };
    }

    public async Task<LessonCompletionResponse> CompleteAsync(
        SeedCurriculum curriculum,
        LessonDefinition lesson,
        ApplicationUser user,
        string completionId,
        DateTimeOffset completedAt,
        CancellationToken cancellationToken = default)
    {
        var dashboard = curriculum.GetDashboard();
        var alreadyRecorded = await database.LessonCompletions.AnyAsync(
            completion => completion.UserId == user.Id
                && (completion.CompletionId == completionId
                    || completion.LessonId == lesson.Response.Id),
            cancellationToken);

        var progress = await database.LearnerProgress.FindAsync([user.Id], cancellationToken);
        if (progress is null)
        {
            progress = new LearnerProgressRecord { UserId = user.Id };
            database.LearnerProgress.Add(progress);
        }

        if (!alreadyRecorded)
        {
            database.LessonCompletions.Add(new LessonCompletionRecord
            {
                UserId = user.Id,
                CompletionId = completionId,
                LessonId = lesson.Response.Id,
                CompletedAtUtc = completedAt.UtcDateTime
            });
            progress.EarnedMinutes += lesson.Response.EstimatedMinutes;
            await database.SaveChangesAsync(cancellationToken);
        }

        var completedMinutes = Math.Min(
            dashboard.DailyPlan.GoalMinutes,
            dashboard.DailyPlan.CompletedMinutes + progress.EarnedMinutes);

        return new LessonCompletionResponse(
            true,
            alreadyRecorded,
            completedMinutes,
            dashboard.DailyPlan.GoalMinutes);
    }
}
