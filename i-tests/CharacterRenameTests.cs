using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;

namespace Ismi.Api.Tests;

public sealed class CharacterRenameTests
{
    [Fact]
    public void LegacyPublicationCanBeReadWithCurrentNamesWithoutRewritingSnapshot()
    {
        var path = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,
            "../../../../content/levantine/everyday-01/revisions/characters/01-lesson.json"));
        var snapshot = File.ReadAllText(path)
            .Replace("Fattoush", "Lina").Replace("Knafeh", "Omar")
            .Replace("fattoush", "lina").Replace("knafeh", "omar").Replace("فتوش", "لينا");
        using var original = JsonDocument.Parse(snapshot);
        var storedJson = JsonSerializer.Serialize(original.RootElement);
        using var document = JsonDocument.Parse(CharacterRegistry.CurrentNames(storedJson));
        var lesson = document.RootElement.GetProperty("lesson").Deserialize<LessonResponse>(
            new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
        var errors = new List<string>();
        CharacterRegistry.Validate(lesson, errors);
        Assert.Empty(errors);
        Assert.Equal("فتوش", lesson.Steps[2].Prompt.Arabic);
        Assert.Equal("fattoush", lesson.Characters!.CharacterIds[0]);
        Assert.Equal("Fattoush → Knafeh", lesson.Introduction!.Dialogue[0].Speaker);
        Assert.Contains("Lina → Omar", snapshot);
        Assert.DoesNotContain("Lina", JsonSerializer.Serialize(lesson));
    }
}
