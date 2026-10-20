using Ismi.Api.Models;

namespace Ismi.Api.Services;

public static class LanguageSupportValidator
{
    public static bool HasShape(LessonLanguageSupport? support) => support is null || support is
        { Phrases: not null, References: not null, UsageNotes: not null }
        && support.Phrases.All(p => p is { Functions: not null, SourceLocators: not null }
            && p.Functions.All(f => f is { ReferenceIds: not null }))
        && support.References.All(r => r is { SearchTerms: not null, ExampleCardIndexes: not null, SourceLocators: not null })
        && support.UsageNotes.All(n => n is { TeachingCardIndexes: not null, SourceLocators: not null });

    public static void Validate(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources,
        bool forPublication, List<string> errors)
    {
        if (lesson.LanguageSupport is not { } support) return;
        var cards = lesson.Introduction?.TeachingCards ?? [];
        if (lesson.TrackId != "levantine" || lesson.ReviewStatus == "demonstrative" || cards.Count == 0)
            errors.Add("Phrase anatomy requires source-linked Levantine teaching cards.");
        if (support.ReviewDisposition is not ("pending" or "accepted"))
            errors.Add("Language support review must be pending or accepted.");
        if ((forPublication || support.ReviewDisposition == "accepted")
            && (support.ReviewDisposition != "accepted" || string.IsNullOrWhiteSpace(support.Reviewer)))
            errors.Add("Phrase anatomy, literal glosses, grammar and usage notes require recorded human acceptance before publication.");
        if (support.Phrases.Count is < 1 or > 12 || support.References.Count is < 1 or > 12 || support.UsageNotes.Count > 12)
            errors.Add("Language support must contain one to twelve phrases/references and at most twelve usage notes.");
        if (support.Phrases.Select(p => p.TeachingCardIndex).Distinct().Count() != support.Phrases.Count)
            errors.Add("Phrase anatomy teaching-card indexes must be unique.");
        var ids = support.References.Select(r => r.Id).ToHashSet(StringComparer.Ordinal);
        if (ids.Count != support.References.Count || support.UsageNotes.Select(n => n.Id).Distinct().Count() != support.UsageNotes.Count)
            errors.Add("Grammar and usage-note IDs must be unique.");
        bool Card(int i) => i >= 0 && i < cards.Count;
        bool Phrase(int i) => support.Phrases.Any(p => p.TeachingCardIndex == i);
        void Provenance(IReadOnlyList<string> locators)
        {
            if (locators.Count == 0 || locators.Any(l => string.IsNullOrWhiteSpace(l) || !sources.Any(s => s.Locator == l)))
                errors.Add("Language support must link to supplied versioned provenance sources.");
        }
        void Contexts(IReadOnlyList<int> indexes)
        {
            if (indexes.Count == 0 || indexes.Distinct().Count() != indexes.Count || indexes.Any(i => !Card(i) || !Phrase(i)))
                errors.Add("Language support contexts must reference distinct anatomy teaching cards.");
        }
        foreach (var phrase in support.Phrases)
        {
            Provenance(phrase.SourceLocators);
            if (!Card(phrase.TeachingCardIndex) || string.IsNullOrWhiteSpace(phrase.LiteralMeaning))
                errors.Add("Phrase anatomy requires an existing teaching card and a contextual literal meaning.");
            var chunks = Card(phrase.TeachingCardIndex) ? cards[phrase.TeachingCardIndex].Chunks.Count : 0;
            if (phrase.Functions.Count == 0 || phrase.Functions.Select(f => f.ChunkIndex).Distinct().Count() != phrase.Functions.Count
                || phrase.Functions.Any(f => f.ChunkIndex < 0 || f.ChunkIndex >= chunks || string.IsNullOrWhiteSpace(f.Label)
                    || f.ReferenceIds.Distinct().Count() != f.ReferenceIds.Count || f.ReferenceIds.Any(id => !ids.Contains(id))))
                errors.Add("Phrase functions require distinct existing chunks, text labels and valid grammar links.");
            foreach (var function in phrase.Functions)
                foreach (var id in function.ReferenceIds)
                    if (support.References.FirstOrDefault(r => r.Id == id) is { } reference
                        && !reference.ExampleCardIndexes.Contains(phrase.TeachingCardIndex))
                        errors.Add("A linked grammar reference must include this phrase as a teaching context.");
        }
        foreach (var reference in support.References)
        {
            if (new[] { reference.Id, reference.Title, reference.Explanation }.Any(string.IsNullOrWhiteSpace)
                || reference.Id.Length > 100 || reference.SearchTerms.Any(string.IsNullOrWhiteSpace))
                errors.Add("Grammar references require stable IDs, titles, explanations and nonblank search terms.");
            Provenance(reference.SourceLocators);
            Contexts(reference.ExampleCardIndexes);
            if (!support.Phrases.Any(p => p.Functions.Any(f => f.ReferenceIds.Contains(reference.Id))))
                errors.Add("Every grammar reference must be linked from a phrase function.");
        }
        foreach (var note in support.UsageNotes)
        {
            if (string.IsNullOrWhiteSpace(note.Id) || note.Id.Length > 100 || string.IsNullOrWhiteSpace(note.Text))
                errors.Add("Usage notes need stable IDs and situational text.");
            Provenance(note.SourceLocators);
            Contexts(note.TeachingCardIndexes);
        }
    }
}
