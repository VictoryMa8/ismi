using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class SeedCurriculum
{
    public const int DefaultDailyGoalMinutes = 15;

    private readonly IReadOnlyList<LessonResponse> _initialLessons;

    public SeedCurriculum()
    {
        var respond = CreateStep(
            "respond",
            "Choose the response that answers the question.",
            new LessonPrompt(
                "كيف كان يومك؟",
                "Kīf kān yōmak?",
                "How was your day?",
                null),
            [
                new LessonAnswer("a", "كان منيح، بس طويل شوي.", "Kān mnīḥ, bas ṭawīl shway.", "It was good, just a little long."),
                new LessonAnswer("b", "أنا رايح عالسوق بكرا.", "Ana rāyeḥ ʿa-s-sūq bukra.", "I am going to the market tomorrow."),
                new LessonAnswer("c", "إنت من وين؟", "Inta min wēn?", "Where are you from?")
            ],
            "Exactly.",
            "Kān mnīḥ directly describes how the day was. Bas adds a contrasting detail: ‘but.’",
            "That response is natural, but it answers a different question.",
            "Listen for kīf—‘how.’ Choose the answer that describes the day.",
            "Try the answer that begins with kān, ‘it was.’");

        var addDetail = CreateStep(
            "add-detail",
            "Keep the conversation going with a relevant detail.",
            new LessonPrompt("شو عملت اليوم؟", "Shū ʿmilt il-yōm?", "What did you do today?", null),
            [
                new LessonAnswer("a", "اشتغلت وبعدين ارتحت بالبيت.", "Ishtaghalt w-baʿdēn irtaḥt bil-bēt.", "I worked and then rested at home."),
                new LessonAnswer("b", "الجو حلو اليوم.", "Il-jaww ḥilu il-yōm.", "The weather is nice today."),
                new LessonAnswer("c", "بكرا عندي شغل.", "Bukra ʿindi shughl.", "I have work tomorrow.")
            ],
            "That fits.",
            "Ishtaghalt says what you did, while baʿdēn connects the next event in your day.",
            "That sentence is useful, but it does not say what you did today.",
            "The question uses ʿmilt—‘you did.’ Answer with an action from today.",
            "Look for the response with two completed actions.");

        var checkIn = CreateStep(
            "check-in",
            "Answer the follow-up naturally.",
            new LessonPrompt("تعبت؟", "Tiʿibt?", "Did you get tired?", null),
            [
                new LessonAnswer("a", "آه، شوي، بس هلّق أحسن.", "Āh, shway, bas hallaʾ aḥsan.", "Yes, a little, but I’m better now."),
                new LessonAnswer("b", "أنا من رام الله.", "Ana min Rām Allāh.", "I’m from Ramallah."),
                new LessonAnswer("c", "الساعة تلاتة.", "Is-sāʿa tlāte.", "It’s three o’clock.")
            ],
            "Nicely answered.",
            "Āh answers directly, and bas hallaʾ aḥsan reassures your friend that you feel better now.",
            "That does not answer whether you got tired.",
            "A yes-or-no question can start with āh or laʾ, then add a short detail.",
            "Choose the response that begins with ‘yes.’");

        var makePlan = CreateStep(
            "make-plan",
            "Finish by answering about tomorrow.",
            new LessonPrompt("شو رح تعمل بكرا؟", "Shū raḥ tiʿmal bukra?", "What will you do tomorrow?", null),
            [
                new LessonAnswer("a", "رح أزور أهلي بعد الشغل.", "Raḥ azūr ahli baʿd ish-shughl.", "I’ll visit my family after work."),
                new LessonAnswer("b", "كان يوم طويل.", "Kān yōm ṭawīl.", "It was a long day."),
                new LessonAnswer("c", "بحب القهوة.", "Baḥibb il-ʾahwe.", "I like coffee.")
            ],
            "You made a plan.",
            "Raḥ marks a future action, and bukra in the question tells you the answer should be about tomorrow.",
            "That sentence is natural, but its time or purpose does not match the question.",
            "Listen for raḥ and bukra—the question asks about a future plan.",
            "Choose the answer that begins with raḥ, ‘will.’");

        _initialLessons =
        [
            CreateLesson("levantine-day-01", "Answer a friend’s check-in", "A friend asks how your day went.", 1, 5, [respond]),
            CreateLesson("levantine-day-02", "Say what you did today", "Add one concrete detail about your day.", 2, 5, [addDetail]),
            CreateLesson("levantine-day-03", "Respond with reassurance", "A friend checks whether the day tired you out.", 3, 5, [checkIn]),
            CreateLesson("levantine-day-04", "Talk about tomorrow", "Finish the conversation by sharing a plan.", 4, 5, [makePlan]),
            CreateLesson("levantine-day-05", "Connect the story of your day", "Review the opening and add a relevant detail.", 5, 6, [respond, addDetail]),
            CreateLesson("levantine-day-06", "Week one conversation checkpoint", "Carry a short guided exchange from today into tomorrow.", 6, 7, [respond, addDetail, checkIn, makePlan])
        ];
    }

    public IReadOnlyList<LessonResponse> GetInitialLessons() => _initialLessons;

    public LessonResponse GetInitialLesson() => _initialLessons[0];

    public LessonDefinition? FindLesson(string lessonId)
    {
        var lesson = _initialLessons.FirstOrDefault(candidate =>
            string.Equals(candidate.Id, lessonId, StringComparison.OrdinalIgnoreCase));
        return lesson is null ? null : new LessonDefinition(lesson);
    }

    public DashboardResponse BuildDashboard(
        string displayName,
        IReadOnlyList<LessonDefinition> publishedLessons,
        IReadOnlySet<string> completedLessonIds,
        int completedMinutesToday)
    {
        var ordered = publishedLessons
            .Where(lesson => string.Equals(lesson.Response.TrackId, "levantine", StringComparison.OrdinalIgnoreCase))
            .OrderBy(lesson => lesson.Response.UnitId, StringComparer.OrdinalIgnoreCase)
            .ThenBy(lesson => lesson.Response.CourseOrder)
            .ThenBy(lesson => lesson.Response.Id, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (ordered.Count == 0)
        {
            throw new InvalidOperationException("At least one published Levantine lesson is required.");
        }

        var next = ordered.FirstOrDefault(lesson => !completedLessonIds.Contains(lesson.Response.Id)) ?? ordered[^1];
        var completedCount = ordered.Count(lesson => completedLessonIds.Contains(lesson.Response.Id));
        var courseLessons = ordered.Select(lesson => new CourseLessonSummary(
            lesson.Response.Id,
            lesson.Response.Title,
            lesson.Response.UnitId,
            lesson.Response.UnitTitle,
            lesson.Response.CourseOrder,
            lesson.Response.EstimatedMinutes,
            lesson.Response.ReviewStatus,
            completedLessonIds.Contains(lesson.Response.Id),
            string.Equals(lesson.Response.Id, next.Response.Id, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        return new DashboardResponse(
            new LearnerSummary(displayName, 0, ordered.Count),
            new DailyPlanSummary(
                DefaultDailyGoalMinutes,
                Math.Min(DefaultDailyGoalMinutes, completedMinutesToday),
                "levantine",
                next.Response.Id,
                courseLessons),
            [
                new TrackProgress(
                    "levantine",
                    "Palestinian Levantine",
                    next.Response.UnitTitle,
                    next.Response.Title,
                    next.Response.EstimatedMinutes,
                    (int)Math.Round(completedCount * 100d / ordered.Count),
                    true),
                new TrackProgress("msa", "Modern Standard Arabic", "Coming later", "MSA pilot not yet published", 0, 0, false),
                new TrackProgress("quranic", "Quranic Arabic", "Coming later", "Quranic pilot not yet published", 0, 0, false)
            ],
            new WordConnection("يَوْم", "yōm", "yawm", "day"));
    }

    private static LessonResponse CreateLesson(
        string id,
        string title,
        string scenario,
        int courseOrder,
        int estimatedMinutes,
        IReadOnlyList<LessonStep> steps) =>
        new(
            id,
            "levantine",
            title,
            scenario,
            steps,
            estimatedMinutes,
            $"seed-2026-09-03-{courseOrder}",
            "levantine-week-01",
            "Week 1 · Talk about your day",
            courseOrder,
            "demonstrative");

    private static LessonStep CreateStep(
        string id,
        string instruction,
        LessonPrompt prompt,
        IReadOnlyList<LessonAnswer> answers,
        string correctTitle,
        string correctExplanation,
        string incorrectTitle,
        string incorrectExplanation,
        string retryHint) =>
        new(
            id,
            instruction,
            prompt,
            answers,
            new LessonEvaluation(
                "a",
                correctTitle,
                correctExplanation,
                incorrectTitle,
                incorrectExplanation,
                retryHint));
}
