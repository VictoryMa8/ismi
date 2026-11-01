using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace Ismi.Api.Services;

public interface ILoginEmailSender
{
    bool IsConfigured { get; }
    Task SendAsync(string email, string code, CancellationToken cancellationToken);
}

public sealed class ResendLoginEmailSender(HttpClient client, IConfiguration configuration) : ILoginEmailSender
{
    public bool IsConfigured => !string.IsNullOrWhiteSpace(configuration["LoginEmail:ResendApiKey"])
        && !string.IsNullOrWhiteSpace(configuration["LoginEmail:From"]);

    public async Task SendAsync(string email, string code, CancellationToken cancellationToken)
    {
        if (!IsConfigured) throw new InvalidOperationException("Login email is not configured.");
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
        {
            Content = JsonContent.Create(new
            {
                from = configuration["LoginEmail:From"],
                to = new[] { email },
                subject = "Your Ismi sign-in code",
                text = $"Your Ismi sign-in code is {code}.\n\nIt expires in 10 minutes and can be used once. Do not share it.\n\nIf you did not request this code, you can ignore this email."
            })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", configuration["LoginEmail:ResendApiKey"]);
        using var response = await client.SendAsync(request, cancellationToken);
        // Do not surface provider bodies, email addresses or credentials in errors.
        if (!response.IsSuccessStatusCode) throw new HttpRequestException("Login email delivery failed.", null, response.StatusCode);
    }
}
