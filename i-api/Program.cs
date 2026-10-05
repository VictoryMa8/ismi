using Ismi.Api.Data;
using Ismi.Api.Models;
using Ismi.Api.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Threading.RateLimiting;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Persist cookie encryption keys alongside the beta database on container hosts.
builder.Services.AddDataProtection().SetApplicationName("Ismi");
builder.Services.AddOptions<KeyManagementOptions>()
    .Configure<IConfiguration, IWebHostEnvironment, ILoggerFactory>((options, configuration, environment, loggerFactory) =>
    {
        var keysPath = configuration["DataProtection:KeysPath"];
        if (!string.IsNullOrWhiteSpace(keysPath))
        {
            var directory = Directory.CreateDirectory(Path.GetFullPath(keysPath, environment.ContentRootPath));
            options.XmlRepository = new FileSystemXmlRepository(directory, loggerFactory);
        }
    });

builder.Services.AddOpenApi();
builder.Services.AddDbContext<IsmiDbContext>((services, options) =>
{
    var configuration = services.GetRequiredService<IConfiguration>();
    var environment = services.GetRequiredService<IWebHostEnvironment>();
    var configuredDatabasePath = configuration["Database:Path"] ?? "App_Data/ismi.db";
    var databasePath = Path.IsPathRooted(configuredDatabasePath)
        ? configuredDatabasePath
        : Path.GetFullPath(configuredDatabasePath, environment.ContentRootPath);

    Directory.CreateDirectory(Path.GetDirectoryName(databasePath)!);
    options.UseSqlite($"Data Source={databasePath};Cache=Shared");
});
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 8;
        options.Password.RequiredUniqueChars = 1;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Lockout.AllowedForNewUsers = true;
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        options.SignIn.RequireConfirmedAccount = false;
    })
    .AddEntityFrameworkStores<IsmiDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();
builder.Services
    .AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();
