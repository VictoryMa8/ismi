using Ismi.Api.Models;

namespace Ismi.Api.Services;

// Bundled identity contract. Asset revisions are retained in the frontend shell.
public static class CharacterRegistry
{
    public const string Version = "ismi-cast-v1";
    private static readonly IReadOnlyDictionary<string, string> Names = new Dictionary<string, string>
    {
        ["lina"] = "Lina", ["omar"] = "Omar"
    };

    public static void Validate(LessonResponse lesson, List<string> errors)
    {
        var cast = lesson.Characters;
        if (cast is not null)
        {
            if (cast.RegistryVersion != Version) errors.Add("Unknown character registry version.");
            if (cast.CharacterIds is null || cast.CharacterIds.Count is < 1 or > 2)
                errors.Add("Character cast needs one or two bundled character IDs.");
            else
            {
                if (cast.CharacterIds.Distinct(StringComparer.Ordinal).Count() != cast.CharacterIds.Count)
                    errors.Add("Character cast has duplicate IDs.");
                foreach (var id in cast.CharacterIds)
                    if (id is null || !Names.ContainsKey(id)) errors.Add($"Unknown character ID '{id}'.");
            }
        }

        bool Known(string? id) => id is not null && Names.ContainsKey(id);
        void Pair(string? speaker, string? addressee, string label, bool required = false)
        {
            if (!required && speaker is null && addressee is null) return;
            if (speaker is null || addressee is null) errors.Add($"{label}: both speaker and addressee IDs are required.");
            foreach (var id in new[] { speaker, addressee }.Where(id => id is not null))
            {
                if (!Known(id)) errors.Add($"{label}: unknown character ID '{id}'.");
                if (cast?.CharacterIds?.Contains(id!) != true)
                    errors.Add($"{label}: character '{id}' must be in this lesson's cast.");
            }
            if (speaker is not null && speaker == addressee) errors.Add($"{label}: speaker and addressee must differ.");
        }

        foreach (var turn in lesson.Introduction?.Dialogue ?? [])
        {
            Pair(turn.SpeakerId, turn.AddresseeId, "Dialogue");
            // Display strings remain intact; explicit identities must agree with authored labels.
            if (Known(turn.SpeakerId) && Known(turn.AddresseeId) &&
                turn.Speaker != Names[turn.SpeakerId!] &&
                turn.Speaker != $"{Names[turn.SpeakerId!]} → {Names[turn.AddresseeId!]}")
                errors.Add("Dialogue character roles conflict with the speaker label.");
            if (cast is not null && turn.SpeakerId is null) errors.Add("A character scene needs explicit dialogue speaker/addressee IDs.");
        }
        foreach (var card in lesson.Introduction?.TeachingCards ?? [])
            Pair(card.SpeakerId, card.AddresseeId, $"Teaching card '{card.Title}'");
        foreach (var step in lesson.Steps)
        {
            if (step.Characters is not { } roles) continue; // Generic cues can stay neutral.
            Pair(roles.SpeakerId, roles.AddresseeId, $"Step '{step.Id}' prompt");
            Pair(roles.ResponseSpeakerId, roles.ResponseAddresseeId, $"Step '{step.Id}' response", true);
            if (roles.SpeakerId is not null && roles.ResponseSpeakerId is not null &&
                !((roles.ResponseSpeakerId == roles.AddresseeId && roles.ResponseAddresseeId == roles.SpeakerId) ||
                  (roles.ResponseSpeakerId == roles.SpeakerId && roles.ResponseAddresseeId == roles.AddresseeId)))
                errors.Add($"Step '{step.Id}': response roles conflict with prompt participants.");
        }
    }
}
