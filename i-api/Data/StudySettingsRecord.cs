namespace Ismi.Api.Data;

public sealed class StudySettingsRecord
{
    public required string UserId { get; set; }
    public required string PreferencesJson { get; set; }
    public long Revision { get; set; }
    public ApplicationUser User { get; set; } = null!;
}
