namespace Ismi.Api.Models;

public sealed record RegisterRequest(
    string DisplayName,
    string Email,
    string Password);

public sealed record LoginRequest(
    string Email,
    string Password,
    bool RememberMe);

public sealed record AuthSessionResponse(
    bool IsAuthenticated,
    string? UserId,
    string? DisplayName,
    string? Email,
    bool CanManageCurriculum)
{
    public static AuthSessionResponse Guest => new(false, null, null, null, false);
}

public sealed record CsrfTokenResponse(string Token);
