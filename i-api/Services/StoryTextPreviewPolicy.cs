using System.Security.Cryptography;
using System.Text.Json;
using Ismi.Api.Models;
namespace Ismi.Api.Services;
// Exact owner-requested development previews; no review/rights acceptance or beta inclusion.
public sealed class StoryTextPreviewPolicy(IConfiguration configuration) {
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    public const string PackageSha256 = "58a0827fdeffd2b4469657fc4ed696a15b97f1003670f4a02c7ae97256b63c7b";
    public bool Enabled => configuration.GetValue<bool>("Curriculum:AllowStoryTextPreview");
    public bool ArcEnabled => configuration.GetValue<bool>("Curriculum:AllowStoryArcTextPreview");
    public static readonly StoryPublicationNotice Notice = new("story-text-preview-2026-10-18", "Unreviewed · text-only preview",
        "Linguistic review and source-rights acceptance are pending. No story audio. Practice uses choices; it does not assess speaking or independent production. Not beta content.");
    public static readonly StoryPublicationNotice ArcNotice = Notice with { ReleaseId = "story-arc-text-preview-2026-10-27" };
    private static StoryPack ReadPinned(string resource, string hash) {
        using var stream = typeof(StoryTextPreviewPolicy).Assembly.GetManifestResourceStream(resource)
            ?? throw new InvalidOperationException("Missing exact story preview package.");
        using var memory = new MemoryStream(); stream.CopyTo(memory); var bytes = memory.ToArray();
        if (Convert.ToHexStringLower(SHA256.HashData(bytes)) != hash) throw new InvalidOperationException("Changed story package requires new owner authorization and pin.");
        return JsonSerializer.Deserialize<StoryPack>(bytes, Json)!;
    }
    private static readonly Lazy<StoryPack> Package = new(() => ReadPinned("Ismi.StoryPreview.01.pack.json", PackageSha256));
    private static readonly Lazy<StoryPack[]> Arc = new(() => [
        ReadPinned("Ismi.StoryArcPreview.01.pack.json", "0203e02652ff44170cd56b7690fe13769e3b9fb8ab177b092399f99d855d22d8"),
        ReadPinned("Ismi.StoryArcPreview.02.pack.json", "a626b2410f688142b09545aae209313c92dd98e855efec35fc5e28eba5665c9c"),
        ReadPinned("Ismi.StoryArcPreview.03.pack.json", "4d67543fc4e53b1c8d257d050f588dfbf0ea209083578ac8f1b5990549642576")
    ]);
    private static bool Matches(StoryPack a, StoryPack b) => JsonSerializer.Serialize(a, Json) == JsonSerializer.Serialize(b, Json);
    public StoryPack ExactPackage() => JsonSerializer.Deserialize<StoryPack>(JsonSerializer.Serialize(Package.Value, Json), Json)!;
    public StoryPack[] ExactArcPackages() => JsonSerializer.Deserialize<StoryPack[]>(JsonSerializer.Serialize(Arc.Value, Json), Json)!;
    public bool IsAuthorized(StoryPack p) => Enabled && Matches(p, Package.Value) || ArcEnabled && Arc.Value.Any(a => Matches(p, a));
    public static StoryPublicationNotice NoticeFor(StoryPack p) => Matches(p, Package.Value) ? Notice : ArcNotice;
}
