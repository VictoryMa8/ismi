namespace Ismi.Api.Data;
public sealed class AlphabetPackRecord
{
    public string Id { get; set; } = "";
    public string CourseId { get; set; } = "";
    public long Revision { get; set; }
    public string StateJson { get; set; } = "";
}
