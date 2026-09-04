using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class LearnerProgressService
{
    private readonly object _gate = new();
    private readonly HashSet<string> _completionIds = new(StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _completedLessonIds = new(StringComparer.OrdinalIgnoreCase);
    private int _earnedMinutes;

    public DashboardResponse GetDashboard(SeedCurriculum curriculum)
    {
        lock (_gate)
        {
            var dashboard = curriculum.GetDashboard();
            var completedMinutes = Math.Min(
                dashboard.DailyPlan.GoalMinutes,
                dashboard.DailyPlan.CompletedMinutes + _earnedMinutes);

            return dashboard with
            {
                DailyPlan = dashboard.DailyPlan with { CompletedMinutes = completedMinutes }
            };
        }
    }

    public LessonCompletionResponse Complete(
        SeedCurriculum curriculum,
        LessonDefinition lesson,
        string completionId)
    {
        lock (_gate)
        {
            var dashboard = curriculum.GetDashboard();
            var duplicateEvent = !_completionIds.Add(completionId);
            var firstLessonCompletion = !duplicateEvent && _completedLessonIds.Add(lesson.Response.Id);

            if (firstLessonCompletion)
            {
                _earnedMinutes += lesson.Response.EstimatedMinutes;
            }

            var completedMinutes = Math.Min(
                dashboard.DailyPlan.GoalMinutes,
                dashboard.DailyPlan.CompletedMinutes + _earnedMinutes);

            return new LessonCompletionResponse(
                true,
                duplicateEvent || !firstLessonCompletion,
                completedMinutes,
                dashboard.DailyPlan.GoalMinutes);
        }
    }
}
