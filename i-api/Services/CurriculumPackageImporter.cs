using System.Text.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;

namespace Ismi.Api.Services;

// Explicit local maintenance command. Never runs on ordinary startup, approves,
// publishes, or silently replaces drafts. Explicit updates are limited to drafts
// previously created by this importer. The web console remains the publish gate.
public sealed class CurriculumPackageImporter(
    IsmiDbContext database,
    CurriculumPublishingService publishing,
    CurriculumValidator validator)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<IReadOnlyList<string>> ImportAsync(string path, bool updateImportedDrafts = false, CancellationToken cancellationToken = default)
    {
        var files = Directory.Exists(path)
            ? Directory.GetFiles(path, "*-lesson.json").Order(StringComparer.Ordinal).ToArray()
            : [path];
        if (files.Length == 0) throw new InvalidOperationException("No *-lesson.json packages found.");
        var packages = new List<CurriculumDraftRequest>();
        foreach (var file in files)
        {
            var package = JsonSerializer.Deserialize<CurriculumDraftRequest>(
                await File.ReadAllTextAsync(file, cancellationToken), JsonOptions)
                ?? throw new InvalidOperationException($"Empty package: {file}");
            var validation = validator.Validate(package.Lesson, package.Sources);
            if (!validation.IsValid)
                throw new InvalidOperationException($"{file}: {string.Join("; ", validation.Errors)}");
            packages.Add(package);
        }
        if (packages.Select(package => package.Lesson.Id).Distinct(StringComparer.OrdinalIgnoreCase).Count() != packages.Count)
            throw new InvalidOperationException("Duplicate lesson IDs in import batch.");

        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        var summaries = await publishing.ListAsync(cancellationToken);
        var result = new List<string>();
        foreach (var package in packages)
        {
            var existing = summaries.Where(item => item.LessonId == package.Lesson.Id)
                .OrderByDescending(item => item.VersionNumber).FirstOrDefault();
            if (existing is not null)
            {
                var detail = (await publishing.GetAsync(existing.Id, cancellationToken))!;
                var previous = new CurriculumDraftRequest(detail.Lesson with { Version = "" }, detail.Sources);
                var incoming = package with { Lesson = package.Lesson with { Version = "" } };
                if (JsonSerializer.Serialize(previous, JsonOptions) == JsonSerializer.Serialize(incoming, JsonOptions))
                {
                    result.Add($"Unchanged: {existing.LessonId} v{existing.VersionNumber}, record {existing.Id}, {existing.Status}");
                    continue;
                }
                if (updateImportedDrafts && detail.Status == CurriculumStatuses.Draft && detail.CreatedBy == "local package import")
                {
                    await publishing.UpdateDraftAsync(detail.Id, package, "local package import", cancellationToken);
                    await publishing.ValidateAsync(detail.Id, "local package import", cancellationToken);
                    result.Add($"Updated imported draft: {detail.Lesson.Id} v{detail.VersionNumber}, record {detail.Id}, draft");
                    continue;
                }
            }
            var draft = await publishing.CreateDraftAsync(package, "local package import", cancellationToken);
            await publishing.ValidateAsync(draft.Id, "local package import", cancellationToken);
            result.Add($"Imported: {draft.Lesson.Id} v{draft.VersionNumber}, record {draft.Id}, {draft.Status}");
        }
        await transaction.CommitAsync(cancellationToken);
        return result;
    }
}