builder.Services.Configure<CookieAuthenticationOptions>(
    IdentityConstants.ApplicationScheme,
    options =>
    {
        options.Cookie.Name = "Ismi.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.IsEssential = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromDays(30);
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            }

            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }

            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "Ismi.Antiforgery";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
});
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("auth", limiter =>
    {
        limiter.PermitLimit = 10;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueLimit = 0;
        limiter.AutoReplenishment = true;
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("IsmiWeb", policy =>
    {
        policy
            .WithOrigins("http://127.0.0.1:5173", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddSingleton<SeedCurriculum>();
builder.Services.AddSingleton<LessonEvaluator>();
builder.Services.AddSingleton<LearnerProgressService>();
builder.Services.AddScoped<AccountProgressService>();
builder.Services.AddScoped<StudySettingsService>();
builder.Services.AddScoped<CurriculumPublishingService>();
builder.Services.AddScoped<CurriculumPackageImporter>();
builder.Services.AddSingleton<RecordingStore>();
builder.Services.AddSingleton<CurriculumValidator>();
builder.Services.AddSingleton<CurriculumAccessService>();

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var database = scope.ServiceProvider.GetRequiredService<IsmiDbContext>();
    await database.Database.EnsureCreatedAsync();
    await CurriculumSchemaInitializer.EnsureCurriculumSchemaAsync(database);
    await StudySettingsService.EnsureSchemaAsync(database);
    var publishing = scope.ServiceProvider.GetRequiredService<CurriculumPublishingService>();
    var seed = scope.ServiceProvider.GetRequiredService<SeedCurriculum>();
    await publishing.EnsureSeededAsync(seed.GetInitialLessons());
    if (builder.Configuration["import-curriculum"] is { Length: > 0 } importPath)
    {
        try
        {
            var importer = scope.ServiceProvider.GetRequiredService<CurriculumPackageImporter>();
            foreach (var line in await importer.ImportAsync(Path.GetFullPath(importPath),
                         builder.Configuration.GetValue<bool>("update-import-drafts")))
                Console.WriteLine(line);
        }
        catch (Exception exception) when (exception is IOException or JsonException or InvalidOperationException or CurriculumWorkflowException)
        {
            Console.Error.WriteLine($"Import failed: {exception.Message}");
            Environment.ExitCode = 1;
        }
        return;
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("IsmiWeb");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "healthy",
    service = "ismi-api",
    utc = DateTimeOffset.UtcNow
}));

var auth = app.MapGroup("/api/auth");

auth.MapGet("/csrf", (HttpContext context, IAntiforgery antiforgery) =>
{
    var tokens = antiforgery.GetAndStoreTokens(context);
    return Results.Ok(new CsrfTokenResponse(tokens.RequestToken!));
});

auth.MapGet("/me", async (
    HttpContext context,
    UserManager<ApplicationUser> userManager,
    CurriculumAccessService curriculumAccess) =>
{
    var user = await userManager.GetUserAsync(context.User);
    return Results.Ok(user is null ? AuthSessionResponse.Guest : ToSession(user, curriculumAccess));
});

auth.MapPost("/register", async Task<IResult> (
    RegisterRequest request,
    HttpContext context,
    IAntiforgery antiforgery,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    CurriculumAccessService curriculumAccess) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;

    var displayName = request.DisplayName.Trim();
    var email = request.Email.Trim();
    var inputErrors = ValidateRegistration(displayName, email, request.Password);
    if (inputErrors.Count > 0) return Results.ValidationProblem(inputErrors);

    var user = new ApplicationUser
    {
        UserName = email,
        Email = email,
        DisplayName = displayName,
        CreatedAtUtc = DateTime.UtcNow
    };
    var result = await userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded) return IdentityValidationProblem(result);

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(ToSession(user, curriculumAccess));
})
.RequireRateLimiting("auth");

auth.MapPost("/login", async Task<IResult> (
    LoginRequest request,
    HttpContext context,
    IAntiforgery antiforgery,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    CurriculumAccessService curriculumAccess) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;

    var email = request.Email.Trim();
    var user = await userManager.FindByEmailAsync(email);
    if (user is null)
    {
        return Results.BadRequest(new ApiError(
            "invalid_credentials",
            "The email or password is incorrect."));
    }

    var result = await signInManager.PasswordSignInAsync(
        user,
        request.Password,
        request.RememberMe,
        lockoutOnFailure: true);
    if (result.IsLockedOut)
    {
        return Results.Json(
            new ApiError("account_locked", "Too many attempts. Try again in 15 minutes."),
            statusCode: StatusCodes.Status423Locked);
    }

    if (!result.Succeeded)
    {
        return Results.BadRequest(new ApiError(
            "invalid_credentials",
            "The email or password is incorrect."));
    }

    return Results.Ok(ToSession(user, curriculumAccess));
})
.RequireRateLimiting("auth");

auth.MapPost("/logout", async Task<IResult> (
    HttpContext context,
    IAntiforgery antiforgery,
    SignInManager<ApplicationUser> signInManager) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;

    await signInManager.SignOutAsync();
    return Results.NoContent();
})
.RequireAuthorization();

app.MapGet("/api/study-settings", async (
    HttpContext context, UserManager<ApplicationUser> users, StudySettingsService settings,
    CancellationToken cancellationToken) =>
{
    var user = await users.GetUserAsync(context.User);
    return Results.Ok(await settings.GetAsync(user!.Id, cancellationToken));
}).RequireAuthorization();

app.MapPost("/api/study-settings", async Task<IResult> (
    SaveStudySettingsRequest request, HttpContext context, IAntiforgery antiforgery,
    UserManager<ApplicationUser> users, StudySettingsService settings, CancellationToken cancellationToken) =>
{
    var csrfError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (csrfError is not null) return csrfError;
    if (request.Preferences is null || !request.Preferences.IsValid() || request.Revision < 0)
        return Results.BadRequest(new ApiError("invalid_study_settings", "Choose a valid daily goal, at least one track, and a primary track from your selection."));
    var user = await users.GetUserAsync(context.User);
    if (!await settings.SaveAsync(user!.Id, request, cancellationToken))
        return Results.Conflict(new ApiError("study_settings_conflict", "Your study settings changed on another device. Choose which settings to keep."));
    return Results.Ok(await settings.GetAsync(user.Id, cancellationToken));
}).RequireAuthorization();

