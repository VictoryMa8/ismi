using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed class AlphabetValidator
{
    public static bool Id(string? id) => id is not null && Regex.IsMatch(id, @"\A[a-z0-9][a-z0-9-]{0,79}\z");
    // Drafts may be incomplete, but must be structurally safe to validate/preview.
    public static bool Bounded(AlphabetPack? p)
    {
        if (p is null || !Id(p.Id) || CourseCatalog.Find(p.CourseId) is null || p.Inventory is null
            || p.Inventory.BasicEntryIds is null || p.Inventory.Entries is null || p.Entries is null || p.Sources is null
            || (p.Fonts is not null && p.Fonts.Any(f => f is null))
            || p.Entries.Length > 160 || p.Inventory.Entries.Length > 160 || p.Sources.Length > 500) return false;
        return p.Inventory.Entries.All(e => e is not null && e.Forms is not null && e.Forms.All(f => f is not null))
            && p.Sources.All(s => s is not null) && p.Entries.All(e => e is not null && e.SourceIds is not null
                && e.NameAudio is not null && e.SoundAudio is not null && e.Examples is not null && e.Activities is not null
                && e.Examples.Length <= 6 && e.Activities.Length <= 16
                && e.Examples.All(w => w is not null && w.SourceIds is not null && w.Occurrences is not null && w.Audio is not null)
                && e.Activities.All(a => a is not null && a.Choices is not null && a.AcceptedIds is not null && a.Choices.Length <= 12 && a.Choices.All(c => c is not null)))
            && JsonSerializer.Serialize(p).Length < 2_000_000;
    }
    public AlphabetValidation Validate(AlphabetPack p)
    {
        var errors = new List<string>();
        void Need(bool value, string message) { if (!value) errors.Add(message); }
        bool Text(string? s) => !string.IsNullOrWhiteSpace(s);
        bool Unique(IEnumerable<string> ids) { var a = ids.ToArray(); return a.All(Id) && a.Distinct().Count() == a.Length; }
        if (!Bounded(p)) return new(false, ["Use a bounded, structurally complete pack object."]);
        Need(!p.EngineeringFixture, "Engineering fixtures cannot be approved or published.");
        Need(p.CourseId is not ("msa" or "quranic"), "MSA/Quranic alphabet publication awaits track-specific source and integrity controls.");
        Need(Text(p.Title) && Text(p.Variety) && Text(p.HelpConvention), "Record the title, reference variety and pronunciation-help convention.");
        Need(Text(p.Reviewer) && Text(p.ReviewEvidence), "Record actual linguistic review of this exact pack.");
        var fonts = p.Fonts ?? [];
        Need(p.CourseId != "khmer" || fonts.Any(f => f.Url == "/fonts/NotoSansKhmer.ttf"), "Khmer packs require their pinned offline font.");
        Need(fonts.Length <= 1 && fonts.All(f => f is not null && f.Url == "/fonts/NotoSansKhmer.ttf" && Regex.IsMatch(f.Hash ?? "", @"\A[a-f0-9]{64}\z")), "Use supported font assets with exact hashes.");
        var inv = p.Inventory;
        Need(Id(inv.Id) && inv.Version > 0 && Text(inv.Reviewer) && Text(inv.ReviewEvidence), "Pin a reviewed script inventory and version.");
        Need(Unique(inv.Entries.Select(e => e.Id)) && Unique(p.Entries.Select(e => e.Id)) && Unique(p.Sources.Select(s => s.Id)), "Entry and source IDs must be unique and stable.");
        Need(inv.BasicEntryIds.Length > 0 && Unique(inv.BasicEntryIds), "Declare the agreed basic inventory.");
        Need(p.Entries.Select(e => e.Id).Order().SequenceEqual(inv.Entries.Select(e => e.Id).Order())
            && inv.BasicEntryIds.All(id => inv.Entries.Any(e => e.Id == id)), "Teaching coverage must exactly match the pinned inventory.");
        foreach (var s in p.Sources)
            Need(Text(s.Citation) && Text(s.Locator) && Text(s.Version) && Text(s.RightsEvidence)
                && s.TextCleared && s.AdaptationCleared && s.OfflineCleared, $"{s.Id}: exact source/version and text/adaptation/offline rights are required.");
        void Sources(string[] ids, string label) => Need(ids.Length > 0 && ids.Distinct().Count() == ids.Length
            && ids.All(id => p.Sources.Any(s => s.Id == id)), $"{label}: link exact source records.");
        void Clip(AlphabetClip c, string label) => Need(RecordingStore.IsUrl(c.Url) && Text(c.Transcript) && Text(c.Speaker)
            && c.Variety == p.Variety && Text(c.Reviewer) && Text(c.ReviewEvidence) && Text(c.RightsEvidence)
            && c.HumanRecording && c.OfflineCleared, $"{label}: a reviewed human recording, exact transcript, variety and offline rights are required.");
        foreach (var s in inv.Entries)
        {
            Need(Text(s.Text) && Text(s.Category) && s.Forms.Length > 0 && s.Forms.All(f => Text(f.Label) && Text(f.Text) && Text(f.Note)), $"{s.Id}: record category and applicable forms with context notes.");
            if (s.Category == "basic") Need(inv.BasicEntryIds.Contains(s.Id), $"{s.Id}: basic entries must be declared in the inventory.");
        }
        foreach (var e in p.Entries)
        {
            Need(Text(e.Name) && Text(e.Note) && Text(e.SoundContext), $"{e.Id}: distinguish the name, sound context and usage note.");
            Sources(e.SourceIds, e.Id); Clip(e.NameAudio, e.Id + " name"); Clip(e.SoundAudio, e.Id + " contextual sound");
            Need(e.NameAudio.Transcript == e.Name, $"{e.Id}: name clip transcript must match its reviewed name.");
            Need(Unique(e.Examples.Select(w => w.Id)) && e.Examples.Length >= (inv.BasicEntryIds.Contains(e.Id) ? 2 : 1)
                && (!inv.BasicEntryIds.Contains(e.Id) || e.Examples.Length <= 3), $"{e.Id}: basic letters need two or three distinct examples; support entries need a demonstration.");
            foreach (var w in e.Examples)
            {
                Sources(w.SourceIds, w.Id); Clip(w.Audio, w.Id);
                Need(Text(w.Text) && Text(w.Meaning) && Text(w.Note) && w.Audio.Transcript == w.Text, $"{w.Id}: preserve exact word/transcript, meaning and contextual note.");
                Need(ValidTargets(w), $"{w.Id}: target locators must cover every intended exact occurrence at Unicode text-element boundaries.");
            }
            Need(Unique(e.Activities.Select(a => a.Id)) && new[] { "shape", "listening", "spot", "repeat" }.All(k => e.Activities.Any(a => a.Kind == k)), $"{e.Id}: include all four practice activities.");
            foreach (var a in e.Activities)
            {
                Need(new[] { "shape", "listening", "spot", "repeat" }.Contains(a.Kind) && Text(a.Prompt) && Text(a.Explanation) && Text(a.Rationale), $"{a.Id}: reviewed prompt, explanation and accepted-answer rationale required.");
                Need(a.Kind == "repeat" ? a.Choices.Length == 0 && a.AcceptedIds.Length == 0
                    : a.Choices.Length >= 2 && Unique(a.Choices.Select(c => c.Id)) && a.Choices.All(c => Text(c.Text))
                        && a.Choices.Select(c => c.Text).Distinct().Count() == a.Choices.Length
                        && a.AcceptedIds.Length > 0 && a.AcceptedIds.Distinct().Count() == a.AcceptedIds.Length
                        && a.AcceptedIds.All(id => a.Choices.Any(c => c.Id == id)) && a.AcceptedIds.Length < a.Choices.Length,
                    $"{a.Id}: use unambiguous structured answers; repeat-aloud is unscored.");
                Need(a.ExampleId is null || e.Examples.Any(w => w.Id == a.ExampleId), $"{a.Id}: unknown example.");
                Need(a.Kind != "spot" || a.ExampleId is not null, $"{a.Id}: word spotting requires an authored example.");
                var urls = new[] { e.NameAudio.Url, e.SoundAudio.Url }.Concat(e.Examples.Select(w => w.Audio.Url));
                Need(a.AudioUrl is null || urls.Contains(a.AudioUrl), $"{a.Id}: audio must reference this entry's reviewed clips.");
                Need(a.Kind is not ("listening" or "repeat") || a.AudioUrl is not null, $"{a.Id}: listening/repeat requires model audio.");
            }
        }
        return new(errors.Count == 0, [.. errors]);
    }
    public static bool ValidTargets(AlphabetExample w)
    {
        if (string.IsNullOrEmpty(w.Text) || string.IsNullOrEmpty(w.Target) || w.Occurrences.Length == 0) return false;
        var boundaries = StringInfo.ParseCombiningCharacters(w.Text).Append(w.Text.Length).ToHashSet();
        var found = new List<int>();
        for (var start = 0; start <= w.Text.Length - w.Target.Length; start++)
            if (w.Text.AsSpan(start, w.Target.Length).SequenceEqual(w.Target) && boundaries.Contains(start) && boundaries.Contains(start + w.Target.Length)) found.Add(start);
        return found.SequenceEqual(w.Occurrences);
    }
}
