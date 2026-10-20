namespace Ismi.Api.Models;

public sealed record CourseMetadata(string Id, string LanguageId, string LanguageName, string Name,
    string Tag, string Direction, string Font, string HelpLabel, string AudioLocale, string GroupId, string PathName);

public static class CourseCatalog
{
    public static readonly CourseMetadata[] All = [
        new("levantine", "arabic", "Arabic", "Palestinian Levantine", "ar-PS", "rtl", "arabic", "Transliteration", "ar-PS", "levantine", ""),
        new("msa", "arabic", "Arabic", "Modern Standard Arabic", "ar", "rtl", "arabic", "Transliteration", "ar", "msa", "General MSA"),
        new("quranic", "arabic", "Arabic", "MSA · Quranic Arabic", "ar", "rtl", "arabic", "Transliteration", "ar", "msa", "Quranic Arabic"),
        new("french", "french", "French", "French", "fr", "ltr", "latin", "Pronunciation help", "fr", "french", ""),
        new("khmer", "khmer", "Khmer", "Khmer", "km", "ltr", "khmer", "Pronunciation help", "km-KH", "khmer", "")
    ];
    public static CourseMetadata? Find(string id) => All.FirstOrDefault(c => c.Id == id);
}

// Explicit author/reviewer attestations travel with each new-language release.
// These fields report the actual review route; they do not imply expert approval.
public sealed record CourseContentReview(string LanguageTag, string Variety, string HelpConvention,
    string Reviewer, string ReviewDisposition, string RightsDisposition,
    IReadOnlyList<string> CriticalIssues, bool EngineeringFixture = false,
    IReadOnlyDictionary<string, string>? SourceLanguages = null);
