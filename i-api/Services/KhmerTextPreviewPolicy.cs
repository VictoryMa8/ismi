using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Ismi.Api.Models;

namespace Ismi.Api.Services;

// Explicit October 16 owner exception. Only the exact five original candidates
// match; edits, extra lessons, audio, other courses and fixtures cannot use it.
public sealed class KhmerTextPreviewPolicy(IConfiguration configuration)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private static readonly string[] PackagePins = [
        "2224bd136e0fcdda1ec04ce15994bf9ebdd57bba5decdabd653acfaf47c127b3",
        "dbdd9898c8ae7a195fc415bf29a2afc8f259ca35358ffa34039ac1b14b6f6eff",
        "eb1f2cf47d2ef65f31707d53548f1aa32f1768ff4583fce8f4671be34ab803e9",
        "4365ee17b61b0f3d89e958b41021c46768cc52e13beb9d8e5ec89b1b07c2625a",
        "76d79aeae71bba70feb0a485f67ccda203da303ed805a9f18bdc49384ea74209"
    ];
    // Persisted approval metadata: keep byte-for-byte compatible with existing
    // publications. UI-only wording belongs in PublicationNotice.vue.
    public static readonly LessonPublicationNotice Notice = new(
        "khmer-meet-01-text-preview-2026-10-16",
        "Unreviewed · text-only preview",
        "AI-assisted draft. Khmer wording, pronunciation help and source rights remain unreviewed. No human audio.");
    private static readonly Lazy<HashSet<string>> Authorized = new(() =>
        Enumerable.Range(1, 5).Select(n => {
            using var stream = typeof(KhmerTextPreviewPolicy).Assembly.GetManifestResourceStream($"Ismi.KhmerPreview.{n:00}-lesson.json")
                ?? throw new InvalidOperationException("Missing owner-authorized Khmer preview package.");
            using var bytes = new MemoryStream(); stream.CopyTo(bytes);
            if (Convert.ToHexStringLower(SHA256.HashData(bytes.ToArray())) != PackagePins[n - 1])
                throw new InvalidOperationException("Changed Khmer candidate requires fresh owner authorization and package pins.");
            var package = JsonSerializer.Deserialize<CurriculumDraftRequest>(bytes.ToArray(), JsonOptions)!;
            return Fingerprint(package.Lesson, package.Sources);
        }).ToHashSet(StringComparer.Ordinal));

    public bool Enabled => configuration.GetValue<bool>("Curriculum:AllowKhmerTextPreview");
    public bool IsAuthorized(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources) =>
        Enabled
        && lesson.TrackId == "khmer" && lesson.PublicationNotice == Notice
        && Authorized.Value.Contains(Fingerprint(lesson, sources));

    public static string Fingerprint(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(
            new CurriculumDraftRequest(lesson with { Version = "", PublicationNotice = null }, sources.ToArray()), JsonOptions))));
}
