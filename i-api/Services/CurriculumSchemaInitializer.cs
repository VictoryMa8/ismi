using Ismi.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public static class CurriculumSchemaInitializer
{
    public static async Task EnsureCurriculumSchemaAsync(
        IsmiDbContext database,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS "CurriculumVersions" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_CurriculumVersions" PRIMARY KEY AUTOINCREMENT,
                "LessonId" TEXT NOT NULL,
                "VersionNumber" INTEGER NOT NULL,
                "Status" TEXT NOT NULL,
                "ContentJson" TEXT NOT NULL,
                "CreatedAtUtc" TEXT NOT NULL,
                "CreatedBy" TEXT NOT NULL,
                "ApprovedAtUtc" TEXT NULL,
                "ApprovedBy" TEXT NULL,
                "PublishedAtUtc" TEXT NULL,
                "PublishedBy" TEXT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_CurriculumVersions_LessonId_VersionNumber"
                ON "CurriculumVersions" ("LessonId", "VersionNumber");
            CREATE INDEX IF NOT EXISTS "IX_CurriculumVersions_LessonId_Status"
                ON "CurriculumVersions" ("LessonId", "Status");

            CREATE TABLE IF NOT EXISTS "CurriculumSources" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_CurriculumSources" PRIMARY KEY AUTOINCREMENT,
                "CurriculumVersionId" INTEGER NOT NULL,
                "SourceType" TEXT NOT NULL,
                "Title" TEXT NOT NULL,
                "Locator" TEXT NOT NULL,
                "Rights" TEXT NOT NULL,
                "Notes" TEXT NOT NULL,
                CONSTRAINT "FK_CurriculumSources_CurriculumVersions_CurriculumVersionId"
                    FOREIGN KEY ("CurriculumVersionId") REFERENCES "CurriculumVersions" ("Id") ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS "IX_CurriculumSources_CurriculumVersionId"
                ON "CurriculumSources" ("CurriculumVersionId");

            CREATE TABLE IF NOT EXISTS "CurriculumAuditEvents" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_CurriculumAuditEvents" PRIMARY KEY AUTOINCREMENT,
                "CurriculumVersionId" INTEGER NOT NULL,
                "Action" TEXT NOT NULL,
                "Actor" TEXT NOT NULL,
                "OccurredAtUtc" TEXT NOT NULL,
                "Details" TEXT NOT NULL,
                CONSTRAINT "FK_CurriculumAuditEvents_CurriculumVersions_CurriculumVersionId"
                    FOREIGN KEY ("CurriculumVersionId") REFERENCES "CurriculumVersions" ("Id") ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS "IX_CurriculumAuditEvents_CurriculumVersionId_OccurredAtUtc"
                ON "CurriculumAuditEvents" ("CurriculumVersionId", "OccurredAtUtc");
            """;

        await database.Database.ExecuteSqlRawAsync(sql, cancellationToken);
    }
}
