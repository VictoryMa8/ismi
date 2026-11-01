using System.Security.Cryptography;
using Ismi.Api.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Ismi.Api.Services;

public sealed class EmailCodeRecord
{
    public string Email { get; set; } = "";
    public string ChallengeId { get; set; } = "";
    public string CodeHash { get; set; } = "";
    public long SentAt { get; set; }
    public long ExpiresAt { get; set; }
    public int Attempts { get; set; }
}

public sealed class EmailCodeService(IsmiDbContext database, ILoginEmailSender sender, TimeProvider clock, IConfiguration configuration)
{
    private static readonly PasswordHasher<string> Hasher = new();

    public async Task<string?> RequestAsync(string email, CancellationToken ct)
    {
        var normalized = email.Trim().ToUpperInvariant();
        var now = clock.GetUtcNow().ToUnixTimeSeconds();
        // Expired challenges have no remaining use; avoid retaining an email log.
        await database.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM EmailCodes WHERE ExpiresAt < {now}", ct);
        var challengeId = Guid.NewGuid().ToString("N");
        var code = RandomNumberGenerator.GetInt32(100_000_000).ToString("D8");
        var hash = Hasher.HashPassword(normalized, code);
        var changed = await database.Database.ExecuteSqlInterpolatedAsync($"""
            INSERT INTO EmailCodes (Email, ChallengeId, CodeHash, SentAt, ExpiresAt, Attempts)
            VALUES ({normalized}, {challengeId}, {hash}, {now}, {now + 600}, 0)
            ON CONFLICT(Email) DO UPDATE SET ChallengeId=excluded.ChallengeId, CodeHash=excluded.CodeHash,
                SentAt=excluded.SentAt, ExpiresAt=excluded.ExpiresAt, Attempts=0
            WHERE EmailCodes.SentAt <= {now - 60}
            """, ct);
        if (changed == 0) return null;
        // Bound provider use even when requests come from many addresses or networks.
        var day = now / 86400;
        var dailyLimit = Math.Clamp(configuration.GetValue("LoginEmail:DailyLimit", 50), 1, 100);
        await database.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM LoginEmailBudget WHERE Day < {day - 1}", ct);
        changed = await database.Database.ExecuteSqlInterpolatedAsync($"""
            INSERT INTO LoginEmailBudget (Day, Count) VALUES ({day}, 1)
            ON CONFLICT(Day) DO UPDATE SET Count=Count+1 WHERE Count < {dailyLimit}
            """, ct);
        if (changed == 0)
        {
            await database.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM EmailCodes WHERE ChallengeId={challengeId}", ct);
            throw new InvalidOperationException("Login email daily limit reached.");
        }
        try { await sender.SendAsync(email.Trim(), code, ct); }
        catch
        {
            await database.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM EmailCodes WHERE ChallengeId={challengeId}", CancellationToken.None);
            throw;
        }
        return challengeId;
    }

    public async Task<string?> ConsumeAsync(string challengeId, string code, CancellationToken ct)
    {
        if (challengeId.Length != 32 || code.Length != 8 || code.Any(c => c is < '0' or > '9')) return null;
        var now = clock.GetUtcNow().ToUnixTimeSeconds();
        var changed = await database.Database.ExecuteSqlInterpolatedAsync($"""
            UPDATE EmailCodes SET Attempts=Attempts+1
            WHERE ChallengeId={challengeId} AND ExpiresAt>{now} AND Attempts<5
            """, ct);
        if (changed != 1) return null;
        var row = await database.Set<EmailCodeRecord>().AsNoTracking().SingleOrDefaultAsync(r => r.ChallengeId == challengeId, ct);
        if (row is null || Hasher.VerifyHashedPassword(row.Email, row.CodeHash, code) == PasswordVerificationResult.Failed) return null;
        // Only one concurrent verification can consume a challenge, including across app instances.
        changed = await database.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM EmailCodes WHERE ChallengeId={challengeId} AND ExpiresAt>{now}", ct);
        return changed == 1 ? row.Email : null;
    }

    public static Task EnsureSchemaAsync(IsmiDbContext database) => database.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS EmailCodes (
            Email TEXT NOT NULL PRIMARY KEY, ChallengeId TEXT NOT NULL UNIQUE, CodeHash TEXT NOT NULL,
            SentAt INTEGER NOT NULL, ExpiresAt INTEGER NOT NULL, Attempts INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS LoginEmailBudget (Day INTEGER NOT NULL PRIMARY KEY, Count INTEGER NOT NULL);
        """);
}
