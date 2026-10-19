using System.Security.Cryptography;
using System.Text.Json;
using Ismi.Api.Models;
namespace Ismi.Api.Services;
// October 18 owner exception: one exact episode, no review/rights acceptance or beta inclusion.
public sealed class StoryTextPreviewPolicy(IConfiguration configuration) {
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    public const string PackageSha256 = "58a0827fdeffd2b4469657fc4ed696a15b97f1003670f4a02c7ae97256b63c7b";
    public bool Enabled => configuration.GetValue<bool>("Curriculum:AllowStoryTextPreview");
    public static readonly StoryPublicationNotice Notice = new("story-text-preview-2026-10-18", "Unreviewed · text-only preview",
        "Linguistic review and source-rights acceptance are pending. No story audio. Practice uses choices; it does not assess speaking or independent production. Not beta content.");
    private static readonly Lazy<StoryPack> Package = new(() => {
        using var stream = typeof(StoryTextPreviewPolicy).Assembly.GetManifestResourceStream("Ismi.StoryPreview.01.pack.json")
            ?? throw new InvalidOperationException("Missing exact story preview package.");
        using var memory = new MemoryStream(); stream.CopyTo(memory); var bytes = memory.ToArray();
        if (Convert.ToHexStringLower(SHA256.HashData(bytes)) != PackageSha256) throw new InvalidOperationException("Changed story package requires new owner authorization and pin.");
        return JsonSerializer.Deserialize<StoryPack>(bytes, Json)!;
    });
    public StoryPack ExactPackage() => JsonSerializer.Deserialize<StoryPack>(JsonSerializer.Serialize(Package.Value, Json), Json)!;
    public bool IsAuthorized(StoryPack p) => Enabled && JsonSerializer.Serialize(p, Json) == JsonSerializer.Serialize(Package.Value, Json);
}
