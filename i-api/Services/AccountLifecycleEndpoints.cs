using System.Globalization;
using System.Security.Claims;
using System.Security.Cryptography;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public static class AccountLifecycleEndpoints
{
    public const string SignInTimeClaim = "ismi:sign-in-time";
    private const string StatePurpose = "Ismi.AccountState.v1";
    public sealed record DeleteRequest(string? Confirmation);
    public sealed record StateRequest(string? Token);

    public static void MapAccountLifecycleEndpoints(this RouteGroupBuilder auth)
    {
        // A protected receipt lets a previously signed-in browser discover deletion
        // even after its session expires. It grants no access to account data.
        auth.MapGet("/account-state", async (HttpContext context, UserManager<ApplicationUser> users,
            IDataProtectionProvider protection) =>
        {
            var user = await users.GetUserAsync(context.User);
            return Results.Ok(new { token = protection.CreateProtector(StatePurpose).Protect(user!.Id) });
        }).RequireAuthorization();

        auth.MapPost("/account-state", async Task<IResult> (StateRequest request, HttpContext context,
            IAntiforgery csrf, IDataProtectionProvider protection, IsmiDbContext database, CancellationToken ct) =>
        {
            if (!await ValidCsrf(context, csrf)) return CsrfError();
            if (string.IsNullOrEmpty(request.Token) || request.Token.Length > 4096) return Results.BadRequest();
            string id;
            try { id = protection.CreateProtector(StatePurpose).Unprotect(request.Token); }
            catch (CryptographicException) { return Results.BadRequest(); }
            return Results.Ok(new { deleted = !await database.Users.AnyAsync(user => user.Id == id, ct) });
        }).RequireRateLimiting("account-state");

        auth.MapPost("/delete-account", async Task<IResult> (DeleteRequest request, HttpContext context,
            IAntiforgery csrf, UserManager<ApplicationUser> users, SignInManager<ApplicationUser> signIn,
            IsmiDbContext database, TimeProvider clock, CancellationToken ct) =>
        {
            if (!await ValidCsrf(context, csrf)) return CsrfError();
            if (request.Confirmation != "DELETE")
                return Results.BadRequest(new ApiError("confirmation_required", "Type DELETE to confirm permanent account deletion."));
            var now = clock.GetUtcNow().ToUnixTimeSeconds();
            if (!long.TryParse(context.User.FindFirstValue(SignInTimeClaim), NumberStyles.None, CultureInfo.InvariantCulture, out var signedIn)
                || signedIn > now || now - signedIn > 600)
                return Results.Json(new ApiError("recent_sign_in_required", "Sign out and sign in again, then delete your account within 10 minutes."), statusCode: 403);

            var user = await users.GetUserAsync(context.User);
            if (user is null) return Results.Unauthorized();
            try
            {
                await using var transaction = await database.Database.BeginTransactionAsync(ct);
                // Identity, progress, completions and settings cascade together.
                await database.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM EmailCodes WHERE Email = {user.NormalizedEmail}", ct);
                var result = await users.DeleteAsync(user);
                if (!result.Succeeded)
                    return Results.Conflict(new ApiError("deletion_failed", "Your account could not be deleted. Try again."));
                await transaction.CommitAsync(ct);
            }
            catch (Exception error) when (error is DbUpdateException or Microsoft.Data.Sqlite.SqliteException)
            {
                return Results.Json(new ApiError("deletion_failed", "Your account could not be deleted. Try again shortly."), statusCode: 503);
            }
            await signIn.SignOutAsync();
            return Results.NoContent();
        }).RequireAuthorization().RequireRateLimiting("auth");
    }

    private static IResult CsrfError() => Results.BadRequest(new ApiError("invalid_csrf_token", "Refresh the page and try again."));
    private static async Task<bool> ValidCsrf(HttpContext context, IAntiforgery csrf)
    {
        try { await csrf.ValidateRequestAsync(context); return true; }
        catch (AntiforgeryValidationException) { return false; }
    }
}
