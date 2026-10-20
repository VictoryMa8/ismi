using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ismi.Api.Tests;

public sealed class LanguageSupportTests
{
    [Fact]
    public async Task AnatomyDraftRequiresAcceptanceAndKeepsImmutablePublicationHistory()
    {
        var database = Path.Combine(Path.GetTempPath(), $"ismi-anatomy-{Guid.NewGuid():N}.db");
        try
        {
            using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Development");
                builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(
                    new Dictionary<string, string?> { ["Database:Path"] = database, ["Recordings:Path"] = database + "-recordings" }));
            });
            using var client = factory.CreateClient();
            using var scope = factory.Services.CreateScope();
            var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
            var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
            var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
            var package = JsonSerializer.Deserialize<CurriculumDraftRequest>(await File.ReadAllTextAsync(
                Path.Combine(AppContext.BaseDirectory, "phrase-anatomy", "01-lesson.json")), options)!;
            var lesson = package.Lesson;
            var support = lesson.LanguageSupport!;
            Assert.Equal(6, support.Phrases.Count);
            Assert.Equal(2, support.References.Count);
            Assert.Equal(3, support.UsageNotes.Count);
            Assert.True(validator.ValidateDraft(lesson, package.Sources).IsValid);
            Assert.False(validator.Validate(lesson, package.Sources).IsValid);
            var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
            var path = Path.Combine(AppContext.BaseDirectory, "phrase-anatomy");
            Assert.Single(await importer.ImportAsync(path));
            Assert.StartsWith("Unchanged:", Assert.Single(await importer.ImportAsync(path)));
            var draft = (await publishing.ListAsync()).Single(v => v.LessonId == lesson.Id);
            Assert.Null(await publishing.FindPublishedLessonAsync(lesson.Id));
            await Assert.ThrowsAsync<CurriculumValidationException>(() => publishing.ApproveAsync(draft.Id, "test actor"));
            var detail = (await publishing.GetAsync(draft.Id))!;
            Assert.Null(detail.ApprovedBy);
            Assert.Null(detail.PublishedBy);
            foreach (var invalid in new[] {
                support with { Phrases = null! }, support with { References = [null!] },
                support with { UsageNotes = [null!] }, support with { Phrases = [support.Phrases[0] with { Functions = [null!] }] },
                support with { Phrases = [support.Phrases[0] with { TeachingCardIndex = 900 }] },
                support with { Phrases = [support.Phrases[0], support.Phrases[0]] },
                support with { Phrases = [support.Phrases[0] with { LiteralMeaning = "" }] },
                support with { Phrases = [support.Phrases[0] with { Functions = [new(999, "label", [])] }] },
                support with { Phrases = [support.Phrases[0] with { Functions = [new(0, "", [])] }] },
                support with { Phrases = [support.Phrases[0] with { Functions = [new(0, "label", ["missing"])] }] },
                support with { References = [support.References[0] with { SourceLocators = ["missing"] }] },
                support with { References = [support.References[0] with { ExampleCardIndexes = [999] }] },
                support with { UsageNotes = [support.UsageNotes[0] with { TeachingCardIndexes = [] }] },
                support with { UsageNotes = [support.UsageNotes[0] with { SourceLocators = [] }] },
                support with { ReviewDisposition = "expert-reviewed" },
                support with { ReviewDisposition = "accepted", Reviewer = "" }
            }) Assert.False(validator.ValidateDraft(lesson with { LanguageSupport = invalid }, package.Sources).IsValid);

            // Acceptance below is exclusively a disposable test fixture, never a content review record.
            var accepted = lesson with { LanguageSupport = support with { ReviewDisposition = "accepted", Reviewer = "Test-only acceptance" } };
            Assert.True(validator.Validate(accepted, package.Sources).IsValid);
            await publishing.UpdateDraftAsync(draft.Id, package with { Lesson = accepted }, "test");
            Assert.Equal(CurriculumStatuses.Approved, (await publishing.ApproveAsync(draft.Id, "test")).Status);
            Assert.Equal(CurriculumStatuses.Published, (await publishing.PublishAsync(draft.Id, "test")).Status);
            var published = (await publishing.FindPublishedLessonAsync(lesson.Id))!.Response;
            Assert.Equal(JsonSerializer.Serialize(accepted.LanguageSupport, options), JsonSerializer.Serialize(published.LanguageSupport, options));
            var revision = await publishing.CreateDraftAsync(package with { Lesson = accepted with { LanguageSupport = accepted.LanguageSupport! with {
                References = accepted.LanguageSupport.References.Select(r => r with { Title = r.Title + " revised" }).ToArray() } } }, "test");
            Assert.Equal(CurriculumStatuses.Approved, (await publishing.ApproveAsync(revision.Id, "test")).Status);
            Assert.Equal(CurriculumStatuses.Published, (await publishing.PublishAsync(revision.Id, "test")).Status);
            await publishing.RollbackAsync(lesson.Id, draft.Id, "test");
            Assert.Equal(published.LanguageSupport!.References[0].Title,
                (await publishing.FindPublishedLessonAsync(lesson.Id))!.Response.LanguageSupport!.References[0].Title);
            Assert.Contains((await publishing.GetAsync(draft.Id))!.Audit, a => a.Action == "published");
        }
        finally
        {
            foreach (var suffix in new[] { "", "-shm", "-wal" }) if (File.Exists(database + suffix)) File.Delete(database + suffix);
            if (Directory.Exists(database + "-recordings")) Directory.Delete(database + "-recordings", true);
        }
    }
}
