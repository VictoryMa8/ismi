namespace Ismi.Api.Models;

public sealed record DashboardResponse(
    LearnerSummary Learner,
    DailyPlanSummary DailyPlan,
    IReadOnlyList<TrackProgress> Tracks,
    WordConnection Connection);

public sealed record LearnerSummary(
    string DisplayName,
    int StreakDays,
    int OfflineLessonCount);

public sealed record DailyPlanSummary(
    int GoalMinutes,
    int CompletedMinutes,
    string PrimaryTrack,
    string NextLessonId,
    IReadOnlyList<CourseLessonSummary> Lessons);

public sealed record CourseLessonSummary(
    string Id,
    string Title,
    string UnitId,
    string UnitTitle,
    int CourseOrder,
    int EstimatedMinutes,
    string ReviewStatus,
    bool IsCompleted,
    bool IsCurrent);

public sealed record TrackProgress(
    string Id,
    string Name,
    string Label,
    string CurrentLessonTitle,
    int PlannedMinutes,
    int ProgressPercent,
    bool IsPrimary);

public sealed record WordConnection(
    string Arabic,
    string Levantine,
    string Formal,
    string Meaning);
