using Ismi.Api.Data;
using Microsoft.AspNetCore.Identity;

namespace Ismi.Api.Services;

public sealed class CurriculumApproverFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var userManager = context.HttpContext.RequestServices
            .GetRequiredService<UserManager<ApplicationUser>>();
        var access = context.HttpContext.RequestServices
            .GetRequiredService<CurriculumAccessService>();
        var user = await userManager.GetUserAsync(context.HttpContext.User);
        return access.CanManage(user)
            ? await next(context)
            : Results.Forbid();
    }
}
