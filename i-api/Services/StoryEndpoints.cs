using Ismi.Api.Models;
using Microsoft.AspNetCore.Antiforgery;
namespace Ismi.Api.Services;
public static class StoryEndpoints
{
    public static void MapStory(this WebApplication app)
    {
        app.MapGet("/api/stories", async (StoryService service, HttpContext context, CancellationToken ct) =>
        { context.Response.Headers.CacheControl = "no-store"; return Results.Ok(await service.CatalogAsync(ct)); });
        app.MapGet("/api/stories/packs/{id}", async (string id, StoryService service, HttpContext context, CancellationToken ct) =>
        { context.Response.Headers.CacheControl = "no-store"; var p = await service.PublicAsync(id, ct);
            return p is null ? Results.NotFound(new ApiError("stories_unavailable", "That stories pack is unavailable.")) : Results.Ok(p); });
        var admin = app.MapGroup("/api/admin/stories").RequireAuthorization().AddEndpointFilter<CurriculumApproverFilter>();
        admin.MapGet("/packs", (StoryService s, CancellationToken ct) => s.ListAsync(ct));
        admin.MapGet("/packs/{id}", (string id, StoryService s, CancellationToken ct) => Run(() => s.GetAsync(id, ct)));
        admin.MapGet("/packs/{id}/preview/{version:int}", (string id, int version, StoryService s, CancellationToken ct) => Run(async () => {
            var detail = await s.GetAsync(id, ct); var v = detail.State.Versions.FirstOrDefault(v => v.Number == version) ?? throw new StoryException("Version unavailable.", 404);
            return StoryService.Public(v); }));
        admin.MapPost("/drafts", (StoryDraft request, StoryService s, HttpContext c, IAntiforgery csrf, CancellationToken ct) =>
            Secure(c, csrf, () => s.SaveAsync(request, Actor(c), ct)));
        admin.MapPost("/packs/{id}/validate", (string id, StoryCommand request, StoryService s, HttpContext c, IAntiforgery csrf, CancellationToken ct) =>
            Secure(c, csrf, () => s.ValidateAsync(id, request.Version, ct)));
        foreach (var command in new[] { "approve", "publish", "withdraw", "rollback", "authorize-text-preview" })
        { var action = command; admin.MapPost($"/packs/{{id}}/{action}", (string id, StoryCommand request, StoryService s, HttpContext c, IAntiforgery csrf, CancellationToken ct) =>
            Secure(c, csrf, () => s.CommandAsync(id, action, request, Actor(c), ct))); }
    }
    private static string Actor(HttpContext c) => c.User.Identity?.Name ?? "owner";
    private static async Task<IResult> Secure<T>(HttpContext c, IAntiforgery csrf, Func<Task<T>> work)
    { try { await csrf.ValidateRequestAsync(c); } catch (AntiforgeryValidationException) { return Results.BadRequest(new ApiError("csrf_required", "Refresh and try again.")); } return await Run(work); }
    private static async Task<IResult> Run<T>(Func<Task<T>> work)
    { try { return Results.Ok(await work()); } catch (StoryException e) { return Results.Json(new ApiError("stories_error", e.Message), statusCode: e.Status); } }
}
