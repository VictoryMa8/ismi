using Ismi.Api.Models;

namespace Ismi.Api.Services;

// Independent, default-off exceptions. Sharing plumbing grants no extra packages.
public sealed class CourseTextPreviewPolicy(KhmerTextPreviewPolicy khmer, FrenchTextPreviewPolicy french)
{
    public LessonPublicationNotice? NoticeFor(LessonResponse lesson) => lesson.TrackId switch {
        "khmer" => KhmerTextPreviewPolicy.Notice,
        "french" => FrenchTextPreviewPolicy.Notice,
        _ => null
    };

    public bool IsAuthorized(LessonResponse lesson, IReadOnlyCollection<CurriculumSourceInput> sources) =>
        khmer.IsAuthorized(lesson, sources) || french.IsAuthorized(lesson, sources);
}