app.MapGet("/api/dashboard", async (
    HttpContext context,
    SeedCurriculum curriculum,
    CurriculumPublishingService publishing,
    LearnerProgressService guestProgress,
    AccountProgressService accountProgress,
    UserManager<ApplicationUser> userManager,
    CancellationToken cancellationToken) =>
{
    var user = await userManager.GetUserAsync(context.User);
    var publishedLessons = await publishing.ListPublishedLessonsAsync(
        "levantine",
        cancellationToken);
    var dashboard = user is null
        ? guestProgress.GetDashboard(GuestId(context), curriculum, publishedLessons)
        : await accountProgress.GetDashboardAsync(
            curriculum,
            publishedLessons,
            user,
            cancellationToken);
    return Results.Ok(dashboard);
});

app.MapGet("/api/lessons/{lessonId}", async (
    string lessonId,
    CurriculumPublishingService curriculum,
    CancellationToken cancellationToken) =>
{
    var lesson = await curriculum.FindPublishedLessonAsync(lessonId, cancellationToken);
    return lesson is null
        ? Results.NotFound(new ApiError("lesson_not_found", "That lesson is not available."))
        : Results.Ok(lesson.ToResponse());
});

app.MapPost("/api/lessons/{lessonId}/attempts", async (
    string lessonId,
    LessonAttemptRequest request,
    CurriculumPublishingService curriculum,
    LessonEvaluator evaluator,
    CancellationToken cancellationToken) =>
{
    var lesson = await curriculum.FindPublishedLessonAsync(lessonId, cancellationToken);
    if (lesson is null)
    {
        return Results.NotFound(new ApiError("lesson_not_found", "That lesson is not available."));
    }

    if (string.IsNullOrWhiteSpace(request.AnswerId))
    {
        return Results.BadRequest(new ApiError("answer_required", "Choose an answer before checking it."));
    }

    if (string.IsNullOrWhiteSpace(request.StepId))
    {
        return Results.BadRequest(new ApiError("step_required", "Choose a lesson step before checking an answer."));
    }

    var step = lesson.FindStep(request.StepId);
    return step is null
        ? Results.NotFound(new ApiError("step_not_found", "That lesson step is not available."))
        : Results.Ok(evaluator.Evaluate(step, request.AnswerId));
});

app.MapPost("/api/lessons/{lessonId}/completions", async Task<IResult> (
    string lessonId,
    LessonCompletionRequest request,
    HttpContext context,
    IAntiforgery antiforgery,
    SeedCurriculum dashboardCurriculum,
    CurriculumPublishingService curriculum,
    LearnerProgressService guestProgress,
    AccountProgressService accountProgress,
    UserManager<ApplicationUser> userManager,
    CancellationToken cancellationToken) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;

    var lesson = await curriculum.FindPublishedLessonAsync(lessonId, cancellationToken);
    if (lesson is null)
    {
        return Results.NotFound(new ApiError("lesson_not_found", "That lesson is not available."));
    }

    if (string.IsNullOrWhiteSpace(request.CompletionId))
    {
        return Results.BadRequest(new ApiError("completion_id_required", "A completion ID is required."));
    }

    var user = await userManager.GetUserAsync(context.User);
    var publishedLessons = await curriculum.ListPublishedLessonsAsync(
        "levantine",
        cancellationToken);
    if (user is null)
    {
        return Results.Ok(guestProgress.Complete(
            GuestId(context),
            dashboardCurriculum,
            publishedLessons,
            lesson,
            request.CompletionId,
            request.CompletedAt));
    }

    return Results.Ok(await accountProgress.CompleteAsync(
        dashboardCurriculum,
        publishedLessons,
        lesson,
        user,
        request.CompletionId,
        request.CompletedAt,
        cancellationToken));
});

