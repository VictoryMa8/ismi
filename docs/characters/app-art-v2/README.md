# Current app character artwork / v2

October 14–15, 2026 · F06.1.1 · Original artwork deployed; portrait-size refinement verified locally.

The owner approved using the selected simple cartoon direction in the app after
reviewing [the three-state/two-scene sample](../fattoush-expressive-02/README.md).
This supersedes that sample's review-only boundary for local app integration.
Knafeh follows the owner's representation brief: lighter-skinned Palestinian Arab,
straight dark hair, clean-shaven. Fattoush keeps dark wavy hair and green clothing.

## What is integrated

- Seven individually exported portraits under `i-web/public/characters/v2/`:
  neutral, attentive and encouraging for both people, plus welcoming Fattoush.
  Calm neutral Fattoush and Knafeh's three portraits were generated to complete
  the app's existing state needs. Sources and exact additional prompts are here.
- The selected coffee scene replaces the landing hero through a new asset path,
  retaining the oval border-free frame and all owner-edited wording.
- Welcoming Fattoush appears on the first welcome card. All existing character
  call sites use the new appearance, including Today, dialogues, recall, practice,
  feedback, completion and the curriculum console's character inspection.
- The planning scene appears only in introductory scenes for Everyday lesson 6
  and the three `levantine-plans-02` lessons. It is absent during recall/grading.
  These are display mappings; no lesson text, IDs, source packages or published
  versions were edited or published.
- All ten new WebP files are precached. A broken portrait shows its decorative
  initial; a broken scene illustration disappears while the text and navigation
  remain usable. Written character roles are unchanged.

`ismi-cast-v2` is the new appearance/registry. Known `ismi-cast-v1` named cast
metadata receives the current owner-approved appearance through an explicit
presentation compatibility adapter. Stored lesson metadata is unchanged, including
older downloaded packages and names. Unknown registries/characters keep fallbacks.
The old `characters/v1/cast.webp` and old landing files are preserved byte-for-byte;
the v1 sprite hash remains
`f8fe3c69f4af3621a117be1ee1439d3d885af2e115d3a740f2c8d5b4cd286759`.

## Source and processing

This is generated OpenAI `image_gen` raster artwork, not commissioned or
human-drawn illustration. The tool did not disclose the exact underlying model.
No third-party illustrator assets or Canva premium assets were added.
[Provenance](provenance.json) records original source paths, generation IDs, the
previous sample's lineage, source/delivery hashes and byte counts. The source PNGs,
[additional exact prompts](prompts.json) and [conversion script](build_assets.mjs)
are retained. Original sample PNGs and prompts remain in the sibling sample folder.
These are raster/prompt sources; no editable facial vector paths are claimed.

`build_assets.mjs` uses Sharp, supplied via `NODE_PATH` or a locally available
package installation. It only downsamples/converts: 512px portrait WebP q88,
1200px/640px coffee variants q86/q84, and a 960px planning scene q86. The new
asset set is about 229 KiB in total. Existing v1 art is still precached for
compatibility; no existing artwork is overwritten.

## Verification

The production build passes, including Vue/TypeScript checking and PWA generation.
All ten v2 URLs and the retained v1 sprite appear in the generated precache.
Twenty-three distinct focused browser checks pass across the final runs:

- Thirteen landing/welcome checks: 320, 390, 768 and 1440px layouts; square portrait
  framing; oval hero; keyboard focus/return navigation; reduced motion, enlarged
  text, missing artwork/API, reload/section behavior and readable prerendering.
- Three lesson-frame checks at 390, 1024 and 1440px preserve the fixed dialog,
  single scroll area and always-visible navigation through long/short cards.
- Seven character checks: complete loaded/failing-image owner previews, unchanged
  hidden recall and mistake retries, unknown registry fallback, planning artwork
  for v1/v2 metadata, scene-image failure, and a real service-worker-controlled
  offline reload of an older downloaded package. That offline check fetches all
  ten v2 art URLs successfully with network disabled.

Commands: `npm run build --prefix i-web`, then
`npm run test:e2e --prefix i-web -- tests/zx-characters.spec.ts tests/landing.spec.ts tests/lesson-layout.spec.ts`.
The initial run passed 21 checks; two newly added assertions targeted neutral cast
portraits while expecting attentive dialogue portraits. Those selectors were
corrected and all seven character checks passed on the focused rerun. The API
startup stalled in the sandbox; the checks ran successfully outside it, using
the harness's isolated temporary SQLite database and local API/preview servers.

The saved screenshots were visually inspected:
[planning mobile](screenshots/planning-mobile.png),
[planning desktop](screenshots/planning-desktop.png),
[dialogue portraits](screenshots/characters-desktop.png),
[gentle mistake feedback](screenshots/mistake-feedback.png).
The new oval coffee hero was also visually inspected during the landing run.
These are browser/keyboard/decorative-image checks, not the broader real-device
assistive-technology beta release gate.

## Remaining scope and delivery

The bounded app integration is complete. Profile/turnaround views from the broader
F06.1 design target remain unmade; no current app component requires them.
Future character expansion or a layered human illustration handoff is separate work.

The owner subsequently authorized commit, push and deployment. Application commit
`03bc3b86fc171692970f59d6a85b2ad67eac311f` reached Vercel Ready as deployment
`dpl_5dKSPFy9mB8MaTfV4ZwqmcQNFAGA`, at
`https://ismi-186d4pbtd-victorys-projects-c1cb4594.vercel.app`, aliased to
`https://ismi-arabic.vercel.app`. The owner visually checked and accepted the live
artwork October 15. The agent's live browser attempt was blocked by an automatic
approval-review usage limit; no automated live visual pass is claimed.

No assets were purchased and no curriculum was published. No backend or
database schema changes, curriculum publication, billing, image-generation service
or runtime AI credentials were added.

## October 15 portrait-size refinement

The owner asked for clearer expressions in the small lesson and home-card portraits.
The shared CSS now uses 64px instead of 44px for lesson/feedback portraits, 64px
instead of 28px on the home next-lesson card, 44px instead of 28px for other compact
course portraits, and 72px instead of 56px for completion encouragement. Existing
88px welcome and 96px console previews keep their own sizes. All sizes still use
`--portrait-size`, fixed flex sizing and a square frame. No new artwork was made.

Production build passes. Ten existing character/lesson-frame checks pass (including
320/390px layouts, fixed navigation, failure fallback and offline assets), followed
by the two existing Today/completion checks after the final home-card override.
The latter include 390/1280px layouts, enlarged text, keyboard entry and completion
navigation. The home-card test's seed fixture is text-only; the 64px portrait rule
is applied to its existing compact cast when character metadata is present.
No new tests were written for this CSS-only adjustment. Follow-up push/deployment
is pending at this checkpoint.
