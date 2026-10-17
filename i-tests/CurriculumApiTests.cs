using System.Net;
using System.Net.Http.Json;
using Ismi.Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ismi.Api.Services;

namespace Ismi.Api.Tests;

public sealed class CurriculumApiTests : IAsyncLifetime
{
    private readonly string _databasePath = Path.Combine(
        Path.GetTempPath(),
        $"ismi-curriculum-tests-{Guid.NewGuid():N}.db");
    private WebApplicationFactory<Program> _factory = null!;

    public Task InitializeAsync()
    {
        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Development");
            builder.ConfigureAppConfiguration((_, configuration) =>
                configuration.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Database:Path"] = _databasePath,
                    ["Recordings:Path"] = _databasePath + "-recordings",
                    ["Curriculum:ApproverEmail"] = "owner@example.test"
                }));
        });
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        _factory.Dispose();
        if (Directory.Exists(_databasePath + "-recordings")) Directory.Delete(_databasePath + "-recordings", true);
        DeleteDatabaseFile(_databasePath);
        DeleteDatabaseFile($"{_databasePath}-shm");
        DeleteDatabaseFile($"{_databasePath}-wal");
        return Task.CompletedTask;
    }

    [Fact]
    public async Task VocabularyRequiresAuthoredContextAndProvenanceAndSurvivesPublication()
    {
        using var owner = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var options = new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web);
        var package = System.Text.Json.JsonSerializer.Deserialize<CurriculumDraftRequest>(
            await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "guided-teaching", "01-lesson.json")), options)!;
        Assert.DoesNotContain("\"vocabulary\"", System.Text.Json.JsonSerializer.Serialize(package.Lesson, options));
        var card = package.Lesson.Introduction!.TeachingCards![0];
        var entry = new LessonVocabulary("check-in", "casual", "expression", card.Phrase.Arabic,
            card.Phrase.Arabizi, card.Phrase.Meaning, "palestinian-urban", "conversational", [],
            card.Note, card.SourceLocators ?? package.Lesson.Introduction.SourceLocators, 0);
        var lesson = package.Lesson with { Vocabulary = [entry] };
        using var scope = _factory.Services.CreateScope();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        Assert.True(validator.Validate(lesson, package.Sources).IsValid);
        foreach (var invalid in new[] {
            entry with { Id = "" }, entry with { SenseId = "" }, entry with { Meaning = "invented" },
            entry with { Dialect = "unknown" }, entry with { SourceLocators = ["missing"] },
            entry with { SourceLocators = [] }, entry with { TeachingCardIndex = -1 },
            entry with { TeachingCardIndex = 999 }, entry with { Forms = [""] }, entry with { Kind = "unknown" }
        }) Assert.False(validator.Validate(lesson with { Vocabulary = [invalid] }, package.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Vocabulary = [entry, entry] }, package.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Vocabulary = [entry with { Forms = null! }] }, package.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Vocabulary = [null!] }, package.Sources).IsValid);
        var response = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts",
            package with { Lesson = lesson });
        response.EnsureSuccessStatusCode();
        var detail = (await response.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{detail.Id}/approve", new { })).EnsureSuccessStatusCode();
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{detail.Id}/publish", new { })).EnsureSuccessStatusCode();
        var published = (await owner.GetFromJsonAsync<LessonResponse>($"/api/lessons/{lesson.Id}"))!;
        Assert.Equal(entry.Id, Assert.Single(published.Vocabulary!).Id);
        Assert.Equal(entry.SourceLocators, published.Vocabulary![0].SourceLocators);
    }

    [Fact]
    public async Task OwnerCanPublishAndRollbackWhileLearnersOnlySeePublishedVersions()
    {
        using var client = CreateClient();
        await RegisterAsync(client, "Owner", "owner@example.test");

        var versions = await client.GetFromJsonAsync<List<CurriculumVersionSummary>>(
            "/api/admin/curriculum/versions");
        Assert.NotNull(versions);
        Assert.Equal(6, versions.Count(version => version.Status == CurriculumStatuses.Published));
        var initial = versions.Single(version => version.LessonId == "levantine-day-01");
        Assert.Equal(CurriculumStatuses.Published, initial.Status);

        var initialDetail = await client.GetFromJsonAsync<CurriculumVersionDetail>(
            $"/api/admin/curriculum/versions/{initial.Id}");
        Assert.NotNull(initialDetail);
        var revisedLesson = initialDetail.Lesson with
        {
            Title = "Tell a friend about your day",
            Version = "ignored-client-version"
        };
        var source = new CurriculumSourceInput(
            "review-record",
            "Palestinian lesson review record",
            "internal:review/levantine-day-01/2026-09-03",
            "Cleared for the invite-only beta.",
            "Demonstrative test provenance.");

        var create = await SendWithCsrfAsync(
            client,
            HttpMethod.Post,
            "/api/admin/curriculum/drafts",
            new CurriculumDraftRequest(revisedLesson, [source]));
        Assert.Equal(HttpStatusCode.OK, create.StatusCode);
        var draft = await create.Content.ReadFromJsonAsync<CurriculumVersionDetail>();
        Assert.NotNull(draft);
        Assert.Equal(CurriculumStatuses.Draft, draft.Status);

        var beforePublish = await client.GetFromJsonAsync<LessonResponse>(
            "/api/lessons/levantine-day-01");
        Assert.NotNull(beforePublish);
        Assert.NotEqual(revisedLesson.Title, beforePublish.Title);

        var validate = await SendWithCsrfAsync(
            client,
            HttpMethod.Post,
            $"/api/admin/curriculum/versions/{draft.Id}/validate",
            new { });
        var validation = await validate.Content.ReadFromJsonAsync<CurriculumValidationResult>();
        Assert.True(validation?.IsValid);

        var approve = await SendWithCsrfAsync(
            client,
            HttpMethod.Post,
            $"/api/admin/curriculum/versions/{draft.Id}/approve",
            new { });
        Assert.Equal(HttpStatusCode.OK, approve.StatusCode);

        var publish = await SendWithCsrfAsync(
            client,
            HttpMethod.Post,
            $"/api/admin/curriculum/versions/{draft.Id}/publish",
            new { });
        Assert.Equal(HttpStatusCode.OK, publish.StatusCode);

        var published = await client.GetFromJsonAsync<LessonResponse>(
            "/api/lessons/levantine-day-01");
        Assert.NotNull(published);
        Assert.Equal(revisedLesson.Title, published.Title);
        Assert.Equal("curriculum-levantine-day-01-v2", published.Version);
        var dashboard = await client.GetFromJsonAsync<DashboardResponse>("/api/dashboard");
        Assert.Equal(
            revisedLesson.Title,
            dashboard!.Tracks.Single(track => track.Id == "levantine").CurrentLessonTitle);

        var editPublished = await SendWithCsrfAsync(
            client,
            HttpMethod.Put,
            $"/api/admin/curriculum/versions/{draft.Id}",
            new CurriculumDraftRequest(revisedLesson, [source]));
        Assert.Equal(HttpStatusCode.Conflict, editPublished.StatusCode);

        var rollback = await SendWithCsrfAsync(
            client,
            HttpMethod.Post,
            "/api/admin/curriculum/lessons/levantine-day-01/rollback",
            new CurriculumRollbackRequest(initial.Id));
        Assert.Equal(HttpStatusCode.OK, rollback.StatusCode);

        var restored = await client.GetFromJsonAsync<LessonResponse>(
            "/api/lessons/levantine-day-01");
        Assert.NotNull(restored);
        Assert.Equal(beforePublish.Title, restored.Title);
        Assert.Equal("curriculum-levantine-day-01-v1", restored.Version);
    }

    [Fact]
    public async Task NonApproverCannotAccessConsoleAndQuranicDraftCannotBeApproved()
    {
        using var nonApprover = CreateClient();
        await RegisterAsync(nonApprover, "Editor", "editor@example.test");
        var forbidden = await nonApprover.GetAsync("/api/admin/curriculum/versions");
        Assert.Equal(HttpStatusCode.Forbidden, forbidden.StatusCode);

        using var owner = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var initial = (await owner.GetFromJsonAsync<List<CurriculumVersionSummary>>(
            "/api/admin/curriculum/versions"))!
            .Single(version => version.LessonId == "levantine-day-01");
        var detail = await owner.GetFromJsonAsync<CurriculumVersionDetail>(
            $"/api/admin/curriculum/versions/{initial.Id}");
        Assert.NotNull(detail);
        var request = new CurriculumDraftRequest(
            detail.Lesson with { Id = "quranic-test-01", TrackId = "quranic" },
            [new CurriculumSourceInput("source", "Test source", "internal:test", "Test-only rights", "")]);

        var create = await SendWithCsrfAsync(
            owner,
            HttpMethod.Post,
            "/api/admin/curriculum/drafts",
            request);
        var draft = await create.Content.ReadFromJsonAsync<CurriculumVersionDetail>();
        Assert.NotNull(draft);

        var approve = await SendWithCsrfAsync(
            owner,
            HttpMethod.Post,
            $"/api/admin/curriculum/versions/{draft.Id}/approve",
            new { });
        Assert.Equal(HttpStatusCode.BadRequest, approve.StatusCode);
        var body = await approve.Content.ReadAsStringAsync();
        Assert.Contains("MSA and Quranic content remain gated", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ConversationPackagePreservesNotesAndRationalesBehindPublicationGate()
    {
        using var owner = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var fixture = new Ismi.Api.Services.SeedCurriculum().GetInitialLesson();
        var step = fixture.Steps[0];
        // Delivery fixture only: reuses existing demonstration language, not new curriculum.
        var lesson = fixture with
        {
            Id = "conversation-test",
            UnitId = "conversation-test-unit",
            ReviewStatus = "owner-review",
            Introduction = new LessonIntroduction(
                "Test goal", Enumerable.Range(0, 4).Select(index =>
                    new DialogueTurn($"Test speaker {index}", step.Prompt)).ToArray(),
                [step.Prompt], "Test usage note", "Test address note", "Test recording script",
                ["internal:test"]),
            Steps = Enumerable.Range(0, 6).Select(index => step with
            {
                Id = $"test-{index}",
                Answers = step.Answers.Select(answer => answer with
                {
                    Rationale = $"Contextual test rationale for {answer.Id}"
                }).Reverse().ToArray()
            }).ToArray()
        };
        var sources = new[] { new CurriculumSourceInput("test", "Test fixture", "internal:test", "Test only", "") };
        using var validationScope = _factory.Services.CreateScope();
        var validator = validationScope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        Assert.True(validator.Validate(lesson, sources).IsValid);
        Assert.False(validator.Validate(lesson with { Introduction = null }, sources).IsValid);
        Assert.False(validator.Validate(lesson, []).IsValid);
        Assert.False(validator.Validate(lesson with { Steps = [step] }, sources).IsValid);
        var created = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts",
            new CurriculumDraftRequest(lesson, sources));
        var draft = await created.Content.ReadFromJsonAsync<CurriculumVersionDetail>();
        Assert.NotNull(draft);
        using var guest = CreateClient();
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync("/api/lessons/conversation-test")).StatusCode);
        Assert.NotEqual(HttpStatusCode.OK,
            (await guest.GetAsync($"/api/admin/curriculum/versions/{draft.Id}")).StatusCode);
        var preview = await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{draft.Id}");
        Assert.Equal("Test usage note", preview!.Lesson.Introduction!.UsageNote);
        Assert.Equal(CurriculumStatuses.Draft, preview.Status);
        // Only this isolated test database receives synthetic approval/publication.
        Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post,
            $"/api/admin/curriculum/versions/{draft.Id}/approve", new { })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post,
            $"/api/admin/curriculum/versions/{draft.Id}/publish", new { })).StatusCode);
        var published = await guest.GetFromJsonAsync<LessonResponse>("/api/lessons/conversation-test");
        Assert.Equal(4, published!.Introduction!.Dialogue.Count);
        Assert.Equal("c", published.Steps[0].Answers[0].Id);
        var incorrect = new Ismi.Api.Services.LessonEvaluator().Evaluate(published.Steps[0], "b");
        Assert.False(incorrect.IsCorrect);
        Assert.Equal("Contextual test rationale for b", incorrect.Explanation);
        Assert.True(new Ismi.Api.Services.LessonEvaluator().Evaluate(published.Steps[0], "a").IsCorrect);
    }

    [Fact]
    public async Task CheckInRevisionsStayDraftsAndPreservePublishedContentAndTeachingCards()
    {
        using var scope = _factory.Services.CreateScope();
        var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
        var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        await importer.ImportAsync(Path.Combine(AppContext.BaseDirectory, "everyday-01"));
        var original = (await publishing.ListAsync()).Single(v => v.LessonId == "levantine-everyday-01-01");
        foreach (var version in (await publishing.ListAsync()).Where(v => v.LessonId.StartsWith("levantine-everyday-01-")))
        {
            await publishing.ApproveAsync(version.Id, "test only");
            await publishing.PublishAsync(version.Id, "test only");
        }
        var revised = await importer.ImportAsync(Path.Combine(AppContext.BaseDirectory, "check-in-v2"));
        Assert.Equal(4, revised.Count);
        Assert.All(revised, result => Assert.Contains("v2", result));
        var detail = await publishing.GetAsync((await publishing.ListAsync())
            .Single(v => v.LessonId == original.LessonId && v.VersionNumber == 2).Id);
        Assert.Equal(CurriculumStatuses.Draft, detail!.Status);
        Assert.Equal("شو عامل؟", detail.Lesson.Introduction!.Dialogue[0].Line.Arabic);
        Assert.Equal(6, detail.Lesson.Introduction.TeachingCards!.Count);
        Assert.Equal("what", detail.Lesson.Introduction.TeachingCards[0].Chunks[0].Meaning);
        using var guest = CreateClient();
        var published = await guest.GetFromJsonAsync<LessonResponse>("/api/lessons/levantine-everyday-01-01");
        Assert.Equal("كيف كان يومك؟", published!.Introduction!.Dialogue[0].Line.Arabic);
        var broken = detail.Lesson with { Introduction = detail.Lesson.Introduction with
        {
            TeachingCards = [detail.Lesson.Introduction.TeachingCards[0] with { Chunks = [] }]
        }};
        Assert.False(validator.Validate(broken, detail.Sources).IsValid);
        var unreadable = detail.Lesson with { Introduction = detail.Lesson.Introduction with
        {
            TeachingCards = [detail.Lesson.Introduction.TeachingCards[0] with { Phrase = null! }]
        }};
        Assert.False(validator.Validate(unreadable, detail.Sources).IsValid);
        // Teaching audio cannot bypass the existing prompt-recording publication gate.
        var audio = detail.Lesson with { Introduction = detail.Lesson.Introduction with
        {
            TeachingCards = [detail.Lesson.Introduction.TeachingCards[0] with
            { Phrase = detail.Lesson.Introduction.TeachingCards[0].Phrase with { AudioUrl = "/unreviewed.wav" } }]
        }};
        Assert.False(validator.Validate(audio, detail.Sources).IsValid);
    }

    [Fact]
    public async Task GuidedTeachingRevisionsPreserveHistoryAndValidatePhraseProvenance()
    {
        using var scope = _factory.Services.CreateScope();
        var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
        var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        await importer.ImportAsync(Path.Combine(AppContext.BaseDirectory, "everyday-01"));
        foreach (var version in (await publishing.ListAsync()).Where(v => v.LessonId.StartsWith("levantine-everyday-")))
        {
            await publishing.ApproveAsync(version.Id, "test only");
            await publishing.PublishAsync(version.Id, "test only");
        }
        var revised = await importer.ImportAsync(Path.Combine(AppContext.BaseDirectory, "guided-teaching"));
        Assert.Equal(7, revised.Count);
        Assert.All(await importer.ImportAsync(Path.Combine(AppContext.BaseDirectory, "guided-teaching")),
            line => Assert.StartsWith("Unchanged:", line));
        using var guest = CreateClient();
        foreach (var version in (await publishing.ListAsync()).Where(v => v.LessonId.StartsWith("levantine-everyday-") && v.VersionNumber == 2))
        {
            var detail = (await publishing.GetAsync(version.Id))!;
            Assert.Equal(CurriculumStatuses.Draft, detail.Status);
            Assert.Null(detail.ApprovedBy);
            Assert.All(detail.Lesson.Introduction!.TeachingCards!, card =>
            {
                Assert.False(string.IsNullOrWhiteSpace(card.RecallCue));
                Assert.NotEmpty(card.Chunks);
                Assert.NotEmpty(card.SourceLocators!);
            });
            var published = await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{version.LessonId}");
            Assert.EndsWith("-v1", published!.Version);
            var first = detail.Lesson.Introduction.TeachingCards![0];
            var unknown = detail.Lesson with { Introduction = detail.Lesson.Introduction with
            { TeachingCards = [first with { SourceLocators = ["internal:unknown"] }] } };
            Assert.False(validator.Validate(unknown, detail.Sources).IsValid);
            var empty = detail.Lesson with { Introduction = detail.Lesson.Introduction with
            { TeachingCards = [first with { SourceLocators = [], RecallCue = " " }] } };
            Assert.False(validator.Validate(empty, detail.Sources).IsValid);
        }
    }

    [Fact]
    public async Task SevenAuthoredPackagesImportIdempotentlyAndRequireApproval()
    {
        using var owner = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var directory = Path.Combine(AppContext.BaseDirectory, "everyday-01");
        using (var scope = _factory.Services.CreateScope())
        {
            var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
            var imported = await importer.ImportAsync(directory);
            Assert.Equal(7, imported.Count);
            Assert.All(imported, line => Assert.StartsWith("Imported:", line));
            var repeated = await importer.ImportAsync(directory);
            Assert.All(repeated, line => Assert.StartsWith("Unchanged:", line));
        }
        var versions = (await owner.GetFromJsonAsync<List<CurriculumVersionSummary>>("/api/admin/curriculum/versions"))!;
        var authored = versions.Where(version => version.LessonId.StartsWith("levantine-everyday-")).ToList();
        Assert.Equal(7, authored.Count);
        Assert.All(authored, version => Assert.Equal(CurriculumStatuses.Draft, version.Status));
        Assert.Equal(6, versions.Count(version => version.Status == CurriculumStatuses.Published));
        using var guest = CreateClient();
        foreach (var version in authored)
        {
            Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{version.LessonId}")).StatusCode);
            var detail = (await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{version.Id}"))!;
            Assert.Equal(8, detail.Lesson.Steps.Count);
            Assert.Equal(6, detail.Lesson.Introduction!.Dialogue.Count);
            Assert.Equal(3, detail.Lesson.Steps.Select(step => step.Evaluation.CorrectAnswerId).Distinct().Count());
            Assert.Null(detail.ApprovedBy);
            Assert.Null(detail.PublishedBy);
            Assert.Contains(detail.Audit, entry => entry.Action == "validated");
            Assert.Equal(HttpStatusCode.Conflict, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{version.Id}/publish", new { })).StatusCode);
            foreach (var step in detail.Lesson.Steps)
            {
                Assert.Equal(3, step.Answers.Select(answer => answer.Arabic + answer.Arabizi).Distinct().Count());
                foreach (var answer in step.Answers)
                {
                    var result = new LessonEvaluator().Evaluate(step, answer.Id);
                    Assert.Equal(answer.Id == step.Evaluation.CorrectAnswerId, result.IsCorrect);
                    Assert.False(string.IsNullOrWhiteSpace(answer.Rationale));
                    if (!result.IsCorrect) Assert.Equal(answer.Rationale, result.Explanation);
                }
            }
        }
        // Synthetic test approval/publication occurs only in this temporary test database.
        foreach (var version in authored)
        {
            Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{version.Id}/approve", new { })).StatusCode);
            Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{version.Id}/publish", new { })).StatusCode);
        }
        var dashboard = (await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.Equal(authored.Select(version => version.LessonId).Order(),
            dashboard.DailyPlan.Lessons.Take(7).Select(lesson => lesson.Id));
        Assert.Equal(13, dashboard.DailyPlan.Lessons.Count);
    }

    [Fact]
    public async Task PlanningUnitImportsPrivatelyAndPublishesAfterTheFirstUnit()
    {
        using var owner = CreateClient();
        using var guest = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        using var scope = _factory.Services.CreateScope();
        var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
        await importer.ImportAsync(Path.Combine(AppContext.BaseDirectory, "everyday-01"));
        var directory = Path.Combine(AppContext.BaseDirectory, "plans-02");
        Assert.Equal(3, (await importer.ImportAsync(directory)).Count);
        Assert.All(await importer.ImportAsync(directory), line => Assert.StartsWith("Unchanged:", line));
        var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
        var authored = (await publishing.ListAsync())
            .Where(v => v.LessonId.StartsWith("levantine-plans-02-")).ToList();
        Assert.Equal(3, authored.Count);
        foreach (var version in authored)
        {
            Assert.Equal(CurriculumStatuses.Draft, version.Status);
            Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{version.LessonId}")).StatusCode);
            Assert.Equal(HttpStatusCode.Conflict, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{version.Id}/publish", new { })).StatusCode);
            var detail = (await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{version.Id}"))!;
            Assert.Null(detail.ApprovedBy);
            Assert.Equal("owner-review", detail.Lesson.ReviewStatus);
            Assert.Equal(6, detail.Lesson.Introduction!.Dialogue.Count);
            Assert.Equal(5, detail.Lesson.Introduction.TeachingCards!.Count);
            Assert.Equal(6, detail.Lesson.Steps.Count);
            Assert.Contains(detail.Audit, entry => entry.Action == "validated");
            foreach (var step in detail.Lesson.Steps)
            {
                Assert.Null(step.Prompt.AudioUrl);
                Assert.Equal(3, step.Answers.Select(a => a.Arabic + a.Arabizi).Distinct().Count());
                foreach (var answer in step.Answers)
                {
                    var result = new LessonEvaluator().Evaluate(step, answer.Id);
                    Assert.Equal(answer.Id == step.Evaluation.CorrectAnswerId, result.IsCorrect);
                    Assert.False(string.IsNullOrWhiteSpace(answer.Rationale));
                    if (!result.IsCorrect) Assert.Equal(answer.Rationale, result.Explanation);
                }
            }
        }
        // Approval is synthetic and limited to this disposable test database.
        foreach (var version in (await publishing.ListAsync()).Where(v =>
            v.LessonId.StartsWith("levantine-everyday-01-") || v.LessonId.StartsWith("levantine-plans-02-")))
        {
            Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{version.Id}/approve", new { })).StatusCode);
            Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{version.Id}/publish", new { })).StatusCode);
        }
        var dashboard = (await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.Equal(Enumerable.Range(1, 7).Select(i => $"levantine-everyday-01-{i:00}")
            .Concat(Enumerable.Range(1, 3).Select(i => $"levantine-plans-02-{i:00}")),
            dashboard.DailyPlan.Lessons.Take(10).Select(l => l.Id));
    }

    [Fact]
    public async Task SyntheticAudioSurvivesDraftPreviewAndCannotPublishWithPendingRights()
    {
        using var owner = CreateClient();
        using var learner = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var csrf = await owner.GetFromJsonAsync<CsrfToken>("/api/auth/csrf");
        owner.DefaultRequestHeaders.Add("X-CSRF-TOKEN", csrf!.Token);
        var bytes = RecordingTests.Wave();
        var upload = await owner.PostAsync("/api/admin/curriculum/recordings", new ByteArrayContent(bytes));
        var url = (await upload.Content.ReadFromJsonAsync<RecordingUpload>())!.AudioUrl;
        owner.DefaultRequestHeaders.Remove("X-CSRF-TOKEN");
        var versions = (await owner.GetFromJsonAsync<List<CurriculumVersionSummary>>("/api/admin/curriculum/versions"))!;
        var detail = (await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{versions.First().Id}"))!;
        var step = detail.Lesson.Steps[0];
        var ssml = $"<speak xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"ar-JO\"><voice name=\"test-voice\">{System.Security.SecurityElement.Escape(step.Prompt.Arabic)}</voice></speak>";
        var synthesis = new SyntheticAudioProvenance("Test provider", "test-voice", "ar-JO", "test fixture", DateTimeOffset.UtcNow,
            ssml, Convert.ToHexStringLower(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(ssml))),
            url[16..^4], "accepted-fallback", "Synthetic transport fixture only.", "pending");
        var recording = new LessonRecording(step.Prompt.Arabic, "test-voice", "jordanian", url, "Synthetic fixture, not human or native review.", "ar-JO", "synthetic", synthesis);
        var lesson = detail.Lesson with { Id = "synthetic-draft-test", Introduction = null, Recall = null, Vocabulary = null, ReviewStatus = "demonstrative",
            Steps = [step with { Prompt = step.Prompt with { AudioUrl = url, Recording = recording } }] };
        CurriculumSourceInput[] sources = [new("recording", "Synthetic transport fixture", url, "Pending rights acceptance; not cleared.", "No real provider rights inferred.")];
        var response = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts", new CurriculumDraftRequest(lesson, sources));
        response.EnsureSuccessStatusCode();
        var draft = (await response.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
        Assert.Equal(recording, draft.Lesson.Steps[0].Prompt.Recording);
        var readinessResponse = await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/readiness", new { });
        var readiness = (await readinessResponse.Content.ReadFromJsonAsync<CurriculumReadinessResult>())!;
        Assert.True(readiness.Draft.IsValid, string.Join("; ", readiness.Draft.Errors));
        Assert.False(readiness.Publication.IsValid);
        Assert.Contains(readiness.Publication.Errors, e => e.Contains("synthetic playback"));
        Assert.Equal(bytes, await owner.GetByteArrayAsync(url));
        Assert.Equal(HttpStatusCode.NotFound, (await learner.GetAsync(url)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await learner.GetAsync("/api/lessons/synthetic-draft-test")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/approve", new { })).StatusCode);
        var saved = (await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{draft.Id}"))!;
        Assert.Equal(recording, saved.Lesson.Steps[0].Prompt.Recording);
    }

    [Fact]
    public async Task RecordingsRequireOwnerCsrfProvenanceAndPublication()
    {
        using var owner = CreateClient();
        using var learner = CreateClient();
        var bytes = RecordingTests.Wave();
        var unauthorized = await learner.PostAsync("/api/admin/curriculum/recordings", new ByteArrayContent(bytes));
        Assert.Equal(HttpStatusCode.Unauthorized, unauthorized.StatusCode);
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var noCsrf = await owner.PostAsync("/api/admin/curriculum/recordings", new ByteArrayContent(bytes));
        Assert.Equal(HttpStatusCode.BadRequest, noCsrf.StatusCode);
        var csrf = await owner.GetFromJsonAsync<CsrfToken>("/api/auth/csrf");
        owner.DefaultRequestHeaders.Add("X-CSRF-TOKEN", csrf!.Token);
        var invalid = await owner.PostAsync("/api/admin/curriculum/recordings", new ByteArrayContent([1, 2, 3]));
        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
        var upload = await owner.PostAsync("/api/admin/curriculum/recordings", new ByteArrayContent(bytes));
        Assert.Equal(HttpStatusCode.OK, upload.StatusCode);
        var url = (await upload.Content.ReadFromJsonAsync<RecordingUpload>())!.AudioUrl;
        var duplicate = await owner.PostAsync("/api/admin/curriculum/recordings", new ByteArrayContent(bytes));
        Assert.Equal(url, (await duplicate.Content.ReadFromJsonAsync<RecordingUpload>())!.AudioUrl);
        Assert.Equal(bytes, await owner.GetByteArrayAsync(url));
        Assert.Equal(HttpStatusCode.NotFound, (await learner.GetAsync(url)).StatusCode);
        owner.DefaultRequestHeaders.Remove("X-CSRF-TOKEN");

        var versions = (await owner.GetFromJsonAsync<List<CurriculumVersionSummary>>("/api/admin/curriculum/versions"))!;
        var original = versions.Single(v => v.LessonId == "levantine-day-01");
        var detail = (await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{original.Id}"))!;
        var step = detail.Lesson.Steps[0];
        var recording = new LessonRecording(step.Prompt.Arabic, "Test speaker", "palestinian-urban", url, "Test fixture only, no linguistic review claim.");
        var lesson = detail.Lesson with { Steps = [step with { Prompt = step.Prompt with { AudioUrl = url, Recording = recording } }] };
        var source = new CurriculumSourceInput("recording", "Synthetic silence fixture", url, "Test-only generated audio; playback and download permitted.", "Not speech or curriculum.");
        var draftResponse = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts", new CurriculumDraftRequest(lesson, detail.Sources));
        var draft = (await draftResponse.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
        var rejected = await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/approve", new { });
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
        Assert.Contains("recording provenance", await rejected.Content.ReadAsStringAsync());
        var mismatched = lesson with { Steps = [step with { Prompt = step.Prompt with { AudioUrl = url, Recording = recording with { Transcript = "different" } } }] };
        await SendWithCsrfAsync(owner, HttpMethod.Put, $"/api/admin/curriculum/versions/{draft.Id}", new CurriculumDraftRequest(mismatched, [source]));
        var badTranscript = await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/approve", new { });
        Assert.Equal(HttpStatusCode.BadRequest, badTranscript.StatusCode);
        await SendWithCsrfAsync(owner, HttpMethod.Put, $"/api/admin/curriculum/versions/{draft.Id}", new CurriculumDraftRequest(lesson, [source]));
        var approve = await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/approve", new { });
        Assert.Equal(HttpStatusCode.OK, approve.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await learner.GetAsync(url)).StatusCode);
        var publish = await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/publish", new { });
        Assert.Equal(HttpStatusCode.OK, publish.StatusCode);
        Assert.Equal(bytes, await learner.GetByteArrayAsync(url));
        using var range = new HttpRequestMessage(HttpMethod.Get, url);
        range.Headers.Range = new System.Net.Http.Headers.RangeHeaderValue(0, 43);
        var partial = await learner.SendAsync(range);
        Assert.Equal(HttpStatusCode.PartialContent, partial.StatusCode);
        Assert.Equal(44, (await partial.Content.ReadAsByteArrayAsync()).Length);
        var published = (await learner.GetFromJsonAsync<LessonResponse>("/api/lessons/levantine-day-01"))!;
        Assert.Equal(recording, published.Steps[0].Prompt.Recording);
        await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/lessons/levantine-day-01/rollback", new CurriculumRollbackRequest(original.Id));
        Assert.Equal(HttpStatusCode.NotFound, (await learner.GetAsync(url)).StatusCode);
    }

    [Fact]
    public async Task CharacterMetadataValidatesRoundTripsAndRollsBackWithoutChangingLanguage()
    {
        using var owner = CreateClient();
        using var guest = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var options = new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web);
        var baseline = System.Text.Json.JsonSerializer.Deserialize<CurriculumDraftRequest>(
            await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "guided-teaching", "01-lesson.json")), options)!;
        var originalResponse = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts", baseline);
        var original = (await originalResponse.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
        await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{original.Id}/approve", new { });
        await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{original.Id}/publish", new { });
        using var scope = _factory.Services.CreateScope();
        var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        var path = Path.Combine(AppContext.BaseDirectory, "characters");
        Assert.Equal(7, (await importer.ImportAsync(path)).Count);
        Assert.All(await importer.ImportAsync(path), line => Assert.StartsWith("Unchanged:", line));
        var versions = (await owner.GetFromJsonAsync<List<CurriculumVersionSummary>>("/api/admin/curriculum/versions"))!;
        var proposals = versions.Where(v => v.Status == CurriculumStatuses.Draft && v.LessonId.StartsWith("levantine-everyday-")).ToList();
        Assert.Equal(7, proposals.Count);
        foreach (var version in proposals)
        {
            var detail = (await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{version.Id}"))!;
            Assert.Equal(CharacterRegistry.Version, detail.Lesson.Characters!.RegistryVersion);
            Assert.True(validator.Validate(detail.Lesson, detail.Sources).IsValid);
            var sourcePackage = System.Text.Json.JsonSerializer.Deserialize<CurriculumDraftRequest>(
                await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "guided-teaching", $"{detail.Lesson.CourseOrder:00}-lesson.json")), options)!;
            var stripped = detail.Lesson with
            {
                Characters = null, Version = sourcePackage.Lesson.Version,
                Steps = detail.Lesson.Steps.Select(step => step with { Characters = null }).ToList(),
                Introduction = detail.Lesson.Introduction! with
                {
                    Dialogue = detail.Lesson.Introduction!.Dialogue.Select(turn => turn with { SpeakerId = null, AddresseeId = null }).ToList(),
                    TeachingCards = detail.Lesson.Introduction.TeachingCards!.Select(card => card with { SpeakerId = null, AddresseeId = null }).ToList()
                }
            };
            Assert.Equal(System.Text.Json.JsonSerializer.Serialize(sourcePackage.Lesson, options), System.Text.Json.JsonSerializer.Serialize(stripped, options));
            Assert.Equal(System.Text.Json.JsonSerializer.Serialize(sourcePackage.Sources, options), System.Text.Json.JsonSerializer.Serialize(detail.Sources, options));
            if (detail.Lesson.CourseOrder > 1) Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{detail.Lesson.Id}")).StatusCode);
        }
        var proposal = proposals.Single(v => v.LessonId == baseline.Lesson.Id);
        var revised = (await owner.GetFromJsonAsync<CurriculumVersionDetail>($"/api/admin/curriculum/versions/{proposal.Id}"))!;
        var lesson = revised.Lesson;
        Assert.Null((await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{lesson.Id}"))!.Characters);
        Assert.False(validator.Validate(lesson with { Characters = lesson.Characters! with { RegistryVersion = "unknown" } }, revised.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Characters = lesson.Characters! with { CharacterIds = ["fattoush", "unknown"] } }, revised.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Characters = lesson.Characters! with { CharacterIds = ["fattoush", "fattoush"] } }, revised.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Characters = null }, revised.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Introduction = lesson.Introduction! with { Dialogue = [lesson.Introduction!.Dialogue[0] with { SpeakerId = "knafeh", AddresseeId = "fattoush" }] } }, revised.Sources).IsValid);
        var step = lesson.Steps[0];
        Assert.False(validator.Validate(lesson with { Steps = [step with { Characters = step.Characters! with { ResponseSpeakerId = null } }] }, revised.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Steps = [step with { Characters = step.Characters! with { ResponseAddresseeId = "knafeh" } }] }, revised.Sources).IsValid);
        Assert.False(validator.Validate(lesson with { Steps = [step with { Characters = step.Characters! with { SpeakerId = "unknown" } }] }, revised.Sources).IsValid);
        // Only disposable test copies are approved and published here.
        Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{proposal.Id}/approve", new { })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{proposal.Id}/publish", new { })).StatusCode);
        var live = (await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{lesson.Id}"))!;
        Assert.Equal("fattoush", live.Steps[0].Characters!.SpeakerId);
        var dashboard = (await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.NotNull(dashboard.DailyPlan.Lessons.Single(l => l.Id == lesson.Id).Characters);
        await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/lessons/{lesson.Id}/rollback", new CurriculumRollbackRequest(original.Id));
        var rollback = (await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{lesson.Id}"))!;
        Assert.Null(rollback.Characters);
        Assert.Null(rollback.Steps[0].Characters);
        Assert.Null(rollback.Introduction!.Dialogue[0].SpeakerId);
    }

    private sealed record RecordingUpload(string AudioUrl);

    [Fact]
    public async Task RecallPackagesValidateAndKeepExactPublishedTeachingModels()
    {
        using var scope = _factory.Services.CreateScope();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        var options = new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web);
        foreach (var number in new[] { 1, 3, 6 })
        {
            var package = System.Text.Json.JsonSerializer.Deserialize<CurriculumDraftRequest>(
                await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "recall", $"{number:00}-lesson.json")), options)!;
            var validation = validator.Validate(package.Lesson, package.Sources);
            Assert.True(validation.IsValid, string.Join("; ", validation.Errors));
            var target = Assert.Single(package.Lesson.Recall!);
            foreach (var invalid in new[] {
                target with { Id = "" }, target with { Dialect = "msa" }, target with { RequiredConcepts = [] },
                target with { SourceLocators = ["missing"] }, target with { Variants = [] },
                target with { Variants = target.Variants.Select(v => v with { ReservedForLater = false }).ToList() },
                target with { AcceptedAnswers = [] }, target with { KnownErrors = target.AcceptedAnswers },
                target with { AcceptedAnswers = [target.AcceptedAnswers[0] with { Arabic = "invented" }] },
                target with { AcceptedAnswers = [target.AcceptedAnswers[0] with { Rationale = "" }] }
            }) Assert.False(validator.Validate(package.Lesson with { Recall = [invalid] }, package.Sources).IsValid);
            Assert.False(validator.Validate(package.Lesson with { Recall = [null!] }, package.Sources).IsValid);
            Assert.False(validator.Validate(package.Lesson with { Recall = [target with { AcceptedAnswers = [null!] }] }, package.Sources).IsValid);
        }
    }

    [Fact]
    public void RecallEvaluationPreservesMeaningAndLeavesUnknownResponsesUnjudged()
    {
        Assert.Equal("الساعة سبعة", RecallEvaluator.Normalize(" السَّاعةُ   سَبْعَة؟ "));
        Assert.Equal("is-saa sab'a", RecallEvaluator.Normalize(" IS-SAA   SAB'A! "));
        Assert.NotEqual(RecallEvaluator.Normalize("sab'a"), RecallEvaluator.Normalize("saba"));
        var answer = new RecallAnswer("الساعة سبعة.", "Is-sāʿa sabʿa.", "At seven.", "Seven fits.", [], ["is-saa sab3a"]);
        var wrong = new RecallAnswer("الساعة ستة.", "Is-sāʿa sitte.", "At six.", "Six differs.", [], []);
        var target = new RecallTarget("time", "Give seven", "palestinian-urban", "conversational", ["seven"], ["source"], [answer], [wrong], "time", []);
        Assert.Equal("accepted", RecallEvaluator.Evaluate(target, "الساعةُ سَبْعة", "arabic"));
        Assert.Equal("accepted", RecallEvaluator.Evaluate(target, "IS-SAA SAB3A!", "arabizi"));
        Assert.Equal("context-error", RecallEvaluator.Evaluate(target, "الساعة ستة", "arabic"));
        Assert.Equal("uncertain", RecallEvaluator.Evaluate(target, "seven please", "arabizi"));
        Assert.Equal("uncertain", RecallEvaluator.Evaluate(target, "سبعة", "arabic"));
    }

    [Fact]
    public async Task RecallReportsRequirePublishedVersionsConsentAndOwnerAccess()
    {
        using var owner = CreateClient();
        using var guest = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var options = new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web);
        var package = System.Text.Json.JsonSerializer.Deserialize<CurriculumDraftRequest>(
            await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "recall", "06-lesson.json")), options)!;
        var draftResponse = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts", package);
        draftResponse.EnsureSuccessStatusCode();
        var draft = (await draftResponse.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
        var report = new RecallReportRequest(Guid.NewGuid().ToString(), draft.Lesson.Id, draft.Lesson.Version,
            "confirm-seven", "confirm-seven-practice", "arabizi", "at seven", "My response gives the time.");
        Assert.Equal(HttpStatusCode.BadRequest, (await SendWithCsrfAsync(guest, HttpMethod.Post, "/api/recall/reports", report)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync("/api/lessons/" + draft.Lesson.Id)).StatusCode);
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/approve", new { })).EnsureSuccessStatusCode();
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/publish", new { })).EnsureSuccessStatusCode();
        var publishedRecall = (await guest.GetFromJsonAsync<LessonResponse>("/api/lessons/" + draft.Lesson.Id))!;
        Assert.NotNull(publishedRecall.Recall);
        report = report with { Version = publishedRecall.Version };
        Assert.Equal(HttpStatusCode.BadRequest, (await guest.PostAsJsonAsync("/api/recall/reports", report)).StatusCode);
        var sentReport = await SendWithCsrfAsync(guest, HttpMethod.Post, "/api/recall/reports", report);
        Assert.True(sentReport.IsSuccessStatusCode, await sentReport.Content.ReadAsStringAsync());
        (await SendWithCsrfAsync(guest, HttpMethod.Post, "/api/recall/reports", report)).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.BadRequest, (await SendWithCsrfAsync(guest, HttpMethod.Post, "/api/recall/reports", report with { Response = "changed" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await SendWithCsrfAsync(guest, HttpMethod.Post, "/api/recall/reports", report with { Id = Guid.NewGuid().ToString(), Version = "wrong" })).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await guest.GetAsync("/api/admin/curriculum/recall-reports")).StatusCode);
        var cases = (await owner.GetFromJsonAsync<List<RecallReviewCase>>("/api/admin/curriculum/recall-reports"))!;
        var saved = Assert.Single(cases);
        Assert.Equal(report, saved.Report);
        Assert.Equal("open", saved.Status);
        Assert.Contains("uncertain", saved.Evaluation);
        Assert.NotEmpty(saved.Sources);
        Assert.Equal("palestinian-urban", saved.Dialect);
        var resolve = await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/recall-reports/{report.Id}/resolve", new RecallResolutionRequest("Keep as uncertain; no published changes."));
        resolve.EnsureSuccessStatusCode();
        Assert.Equal("resolved", (await resolve.Content.ReadFromJsonAsync<RecallReviewCase>())!.Status);
    }

    [Theory]
    [InlineData("french", "fr", "ab cd", "ab ", "cd")]
    [InlineData("khmer", "km", "កិខ", "កិ", "ខ")]
    public async Task NewCourseProfilePreservesNeutralTextPublicationRollbackAndProgress(
        string courseId, string tag, string text, string segment1, string segment2)
    {
        using var owner = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        using var guest = CreateClient();
        var seed = (await guest.GetFromJsonAsync<LessonResponse>("/api/lessons/levantine-day-01"))!;
        var before = System.Text.Json.JsonSerializer.Serialize(seed);
        var step = seed.Steps[0] with {
            Prompt = new LessonPrompt(null!, null!, "Engineering test only", null, TargetText: text, PronunciationHelp: "test"),
            Answers = seed.Steps[0].Answers.Select((a, i) => a with { Arabic = null!, Arabizi = null!,
                TargetText = text + (i == 0 ? "" : "x"), PronunciationHelp = "test", Rationale = "Synthetic test rationale",
                Segments = i == 0 ? new[] { segment1, segment2 } : new[] { text + "x" } }).ToArray()
        };
        var lesson = seed with { Id = $"test-{courseId}", TrackId = courseId, SchemaVersion = 2,
            UnitId = "shared-test-unit", Steps = [step],
            ContentReview = new(tag, "test-variety", "test-convention", "test harness", "accepted", "cleared", [], SourceLanguages: new Dictionary<string, string> { ["test:review"] = tag }) };
        CurriculumSourceInput[] sources = [new("linguistic-review", "Synthetic test record", "test:review", "Test data only", "No actual linguistic review claimed")];
        using var scope = _factory.Services.CreateScope();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        Assert.True(validator.Validate(lesson, sources).IsValid);
        Assert.False(validator.Validate(lesson, [sources[0] with { Locator = null! }]).IsValid);
        foreach (var review in new[] { lesson.ContentReview with { LanguageTag = "ar" },
            lesson.ContentReview with { LanguageTag = null! }, lesson.ContentReview with { SourceLanguages = new Dictionary<string, string> { ["test:review"] = "ar" } }, lesson.ContentReview with { EngineeringFixture = true },
            lesson.ContentReview with { RightsDisposition = "pending" }, lesson.ContentReview with { CriticalIssues = ["open defect"] },
            lesson.ContentReview with { ReviewDisposition = "pending" } })
            Assert.False(validator.Validate(lesson with { ContentReview = review }, sources).IsValid);
        Assert.False(validator.Validate(lesson with { SchemaVersion = 1 }, sources).IsValid);
        Assert.False(validator.Validate(lesson with { Steps = [step with { Prompt = step.Prompt with { Arabic = "different" } }] }, sources).IsValid);
        if (courseId == "khmer") Assert.False(validator.Validate(lesson with { Steps = [step with {
            Answers = step.Answers.Select(a => a with { Segments = ["wrong"] }).ToArray() }] }, sources).IsValid);
        var draftResponse = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts", new CurriculumDraftRequest(lesson, sources));
        draftResponse.EnsureSuccessStatusCode();
        var draft = (await draftResponse.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{lesson.Id}")).StatusCode);
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/approve", new { })).EnsureSuccessStatusCode();
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/publish", new { })).EnsureSuccessStatusCode();
        var published = (await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{lesson.Id}"))!;
        Assert.Equal(text, published.Steps[0].Prompt.TargetText);
        Assert.Equal(new[] { segment1, segment2 }, published.Steps[0].Answers[0].Segments);
        var dashboard = (await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.Contains(dashboard.DailyPlan.Lessons, l => l.TrackId == courseId && l.Id == lesson.Id);
        Assert.Equal(0, dashboard.Tracks.Single(t => t.Id == courseId).ProgressPercent);
        var completion = new LessonCompletionRequest(Guid.NewGuid().ToString(), DateTimeOffset.UtcNow);
        (await SendWithCsrfAsync(guest, HttpMethod.Post, $"/api/lessons/{lesson.Id}/completions", completion)).EnsureSuccessStatusCode();
        var repeated = await SendWithCsrfAsync(guest, HttpMethod.Post, $"/api/lessons/{lesson.Id}/completions", completion);
        Assert.True((await repeated.Content.ReadFromJsonAsync<LessonCompletionResponse>())!.AlreadyRecorded);
        dashboard = (await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.Equal(100, dashboard.Tracks.Single(t => t.Id == courseId).ProgressPercent);
        Assert.Equal(0, dashboard.Tracks.Single(t => t.Id == "levantine").ProgressPercent);
        var revision = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts", new CurriculumDraftRequest(lesson with { Title = "Revised test" }, sources));
        var v2 = (await revision.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{v2.Id}/approve", new { })).EnsureSuccessStatusCode();
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{v2.Id}/publish", new { })).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Unauthorized, (await SendWithCsrfAsync(guest, HttpMethod.Post, $"/api/admin/curriculum/versions/{v2.Id}/withdraw", new CurriculumWithdrawalRequest("Test"))).StatusCode);
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{v2.Id}/withdraw", new CurriculumWithdrawalRequest("Synthetic withdrawal rehearsal"))).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{lesson.Id}")).StatusCode);
        Assert.DoesNotContain((await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!.DailyPlan.Lessons, l => l.Id == lesson.Id);
        (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/lessons/{lesson.Id}/rollback", new CurriculumRollbackRequest(draft.Id))).EnsureSuccessStatusCode();
        Assert.Equal(published, (await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{lesson.Id}"))!, new LessonJsonComparer());
        var moved = await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/admin/curriculum/drafts", new CurriculumDraftRequest(lesson with { TrackId = "levantine" }, sources));
        Assert.Equal(HttpStatusCode.Conflict, moved.StatusCode);
        Assert.Equal(before, System.Text.Json.JsonSerializer.Serialize(await guest.GetFromJsonAsync<LessonResponse>("/api/lessons/levantine-day-01")));
        var preferences = new StudyPreferences(5, ["levantine", "msa", "quranic", "french", "khmer"], courseId);
        (await SendWithCsrfAsync(owner, HttpMethod.Post, "/api/study-settings", new SaveStudySettingsRequest(preferences, 0))).EnsureSuccessStatusCode();
        Assert.Equal(5, (await owner.GetFromJsonAsync<StudySettingsResponse>("/api/study-settings"))!.Preferences.SelectedTrackIds.Count);
    }
    [Fact]
    public async Task UnreviewedKhmerUnitImportsAndPreviewsPrivatelyButCannotApproveOrPublish()
    {
        using var owner = CreateClient();
        using var guest = CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var arabicBefore = await guest.GetStringAsync("/api/lessons/levantine-day-01");
        using var scope = _factory.Services.CreateScope();
        var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
        var path = Path.Combine(AppContext.BaseDirectory, "khmer-meet-01");
        Assert.Equal(5, (await importer.ImportAsync(path)).Count);
        Assert.All(await importer.ImportAsync(path), line => Assert.StartsWith("Unchanged:", line));
        var drafts = (await publishing.ListAsync()).Where(v => v.LessonId.StartsWith("khmer-meet-01-")).ToArray();
        Assert.Equal(5, drafts.Length);
        foreach (var draft in drafts)
        {
            var detail = (await publishing.GetAsync(draft.Id))!;
            Assert.Equal(CurriculumStatuses.Draft, detail.Status);
            Assert.Null(detail.ApprovedBy);
            Assert.Null(detail.PublishedBy);
            Assert.Equal("pending", detail.Lesson.ContentReview!.ReviewDisposition);
            Assert.Equal("pending", detail.Lesson.ContentReview.RightsDisposition);
            Assert.True(validator.ValidateDraft(detail.Lesson, detail.Sources).IsValid);
            Assert.False(validator.Validate(detail.Lesson, detail.Sources).IsValid);
            var readinessResponse = await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{draft.Id}/readiness", new { });
            readinessResponse.EnsureSuccessStatusCode();
            var readiness = (await readinessResponse.Content.ReadFromJsonAsync<CurriculumReadinessResult>())!;
            Assert.True(readiness.Draft.IsValid);
            Assert.False(readiness.Publication.IsValid);
            Assert.NotEmpty(readiness.Publication.Errors);
            Assert.Equal(HttpStatusCode.Unauthorized, (await SendWithCsrfAsync(guest, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{draft.Id}/readiness", new { })).StatusCode);
            Assert.Equal(HttpStatusCode.BadRequest, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{draft.Id}/approve", new { })).StatusCode);
            Assert.Equal(HttpStatusCode.Conflict, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{draft.Id}/publish", new { })).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{draft.LessonId}")).StatusCode);
            var script = detail.Lesson.Introduction!.ScriptSupport!;
            Assert.NotEmpty(script.TeachingCardIndexes);
            Assert.All(detail.Lesson.Steps.SelectMany(s => s.Answers), a => Assert.Equal(a.TargetText, string.Concat(a.Segments!)));
            var first = detail.Lesson.Steps[0];
            var brokenSegments = detail.Lesson with { Steps = [first with {
                Answers = first.Answers.Select(a => a with { Segments = ["changed"] }).ToArray() }] };
            Assert.False(validator.ValidateDraft(brokenSegments, detail.Sources).IsValid);
            var brokenScript = detail.Lesson with { Introduction = detail.Lesson.Introduction with {
                ScriptSupport = script with { TeachingCardIndexes = [999] } } };
            Assert.False(validator.ValidateDraft(brokenScript, detail.Sources).IsValid);
            Assert.False(validator.ValidateDraft(detail.Lesson with { ContentReview = detail.Lesson.ContentReview with {
                SourceLanguages = new Dictionary<string, string>() } }, detail.Sources).IsValid);
        }
        var dashboard = (await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.DoesNotContain(dashboard.DailyPlan.Lessons, l => l.TrackId == "khmer");
        Assert.Equal(arabicBefore, await guest.GetStringAsync("/api/lessons/levantine-day-01"));
    }

    [Fact]
    public async Task OwnerTextPreviewExceptionPinsFiveExactPackagesAndPreservesPendingReviewAndNormalGates()
    {
        using var previewFactory = _factory.WithWebHostBuilder(builder => builder.ConfigureAppConfiguration((_, config) =>
            config.AddInMemoryCollection(new Dictionary<string, string?> { ["Curriculum:AllowKhmerTextPreview"] = "true" })));
        using var owner = previewFactory.CreateClient();
        using var guest = previewFactory.CreateClient();
        await RegisterAsync(owner, "Owner", "owner@example.test");
        var arabicBefore = await guest.GetStringAsync("/api/lessons/levantine-day-01");
        using var scope = previewFactory.Services.CreateScope();
        var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
        var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
        var validator = scope.ServiceProvider.GetRequiredService<CurriculumValidator>();
        await importer.ImportAsync(Path.Combine(AppContext.BaseDirectory, "khmer-meet-01"));
        var drafts = (await publishing.ListAsync()).Where(v => v.LessonId.StartsWith("khmer-meet-01-")).ToArray();
        Assert.Equal(5, drafts.Length);
        foreach (var draft in drafts)
        {
            var original = (await publishing.GetAsync(draft.Id))!;
            var candidate = original.Lesson with { PublicationNotice = KhmerTextPreviewPolicy.Notice };
            Assert.True(validator.Validate(candidate, original.Sources).IsValid);
            Assert.False(new KhmerTextPreviewPolicy(new ConfigurationBuilder().Build()).IsAuthorized(candidate, original.Sources));
            foreach (var changed in new[] {
                candidate with { Id = "khmer-meet-01-06" }, candidate with { TrackId = "french" },
                candidate with { Title = "Changed wording" },
                candidate with { PublicationNotice = candidate.PublicationNotice! with { Label = "Reviewed" } },
                candidate with { ContentReview = candidate.ContentReview! with { Reviewer = "invented", ReviewDisposition = "accepted", CriticalIssues = [] } }
            }) Assert.False(validator.Validate(changed, original.Sources).IsValid);
            Assert.False(validator.Validate(candidate, original.Sources.Select(s => s with { Notes = "changed" }).ToArray()).IsValid);
            Assert.Equal(HttpStatusCode.BadRequest, (await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{draft.Id}/approve", new { })).StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, (await SendWithCsrfAsync(guest, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{draft.Id}/approve-text-preview", new { })).StatusCode);
            Assert.Equal(HttpStatusCode.BadRequest, (await owner.PostAsJsonAsync(
                $"/api/admin/curriculum/versions/{draft.Id}/approve-text-preview", new { })).StatusCode);
            var approve = await SendWithCsrfAsync(owner, HttpMethod.Post,
                $"/api/admin/curriculum/versions/{draft.Id}/approve-text-preview", new { });
            approve.EnsureSuccessStatusCode();
            var approved = (await approve.Content.ReadFromJsonAsync<CurriculumVersionDetail>())!;
            Assert.Equal(KhmerTextPreviewPolicy.Notice, approved.Lesson.PublicationNotice);
            Assert.Equal("pending", approved.Lesson.ContentReview!.ReviewDisposition);
            Assert.Equal("pending", approved.Lesson.ContentReview.RightsDisposition);
            Assert.Equal("", approved.Lesson.ContentReview.Reviewer);
            Assert.NotEmpty(approved.Lesson.ContentReview.CriticalIssues);
            Assert.Contains(approved.Audit, a => a.Action == "approved-text-preview");
            Assert.DoesNotContain(approved.Sources, s => s.SourceType == "linguistic-review");
            (await SendWithCsrfAsync(owner, HttpMethod.Post, $"/api/admin/curriculum/versions/{draft.Id}/publish", new { })).EnsureSuccessStatusCode();
            var published = (await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{draft.LessonId}"))!;
            Assert.Equal(KhmerTextPreviewPolicy.Notice, published.PublicationNotice);
            Assert.All(published.Steps, s => Assert.Null(s.Prompt.AudioUrl));
        }
        var dashboard = (await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!;
        Assert.Equal(5, dashboard.DailyPlan.Lessons.Count(l => l.TrackId == "khmer" && l.PublicationNotice == KhmerTextPreviewPolicy.Notice));
        Assert.Equal(arabicBefore, await guest.GetStringAsync("/api/lessons/levantine-day-01"));
        var configuration = previewFactory.Services.GetRequiredService<IConfiguration>();
        configuration["Curriculum:AllowKhmerTextPreview"] = "false";
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{drafts[0].LessonId}")).StatusCode);
        Assert.DoesNotContain((await guest.GetFromJsonAsync<DashboardResponse>("/api/dashboard"))!.DailyPlan.Lessons, l => l.TrackId == "khmer");
        configuration["Curriculum:AllowKhmerTextPreview"] = "true";
        // Earlier HTTP commands used separate request scopes; refresh this
        // import scope before the direct service withdrawal/rollback rehearsal.
        scope.ServiceProvider.GetRequiredService<Ismi.Api.Data.IsmiDbContext>().ChangeTracker.Clear();
        var first = (await publishing.GetAsync(drafts[0].Id))!;
        var revision = await publishing.CreateDraftAsync(new(first.Lesson, first.Sources), "test owner");
        await publishing.ApproveTextPreviewAsync(revision.Id, "test owner");
        await publishing.PublishAsync(revision.Id, "test owner");
        await publishing.WithdrawAsync(revision.Id, "Test withdrawal", "test owner");
        Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync($"/api/lessons/{first.Lesson.Id}")).StatusCode);
        try { await publishing.RollbackAsync(first.Lesson.Id, first.Id, "test owner"); }
        catch (CurriculumValidationException ex) { Assert.Fail(string.Join("; ", ex.Errors)); }
        Assert.Equal(KhmerTextPreviewPolicy.Notice, (await guest.GetFromJsonAsync<LessonResponse>($"/api/lessons/{first.Lesson.Id}"))!.PublicationNotice);
    }

    private sealed class LessonJsonComparer : IEqualityComparer<LessonResponse>
    {
        public bool Equals(LessonResponse? x, LessonResponse? y) => System.Text.Json.JsonSerializer.Serialize(x) == System.Text.Json.JsonSerializer.Serialize(y);
        public int GetHashCode(LessonResponse obj) => obj.Id.GetHashCode();
    }

    private HttpClient CreateClient() =>
        _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            HandleCookies = true
        });

    private static async Task RegisterAsync(HttpClient client, string name, string email)
    {
        var response = await SendWithCsrfAsync(client, HttpMethod.Post, "/api/auth/register", new
        {
            displayName = name,
            email,
            password = "long test password"
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private static async Task<HttpResponseMessage> SendWithCsrfAsync<T>(
        HttpClient client,
        HttpMethod method,
        string path,
        T body)
    {
        var csrf = await client.GetFromJsonAsync<CsrfToken>("/api/auth/csrf");
        Assert.NotNull(csrf);
        using var request = new HttpRequestMessage(method, path)
        {
            Content = JsonContent.Create(body)
        };
        request.Headers.Add("X-CSRF-TOKEN", csrf.Token);
        return await client.SendAsync(request);
    }

    private static void DeleteDatabaseFile(string path)
    {
        if (File.Exists(path)) File.Delete(path);
    }

    private sealed record CsrfToken(string Token);
}