var curriculumAdmin = app.MapGroup("/api/admin/curriculum")
    .RequireAuthorization()
    .AddEndpointFilter<CurriculumApproverFilter>();

// Draft assets can be previewed by the owner; only published assets reach learners.
app.MapGet("/api/recordings/{file}", async Task<IResult> (
    string file, HttpContext context, RecordingStore recordings,
    CurriculumPublishingService publishing, UserManager<ApplicationUser> users,
    CurriculumAccessService access, CancellationToken cancellationToken) =>
{
    var url = "/api/recordings/" + file;
    var path = recordings.Find(url);
    if (path is null) return Results.NotFound();
    if (!access.CanManage(await users.GetUserAsync(context.User)) &&
        !await publishing.IsPublishedRecordingAsync(url, cancellationToken)) return Results.NotFound();
    context.Response.Headers.CacheControl = "private, no-store";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    return Results.File(path, "audio/wav", enableRangeProcessing: true);
});

curriculumAdmin.MapPost("/recordings", async Task<IResult> (
    HttpContext context, IAntiforgery antiforgery, RecordingStore recordings,
    CancellationToken cancellationToken) =>
{
    var error = await ValidateAntiforgeryAsync(context, antiforgery);
    if (error is not null) return error;
    if (context.Request.ContentLength > RecordingStore.MaxBytes)
        return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);
    // Bound the read even for chunked uploads without a Content-Length header.
    using var buffer = new MemoryStream();
    var chunk = new byte[8192];
    int count;
    while ((count = await context.Request.Body.ReadAsync(chunk, cancellationToken)) > 0)
    {
        if (buffer.Length + count > RecordingStore.MaxBytes)
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);
        buffer.Write(chunk, 0, count);
    }
    try
    {
        var url = await recordings.SaveAsync(buffer.ToArray(), cancellationToken);
        return Results.Ok(new { audioUrl = url });
    }
    catch (InvalidDataException exception)
    {
        return Results.BadRequest(new ApiError("invalid_recording", exception.Message));
    }
});

