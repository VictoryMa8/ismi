using Ismi.Api.Models;

namespace Ismi.Api.Services;

// Independent, default-off exceptions. Sharing plumbing grants no extra packages.
public sealed class CourseTextPreviewPolicy(KhmerTextPreviewPolicy khmer, FrenchTextPreviewPolicy french, LevantineExpansionTextPreviewPolicy? expansion = null)
{
    public LessonPublicationNotice? NoticeFor(LessonResponse lesson) => lesson.TrackId switch {
        "khmer" => KhmerTextPreviewPolicy.Notice,
        "french" => FrenchTextPreviewPolicy.Notice,
        "levantine" when LevantineExpansionTextPreviewPolicy.IsExpansionLesson(lesson.Id) => LevantineExpansionTextPreviewPolicy.Notice,
        _ => null
    };

    public bool IsAuthorized(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources) =>
        khmer.IsAuthorized(lesson, sources) || french.IsAuthorized(lesson, sources)
        || expansion?.IsAuthorized(lesson, sources) == true;
}
