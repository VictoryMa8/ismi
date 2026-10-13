using Ismi.Api.Models;

namespace Ismi.Api.Services;

public static class RecallValidator
{
    public static bool HasShape(IReadOnlyList<RecallTarget>? targets) => targets is null || targets.All(t =>
        t is { RequiredConcepts: not null, SourceLocators: not null, AcceptedAnswers: not null, KnownErrors: not null, Variants: not null }
        && t.AcceptedAnswers.Concat(t.KnownErrors).All(a => a is { ArabicVariants: not null, ArabiziVariants: not null })
        && t.Variants.All(v => v is not null));

    public static void Validate(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources, List<string> errors)
    {
        if (lesson.Recall is null) return;
        if (lesson.ReviewStatus == "demonstrative" || lesson.Introduction?.TeachingCards is null)
            errors.Add("Recall requires source-linked teaching content, not demonstration fixtures.");
        if (lesson.Recall.Count is < 1 or > 3) errors.Add("Recall needs one to three bounded targets per lesson.");
        if (lesson.Recall.Select(t => t.Id).Distinct(StringComparer.OrdinalIgnoreCase).Count() != lesson.Recall.Count)
            errors.Add("Recall target IDs must be unique.");
        foreach (var t in lesson.Recall)
        {
            if (new[] { t.Id, t.Intent, t.Register, t.Hint }.Any(string.IsNullOrWhiteSpace)
                || t.Id.Length > 100 || t.Dialect is not ("palestinian-urban" or "jordanian"))
                errors.Add("Recall needs an ID, intent, dialect, register and hint.");
            if (t.RequiredConcepts.Count == 0 || t.RequiredConcepts.Any(string.IsNullOrWhiteSpace))
                errors.Add("Recall must state required concepts.");
            if (t.SourceLocators.Count == 0 || t.SourceLocators.Any(s => !sources.Any(source => source.Locator == s)))
                errors.Add("Recall must link to supplied provenance.");
            if (t.AcceptedAnswers.Count is < 1 or > 10) errors.Add("Recall needs bounded accepted responses.");
            if (t.Variants.Count != 2 || t.Variants.Count(v => v.ReservedForLater) != 1
                || t.Variants.Select(v => v.Id).Distinct(StringComparer.OrdinalIgnoreCase).Count() != t.Variants.Count
                || t.Variants.Any(v => string.IsNullOrWhiteSpace(v.Id) || v.Id.Length > 100 || string.IsNullOrWhiteSpace(v.Situation)))
                errors.Add("Recall needs two distinct situations, one reserved for later.");
            foreach (var answer in t.AcceptedAnswers.Concat(t.KnownErrors))
            {
                if (new[] { answer.Arabic, answer.Arabizi, answer.Meaning, answer.Rationale }.Any(string.IsNullOrWhiteSpace)
                    || answer.ArabicVariants.Concat(answer.ArabiziVariants).Any(string.IsNullOrWhiteSpace))
                    errors.Add("Recall responses need text, meaning, rationale and nonblank authored alternatives.");
            }
            foreach (var mode in new[] { "arabic", "arabizi" })
            {
                var accepted = t.AcceptedAnswers.SelectMany(a => RecallEvaluator.Forms(a, mode)).Select(RecallEvaluator.Normalize).ToHashSet();
                if (accepted.Contains("") || t.KnownErrors.SelectMany(a => RecallEvaluator.Forms(a, mode)).Select(RecallEvaluator.Normalize).Any(accepted.Contains))
                    errors.Add("Recall accepted forms cannot be empty or conflict with known errors after normalization.");
            }
            foreach (var answer in t.AcceptedAnswers)
                if (lesson.Introduction?.TeachingCards?.Any(c => c.Phrase.Arabic == answer.Arabic
                    && c.Phrase.Arabizi == answer.Arabizi && c.Phrase.Meaning == answer.Meaning) != true)
                    errors.Add("This recall slice must copy accepted models exactly from its lesson's teaching cards.");
        }
    }
}
