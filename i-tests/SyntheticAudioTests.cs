using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;

namespace Ismi.Api.Tests;

public sealed class SyntheticAudioTests
{
    private const string AudioHash = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    private const string Url = "/api/recordings/" + AudioHash + ".wav";
    private static LessonRecording Recording()
    {
        const string ssml = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"ar-JO\"><voice name=\"ar-JO-TaimNeural\"><sub alias=\"عَامْلِه\">عاملة</sub></voice></speak>";
        return new("عاملة", "Taim", "jordanian", Url, "Owner accepted a qualified synthetic draft; not native review.", "ar-JO", "synthetic",
            new("Microsoft Azure Speech", "ar-JO-TaimNeural", "ar-JO", "not exposed", DateTimeOffset.UtcNow,
                ssml, Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(ssml))), AudioHash,
                "accepted-fallback", "Owner permits fallback with heavy m.", "pending"));
    }
    private static List<string> Check(LessonRecording recording, bool publication = false)
    {
        var errors = new List<string>();
        SyntheticAudioValidator.Validate(recording, Url, publication, "test", errors);
        return errors;
    }

    [Fact]
    public void PendingRightsPassDraftButNeverPublicationAndMetadataRoundTrips()
    {
        var recording = Recording();
        Assert.Empty(Check(recording));
        Assert.Contains(Check(recording, true), e => e.Contains("rights before approval/publication"));
        Assert.Equal(recording, JsonSerializer.Deserialize<LessonRecording>(JsonSerializer.Serialize(recording)));
        var cleared = recording with { Synthesis = recording.Synthesis! with { RightsStatus = "cleared", RightsEvidence = "Test-only permission fixture, not actual provider clearance." } };
        Assert.Empty(Check(cleared, true));
        Assert.NotEmpty(Check(cleared with { Synthesis = cleared.Synthesis! with { ReviewDisposition = "pending" } }, true));
        Assert.NotEmpty(Check(cleared with { Synthesis = cleared.Synthesis! with { RightsEvidence = "" } }));
    }

    [Fact]
    public void ChangedTranscriptRequestHashVoiceOrOutputHashIsRejected()
    {
        var r = Recording();
        Assert.NotEmpty(Check(r with { Transcript = "different" }));
        Assert.NotEmpty(Check(r with { Synthesis = r.Synthesis! with { SsmlSha256 = new string('b', 64) } }));
        Assert.NotEmpty(Check(r with { Synthesis = r.Synthesis! with { Voice = "another voice" } }));
        Assert.NotEmpty(Check(r with { Synthesis = r.Synthesis! with { AudioSha256 = new string('b', 64) } }));
        Assert.NotEmpty(Check(r with { Synthesis = null }));
    }

    [Fact]
    public void LegacyHumanSerializationIsUnchangedAndSyntheticCannotMasqueradeAsHuman()
    {
        var legacy = new LessonRecording("a", "Human", "jordanian", Url, "review");
        var json = JsonSerializer.Serialize(legacy, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        Assert.DoesNotContain("origin", json);
        Assert.DoesNotContain("synthesis", json);
        Assert.Empty(Check(legacy, true));
        Assert.NotEmpty(Check(Recording() with { Origin = "human" }));
        Assert.NotEmpty(Check(Recording() with { Origin = null }));
    }
}
