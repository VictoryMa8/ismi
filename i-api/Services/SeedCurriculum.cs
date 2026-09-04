using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class SeedCurriculum
{
    private readonly DashboardResponse _dashboard = new(
        new LearnerSummary("Maya", 8, 3),
        new DailyPlanSummary(15, 8, "levantine", "levantine-day-01"),
        [
            new TrackProgress(
                "levantine",
                "Palestinian Levantine",
                "Unit 2",
                "Tell them about your day",
                6,
                42,
                true),
            new TrackProgress(
                "msa",
                "Modern Standard Arabic",
                "MSA",
                "Reading the headline",
                4,
                60,
                false),
            new TrackProgress(
                "quranic",
                "Quranic Arabic",
                "Quranic",
                "Al-Ikhlas: core words",
                5,
                35,
                false)
        ],
        new WordConnection("يَوْم", "yōm", "yawm", "day"));

    private readonly IReadOnlyDictionary<string, LessonDefinition> _lessons =
        new Dictionary<string, LessonDefinition>(StringComparer.OrdinalIgnoreCase)
        {
            ["levantine-day-01"] = new LessonDefinition(
                new LessonResponse(
                    "levantine-day-01",
                    "levantine",
                    "Tell them about your day",
                    "A friend checks in after a long day.",
                    [
                        CreateStep(
                            "respond",
                            "Choose the response that answers the question.",
                            new LessonPrompt(
                                "كيف كان يومك؟",
                                "Kīf kān yōmak?",
                                "How was your day?",
                                null),
                            [
                                new LessonAnswer(
                                    "a",
                                    "كان منيح، بس طويل شوي.",
                                    "Kān mnīḥ, bas ṭawīl shway.",
                                    "It was good, just a little long."),
                                new LessonAnswer(
                                    "b",
                                    "أنا رايح عالسوق بكرا.",
                                    "Ana rāyeḥ ʿa-s-sūq bukra.",
                                    "I am going to the market tomorrow."),
                                new LessonAnswer(
                                    "c",
                                    "إنت من وين؟",
                                    "Inta min wēn?",
                                    "Where are you from?")
                            ],
                            "Exactly.",
                            "Kān mnīḥ directly describes how the day was. Bas adds a contrasting detail: ‘but.’",
                            "That response is natural, but it answers a different question.",
                            "Listen for kīf—‘how.’ Choose the answer that describes the day.",
                            "Try the answer that begins with kān, ‘it was.’"),
                        CreateStep(
                            "add-detail",
                            "Keep the conversation going with a relevant detail.",
                            new LessonPrompt(
                                "شو عملت اليوم؟",
                                "Shū ʿmilt il-yōm?",
                                "What did you do today?",
                                null),
                            [
                                new LessonAnswer(
                                    "a",
                                    "اشتغلت وبعدين ارتحت بالبيت.",
                                    "Ishtaghalt w-baʿdēn irtaḥt bil-bēt.",
                                    "I worked and then rested at home."),
                                new LessonAnswer(
                                    "b",
                                    "الجو حلو اليوم.",
                                    "Il-jaww ḥilu il-yōm.",
                                    "The weather is nice today."),
                                new LessonAnswer(
                                    "c",
                                    "بكرا عندي شغل.",
                                    "Bukra ʿindi shughl.",
                                    "I have work tomorrow.")
                            ],
                            "That fits.",
                            "Ishtaghalt says what you did, while baʿdēn connects the next event in your day.",
                            "That sentence is useful, but it does not say what you did today.",
                            "The question uses ʿmilt—‘you did.’ Answer with an action from today.",
                            "Look for the response with two completed actions."),
                        CreateStep(
                            "check-in",
                            "Answer the follow-up naturally.",
                            new LessonPrompt(
                                "تعبت؟",
                                "Tiʿibt?",
                                "Did you get tired?",
                                null),
                            [
                                new LessonAnswer(
                                    "a",
                                    "آه، شوي، بس هلّق أحسن.",
                                    "Āh, shway, bas hallaʾ aḥsan.",
                                    "Yes, a little, but I’m better now."),
                                new LessonAnswer(
                                    "b",
                                    "أنا من رام الله.",
                                    "Ana min Rām Allāh.",
                                    "I’m from Ramallah."),
                                new LessonAnswer(
                                    "c",
                                    "الساعة تلاتة.",
                                    "Is-sāʿa tlāte.",
                                    "It’s three o’clock.")
                            ],
                            "Nicely answered.",
                            "Āh answers directly, and bas hallaʾ aḥsan reassures your friend that you feel better now.",
                            "That does not answer whether you got tired.",
                            "A yes-or-no question can start with āh or laʾ, then add a short detail.",
                            "Choose the response that begins with ‘yes.’"),
                        CreateStep(
                            "make-plan",
                            "Finish by answering about tomorrow.",
                            new LessonPrompt(
                                "شو رح تعمل بكرا؟",
                                "Shū raḥ tiʿmal bukra?",
                                "What will you do tomorrow?",
                                null),
                            [
                                new LessonAnswer(
                                    "a",
                                    "رح أزور أهلي بعد الشغل.",
                                    "Raḥ azūr ahli baʿd ish-shughl.",
                                    "I’ll visit my family after work."),
                                new LessonAnswer(
                                    "b",
                                    "كان يوم طويل.",
                                    "Kān yōm ṭawīl.",
                                    "It was a long day."),
                                new LessonAnswer(
                                    "c",
                                    "بحب القهوة.",
                                    "Baḥibb il-ʾahwe.",
                                    "I like coffee.")
                            ],
                            "You made a plan.",
                            "Raḥ marks a future action, and bukra in the question tells you the answer should be about tomorrow.",
                            "That sentence is natural, but its time or purpose does not match the question.",
                            "Listen for raḥ and bukra—the question asks about a future plan.",
                            "Choose the answer that begins with raḥ, ‘will.’")
                    ],
                    6,
                    "seed-2026-09-02"))
        };

    public DashboardResponse GetDashboard() => _dashboard;

    public LessonResponse GetInitialLesson() => _lessons["levantine-day-01"].Response;

    public LessonDefinition? FindLesson(string lessonId) =>
        _lessons.GetValueOrDefault(lessonId);

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
