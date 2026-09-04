using Ismi.Api.Data;

namespace Ismi.Api.Services;

public sealed class CurriculumAccessService(IConfiguration configuration)
{
    public bool CanManage(ApplicationUser? user)
    {
        var approverEmail = configuration["Curriculum:ApproverEmail"]?.Trim();
        return user is not null
            && !string.IsNullOrWhiteSpace(approverEmail)
            && string.Equals(user.Email, approverEmail, StringComparison.OrdinalIgnoreCase);
    }
}
