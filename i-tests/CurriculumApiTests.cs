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
        Assert.Contains("only Levantine", body, StringComparison.OrdinalIgnoreCase);
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

    private sealed record RecordingUpload(string AudioUrl);

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
