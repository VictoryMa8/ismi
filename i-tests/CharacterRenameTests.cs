using System.Text.Json;
using Ismi.Api.Models;
using Ismi.Api.Services;

namespace Ismi.Api.Tests;

public sealed class CharacterRenameTests
{
    [Theory]
    [InlineData("خلينا نطبخ سوا. لينا هون.", "خلينا نطبخ سوا. فتوش هون.")]
    [InlineData("علينا وبالينا", "علينا وبالينا")]
    public void ArabicNameMigrationPreservesWordsInPlainAndEscapedJson(string before, string expected)
    {
        Assert.Equal(expected, CharacterRegistry.CurrentNames(before));
        var encoded = JsonSerializer.Serialize(new { text = before });
        using var parsed = JsonDocument.Parse(CharacterRegistry.CurrentNames(encoded));
        Assert.Equal(expected, parsed.RootElement.GetProperty("text").GetString());
        var literal = JsonSerializer.Serialize(new { text = @"\u0644\u064A\u0646\u0627" });
        using var literalParsed = JsonDocument.Parse(CharacterRegistry.CurrentNames(literal));
        Assert.Equal(@"\u0644\u064A\u0646\u0627", literalParsed.RootElement.GetProperty("text").GetString());
    }

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
