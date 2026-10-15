using Ismi.Api.Models;
using Microsoft.AspNetCore.Antiforgery;

namespace Ismi.Api.Services;

public static class CulturalMediaEndpoints
{
    public static void MapCulturalMedia(this WebApplication app)
    {
        app.MapGet("/api/culture/weekly", async (int? offset, CulturalMediaService service, HttpContext context, CancellationToken ct) =>
        {
            var catalog = await service.CatalogAsync(offset ?? 0, ct);
            context.Response.Headers.ETag = $"\"{catalog.CatalogRevision}-{catalog.Offset}\"";
            context.Response.Headers.CacheControl = "no-store";
            return Results.Ok(catalog);
        });
        app.MapGet("/api/culture/editions/{id}", async (string id, CulturalMediaService service, HttpContext context, CancellationToken ct) =>
        {
            context.Response.Headers.CacheControl = "no-store";
            var edition = await service.PublicDetailAsync(id, ct);
            return edition is null ? Results.NotFound(new ApiError("collection_not_found", "That collection is not available.")) : Results.Ok(edition);
        });
        var admin = app.MapGroup("/api/admin/culture").RequireAuthorization().AddEndpointFilter<CurriculumApproverFilter>();
        admin.MapGet("/editions", (CulturalMediaService service, CancellationToken ct) => service.ListAsync(ct));
        admin.MapGet("/editions/{id}", (string id, CulturalMediaService service, CancellationToken ct) => Run(() => service.GetAsync(id, ct)));
        admin.MapPost("/drafts", (CulturalDraftRequest request, CulturalMediaService service, HttpContext context, IAntiforgery csrf, CancellationToken ct) =>
            Secure(context, csrf, () => service.SaveDraftAsync(request, Actor(context), ct)));
        admin.MapPost("/editions/{id}/validate", (string id, CulturalCommand request, CulturalMediaService service, HttpContext context, IAntiforgery csrf, CancellationToken ct) =>
            Secure(context, csrf, () => service.ValidateAsync(id, request.Version, ct)));
        foreach (var action in new[] { "approve", "publish", "withdraw", "rollback" })
        {
            var command = action;
            admin.MapPost($"/editions/{{id}}/{command}", (string id, CulturalCommand request, CulturalMediaService service, HttpContext context, IAntiforgery csrf, CancellationToken ct) =>
                Secure(context, csrf, () => service.CommandAsync(id, command, request, Actor(context), ct)));
        }
        admin.MapPost("/editions/{id}/check-link", (string id, CulturalLinkCheck request, CulturalMediaService service, HttpContext context, IAntiforgery csrf, CancellationToken ct) =>
            Secure(context, csrf, () => service.CheckLinkAsync(id, request, Actor(context), ct)));
    }
    private static string Actor(HttpContext c) => c.User.Identity?.Name ?? "curriculum approver";
    private static async Task<IResult> Secure<T>(HttpContext c, IAntiforgery csrf, Func<Task<T>> action)
    {
        try { await csrf.ValidateRequestAsync(c); }
        catch (AntiforgeryValidationException) { return Results.BadRequest(new ApiError("csrf_required", "Refresh and try again.")); }
        return await Run(action);
    }
    private static async Task<IResult> Run<T>(Func<Task<T>> action)
    {
        try { return Results.Ok(await action()); }
        catch (CulturalMediaException e) { return Results.Json(new ApiError("collection_error", e.Message), statusCode: e.Status); }
    }
}
