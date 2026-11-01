using Google.Apis.Auth;

namespace Ismi.Api.Services;

public sealed record GoogleIdentity(string Subject, string Email, string Name, string? Nonce);

public interface IGoogleIdentityVerifier
{
    Task<GoogleIdentity?> VerifyAsync(string credential);
}

public sealed class GoogleIdentityVerifier(IConfiguration configuration) : IGoogleIdentityVerifier
{
    public async Task<GoogleIdentity?> VerifyAsync(string credential)
    {
        if (string.IsNullOrWhiteSpace(configuration["Authentication:Google:ClientId"]) || credential.Length > 16000) return null;
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(credential, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [configuration["Authentication:Google:ClientId"]!]
            });
            if (!payload.EmailVerified || string.IsNullOrWhiteSpace(payload.Subject) || string.IsNullOrWhiteSpace(payload.Email)) return null;
            return new(payload.Subject, payload.Email, payload.Name ?? "Learner", payload.Nonce);
        }
        catch (InvalidJwtException) { return null; }
    }
}
