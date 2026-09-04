using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Ismi.Api.Data;

public sealed class ApplicationUser : IdentityUser
{
    [MaxLength(40)]
    public string DisplayName { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public sealed class LearnerProgressRecord
{
    [MaxLength(450)]
    public required string UserId { get; set; }

    public int EarnedMinutes { get; set; }

    public ApplicationUser User { get; set; } = null!;
}

public sealed class LessonCompletionRecord
{
    public long Id { get; set; }

    [MaxLength(450)]
    public required string UserId { get; set; }

    [MaxLength(100)]
    public required string CompletionId { get; set; }

    [MaxLength(100)]
    public required string LessonId { get; set; }

    public DateTime CompletedAtUtc { get; set; }

    public ApplicationUser User { get; set; } = null!;
}

public sealed class CurriculumVersionRecord
{
    public long Id { get; set; }

    [MaxLength(100)]
    public required string LessonId { get; set; }

    public int VersionNumber { get; set; }

    [MaxLength(24)]
    public required string Status { get; set; }

    public required string ContentJson { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    [MaxLength(320)]
    public required string CreatedBy { get; set; }

    public DateTime? ApprovedAtUtc { get; set; }

    [MaxLength(320)]
    public string? ApprovedBy { get; set; }

    public DateTime? PublishedAtUtc { get; set; }

    [MaxLength(320)]
    public string? PublishedBy { get; set; }

    public ICollection<CurriculumSourceRecord> Sources { get; set; } = [];

    public ICollection<CurriculumAuditRecord> AuditEvents { get; set; } = [];
}

public sealed class CurriculumSourceRecord
{
    public long Id { get; set; }

    public long CurriculumVersionId { get; set; }

    [MaxLength(50)]
    public required string SourceType { get; set; }

    [MaxLength(200)]
    public required string Title { get; set; }

    [MaxLength(1000)]
    public required string Locator { get; set; }

    [MaxLength(500)]
    public required string Rights { get; set; }

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public CurriculumVersionRecord CurriculumVersion { get; set; } = null!;
}

public sealed class CurriculumAuditRecord
{
    public long Id { get; set; }

    public long CurriculumVersionId { get; set; }

    [MaxLength(40)]
    public required string Action { get; set; }

    [MaxLength(320)]
    public required string Actor { get; set; }

    public DateTime OccurredAtUtc { get; set; }

    [MaxLength(1000)]
    public required string Details { get; set; }

    public CurriculumVersionRecord CurriculumVersion { get; set; } = null!;
}
