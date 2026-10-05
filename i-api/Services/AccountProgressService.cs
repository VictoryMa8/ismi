using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public sealed class AccountProgressService(IsmiDbContext database, StudySettingsService settings)
{
    public async Task<DashboardResponse> GetDashboardAsync(
        SeedCurriculum curriculum,
        IReadOnlyList<LessonDefinition> publishedLessons,
        ApplicationUser user,
        CancellationToken cancellationToken = default)
    {
        var completions = await database.LessonCompletions
            .AsNoTracking()
            .Where(completion => completion.UserId == user.Id)
            .Select(completion => new { completion.LessonId, completion.CompletedAtUtc })
            .ToListAsync(cancellationToken);
        var completedIds = completions
            .Select(completion => completion.LessonId)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        var minutesByLesson = publishedLessons.ToDictionary(
            lesson => lesson.Response.Id,
            lesson => lesson.Response.EstimatedMinutes,
            StringComparer.OrdinalIgnoreCase);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var completedMinutesToday = completions
            .Where(completion => DateOnly.FromDateTime(completion.CompletedAtUtc) == today)
            .Sum(completion => minutesByLesson.GetValueOrDefault(completion.LessonId));

        return curriculum.BuildDashboard(
            user.DisplayName,
            publishedLessons,
            completedIds,
            completedMinutesToday,
            (await settings.GetAsync(user.Id, cancellationToken)).Preferences.GoalMinutes,
            completions.Where(c => DateOnly.FromDateTime(c.CompletedAtUtc) == today)
                .Select(c => c.LessonId).ToHashSet(StringComparer.OrdinalIgnoreCase));
    }

    public async Task<LessonCompletionResponse> CompleteAsync(
        SeedCurriculum curriculum,
        IReadOnlyList<LessonDefinition> publishedLessons,
        LessonDefinition lesson,
        ApplicationUser user,
        string completionId,
        DateTimeOffset completedAt,
        CancellationToken cancellationToken = default)
    {
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

        var dashboard = await GetDashboardAsync(
            curriculum,
            publishedLessons,
            user,
            cancellationToken);
        return new LessonCompletionResponse(
            true,
            alreadyRecorded,
            dashboard.DailyPlan.CompletedMinutes,
            dashboard.DailyPlan.GoalMinutes);
    }
}
