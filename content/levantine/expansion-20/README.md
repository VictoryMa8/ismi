# F12 · Twenty-lesson development preview batch

The owner instructed on October 19, 2026: “Author 20 remaining lessons, leave the
30 to another roadmap checkpoint, mark this done then commit deploy and publish.”
This supersedes review-before-authoring for this batch and authorizes release on
the existing free development preview. It does not invent linguistic/source-rights
acceptance, human recordings, learner outcomes or beta eligibility.

The twenty new lessons occupy course orders **11–30**, five each in:

- Week 3: At home together.
- Week 4: People and plans, including a text-supported month-one rehearsal.
- Week 5: Share a meal.
- Week 6: Around the neighborhood.

Each portable package contains six original dialogue turns, four teaching cards
with explicitly authored chunks, six contextual choice steps with individual
rationales, and three recall targets in immediate/later-message contexts. Totals:
**120 turns, 80 teaching cards, 120 practice steps, 60 recall targets**.
Seven-minute lesson estimates are unmeasured. The month-one rehearsal supplies
text practice; it does not measure five-minute spontaneous/guided speech.

[authoring.json](authoring.json) holds original composed scenes and aligned phrase
chunks. `node scripts/build-levantine-expansion.mjs` produces all twenty packages,
full readable `*-review.md` packets and the [exact manifest](review-manifest.json).
`--check` verifies reproducibility without changing files. The builder never imports,
approves, publishes or calls providers. Original source/package files are retained.

## Source and learner disclosure

Packages retain **pending** review/source-rights dispositions, an empty reviewer,
and explicit absent-audio/access/outcome records. Reference consultation checks
lexical facts; it does not grant copying rights or establish urban naturalness.
All dialogue, contexts, teaching notes and contextual rationales are original
AI-assisted compositions, not reproduced publisher lessons or media. The original
[lexical reference pointers](https://resources.lingualism.com/levantine-arabic/)
are recorded per package, including household/family/food/direction locators.
Human lexical, gender/address, phonetic and pragmatic acceptance remains required.

Normal approval rejects pending new-batch records. The separate preview-approval
route works only with `Curriculum:AllowLevantineExpansionTextPreview`, the exact
embedded twenty-file manifest/package hashes and semantic lesson+source
fingerprints. It writes **Unreviewed · text-only preview**, preserving pending
records. The flag is enabled only in the existing development-preview startup
script and disposable browser/test servers; its application default is off.
Changed content, sources, audio or an additional lesson does not match the exception.
The ordinary review path remains available for genuinely accepted future versions.

Existing Everyday publications, F12.1 Plans drafts, F12.2 correction candidates,
French/Khmer exceptions, audio assets and user data are outside this batch.
No prior correction is silently applied over newer published content.

## Deferred depth and verification

The owner moved the final thirty slots (weeks 7–12, orders 31–60) to **F12.6**.
Full-course human/source/audio/outcome/access acceptance remains **F12.5**.
Current feature state, application/content delivery and next actors live only in
[ROADMAP.md](../../../ROADMAP.md#f12-levantine-course-expansion).

API tests use disposable databases and include exact draft validation/import,
idempotency, preview approval/publication/privacy, disabled/mutated/extra scope
rejection, pending reviewer/rights retention, and expected course order. Browser
checks exercise text-only learner notices, teaching, practice, offline completion
and reconnection against test publications, without claiming physical-device or
screen-reader acceptance. Release evidence is linked from the feature note.
