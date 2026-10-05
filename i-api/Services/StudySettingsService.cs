using System.Text.Json;
using Ismi.Api.Data;
using Ismi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public sealed class StudySettingsService(IsmiDbContext database)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<StudySettingsResponse> GetAsync(string userId, CancellationToken cancellationToken = default)
    {
        var row = await database.StudySettings.AsNoTracking().SingleOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        return row is null ? new(StudyPreferences.Default, 0)
            : new(JsonSerializer.Deserialize<StudyPreferences>(row.PreferencesJson, JsonOptions)!, row.Revision);
    }

    public async Task<bool> SaveAsync(string userId, SaveStudySettingsRequest request, CancellationToken cancellationToken)
    {
        var defaults = JsonSerializer.Serialize(StudyPreferences.Default, JsonOptions);
        await database.Database.ExecuteSqlInterpolatedAsync($"""
            INSERT OR IGNORE INTO "StudySettings" ("UserId", "PreferencesJson", "Revision")
            VALUES ({userId}, {defaults}, 0)
            """, cancellationToken);
        var normalized = request.Preferences with
        {
            SelectedTrackIds = StudyPreferences.TrackIds.Where(request.Preferences.SelectedTrackIds.Contains).ToArray()
        };
        var json = JsonSerializer.Serialize(normalized, JsonOptions);
        var changed = await database.StudySettings
            .Where(s => s.UserId == userId && s.Revision == request.Revision)
            .ExecuteUpdateAsync(set => set.SetProperty(s => s.PreferencesJson, json)
                .SetProperty(s => s.Revision, s => s.Revision + 1), cancellationToken);
        // A lost response followed by an identical retry is safe; divergent edits conflict.
        return changed == 1 || await database.StudySettings.AnyAsync(
            s => s.UserId == userId && s.PreferencesJson == json, cancellationToken);
    }

    public static Task EnsureSchemaAsync(IsmiDbContext database) => database.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS "StudySettings" (
            "UserId" TEXT NOT NULL PRIMARY KEY,
            "PreferencesJson" TEXT NOT NULL,
            "Revision" INTEGER NOT NULL,
            FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
        );
        """);
}
