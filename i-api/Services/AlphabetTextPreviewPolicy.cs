using System.Security.Cryptography;
using System.Text.Json;
using Ismi.Api.Models;

namespace Ismi.Api.Services;
// Exact owner-requested October 16 inventory-only previews. No linguistic review/audio claim.
// The normal publication validator remains unchanged. Different content requires normal review
// or a new, explicitly scoped owner exception and pins; these are not beta publications.
public sealed class AlphabetTextPreviewPolicy(IConfiguration configuration)
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    private static readonly string[] Courses = ["levantine", "msa", "quranic", "khmer", "french"];
    private static readonly string[] Pins = [
        "97cc6af7645489f369090410238ab93c015ef6cc89f38a788ad5f455081ae163",
        "0f2927a7ede48210695c1c9f0931e5c30b134b33166d62ecebfab49aba3cd6d1",
        "a2fd40e2399833882adc3ddcffa53fffb1b486fce5db4faa8a99d98e8c28871c",
        "f92d2926e94e2508fabe9e7428fe7f5cc2c0e1e0a992c479d6ada524e9c56ba9",
        "1672160b79be7d5f7a43deafceb509ecc4173bf7c7f134e6bbcba6b0226cce4b"
    ];
    public static readonly AlphabetPublicationNotice Notice = new("alphabet-inventory-text-preview-2026-10-16",
        "Unreviewed · text-only preview",
        "Character shapes and Unicode technical names only. Linguistic review, pronunciation, word examples and exercises are pending. No human audio. Not reviewed course completion or beta content.");
    public bool Enabled => configuration.GetValue<bool>("Curriculum:AllowAlphabetTextPreview");
    private static readonly Lazy<AlphabetPack[]> Packages = new(() => Courses.Select((course, i) => {
        using var stream = typeof(AlphabetTextPreviewPolicy).Assembly.GetManifestResourceStream($"Ismi.AlphabetPreview.{course}.pack.json")
            ?? throw new InvalidOperationException("Missing exact alphabet inventory preview.");
        using var memory = new MemoryStream(); stream.CopyTo(memory); var bytes = memory.ToArray();
        if (Convert.ToHexStringLower(SHA256.HashData(bytes)) != Pins[i]) throw new InvalidOperationException("Changed alphabet preview requires new owner authorization and pins.");
        return JsonSerializer.Deserialize<AlphabetPack>(bytes, Json)!;
    }).ToArray());
    public AlphabetPack[] ExactPackages() => Packages.Value.Select(p => JsonSerializer.Deserialize<AlphabetPack>(JsonSerializer.Serialize(p, Json),Json)!).ToArray();
    public bool IsAuthorized(AlphabetPack p) => Enabled && !p.EngineeringFixture && Packages.Value.Any(candidate =>
        candidate.Id == p.Id && candidate.CourseId == p.CourseId && JsonSerializer.Serialize(candidate,Json) == JsonSerializer.Serialize(p,Json));
    public static string LicenseText {
        get { using var stream = typeof(AlphabetTextPreviewPolicy).Assembly.GetManifestResourceStream("Ismi.AlphabetPreview.UnicodeLicense.txt")!;
            using var reader = new StreamReader(stream); return reader.ReadToEnd(); }
    }
}
