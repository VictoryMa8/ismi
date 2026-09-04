using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Data;

public sealed class IsmiDbContext(DbContextOptions<IsmiDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<LearnerProgressRecord> LearnerProgress => Set<LearnerProgressRecord>();

    public DbSet<LessonCompletionRecord> LessonCompletions => Set<LessonCompletionRecord>();

    public DbSet<CurriculumVersionRecord> CurriculumVersions => Set<CurriculumVersionRecord>();

    public DbSet<CurriculumSourceRecord> CurriculumSources => Set<CurriculumSourceRecord>();

    public DbSet<CurriculumAuditRecord> CurriculumAuditEvents => Set<CurriculumAuditRecord>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<LearnerProgressRecord>(entity =>
        {
            entity.HasKey(progress => progress.UserId);
            entity.HasOne(progress => progress.User)
                .WithOne()
                .HasForeignKey<LearnerProgressRecord>(progress => progress.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<LessonCompletionRecord>(entity =>
        {
            entity.HasIndex(completion => new { completion.UserId, completion.CompletionId })
                .IsUnique();
            entity.HasIndex(completion => new { completion.UserId, completion.LessonId })
                .IsUnique();
            entity.HasOne(completion => completion.User)
                .WithMany()
                .HasForeignKey(completion => completion.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CurriculumVersionRecord>(entity =>
        {
            entity.HasIndex(version => new { version.LessonId, version.VersionNumber })
                .IsUnique();
            entity.HasIndex(version => new { version.LessonId, version.Status });
            entity.Property(version => version.ContentJson).HasColumnType("TEXT");
        });

        builder.Entity<CurriculumSourceRecord>(entity =>
        {
            entity.HasOne(source => source.CurriculumVersion)
                .WithMany(version => version.Sources)
                .HasForeignKey(source => source.CurriculumVersionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CurriculumAuditRecord>(entity =>
        {
            entity.HasIndex(audit => new { audit.CurriculumVersionId, audit.OccurredAtUtc });
            entity.HasOne(audit => audit.CurriculumVersion)
                .WithMany(version => version.AuditEvents)
                .HasForeignKey(audit => audit.CurriculumVersionId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
