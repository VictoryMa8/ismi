using System.Net;
using System.Text.RegularExpressions;
using Ismi.Api.Models;

namespace Ismi.Api.Services;

public sealed partial class CulturalMediaValidator
{
    [GeneratedRegex("^[a-z0-9][a-z0-9-]{0,79}$")]
    private static partial Regex Identifier();
    private static string DestinationIdentity(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)) return url;
        string? video = null;
        if (uri.Host == "youtu.be") video = uri.AbsolutePath.Trim('/').Split('/')[0];
        if (uri.Host is "youtube.com" or "www.youtube.com")
        {
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            if (query.TryGetValue("v", out var id)) video = id.ToString();
            else if (uri.AbsolutePath.StartsWith("/shorts/") || uri.AbsolutePath.StartsWith("/embed/")) video = uri.AbsolutePath.Split('/').ElementAtOrDefault(2);
        }
        return string.IsNullOrEmpty(video) ? url : "youtube:" + video;
    }
    public static bool SafeUrl(string? value)
    {
        if (value is null || value.Length > 2000 || !Uri.TryCreate(value, UriKind.Absolute, out var url)
            || url.Scheme != "https" || url.UserInfo.Length != 0 || !url.IsDefaultPort
            || url.IsLoopback || IPAddress.TryParse(url.Host.Trim('[', ']'), out _)) return false;
        var host = url.IdnHost.ToLowerInvariant();
        return Uri.CheckHostName(host) == UriHostNameType.Dns && host.Contains('.')
            && !host.EndsWith(".localhost") && !host.EndsWith(".local")
            && !host.EndsWith(".internal") && !host.EndsWith(".test") && !host.EndsWith(".invalid");
    }
    public CulturalValidation Validate(CulturalEdition? edition)
    {
        var errors = new List<string>();
        void Text(string? value, string name, int max = 1000, bool required = true)
        {
            if ((required && string.IsNullOrWhiteSpace(value)) || value is null || value.Length > max
                || value.Contains('<') || value.Contains('>')) errors.Add($"{name}: use plain text, at most {max} characters.");
        }
        bool Id(string? id) => id is not null && Identifier().IsMatch(id);
        if (edition is null) return new(false, ["An edition is required."]);
        if (!Id(edition.Id)) errors.Add("Use a stable lowercase edition ID (letters, numbers and hyphens).");
        Text(edition.Title, "Edition title", 150); Text(edition.Theme, "Theme", 250, false);
        if (edition.WeekStartUtc.Kind != DateTimeKind.Utc || edition.WeekStartUtc.DayOfWeek != DayOfWeek.Monday
            || edition.WeekStartUtc.TimeOfDay != TimeSpan.Zero || edition.WeekStartUtc.Year < 2026)
            errors.Add("Edition must start on Monday at 00:00 UTC, from 2026 onward.");
        if (edition.Items is not { Length: 3 } || edition.Items.Any(i => i is null))
            return new(false, [..errors, "An edition needs exactly three non-null items: YouTube video, film and song."]);
        if (!edition.Items.Select(i => i.Slot).Order().SequenceEqual(new[] { "film", "song", "youtube-video" }))
            errors.Add("Include one YouTube video, one film and one song.");
        var ids = new HashSet<string>(); var primaryUrls = new HashSet<string>();
        foreach (var item in edition.Items)
        {
            if (!Id(item.Id) || !ids.Add(item.Id)) errors.Add("Item IDs must be valid and unique.");
            Text(item.Title, "Title", 200); Text(item.Creator, "Creator", 200);
            if (item.ArabicTitle is not null) Text(item.ArabicTitle, "Arabic title", 200, false);
            foreach (var (value, name) in new[] { (item.Language, "Language"), (item.Dialect, "Dialect"),
                (item.Register, "Register"), (item.DifficultyReason, "Difficulty reason"),
                (item.Description, "Description"), (item.Prompt, "Prompt"),
                (item.TextAlternative, "Text alternative"), (item.SourceEvidence, "Source evidence"),
                (item.ReviewNotes, "Review notes") }) Text(value, name);
            Text(item.ContentNotes, "Content notes", 500, false);
            if (item.Difficulty is not ("supported" or "stretch" or "advanced")) errors.Add("Use supported, stretch or advanced difficulty.");
            if (item.DurationSeconds is < 1 or > 21600 || item.Year is < 1888 or > 2200) errors.Add("Check the work's runtime/year.");
            if (item.Resources is not { Length: > 0 and <= 5 } || item.Resources.Any(r => r is null))
            { errors.Add("Each item needs 1–5 non-null resources."); continue; }
            var primaries = item.Resources.Where(r => r.Purpose == "primary").ToArray();
            if (primaries.Length != 1) errors.Add("Each item needs exactly one primary destination.");
            foreach (var r in item.Resources)
            {
                if (!Id(r.Id) || !ids.Add(r.Id)) errors.Add("Resource IDs must be valid and unique across the edition.");
                if (!SafeUrl(r.Url) || r.TranscriptUrl is not null && !SafeUrl(r.TranscriptUrl)) errors.Add("Resources must use direct public HTTPS destinations without credentials or special ports.");
                if (r.Purpose is not ("primary" or "free-companion" or "alternate")) errors.Add("Unknown resource purpose.");
                if (r.Access is not ("free" or "ad-supported" or "rental" or "subscription")) errors.Add("Access must be checked: free, ad-supported, rental or subscription.");
                if (r.CaptionOrigin is not ("publisher" or "automatic" or "none" or "unknown")
                    || r.CaptionLanguages is null || r.CaptionLanguages.Length > 10
                    || r.CaptionLanguages.Any(l => string.IsNullOrWhiteSpace(l) || l.Length > 80)
                    || r.CaptionOrigin == "none" && r.CaptionLanguages.Length > 0) errors.Add("Check caption languages and origin.");
                if (r.CheckedAtUtc.Kind != DateTimeKind.Utc || r.CheckedAtUtc.Year < 2026) errors.Add("Record an availability check in UTC.");
                if (r.DurationSeconds is < 1 or > 21600 || r.StartSeconds is < 0
                    || r.EndSeconds is < 1 || (r.StartSeconds ?? 0) >= (r.EndSeconds ?? r.DurationSeconds)
                    || (r.EndSeconds ?? r.DurationSeconds) > r.DurationSeconds) errors.Add("Check resource duration and suggested window.");
                Text(r.Platform, "Platform", 100); Text(r.AccessNotes, "Access notes", 500);
                Text(r.Region, "Checked region", 150); Text(r.SupportNotes, "Support notes", 500);
                Text(r.Evidence, "Availability/source evidence");
                if (r.Purpose == "primary")
                {
                    if (!primaryUrls.Add(DestinationIdentity(r.Url))) errors.Add("One destination cannot fill two primary slots.");
                    if (item.Slot == "youtube-video" && SafeUrl(r.Url)
                        && new Uri(r.Url).Host.ToLowerInvariant() is not ("youtube.com" or "www.youtube.com" or "youtu.be"))
                        errors.Add("The video slot must link to YouTube.");
                    if (item.Slot != "film" && r.Access is not ("free" or "ad-supported")) errors.Add("Video and song need a free primary path.");
                }
            }
            if (item.Slot == "film" && !item.Resources.Any(r => r.Purpose == "free-companion" && r.Access is "free" or "ad-supported"))
                errors.Add("The film needs a separately labeled free companion.");
        }
        return new(errors.Count == 0, [.. errors.Distinct()]);
    }
}
