using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;

namespace Ismi.Api.Services;

public static class PasswordlessEndpoints
{
    private const string NonceCookie = "Ismi.GoogleNonce";
    public sealed record EmailCodeRequest(string? Email);
    public sealed record EmailCodeVerification(string? ChallengeId, string? Code, bool RememberMe);
    public sealed record GoogleVerification(string? Credential, bool RememberMe);

    public static void MapPasswordlessEndpoints(this RouteGroupBuilder auth)
    {
        auth.MapGet("/options", (IConfiguration config, ILoginEmailSender sender, HttpContext context) =>
        {
            context.Response.Headers.CacheControl = "no-store";
            return Results.Ok(new { googleClientId = config["Authentication:Google:ClientId"], emailCode = sender.IsConfigured });
        });
        auth.MapPost("/google/nonce", async Task<IResult> (HttpContext context, IAntiforgery csrf, IDataProtectionProvider protection) =>
        {
            if (!await ValidCsrf(context, csrf)) return CsrfError();
            var nonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            context.Response.Cookies.Append(NonceCookie, protection.CreateProtector(NonceCookie).ToTimeLimitedDataProtector().Protect(nonce, TimeSpan.FromMinutes(10)), new CookieOptions
            {
                HttpOnly = true, Secure = context.Request.IsHttps, SameSite = SameSiteMode.Strict,
                Path = "/api/auth/google", MaxAge = TimeSpan.FromMinutes(10), IsEssential = true
            });
            return Results.Ok(new { nonce });
        }).RequireRateLimiting("passwordless");

        auth.MapPost("/google", async Task<IResult> (GoogleVerification request, HttpContext context,
            IAntiforgery csrf, IDataProtectionProvider protection, IGoogleIdentityVerifier verifier,
            UserManager<ApplicationUser> users, SignInManager<ApplicationUser> signIn, CurriculumAccessService access) =>
        {
            if (!await ValidCsrf(context, csrf)) return CsrfError();
            if (string.IsNullOrWhiteSpace(request.Credential)) return InvalidCode();
            string? nonce = null;
            try
            {
                if (context.Request.Cookies.TryGetValue(NonceCookie, out var value))
                    nonce = protection.CreateProtector(NonceCookie).ToTimeLimitedDataProtector().Unprotect(value);
            }
            catch (CryptographicException) { }
            context.Response.Cookies.Delete(NonceCookie, new CookieOptions { Path = "/api/auth/google" });
            if (nonce is null) return InvalidCode();
            var identity = await verifier.VerifyAsync(request.Credential);
            if (identity is null || identity.Nonce != nonce) return InvalidCode();
            var user = await users.FindByLoginAsync("Google", identity.Subject);
            var current = await users.GetUserAsync(context.User);
            if (user is not null && current is not null && user.Id != current.Id)
                return Results.BadRequest(new ApiError("different_account", "That Google account belongs to another Ismi account."));
            if (user is null)
            {
                var matching = await users.FindByEmailAsync(identity.Email);
                // An email claim alone must never silently link a pre-existing account.
                if (matching is not null && current?.Id != matching.Id)
                    return Results.Conflict(new ApiError("link_required", "Sign in to your existing Ismi account first, then connect Google in Account."));
                if (current is not null && !string.Equals(current.Email, identity.Email, StringComparison.OrdinalIgnoreCase))
                    return Results.BadRequest(new ApiError("email_mismatch", "Choose the Google account with your Ismi email address."));
                user = current ?? new ApplicationUser { UserName = identity.Email, Email = identity.Email, EmailConfirmed = true,
                    DisplayName = identity.Name.Length > 40 ? identity.Name[..40] : identity.Name, CreatedAtUtc = DateTime.UtcNow };
                if (current is null && !(await users.CreateAsync(user)).Succeeded) return InvalidCode();
                if (!(await users.AddLoginAsync(user, new UserLoginInfo("Google", identity.Subject, "Google"))).Succeeded) return InvalidCode();
            }
            if (await users.IsLockedOutAsync(user)) return InvalidCode();
            await signIn.SignInAsync(user, request.RememberMe, "Google");
            return Session(user, access);
        }).RequireRateLimiting("passwordless");

        auth.MapPost("/email-code/request", async Task<IResult> (EmailCodeRequest request, HttpContext context,
            IAntiforgery csrf, EmailCodeService codes, ILoginEmailSender sender, ILogger<EmailCodeService> logger, CancellationToken ct) =>
        {
            if (!await ValidCsrf(context, csrf)) return CsrfError();
            if (!sender.IsConfigured) return Results.Json(new ApiError("email_unavailable", "Email sign-in is not available yet."), statusCode: 503);
            if (string.IsNullOrWhiteSpace(request.Email) || request.Email.Length > 254 || !new EmailAddressAttribute().IsValid(request.Email.Trim()))
                return Results.BadRequest(new ApiError("invalid_email", "Enter a valid email address."));
            try
            {
                var id = await codes.RequestAsync(request.Email, ct);
                return id is null ? Results.Json(new ApiError("code_cooldown", "Wait one minute before requesting another code."), statusCode: 429)
                    : Results.Ok(new { challengeId = id });
            }
            catch (Exception ex) when (ex is HttpRequestException or InvalidOperationException || ex is TaskCanceledException && !ct.IsCancellationRequested)
            {
                // Do not log email addresses, codes, credentials or provider exception messages.
                logger.LogWarning("Login email delivery failed ({FailureType}).", ex.GetType().Name);
                return Results.Json(new ApiError("email_delivery_failed", "We could not send a code. Try again shortly."), statusCode: 503);
            }
        }).RequireRateLimiting("passwordless");

        auth.MapPost("/email-code/verify", async Task<IResult> (EmailCodeVerification request, HttpContext context,
            IAntiforgery csrf, EmailCodeService codes, UserManager<ApplicationUser> users,
            SignInManager<ApplicationUser> signIn, CurriculumAccessService access, CancellationToken ct) =>
        {
            if (!await ValidCsrf(context, csrf)) return CsrfError();
            var email = await codes.ConsumeAsync(request.ChallengeId ?? "", request.Code ?? "", ct);
            if (email is null) return InvalidCode();
            var user = await users.FindByEmailAsync(email);
            if (user is null)
            {
                user = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true, DisplayName = "Learner", CreatedAtUtc = DateTime.UtcNow };
                if (!(await users.CreateAsync(user)).Succeeded) return InvalidCode();
            }
            else
            {
                if (await users.IsLockedOutAsync(user)) return InvalidCode();
                if (!user.EmailConfirmed)
                {
                    user.EmailConfirmed = true;
                    if (!(await users.UpdateAsync(user)).Succeeded) return InvalidCode();
                }
            }
            await signIn.SignInAsync(user, request.RememberMe, "EmailCode");
            return Session(user, access);
        }).RequireRateLimiting("passwordless");
    }

    private static IResult Session(ApplicationUser user, CurriculumAccessService access) =>
        Results.Ok(new AuthSessionResponse(true, user.Id, user.DisplayName, user.Email, access.CanManage(user)));
    private static IResult InvalidCode() => Results.BadRequest(new ApiError("invalid_sign_in", "That sign-in could not be verified. Request a new code or try again."));
    private static IResult CsrfError() => Results.BadRequest(new ApiError("invalid_csrf_token", "Refresh the page and try again."));
    private static async Task<bool> ValidCsrf(HttpContext context, IAntiforgery csrf)
    {
        try { await csrf.ValidateRequestAsync(context); return true; }
        catch (AntiforgeryValidationException) { return false; }
    }
}
