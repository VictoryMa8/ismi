using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class CurriculumValidator(RecordingStore recordings)
{
    public CurriculumValidationResult Validate(
        LessonResponse lesson,
        IReadOnlyCollection<CurriculumSourceInput> sources)
    {
        var errors = new List<string>();
        if (!HasReadableShape(lesson, sources))
            return new(false, ["The package has missing or null lesson, step, answer, dialogue, or source fields."]);

        CharacterRegistry.Validate(lesson, errors);

        Required(errors, lesson.Id, "Lesson ID is required.");
        if (lesson.Id.Length > 100) errors.Add("Lesson ID cannot exceed 100 characters.");
        if (!string.Equals(lesson.TrackId, "levantine", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("This checkpoint can publish only Levantine lessons. MSA and Quranic content remain gated.");
        }

        Required(errors, lesson.Title, "Lesson title is required.");
        Required(errors, lesson.Scenario, "Lesson scenario is required.");
        Required(errors, lesson.UnitId, "Unit ID is required.");
        Required(errors, lesson.UnitTitle, "Unit title is required.");
        if (lesson.CourseOrder < 1) errors.Add("Course order must be 1 or greater.");
        if (lesson.ReviewStatus is not ("demonstrative" or "reviewed" or "owner-review"))
        {
            errors.Add("Review status must be 'demonstrative', 'reviewed', or 'owner-review' (no expert review claimed).");
        }
        if (lesson.EstimatedMinutes is < 1 or > 30)
        {
            errors.Add("Estimated minutes must be between 1 and 30.");
        }

        if (lesson.Steps.Count == 0) errors.Add("At least one lesson step is required.");
        DuplicateErrors(errors, lesson.Steps.Select(step => step.Id), "step ID");

        for (var index = 0; index < lesson.Steps.Count; index++)
        {
            var step = lesson.Steps[index];
            var label = string.IsNullOrWhiteSpace(step.Id) ? $"Step {index + 1}" : $"Step '{step.Id}'";
            Required(errors, step.Id, $"{label} needs an ID.");
            Required(errors, step.Instruction, $"{label} needs an instruction.");
            Required(errors, step.Prompt.Arabic, $"{label} needs an Arabic prompt.");
            Required(errors, step.Prompt.Arabizi, $"{label} needs Arabizi/transliteration.");
            Required(errors, step.Prompt.Meaning, $"{label} needs an English meaning.");

            if (step.Prompt.AudioUrl is not null || step.Prompt.Recording is not null)
            {
                var recording = step.Prompt.Recording;
                if (recordings.Find(step.Prompt.AudioUrl) is null)
                    errors.Add($"{label} needs an uploaded recording asset.");
                if (recording is null)
                    errors.Add($"{label} needs recording metadata and provenance.");
                else
                {
                    Required(errors, recording.Transcript, $"{label} needs a recording transcript.");
                    if (recording.Transcript != step.Prompt.Arabic)
                        errors.Add($"{label}'s transcript must match the Arabic prompt exactly.");
                    Required(errors, recording.Speaker, $"{label} needs a speaker credit or pseudonym.");
                    Required(errors, recording.ReviewNotes, $"{label} needs recording review notes.");
                    if (recording.Dialect is not ("palestinian-urban" or "jordanian"))
                        errors.Add($"{label} needs a Palestinian urban or Jordanian dialect label.");
                    if (string.IsNullOrWhiteSpace(recording.SourceLocator) || !sources.Any(source =>
                        source.SourceType == "recording" && source.Locator == recording.SourceLocator &&
                        !string.IsNullOrWhiteSpace(source.Rights)))
                        errors.Add($"{label} needs a matching recording provenance source with permission for playback and offline distribution.");
                }
            }

            if (step.Answers.Count < 2) errors.Add($"{label} needs at least two answer choices.");
            DuplicateErrors(errors, step.Answers.Select(answer => answer.Id), $"answer ID in {label}");
            foreach (var answer in step.Answers)
            {
                Required(errors, answer.Id, $"Every answer in {label} needs an ID.");
                Required(errors, answer.Arabic, $"Answer '{answer.Id}' in {label} needs Arabic text.");
                Required(errors, answer.Arabizi, $"Answer '{answer.Id}' in {label} needs Arabizi/transliteration.");
                Required(errors, answer.Meaning, $"Answer '{answer.Id}' in {label} needs an English meaning.");
            }

            var evaluation = step.Evaluation;
            if (!step.Answers.Any(answer => string.Equals(
                    answer.Id,
                    evaluation.CorrectAnswerId,
                    StringComparison.OrdinalIgnoreCase)))
            {
                errors.Add($"{label}'s correct answer ID must match one of its answer choices.");
            }

            Required(errors, evaluation.CorrectTitle, $"{label} needs a correct-answer title.");
            Required(errors, evaluation.CorrectExplanation, $"{label} needs a reviewed correct-answer explanation.");
            Required(errors, evaluation.IncorrectTitle, $"{label} needs an incorrect-answer title.");
            Required(errors, evaluation.IncorrectExplanation, $"{label} needs a reviewed incorrect-answer explanation.");
            Required(errors, evaluation.RetryHint, $"{label} needs a retry hint.");
        }

        if (lesson.Introduction is { } introduction)
        {
            Required(errors, introduction.Goal, "A visible learning goal is required.");
            Required(errors, introduction.UsageNote, "A usage note is required.");
            Required(errors, introduction.DialectNote, "A dialect/address note is required.");
            Required(errors, introduction.RecordingNote, "Recording status and script instructions are required.");
            if (introduction.Dialogue.Count is < 4 or > 6) errors.Add("The dialogue must contain four to six turns.");
            if (introduction.Expressions.Count == 0) errors.Add("Introduce expressions from the dialogue.");
            foreach (var turn in introduction.Dialogue)
            {
                Required(errors, turn.Speaker, "Each dialogue turn needs a speaker.");
            }
            foreach (var line in introduction.Dialogue.Select(turn => turn.Line).Concat(introduction.Expressions))
            {
                Required(errors, line.Arabic, "Dialogue and expressions need Arabic.");
                Required(errors, line.Arabizi, "Dialogue and expressions need transliteration.");
                Required(errors, line.Meaning, "Dialogue and expressions need English meaning.");
            }
            if (introduction.TeachingCards is { } cards)
            {
                if (cards.Count is < 1 or > 12) errors.Add("Teaching cards must contain one to twelve focused phrases.");
                foreach (var card in cards)
                {
                    Required(errors, card.Title, "Teaching cards need a title.");
                    Required(errors, card.Note, "Teaching cards need a contextual teaching explanation.");
                    Required(errors, card.Phrase.Arabic, "Teaching cards need an Arabic phrase.");
                    Required(errors, card.Phrase.Arabizi, "Teaching cards need transliteration.");
                    Required(errors, card.Phrase.Meaning, "Teaching cards need an English meaning.");
                    if (card.RecallCue is not null) Required(errors, card.RecallCue, "Recall cues cannot be blank.");
                    if (card.SourceLocators is { } cardSources)
                    {
                        if (cardSources.Count == 0) errors.Add("Teaching-card sources cannot be empty.");
                        foreach (var locator in cardSources)
                            if (string.IsNullOrWhiteSpace(locator) || !sources.Any(source => source.Locator == locator))
                                errors.Add($"Teaching-card source '{locator}' is missing from provenance.");
                    }
                    if (card.Phrase.AudioUrl is not null || card.Phrase.Recording is not null)
                        errors.Add("Teaching-card recordings are not supported; use publication-validated exercise prompt recordings.");
                    if (card.Chunks.Count == 0) errors.Add("Teaching cards need phrase building blocks.");
                    foreach (var chunk in card.Chunks)
                    {
                        Required(errors, chunk.Arabic, "Phrase blocks need Arabic.");
                        Required(errors, chunk.Arabizi, "Phrase blocks need transliteration.");
                        Required(errors, chunk.Meaning, "Phrase blocks need contextual meaning.");
                    }
                }
            }
            if (introduction.SourceLocators.Count == 0) errors.Add("Teaching notes need source locators.");
            foreach (var locator in introduction.SourceLocators)
            {
                if (!sources.Any(source => source.Locator == locator)) errors.Add($"Teaching source '{locator}' is missing from provenance.");
            }
            if (lesson.Steps.Count is < 6 or > 10) errors.Add("A complete conversation lesson needs six to ten practice interactions.");
            foreach (var answer in lesson.Steps.SelectMany(step => step.Answers))
                Required(errors, answer.Rationale, $"Answer '{answer.Id}' needs a contextual rationale.");
        }
        if (lesson.ReviewStatus == "owner-review" && lesson.Introduction is null)
            errors.Add("Owner-review lesson packages require a dialogue and teaching notes.");

        if (sources.Count == 0) errors.Add("At least one provenance source is required.");
        for (var index = 0; index < sources.Count; index++)
        {
            var source = sources.ElementAt(index);
            var label = $"Source {index + 1}";
            Required(errors, source.SourceType, $"{label} needs a type.");
            Required(errors, source.Title, $"{label} needs a title.");
            Required(errors, source.Locator, $"{label} needs a stable URL, record ID, or internal locator.");
            Required(errors, source.Rights, $"{label} needs a rights or permission statement.");
        }

        return new CurriculumValidationResult(errors.Count == 0, errors);
    }

    public static bool HasReadableShape(LessonResponse? lesson, IReadOnlyCollection<CurriculumSourceInput>? sources) =>
        lesson is { Id: not null, TrackId: not null, Steps: not null }
        && sources is not null && sources.All(source => source is not null)
        && lesson.Steps.All(step => step is { Prompt: not null, Answers: not null, Evaluation: not null }
            && step.Answers.All(answer => answer is not null))
        && (lesson.Introduction is null || lesson.Introduction is
            { Dialogue: not null, Expressions: not null, SourceLocators: not null } introduction
            && introduction.Dialogue.All(turn => turn is { Line: not null })
            && introduction.Expressions.All(line => line is not null)
            && (introduction.TeachingCards is null || introduction.TeachingCards.All(card =>
                card is { Phrase: not null, Chunks: not null } && card.Chunks.All(chunk => chunk is not null))));

    private static void Required(List<string> errors, string? value, string message)
    {
        if (string.IsNullOrWhiteSpace(value)) errors.Add(message);
    }

    private static void DuplicateErrors(
        List<string> errors,
        IEnumerable<string> values,
        string label)
    {
        var duplicate = values
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .GroupBy(value => value, StringComparer.OrdinalIgnoreCase)
            .FirstOrDefault(group => group.Count() > 1);
        if (duplicate is not null) errors.Add($"Duplicate {label} '{duplicate.Key}'.");
    }
}
