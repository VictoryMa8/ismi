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
    string NextLessonId);

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
