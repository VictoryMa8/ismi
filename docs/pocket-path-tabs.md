# Pocket Path learner tabs

The owner approved the four learner-tab mockups on November 4 and requested
more space in Progress and a push to the existing development preview. The
mockups use sample data. The application reads course, review, progress and
glossary state from the existing learner flows.

## Implementation

- Courses shows the next lesson and a unit map that expands on demand.
  Lesson order, manual access, completed-unit checkpoints, MSA paths and
  exact preview labels come from the existing course catalog.
- Practice uses the due-review queue as its first action. Mixed review,
  mistakes, checkpoints, written recall, lesson practice and reference
  resources are available through the same study flows.
- Progress leads with written outcomes. The skills section, course total
  and Study habits have 20–28 px between them, with taller skill rows and
  expandable practice/evidence. Streak, weekly activities and achievement
  controls use the existing device-local preferences.
- Words opens with search and compact results. Filters expand below the
  search row. Entry details provide pronunciation help, audio when supplied,
  source context and direct teaching-card entry.

## Local verification

- Beta **0.0.20** passed the production build. Chromium checks covered tab
  navigation and reflow at 320, 390, 768 and 1280 px, course switching, direct
  due-review start and focus return, habit controls, outcome evidence,
  search and filtering, audio, and offline course and glossary access.
- Inspected the Progress layout at mobile and desktop sizes and checked
  the gaps between skills, course progress and Study habits.
- The saved curriculum preview focus assertion and the guest writing
  availability assertion after account logout also fail on a clean build
  of the previous deployed commit, `59f86b1`.

## Preview rollout

On November 4, the push to `main` deployed application commit
`4f60b41e93a1b02aa213ca4301fed850d41b9278`.
[Vercel marked the deployment Ready](https://vercel.com/victorys-projects-c1cb4594/ismi/6Tyg1skA3aDnuo8nYy2QVRhygSU7)
and assigned both existing preview aliases. A guest Chromium session saw
Beta 0.0.20 on both aliases and verified the Courses map, Practice resources,
Progress habits and Words filters. At 390 px, the two gaps between the
Progress sections each measured 20 px.
