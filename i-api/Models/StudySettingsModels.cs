namespace Ismi.Api.Models;

public sealed record StudyPreferences(int GoalMinutes, IReadOnlyList<string> SelectedTrackIds, string PrimaryTrack)
{
    public static StudyPreferences Default => new(15, ["levantine"], "levantine");
    public static readonly string[] TrackIds = ["levantine", "msa", "quranic"];
    public bool IsValid() => GoalMinutes is 5 or 10 or 15 or 30
        && SelectedTrackIds is { Count: > 0 and <= 3 }
        && SelectedTrackIds.All(id => TrackIds.Contains(id))
        && SelectedTrackIds.Distinct().Count() == SelectedTrackIds.Count
        && SelectedTrackIds.Contains(PrimaryTrack);
}

public sealed record StudySettingsResponse(StudyPreferences Preferences, long Revision);
public sealed record SaveStudySettingsRequest(StudyPreferences Preferences, long Revision);
