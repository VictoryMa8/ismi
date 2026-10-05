using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class LearnerProgressService
{
    private readonly object _gate = new();
    private readonly Dictionary<string, GuestState> _guests =
        new(StringComparer.OrdinalIgnoreCase);

    public DashboardResponse GetDashboard(
        string guestId,
        SeedCurriculum curriculum,
        IReadOnlyList<LessonDefinition> publishedLessons)
    {
        lock (_gate)
        {
            var guest = GetGuest(guestId);
            var completedIds = guest.CompletionsByLesson.Keys.ToHashSet(StringComparer.OrdinalIgnoreCase);
            var completedMinutesToday = CalculateTodayMinutes(guest, publishedLessons);
            return curriculum.BuildDashboard(
                "Guest",
                publishedLessons,
                completedIds,
                completedMinutesToday,
                completedTodayIds: guest.CompletionsByLesson.Values
                    .Where(c => DateOnly.FromDateTime(c.CompletedAt.UtcDateTime) == DateOnly.FromDateTime(DateTime.UtcNow))
                    .Select(c => c.LessonId).ToHashSet(StringComparer.OrdinalIgnoreCase));
        }
    }

    public LessonCompletionResponse Complete(
        string guestId,
        SeedCurriculum curriculum,
        IReadOnlyList<LessonDefinition> publishedLessons,
        LessonDefinition lesson,
        string completionId,
        DateTimeOffset completedAt)
    {
        lock (_gate)
        {
            var guest = GetGuest(guestId);
            var duplicateEvent = guest.CompletionsByEvent.ContainsKey(completionId);
            var duplicateLesson = guest.CompletionsByLesson.ContainsKey(lesson.Response.Id);
            if (!duplicateEvent && !duplicateLesson)
            {
                var completion = new GuestCompletion(
                    completionId,
                    lesson.Response.Id,
                    completedAt.ToUniversalTime());
                guest.CompletionsByEvent[completionId] = completion;
                guest.CompletionsByLesson[lesson.Response.Id] = completion;
            }

            var completedMinutes = Math.Min(
                SeedCurriculum.DefaultDailyGoalMinutes,
                CalculateTodayMinutes(guest, publishedLessons));
            return new LessonCompletionResponse(
                true,
                duplicateEvent || duplicateLesson,
                completedMinutes,
                SeedCurriculum.DefaultDailyGoalMinutes);
        }
    }

    private GuestState GetGuest(string guestId)
    {
        if (_guests.TryGetValue(guestId, out var guest)) return guest;
        guest = new GuestState();
        _guests[guestId] = guest;
        return guest;
    }

    private static int CalculateTodayMinutes(
        GuestState guest,
        IReadOnlyList<LessonDefinition> publishedLessons)
    {
        var minutesByLesson = publishedLessons.ToDictionary(
            lesson => lesson.Response.Id,
            lesson => lesson.Response.EstimatedMinutes,
            StringComparer.OrdinalIgnoreCase);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        return guest.CompletionsByLesson.Values
            .Where(completion => DateOnly.FromDateTime(completion.CompletedAt.UtcDateTime) == today)
            .Sum(completion => minutesByLesson.GetValueOrDefault(completion.LessonId));
    }

    private sealed record GuestCompletion(
        string CompletionId,
        string LessonId,
        DateTimeOffset CompletedAt);

    private sealed class GuestState
    {
        public Dictionary<string, GuestCompletion> CompletionsByEvent { get; } =
            new(StringComparer.OrdinalIgnoreCase);

        public Dictionary<string, GuestCompletion> CompletionsByLesson { get; } =
            new(StringComparer.OrdinalIgnoreCase);
    }
}
