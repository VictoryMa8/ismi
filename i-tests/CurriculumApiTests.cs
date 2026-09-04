using System.Net;
using System.Net.Http.Json;
using Ismi.Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

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
                    ["Curriculum:ApproverEmail"] = "owner@example.test"
                }));
        });
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        _factory.Dispose();
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
        var initial = Assert.Single(versions!);
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
            "/api/admin/curriculum/versions"))!.Single();
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
