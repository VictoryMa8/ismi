# Pocket Path learner refresh

The owner selected Pocket Path and the calligraphic Red Seal, then approved the
solid green banner with rounded corners and asked to apply it in the learner
app. The bounded change covers Today, the learner header and the lesson
presentation. Existing course, review, reading and resume flows supply the
underlying behavior. This scope includes automated viewport, keyboard and
offline checks.

## Implementation

- Today places course progress, the single next or resumed lesson, and due
  review along one path. The Levantine banner uses solid green and rounded
  corners. Other courses retain their own card colors. Streak settings and
  progress remain in Progress. The daily goal, queue, and allocation controls
  still use the existing study plan.
- The compact course picker uses the existing course selection and switching
  logic. The Red Seal appears in the mobile header and desktop sidebar as a
  local vector made from [Amiri Bold](https://github.com/google/fonts/tree/main/ofl/amiri).
- Lessons show the active stage and place the authored dialogue first.
  Translations are available per turn. Scene context, optional script help,
  and review records are accessible below the dialogue. Lessons use the
  fixed frame, internal scroll region, reading preferences and saved checkpoints.
- Application version: **Beta 0.0.19**.

## November 4 verification

- The production build passed and the Account and About screens displayed
  Beta 0.0.19 from the package version.
- Across the Chromium runs, 68 distinct checks passed. The final focused
  rerun passed all 35 checks for landing return, Today and offline resume,
  reading comfort, and the character lesson layouts. The separate Everyday
  walkthrough passed keyboard translation reveal, seven offline lesson
  completions, checkpoint review and reconnect sync in a disposable database.
- Chromium verification used emulated and desktop viewports from 320 to
  1440 px. Physical-device and assistive-technology verification remain part
  of the broader release gates.

## Preview rollout

On November 4 the owner requested push. Commit `a0e9de5` on `main` reached
Vercel Ready for the [Ismi development preview](https://ismi-arabic.vercel.app/).
The `ismi-ruby.vercel.app` alias redirected to the same app. A clean Chromium
session loaded Beta 0.0.19 through both aliases. At 390 px, Today showed the
Red Seal and rounded green card, and opening a live lesson revealed the
first dialogue translation on demand.
[Deployment record](https://vercel.com/victorys-projects-c1cb4594/ismi/EJ1Xhn22tsz3CBp7968XWuY6E4w2)
