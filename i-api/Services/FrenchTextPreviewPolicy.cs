using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Ismi.Api.Models;

namespace Ismi.Api.Services;

// Explicit October 18 owner exception. Only the exact five original candidates
// match; edits, extra lessons, audio, other courses and fixtures cannot use it.
public sealed class FrenchTextPreviewPolicy(IConfiguration configuration)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private static readonly string[] PackagePins = [
        "f483c36bc23785c5bdb541a7e1d593b39d1cb0e664a22002bdd4e5a0f3349b22",
        "55a0199541981e253fed3911a62dce8b8a98d4238454bc231bda4fefdddd5bd6",
        "d1e50ddcb1fbe45b3bd7a5eefb53dde1d01518e7dc7ba9a9e187f17af0f89367",
        "98998a3097ac2ddaaef7e5709b1320faf5815814abe53ef075243e35f73522b2",
        "6f57ce3919c894a9adce8361e6dc2c28c37806d79cd1692e08a85cfc7bf06165"
    ];
    public static readonly LessonPublicationNotice Notice = new(
        "french-meet-01-text-preview-2026-10-18",
        "Unreviewed · text-only preview",
        "AI-assisted draft. French wording, register and source rights remain unreviewed. No human audio.");
    private static readonly Lazy<HashSet<string>> Authorized = new(() =>
        Enumerable.Range(1, 5).Select(n => {
            using var stream = typeof(FrenchTextPreviewPolicy).Assembly.GetManifestResourceStream($"Ismi.FrenchPreview.{n:00}-lesson.json")
                ?? throw new InvalidOperationException("Missing owner-authorized French preview package.");
            using var bytes = new MemoryStream(); stream.CopyTo(bytes);
            if (Convert.ToHexStringLower(SHA256.HashData(bytes.ToArray())) != PackagePins[n - 1])
                throw new InvalidOperationException("Changed French candidate requires fresh owner authorization and package pins.");
            var package = JsonSerializer.Deserialize<CurriculumDraftRequest>(bytes.ToArray(), JsonOptions)!;
            return Fingerprint(package.Lesson, package.Sources);
        }).ToHashSet(StringComparer.Ordinal));

    public bool Enabled => configuration.GetValue<bool>("Curriculum:AllowFrenchTextPreview");
    public bool IsAuthorized(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources) =>
        Enabled
        && lesson.TrackId == "french" && lesson.PublicationNotice == Notice
        && Authorized.Value.Contains(Fingerprint(lesson, sources));

    public static string Fingerprint(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(
            new CurriculumDraftRequest(lesson with { Version = "", PublicationNotice = null }, sources.ToArray()), JsonOptions))));
}
