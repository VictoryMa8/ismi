using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;
using Ismi.Api.Models;

namespace Ismi.Api.Services;

public static class SyntheticAudioValidator
{
    public static void Validate(LessonRecording recording, string? audioUrl, bool forPublication, string label, List<string> errors)
    {
        if (recording.Origin is not (null or "human" or "synthetic"))
            errors.Add($"{label} has an unknown audio origin.");
        if (recording.Origin != "synthetic")
        {
            if (recording.Synthesis is not null) errors.Add($"{label} cannot present synthetic provenance as a human recording.");
            return;
        }
        var synthesis = recording.Synthesis;
        if (synthesis is null)
        {
            errors.Add($"{label} needs structured synthetic audio provenance.");
            return;
        }
        foreach (var field in new[] { synthesis.Provider, synthesis.Voice, synthesis.Locale, synthesis.ModelRevision })
            if (string.IsNullOrWhiteSpace(field)) errors.Add($"{label} needs provider, voice, locale and model revision (or 'not exposed').");
        static bool Hash(string? value) => value is not null && Regex.IsMatch(value, "\\A[a-f0-9]{64}\\z");
        if (!Hash(synthesis.AudioSha256) || audioUrl != $"/api/recordings/{synthesis.AudioSha256}.wav")
            errors.Add($"{label}'s synthetic output hash must match its uploaded asset.");
        if (synthesis.GeneratedAt == default || synthesis.GeneratedAt > DateTimeOffset.UtcNow.AddMinutes(5))
            errors.Add($"{label} needs a valid synthesis timestamp.");
        if (string.IsNullOrWhiteSpace(synthesis.Ssml) || synthesis.Ssml.Length > 16000 || !Hash(synthesis.SsmlSha256)
            || synthesis.SsmlSha256 != Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(synthesis.Ssml ?? ""))))
            errors.Add($"{label} needs the exact synthesis request and matching SHA-256.");
        else
        {
            try
            {
                using var reader = XmlReader.Create(new StringReader(synthesis.Ssml!), new XmlReaderSettings
                { DtdProcessing = DtdProcessing.Prohibit, XmlResolver = null, MaxCharactersInDocument = 16000 });
                var root = XDocument.Load(reader).Root;
                XNamespace ns = "http://www.w3.org/2001/10/synthesis";
                var voices = root?.Descendants(ns + "voice").ToArray() ?? [];
                if (root?.Name != ns + "speak" || root.Value != recording.Transcript || voices.Length != 1
                    || (string?)voices[0].Attribute("name") != synthesis.Voice
                    || (string?)root.Attribute(XNamespace.Xml + "lang") != synthesis.Locale)
                    errors.Add($"{label}'s synthesis request must retain the exact transcript, voice and locale.");
            }
            catch (XmlException) { errors.Add($"{label} has invalid synthesis SSML."); }
        }
        if (synthesis.ReviewDisposition is not ("pending" or "accepted" or "accepted-fallback"))
            errors.Add($"{label} needs an explicit synthetic listening disposition.");
        if (synthesis.RightsStatus is not ("pending" or "cleared"))
            errors.Add($"{label} needs an explicit synthetic audio rights status.");
        if (synthesis.RightsStatus == "cleared" && string.IsNullOrWhiteSpace(synthesis.RightsEvidence))
            errors.Add($"{label} needs evidence of synthetic playback and offline redistribution rights.");
        if (forPublication)
        {
            if (synthesis.ReviewDisposition is not ("accepted" or "accepted-fallback") || string.IsNullOrWhiteSpace(synthesis.OwnerReview))
                errors.Add($"{label} needs recorded owner listening acceptance before synthetic audio publication.");
            if (synthesis.RightsStatus != "cleared" || string.IsNullOrWhiteSpace(synthesis.RightsEvidence))
                errors.Add($"{label} needs cleared synthetic playback and offline redistribution rights before approval/publication.");
        }
    }
}
