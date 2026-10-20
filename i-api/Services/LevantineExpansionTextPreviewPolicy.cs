using System.Security.Cryptography;
using System.Text.Json;
using System.Text.RegularExpressions;
using Ismi.Api.Models;

namespace Ismi.Api.Services;

// October 19 owner-directed twenty-lesson development preview. Default off;
// exact embedded package bytes and semantic fingerprints bound the exception.
public sealed class LevantineExpansionTextPreviewPolicy(IConfiguration configuration)
{
    private const string ManifestPin = "a6005c600a73e3aa16ba50203ae8198751bd1fd9a54e87b687b56f3c46558f29";
    public static readonly LessonPublicationNotice Notice = new(
        "levantine-expansion-20-text-preview-2026-10-19",
        "Unreviewed · text-only preview",
        "AI-assisted Palestinian Levantine draft. Linguistic and source-rights acceptance remain pending. No human audio or beta approval.");
    public static bool IsExpansionLesson(string id) => Regex.IsMatch(id,
        @"^levantine-(home-03|family-04|food-05|neighborhood-06)-0[1-5]$", RegexOptions.CultureInvariant);
    private static byte[] Resource(string name)
    {
        using var stream = typeof(LevantineExpansionTextPreviewPolicy).Assembly
            .GetManifestResourceStream("Ismi.LevantineExpansion." + name)
            ?? throw new InvalidOperationException("Missing Levantine expansion preview resource.");
        using var bytes = new MemoryStream(); stream.CopyTo(bytes); return bytes.ToArray();
    }
    private static readonly Lazy<HashSet<string>> Authorized = new(() => {
        var manifest = Resource("review-manifest.json");
        if (Convert.ToHexStringLower(SHA256.HashData(manifest)) != ManifestPin)
            throw new InvalidOperationException("Changed expansion manifest requires explicit authorization and pin reconciliation.");
        using var document = JsonDocument.Parse(manifest);
        var packages = document.RootElement.GetProperty("packages").EnumerateArray().ToArray();
        if (packages.Length != 20) throw new InvalidOperationException("Expected exactly twenty expansion packages.");
        var fingerprints = new HashSet<string>(StringComparer.Ordinal);
        foreach (var pin in packages)
        {
            var bytes = Resource(pin.GetProperty("path").GetString()!);
            if (Convert.ToHexStringLower(SHA256.HashData(bytes)) != pin.GetProperty("sha256").GetString())
                throw new InvalidOperationException("Changed Levantine preview requires fresh exact package authorization.");
            var package = JsonSerializer.Deserialize<CurriculumDraftRequest>(bytes, new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
            if (!IsExpansionLesson(package.Lesson.Id) || package.Lesson.TrackId != "levantine")
                throw new InvalidOperationException("Unexpected expansion lesson scope.");
            fingerprints.Add(FrenchTextPreviewPolicy.Fingerprint(package.Lesson, package.Sources));
        }
        if (fingerprints.Count != 20) throw new InvalidOperationException("Duplicate expansion package.");
        return fingerprints;
    });
    public bool IsAuthorized(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources) =>
        configuration.GetValue<bool>("Curriculum:AllowLevantineExpansionTextPreview")
        && lesson.TrackId == "levantine" && IsExpansionLesson(lesson.Id) && lesson.PublicationNotice == Notice
        && Authorized.Value.Contains(FrenchTextPreviewPolicy.Fingerprint(lesson, sources));
}
