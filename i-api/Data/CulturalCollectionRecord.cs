namespace Ismi.Api.Data;

public sealed class CulturalCollectionRecord
{
    public string Id { get; set; } = "";
    public DateTime WeekStartUtc { get; set; }
    public long Revision { get; set; }
    public string StateJson { get; set; } = "";
}
