using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ismi.Api.Tests;

public sealed class TransliterationDraftTests
{
    [Fact]
    public async Task CorrectionsValidateImportPrivatelyAndPreservePriorVersions()
    {
        var database = Path.Combine(Path.GetTempPath(), $"ismi-transliteration-{Guid.NewGuid():N}.db");
        try
        {
            using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Development");
                builder.ConfigureAppConfiguration((_, configuration) => configuration.AddInMemoryCollection(
                    new Dictionary<string, string?> { ["Database:Path"] = database, ["Recordings:Path"] = database + "-recordings" }));
            });
            using var guest = factory.CreateClient();
            using var scope = factory.Services.CreateScope();
            var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
            var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
            var evaluator = new LessonEvaluator();
            var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var basePath = Path.Combine(AppContext.BaseDirectory, "pilot-release");
            var candidatePath = Path.Combine(AppContext.BaseDirectory, "transliteration-audit");
            await importer.ImportAsync(basePath);
            var originals = (await publishing.ListAsync()).Where(v => v.LessonId.StartsWith("levantine-everyday-")).ToList();
            Assert.Equal(7, originals.Count);
            // Reproduce the hosted predecessor state only in this disposable DB.
            foreach (var original in originals)
            {
                await publishing.ApproveAsync(original.Id, "test predecessor approval");
                await publishing.PublishAsync(original.Id, "test predecessor publication");
            }
            var snapshots = new Dictionary<long, string>();
            foreach (var original in originals)
                snapshots[original.Id] = JsonSerializer.Serialize((await publishing.GetAsync(original.Id))!.Lesson, options);
            Assert.Equal(3, (await importer.ImportAsync(candidatePath)).Count);
            Assert.All(await importer.ImportAsync(candidatePath), line => Assert.StartsWith("Unchanged:", line));
            foreach (var number in new[] { 3, 5, 7 })
            {
                var id = $"levantine-everyday-01-{number:00}";
                var version = (await publishing.ListAsync()).Where(v => v.LessonId == id).MaxBy(v => v.VersionNumber)!;
                var detail = (await publishing.GetAsync(version.Id))!;
                Assert.Equal(CurriculumStatuses.Draft, detail.Status);
                Assert.Null(detail.ApprovedBy);
                Assert.Null(detail.PublishedBy);
                Assert.Contains(detail.Audit, entry => entry.Action == "validated");
                var publicLesson = JsonSerializer.Deserialize<LessonResponse>(await guest.GetStringAsync($"/api/lessons/{id}"), options)!;
                Assert.Equal(snapshots[originals.Single(v => v.LessonId == id).Id], JsonSerializer.Serialize(publicLesson, options));
                var prior = JsonSerializer.Deserialize<CurriculumDraftRequest>(await File.ReadAllTextAsync(Path.Combine(basePath, $"{number:00}-lesson.json")), options)!;
                var lesson = detail.Lesson;
                Assert.Equal(JsonSerializer.Serialize(prior.Lesson.Characters, options), JsonSerializer.Serialize(lesson.Characters, options));
                Assert.Equal(prior.Lesson.Steps.Select(s => s.Id), lesson.Steps.Select(s => s.Id));
                Assert.Equal(prior.Lesson.Steps.Select(s => s.Evaluation.CorrectAnswerId), lesson.Steps.Select(s => s.Evaluation.CorrectAnswerId));
                var serialized = JsonSerializer.Serialize(lesson, options);
                Assert.DoesNotContain("mnīḥīn", serialized.ToLowerInvariant());
                Assert.DoesNotContain("منيحين", serialized);
                foreach (var step in lesson.Steps)
                {
                    var previous = prior.Lesson.Steps.Single(s => s.Id == step.Id);
                    Assert.Equal(previous.Characters, step.Characters);
                    foreach (var answer in step.Answers)
                    {
                        Assert.Equal(answer.Id == step.Evaluation.CorrectAnswerId, evaluator.Evaluate(step, answer.Id).IsCorrect);
                        var oldRationale = previous.Answers.Single(a => a.Id == answer.Id).Rationale!
                            .Replace("Mnīḥīn", "Mnāḥ").Replace("mnīḥīn", "mnāḥ");
                        Assert.StartsWith(oldRationale, answer.Rationale);
                    }
                }
                if (number is 5 or 7)
                    Assert.Contains(lesson.Steps.SelectMany(s => s.Answers), a => a.Arabic == "مناح، شكراً." && a.Arabizi == "Mnāḥ, shukran.");
                if (number is 3 or 7)
                {
                    Assert.Contains("aw as in English “how”", lesson.Introduction!.DialectNote);
                    foreach (var step in lesson.Steps)
                    foreach (var answer in step.Answers.Where(a => a.Arabizi.Contains("law ")))
                    {
                        var old = prior.Lesson.Steps.Single(s => s.Id == step.Id).Answers.Single(a => a.Id == answer.Id);
                        Assert.Equal(old.Arabic, answer.Arabic);
                        Assert.Equal(old.Arabizi, answer.Arabizi);
                    }
                }
                Assert.NotEmpty(lesson.Vocabulary!);
                foreach (var word in lesson.Vocabulary!)
                {
                    var card = lesson.Introduction!.TeachingCards![word.TeachingCardIndex];
                    Assert.Equal(card.Note, word.Note);
                    Assert.Contains(word.Arabic, card.Chunks.Select(c => c.Arabic).Append(card.Phrase.Arabic));
                    Assert.Contains(word.Arabizi, card.Chunks.Select(c => c.Arabizi).Append(card.Phrase.Arabizi));
                }
            }
            foreach (var original in originals)
                Assert.Equal(snapshots[original.Id], JsonSerializer.Serialize((await publishing.GetAsync(original.Id))!.Lesson, options));
        }
        finally
        {
            foreach (var suffix in new[] { "", "-wal", "-shm" }) File.Delete(database + suffix);
            if (Directory.Exists(database + "-recordings")) Directory.Delete(database + "-recordings", true);
        }
    }
}
