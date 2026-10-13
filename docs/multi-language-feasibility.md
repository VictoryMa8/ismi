# French, Khmer and parallel language study

Assessment October 12, 2026. The owner subsequently authorized expanding the product
roadmap to French, Khmer and parallel language study. The current plans are F24–F26
in [ROADMAP.md](../ROADMAP.md#f24-multi-language-foundation-and-parallel-study).
No implementation, publication or deployment is authorized by this planning request;
inclusion in the first-100 beta remains a decision.

## What can be reused

F15.1 already supports several selected tracks, a primary track, separate lesson
completion accounting and a daily queue. Guest/account settings, downloaded lessons,
offline completion, review and the curriculum console provide reusable foundations.
Only Levantine publication is currently enabled; selecting another Arabic track
does not establish a delivered course.

## Work required

- Introduce language/course metadata: language code, script direction, font,
  pronunciation-help conventions and audio locale. Preserve distinct Levantine,
  MSA and Quranic courses within Arabic, including Quran-specific source controls.
- Generalize the `arabic`/`arabizi` prompt, answer, chunk and vocabulary fields with
  compatibility for published Arabic packages, old downloads and pending progress.
- Replace fixed Arabic direction, language tags, fonts, playback labels and device
  voice selection in teaching, exercises, reviews and the glossary.
- Extend the client track registry and server settings validation, which currently
  allow only three Arabic tracks and at most three selections. Make availability
  depend on published content rather than the existing Levantine-only UI shortcut.
- Extend publication validation deliberately for each new course, keeping source,
  explanation, audio and approval requirements; do not remove Quranic safeguards.
- Review scheduling for short goals with several languages. The current 60% primary
  allocation can leave secondary courses tiny or zero allocations, while whole
  lessons can exceed their allocation. Rotating secondary courses across days is a
  recommendation for later agreement, not an adopted scheduling policy.

French is the simpler first integration for text rendering. Khmer requires dedicated
font/layout, pronunciation-help, input and accessibility verification. The current
phrase builder splits text on whitespace; it needs authored segments for Khmer
rather than automatically treating spaces as word boundaries. Unicode identifies
Khmer as requiring tailored word and line boundary handling:
[Unicode Text Segmentation](https://www.unicode.org/reports/tr29/#Word_Boundaries).
The [W3C draft Khmer gap analysis](https://www.w3.org/TR/khmr-gap/) provides browser
layout issues to check; it is a work in progress, not a claim that all Khmer web
rendering is broken.

## Difficulty and proposed first scope

The shared language foundation is moderate engineering work, on the order of weeks
for a bounded, tested pilot rather than a settings-only change. This is an initial
judgment from source inspection, not a delivery estimate. Reliable full courses are
a substantially larger authoring, audio, review and learner-verification effort;
no defensible completion date exists without agreed depth and source/reviewer access.
Live speaking-provider suitability has not been evaluated for either language.

For the adopted roadmap expansion, recommend generalizing the foundation once,
then integrating one short French unit and one short Khmer unit and verifying
mixed-language settings, rendering, review, offline reload/completion and reconnection.
English remains the teaching/interface language for that proposed pilot. Define
target learner level, course variety, outcomes and content/audio review arrangements
before authoring. F24–F26 now contain the child tasks, proposed course sequences,
decisions and completion criteria; this note remains inspection evidence, not a
second status document.

Inspection basis: `i-web/src/studyPlan.ts`, `types.ts`, `StudySettings.vue`,
`App.vue`, `LessonTeaching.vue`, `PhraseBuilder.vue`, `style.css`;
`i-api/Models/StudySettingsModels.cs`, `LessonModels.cs` and
`i-api/Services/CurriculumValidator.cs`. No application changes or runtime checks.
