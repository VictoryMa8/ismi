using System.Text;
using System.Text.RegularExpressions;
using Ismi.Api.Models;
namespace Ismi.Api.Services;

public static class RecallEvaluator
{
    public static string Normalize(string input) => Regex.Replace(
        Regex.Replace(Regex.Replace(input.Normalize(NormalizationForm.FormC).ToLowerInvariant(),
            "[\\u064b-\\u0652\\u0670]", ""), "[.,!?،؛؟:;…]", " "), "\\s+", " ").Trim();
    public static IEnumerable<string> Forms(RecallAnswer answer, string mode) => mode == "arabic"
        ? new[] { answer.Arabic }.Concat(answer.ArabicVariants)
        : new[] { answer.Arabizi }.Concat(answer.ArabiziVariants);
    public static string Evaluate(RecallTarget target, string response, string mode) =>
        target.AcceptedAnswers.Any(a => Forms(a, mode).Any(f => Normalize(f) == Normalize(response))) ? "accepted"
        : target.KnownErrors.Any(a => Forms(a, mode).Any(f => Normalize(f) == Normalize(response))) ? "context-error"
        : "uncertain";
}
