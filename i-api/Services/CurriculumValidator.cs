using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class CurriculumValidator
{
    public CurriculumValidationResult Validate(
        LessonResponse lesson,
        IReadOnlyCollection<CurriculumSourceInput> sources)
    {
        var errors = new List<string>();

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
        if (lesson.ReviewStatus is not ("demonstrative" or "reviewed"))
        {
            errors.Add("Review status must be 'demonstrative' or 'reviewed'.");
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
