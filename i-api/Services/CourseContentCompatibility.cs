using Ismi.Api.Models;

namespace Ismi.Api.Services;

public static class CourseContentCompatibility
{
    // Validation adapter only; never rewrites stored/immutable publications.
    private static LessonPrompt Prompt(LessonPrompt p) => p with
        { Arabic = p.TargetText ?? p.Arabic, Arabizi = p.PronunciationHelp ?? p.Arabizi };
    public static LessonResponse Readable(LessonResponse lesson) => lesson with {
        Steps = lesson.Steps.Select(s => s with {
            Prompt = Prompt(s.Prompt),
            Answers = s.Answers.Select(a => a with { Arabic = a.TargetText ?? a.Arabic,
                Arabizi = a.PronunciationHelp ?? a.Arabizi }).ToArray()
        }).ToArray(),
        Introduction = lesson.Introduction is not { } i ? null : i with {
            Dialogue = i.Dialogue.Select(t => t with { Line = Prompt(t.Line) }).ToArray(),
            Expressions = i.Expressions.Select(Prompt).ToArray(),
            TeachingCards = i.TeachingCards?.Select(c => c with { Phrase = Prompt(c.Phrase),
                Chunks = c.Chunks.Select(b => b with { Arabic = b.TargetText ?? b.Arabic,
                    Arabizi = b.PronunciationHelp ?? b.Arabizi }).ToArray() }).ToArray()
        },
        Vocabulary = lesson.Vocabulary?.Select(v => v with { Arabic = v.TargetText ?? v.Arabic,
            Arabizi = v.PronunciationHelp ?? v.Arabizi }).ToArray()
    };

    public static void ValidateProfile(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources, List<string> errors,
        bool forPublication = true)
    {
        var course = CourseCatalog.Find(lesson.TrackId);
        if (course is null) { errors.Add("Unknown course ID."); return; }
        if (lesson.SchemaVersion is not (1 or 2)) errors.Add("Unsupported lesson schema version.");
        var texts = lesson.Steps.Select(s => (s.Prompt.Arabic, s.Prompt.TargetText, s.Prompt.Arabizi, s.Prompt.PronunciationHelp))
            .Concat(lesson.Steps.SelectMany(s => s.Answers).Select(a => (a.Arabic, a.TargetText, a.Arabizi, a.PronunciationHelp)))
            .Concat(lesson.Introduction?.Dialogue.Select(t => (t.Line.Arabic, t.Line.TargetText, t.Line.Arabizi, t.Line.PronunciationHelp)) ?? [])
            .Concat(lesson.Introduction?.Expressions.Select(p => (p.Arabic, p.TargetText, p.Arabizi, p.PronunciationHelp)) ?? [])
            .Concat(lesson.Introduction?.TeachingCards?.Select(c => (c.Phrase.Arabic, c.Phrase.TargetText, c.Phrase.Arabizi, c.Phrase.PronunciationHelp)) ?? [])
            .Concat(lesson.Introduction?.TeachingCards?.SelectMany(c => c.Chunks).Select(b => (b.Arabic, b.TargetText, b.Arabizi, b.PronunciationHelp)) ?? [])
            .Concat(lesson.Vocabulary?.Select(v => (v.Arabic, v.TargetText, v.Arabizi, v.PronunciationHelp)) ?? []);
        foreach (var (legacy, text, legacyHelp, help) in texts)
        {
            if (text is not null && !string.IsNullOrEmpty(legacy) && legacy != text
                || help is not null && !string.IsNullOrEmpty(legacyHelp) && legacyHelp != help)
                errors.Add("Legacy and neutral text fields must agree when both are supplied.");
            if (course.LanguageId != "arabic" && string.IsNullOrWhiteSpace(text))
                errors.Add("New-language packages require explicit targetText fields.");
        }
        if (course.LanguageId == "arabic") return;
        if (lesson.SchemaVersion != 2) errors.Add("New-language packages require schema version 2.");
        if (lesson.Recall?.Count > 0) errors.Add("Typed recall remains Arabic-specific until a course evaluator is reviewed.");
        if (lesson.ContentReview is not { } review) { errors.Add("New-language content needs a course review record."); return; }
        if (string.IsNullOrWhiteSpace(review.LanguageTag) || review.LanguageTag != course.Tag && !review.LanguageTag.StartsWith(course.Tag + "-", StringComparison.Ordinal))
            errors.Add("Review language does not match the course.");
        if (new[] { review.Variety, review.HelpConvention }.Any(string.IsNullOrWhiteSpace))
            errors.Add("Specify course variety and pronunciation-help convention.");
        if ((forPublication || review.ReviewDisposition == "accepted") && string.IsNullOrWhiteSpace(review.Reviewer))
            errors.Add("Record the actual linguistic reviewer before approval.");
        if (review.ReviewDisposition is not ("pending" or "accepted" or "changes-requested")
            || review.RightsDisposition is not ("pending" or "cleared" or "restricted"))
            errors.Add("Use an explicit pending/accepted/changes-requested review and pending/cleared/restricted rights disposition.");
        if (review.CriticalIssues is null)
            errors.Add("Record critical issues explicitly, including an empty list when none are known.");
        if (forPublication && (review.ReviewDisposition != "accepted" || review.RightsDisposition != "cleared"
            || review.CriticalIssues is null || review.CriticalIssues.Count > 0))
            errors.Add("Resolve critical linguistic/rights issues and record accepted review/cleared rights.");
        if (review.SourceLanguages is null || sources.Any(source => string.IsNullOrWhiteSpace(source.Locator) || !review.SourceLanguages.TryGetValue(source.Locator, out var tag) || tag != review.LanguageTag))
            errors.Add("Every source locator needs a matching language declaration in contentReview.sourceLanguages.");
        if (texts.Any(t => (t.Item2 ?? "").Any(ch => ch is >= '\u0600' and <= '\u06ff')))
            errors.Add("Arabic-script target text does not match this French/Khmer course profile.");
        if (forPublication && review.EngineeringFixture) errors.Add("Engineering fixtures cannot be approved or published.");
        if (forPublication && !sources.Any(s => s.SourceType == "linguistic-review" && !string.IsNullOrWhiteSpace(s.Notes)))
            errors.Add("A factual linguistic-review disposition source is required.");
        foreach (var answer in lesson.Steps.SelectMany(s => s.Answers))
        {
            if (string.IsNullOrWhiteSpace(answer.Rationale)) errors.Add("Every answer needs a reviewed contextual rationale.");
            if (answer.Segments is { } segments && (segments.Count == 0 || segments.Any(string.IsNullOrEmpty)
                || string.Concat(segments) != answer.TargetText))
                errors.Add("Authored answer segments must recombine to exact target text, including spaces.");
            if (course.Id == "khmer" && answer.Segments is null)
                errors.Add("Khmer answers require authored segments; whitespace is not a word boundary.");
        }
    }
}
