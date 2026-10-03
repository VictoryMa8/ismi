# Landing page implementation

Current feature status and next actions live in [the roadmap](../../ROADMAP.md#f07-landing-page-and-app-welcome).
This file supplies design/implementation evidence; historical checks are dated checkpoints.

## Current owner revision

The hero is now outlined as one complete image, with no surrounding decorative
bubble. Green, red and gold surfaces replace the pastel fills across the landing
and welcome cards. Reload disables browser scroll restoration and clears a
landing section hash before hydration, then resets scroll at page show. Learner
routes remain intact on reload; explicit section links still navigate normally.

The owner's shortened wording is preserved. The sample entry links now say
“Try out the app” and open `/#/today`; obsolete sample-only notes were removed.
The isolated sample component is retired, with its unapproved source-linked
proposal archived in `retired-sample-proposal.json` for provenance.

First app entry presents a skippable three-card “Before we let you loose”
dialog. Completion, Skip intro or Escape records only the device-local
`ismi-welcome-v1` preference. No lesson progress or curriculum state changes.
The dialog traps keyboard focus, makes the learner background inert, supports
enlarged text and restores focus to the learner page. Storage failure still
allows entry and avoids repeating the intro within the current page session.

Both learner layouts expose “Back to landing page”; the Ismi logo also returns
to the landing page. Return navigation resets scroll to the top and preserves
browser history. The palette uses richer green, red and gold surfaces.
Portrait sizing uses `--portrait-size` consistently, fixing the
conflicting width/flex-basis rules that distorted the sprite cells.

The updated landing/navigation browser checks cover 320/390/768/1440 px,
portrait geometry, three-card navigation, skip/Escape, focus containment,
return links, reload persistence, unavailable storage/art/API, 200% text,
and prerendered root HTML. These changes remain local; no deployment or
curriculum publication is included.

## Earlier implementation notes

The notes below record the initial implementation; sample behavior is superseded
by the revision above.

October 2, 2026. Local implementation of [the plan](../landing-page-plan.md).
The root renders the marketing page; existing learner hash routes still open the
learner app. Learner code loads only on entry. Installed PWAs start at
`/#/today`. A build-time Vue render fills the root HTML before Workbox computes
its revision, and the browser hydrates that same page. Marketing artwork is
excluded from essential PWA precaching.

The page includes the hero, personal relevance, three method stages, an isolated
sample, four learning benefits, explicit track status, development/beta status,
eight FAQ disclosures and repeated sample entry. The return link uses a local
visited marker; it does not claim a valid authenticated session.

The sample is a bounded **local preview awaiting owner publication approval**.
It bundles only two dialogue turns and the first contextual exercise from the
character proposal for lesson 1. Its accepted answer and all answer rationales
are copied from that package. The source links remain available in the dialog.
This implementation is not approval of the other lesson drafts. The sample
uses in-memory state and the shared deterministic evaluator, with no API calls,
voice capture, IndexedDB, XP, minutes, completion queue or review-history writes.
It supports optional meanings, recall before reveal, feedback, unlimited retry,
replay, keyboard focus trapping, Escape and focus restoration. It remains
usable offline after its lazily loaded module arrives.

There is no invitation form, email collection, provider, enforced invitation
gate, contact address or new policy text. The plan explicitly permits the
informational development-preview milestone while those decisions are pending.
No fictional contact, privacy or terms destinations are published.

## Characters

Fattoush replaces the woman’s previous name and Knafeh replaces the man’s.
Designs, rows, gendered teaching roles and the `ismi-cast-v1` asset remain the
same. Current source packages, exercise copy, character mappings, review notes,
documentation and tests use the new names. The isolated Arabic name prompt now
uses فتوش. Other Arabic teaching content is unchanged.

Compatibility adapters read old published/database and offline package names
and IDs as their current names. They do not rewrite stored publications, audit
history, progress or account identities. Old names remain only in compatibility
code and the regression fixture that tests it. Source-package manifests retain
pre-rename hashes and distinguish predecessor publication records from the
renamed files; no database package import, approval or publication occurred.

## Art and metadata

[Generation prompts](generation-prompts.txt) and [asset provenance](asset-provenance.json)
record built-in image_gen authorship, reference identities, original images,
responsive WebP conversion, byte sizes and hashes. Hero text and Arabic are HTML,
with decorative artwork. Companion sections reuse existing portraits. The
separate social image contains the Ismi wordmark and headline.

Canonical and social asset URLs use the already configured development origin,
`https://ismi-ruby.vercel.app`; no new production-domain decision is implied.
The previous `public/og.png` is preserved but the new metadata uses the landing
social asset. No deployment occurred.

## Verification

See the landing Playwright checks in `i-web/tests/landing.spec.ts`. They cover
320/390/768/1440 px layouts, keyboard containment/restoration, help/recall,
contextual feedback and retry, offline sample interaction, no learning writes,
root/learner history and refresh, unavailable art/API, 200% text enlargement,
prerendered HTML without JavaScript, and PWA entry/precache boundaries.
Existing learner tests enter `/#/today` explicitly now that `/` is marketing.

A real screen-reader session and broader supported-browser/pilot release gates
remain necessary before the beta opens. The browser accessibility tree was
inspected; that alone is not a claim that those release gates passed.

Verified images: [desktop first screen](desktop-preview.png), [full desktop page](landing-1440.png),
and [mobile page](landing-390.png). Responsive hero assets are about 21/43 KB.
Main HTML, CSS, JavaScript, selected hero and portrait total approximately
125–147 KB after gzip for text resources, excluding deferred sample/learner
code and background service-worker precaching.

Validation result: production build, the full 34-test browser regression suite
and 24 backend tests passed. Targeted follow-up checks cover the additional
legacy offline fixture, review compatibility and sample-download recovery. A separate legacy-offline rename check covers packages downloaded
before the name change. The open local preview uses a disposable SQLite backup
and separate API port; the existing database and API process are untouched.

Final targeted landing checks: 9 passed, including failed sample-module loading
with a usable recovery action. Across the full suite and targeted additions,
36 distinct browser checks and 24 backend tests passed.