curriculumAdmin.MapGet("/versions", async (
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
    Results.Ok(await publishing.ListAsync(cancellationToken)));

curriculumAdmin.MapGet("/versions/{versionId:long}", async (
    long versionId,
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
{
    var version = await publishing.GetAsync(versionId, cancellationToken);
    return version is null
        ? Results.NotFound(new ApiError("curriculum_version_not_found", "That curriculum version does not exist."))
        : Results.Ok(version);
});

curriculumAdmin.MapPost("/drafts", async Task<IResult> (
    CurriculumDraftRequest request,
    HttpContext context,
    IAntiforgery antiforgery,
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;
    return await CurriculumCommandAsync(
        () => publishing.CreateDraftAsync(request, CurriculumActor(context), cancellationToken));
});

curriculumAdmin.MapPut("/versions/{versionId:long}", async Task<IResult> (
    long versionId,
    CurriculumDraftRequest request,
    HttpContext context,
    IAntiforgery antiforgery,
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;
    return await CurriculumCommandAsync(
        () => publishing.UpdateDraftAsync(versionId, request, CurriculumActor(context), cancellationToken));
});

curriculumAdmin.MapPost("/versions/{versionId:long}/validate", async Task<IResult> (
    long versionId,
    HttpContext context,
    IAntiforgery antiforgery,
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;
    try
    {
        return Results.Ok(await publishing.ValidateAsync(
            versionId,
            CurriculumActor(context),
            cancellationToken));
    }
    catch (CurriculumWorkflowException exception)
    {
        return CurriculumError(exception);
    }
});

curriculumAdmin.MapPost("/versions/{versionId:long}/approve", async Task<IResult> (
    long versionId,
    HttpContext context,
    IAntiforgery antiforgery,
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;
    return await CurriculumCommandAsync(
        () => publishing.ApproveAsync(versionId, CurriculumActor(context), cancellationToken));
});

curriculumAdmin.MapPost("/versions/{versionId:long}/publish", async Task<IResult> (
    long versionId,
    HttpContext context,
    IAntiforgery antiforgery,
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;
    return await CurriculumCommandAsync(
        () => publishing.PublishAsync(versionId, CurriculumActor(context), cancellationToken));
});

curriculumAdmin.MapPost("/lessons/{lessonId}/rollback", async Task<IResult> (
    string lessonId,
    CurriculumRollbackRequest request,
    HttpContext context,
    IAntiforgery antiforgery,
    CurriculumPublishingService publishing,
    CancellationToken cancellationToken) =>
{
    var antiforgeryError = await ValidateAntiforgeryAsync(context, antiforgery);
    if (antiforgeryError is not null) return antiforgeryError;
    return await CurriculumCommandAsync(
        () => publishing.RollbackAsync(
            lessonId,
            request.TargetVersionId,
            CurriculumActor(context),
            cancellationToken));
});

app.Run();

static AuthSessionResponse ToSession(
    ApplicationUser user,
    CurriculumAccessService curriculumAccess) =>
    new(true, user.Id, user.DisplayName, user.Email, curriculumAccess.CanManage(user));

static string GuestId(HttpContext context)
{
    const string cookieName = "Ismi.Guest";
    if (context.Request.Cookies.TryGetValue(cookieName, out var existing)
        && Guid.TryParseExact(existing, "N", out _))
    {
        return existing;
    }

    var guestId = Guid.NewGuid().ToString("N");
    context.Response.Cookies.Append(cookieName, guestId, new CookieOptions
    {
        HttpOnly = true,
        IsEssential = true,
        SameSite = SameSiteMode.Lax,
        Secure = context.Request.IsHttps,
        MaxAge = TimeSpan.FromDays(30)
    });
    return guestId;
}

static string CurriculumActor(HttpContext context) =>
    context.User.Identity?.Name ?? "curriculum approver";

static async Task<IResult> CurriculumCommandAsync(
    Func<Task<CurriculumVersionDetail>> command)
{
    try
    {
        return Results.Ok(await command());
    }
    catch (CurriculumValidationException exception)
    {
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["curriculum"] = exception.Errors.ToArray()
        });
    }
    catch (CurriculumWorkflowException exception)
    {
        return CurriculumError(exception);
    }
}

static IResult CurriculumError(CurriculumWorkflowException exception) =>
    exception.IsNotFound
        ? Results.NotFound(new ApiError(exception.Code, exception.Message))
        : Results.Conflict(new ApiError(exception.Code, exception.Message));

static Dictionary<string, string[]> ValidateRegistration(
    string displayName,
    string email,
    string password)
{
    var errors = new Dictionary<string, string[]>();

    if (displayName.Length is < 2 or > 40)
    {
        errors["displayName"] = ["Use a display name between 2 and 40 characters."];
    }

    if (string.IsNullOrWhiteSpace(email)
        || !new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email))
    {
        errors["email"] = ["Enter a valid email address."];
    }

    if (password.Length < 8)
    {
        errors["password"] = ["Use at least 8 characters for your password."];
    }

    return errors;
}

static IResult IdentityValidationProblem(IdentityResult result)
{
    var errors = result.Errors
        .GroupBy(error => error.Code.StartsWith("Password", StringComparison.OrdinalIgnoreCase)
            ? "password"
            : "email")
        .ToDictionary(
            group => group.Key,
            group => group.Select(error => error.Description).ToArray());
    return Results.ValidationProblem(errors);
}

static async Task<IResult?> ValidateAntiforgeryAsync(
    HttpContext context,
    IAntiforgery antiforgery)
{
    try
    {
        await antiforgery.ValidateRequestAsync(context);
        return null;
    }
    catch (AntiforgeryValidationException)
    {
        return Results.BadRequest(new ApiError(
            "invalid_csrf_token",
            "The security token is missing or expired. Refresh and try again."));
    }
}

public partial class Program;
