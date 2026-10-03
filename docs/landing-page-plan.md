# Ismi character landing page implementation plan

Proposed October 2, 2026. This document preserves the original design proposal;
current behavior is in [implementation notes](landing/README.md), and feature
status is in [F07/F18 on the roadmap](../ROADMAP.md). The landing entry now opens
the real app with a skippable three-card welcome. The isolated sample and sample
CTA proposals below are superseded; preserve the owner's edited interface copy.
Invitation controls and beta release remain separate work. Product constraints
live in AGENTS.md.

## Goal and audience

Give a new visitor a clear reason to learn Arabic with Ismi, show what a lesson
feels like, and offer an easy next step. Within the first screen they should
understand that this is a conversation-focused Arabic learning app, who it is
for, and that this is an early development preview with a free, invite-only beta
planned. Update that status when the actual enrollment gate is ready.

Lead with English-speaking adults who know some Arabic and want to speak with
a Levantine partner, friend or family. Welcome other motivated learners without
claiming a complete absolute-beginner course or an established fluency outcome.

Success is a visitor saying: “This teaches the conversations I care about. I
understand how it works, and I want to try it.” Show a useful learning experience
and clear scope rather than filling the page with feature names.

## Positioning and first-screen copy

- **Headline:** Speak with the people you love.
- **Description:** Learn Palestinian Levantine Arabic through everyday
  conversations. Understand useful phrases, try them from memory, and practice
  a response—with help whenever you need it.
- **Primary button:** Try a sample lesson.
- **Secondary button:** See how it works.
- **Availability line now:** Development preview · For adults 18+.
  Use “Free invite-only beta · For adults 18+” once that enrollment is ready.
- **Returning learner link:** Sign in. Show Continue learning when a reliable
  local learning marker exists; the app still verifies the actual session.

Use “Understand Arabic from conversation to Quran” in the later track section,
where the available/planned distinction is visible. Keep the hero focused on
the usable flagship instead of implying three complete courses already exist.

Mango is a reference for conversational teaching and explaining the method,
not a co-brand or an endorsement. Its current homepage combines a clear
promise, course discovery, an explanation of the method, product demonstration,
FAQ and repeated calls to action. Its method page demonstrates phrase
construction through real exchanges. These patterns inform the proposal; its
efficacy, audio, staffing and pricing claims do not transfer to Ismi.
Sources inspected October 2, 2026: [Mango homepage](https://www.mangolanguages.com/)
and [How Mango works](https://www.mangolanguages.com/how-it-works).

## Page structure and content

| Order | Section | What visitors see and why |
| --- | --- | --- |
| 1 | Navigation | Ismi wordmark, How it works, Arabic tracks, FAQ, Sign in, and the primary sample button. Simple mobile navigation; no learner sidebar. |
| 2 | Hero | The copy above, Fattoush and Knafeh in a warm everyday conversation, and a compact actual lesson card. Desktop: text left, illustration right. Mobile: headline/buttons first, compact scene next. |
| 3 | Personal relevance | “For the conversations that bring you closer.” Three specific situations: checking in on someone's day, making plans together, and sharing everyday moments. Use existing lesson topics; avoid invented course breadth. |
| 4 | How a lesson works | “Meet the conversation. Understand the pieces. Try your response.” Three short stages with the same exchange, character roles, optional translation and one concise explanation. Show the actual learning sequence. |
| 5 | Interactive sample | One bounded check-in with Fattoush and Knafeh: encounter a phrase, see its building blocks, recall before reveal, then try a contextual response. “Try a sample lesson” opens this experience directly. |
| 6 | Reasons to choose Ismi | Four benefits: useful everyday exchanges; explanations when something doesn't fit; unrestricted review/retries; downloaded lessons for offline practice. Pair each benefit with a real UI detail rather than an icon-only claim. |
| 7 | Arabic tracks | A visually larger Palestinian Levantine card for the current focus; quieter MSA and Quranic cards clearly labeled Planned. Explain everyday speech, formal Arabic, and comprehension of Quranic Arabic in plain English. |
| 8 | Beta and trust | State what is available, what is still being built, and how content is approved. Explain that this is an early product, with owner-approved material and further review planned. Use a real product preview as evidence. |
| 9 | FAQ | Answer dialect, prior Arabic knowledge, script/transliteration, price, account requirement, offline use, course availability and audio questions. |
| 10 | Final invitation | “Start with one conversation.” Repeat the sample button and offer Request a beta invite. No countdown, fake limited spots or pressure. |
| 11 | Footer | Wordmark, short purpose statement, Sign in, working contact, privacy and terms links, beta status and copyright. Publish only real destinations and approved policy text. |

Keep the mobile page compact: short paragraphs, three method stages, four
benefits and roughly eight FAQ entries. Avoid a pricing grid, blog carousel or
large comparison table during this beta. Repeat the same primary action in the
header, hero and final section; avoid several competing CTA labels.

### Benefit and FAQ copy direction

Recommended benefit titles: “Practice a real exchange,” “Understand why,”
“Keep practicing,” and “Take downloaded lessons with you.” Explain offline
availability as downloaded core lessons, not an offline AI service. Review is
currently manual and its history stays on the device; do not call it adaptive
spaced repetition or promise cross-device review synchronization.

Draft FAQ answers:

- **Which Arabic?** The first course focuses on urban Palestinian Levantine.
  Jordanian alternatives are labeled where included. MSA and Quranic tracks
  are planned; keep their current status explicit.
- **Do I need to read Arabic?** Levantine practice includes Arabic script,
  transliteration and optional translation help. The initial course is aimed
  at learners who already know a little Arabic; reading bootcamps are planned.
- **How much time does a lesson take?** Core micro-lessons are designed around
  short practice sessions, generally five to seven minutes. Verify the selected
  sample's actual length before advertising a specific duration.
- **Is it free?** The invite-only beta is free. Core lessons, explanations,
  retries, review and downloaded core lessons remain part of the free learning
  floor. Future subscription details are undecided.
- **Do I need an account?** The public sample needs none. Guest learning is
  supported; an account is needed for durable or cross-device progress sync.
  Full beta access remains subject to the invitation flow.
- **Can I study offline?** Download supported core lessons first, then study
  offline and sync completion after reconnecting. A first visit still requires
  internet access to receive the page/assets.
- **Who creates the lessons?** Source-linked material goes through validation
  and owner approval. AI assists within the source boundaries. Do not imply
  native-expert or qualified Quranic review that has not taken place.
- **What audio is included?** Reviewed human recordings are planned. Where
  absent, any available browser/device voice is clearly labeled as a preview.
  The public sample can be completed without listening.

Do not add testimonials, star ratings, learner counts, press logos, university
equivalencies or guaranteed results until genuine evidence and permission exist.
Add real pilot feedback later, with consent. The thirty-day outcomes in AGENTS.md
are curriculum targets; they are not demonstrated landing-page promises.

## Fattoush and Knafeh art direction

Use the exact existing identities from
[the character guide](characters/character-guide.md): Fattoush's dark wavy hair and
sage clothing, Knafeh's short curly hair, graphic beard and terracotta clothing.
Retain the adult proportions, flat geometric features and corporate cartoon
style. They are conversation participants, with no newly assigned religion,
occupation, location or romantic relationship.

Make the landing page feel like the same product with more space for storytelling:
warm off-white, charcoal text, deep green primary buttons, restrained terracotta
accents, rounded conversation cards and generous whitespace. Avoid childish
reward imagery or generic office illustrations unrelated to language learning.

Required assets:

1. One responsive hero scene showing both characters exchanging a greeting or
   checking in. Use an everyday setting with restrained detail. A shared table
   is a visual setting, not a claim that a new lesson exists.
2. Two small companion compositions for the method and closing CTA, preferably
   crops or existing portraits rather than three unrelated new illustrations.
3. One social preview image with the characters, Ismi wordmark and headline.
4. Real lesson UI captures or live components for the method section. Existing
   screenshots are reference material; final marketing captures must reflect
   exactly the content and features offered to visitors.

During implementation, inspect the existing concept sheet, then use imagegen
with it as a visual reference if new poses/scenes are needed. Store the prompt,
original output, optimized assets, hashes and provenance. Keep the lesson
`ismi-cast-v1` registry and `cast.webp` unchanged; landing art gets a separate
path such as `public/landing/`. Never upscale the tiny portrait sheet into the
main hero. Keep all Arabic, interface text and speech bubbles as HTML outside
generated images so spelling, reading order and responsive layout remain reliable.

Decorative art has empty alt text. Meaningful information is in visible text;
character names accompany the actual conversation. Static artwork is the
default, with no autoplay, moving background or hover-only information.

## Visitor flow and routing

Recommended funnel:

```text
New visitor at / → landing → sample → request beta invite
Returning learner → Sign in / Continue learning → existing learner app
Existing #/today, #/courses, #/practice, #/account links → existing learner app
```

Keep `/` as an explicit, shareable marketing destination. Preserve the current
hash-based learner routes; no first-visit modal or redirect may trap a user
away from a deep link. Returning learners have a prominent app entry rather
than an automatic root redirect that makes the landing page hard to revisit.

Handle landing section anchors deliberately: today's `readPage()` maps every
unknown hash to Today. Support known marketing anchors as landing states or use
buttons that scroll without changing the route. Test browser back/forward,
refresh, sign-in entry and brand links. Update the installed PWA `start_url`
to `/#/today` so launching a study app does not open marketing each time.

### Public sample

Recommend a 60–90 second taste of the method, labeled Sample, not an abbreviated
mastery test. It should reuse an unchanged, source-linked approved exchange and
its accepted answers/explanations, with explicit Fattoush/Knafeh roles. The currently
local character proposals remain drafts: do not bundle them into public
marketing merely because the frontend code has deployed. Owner approval of the
exact sample and character presentation is a publication dependency.

Isolate sample interaction from course progress: no XP, minutes, lesson
completion events, review-history writes, recording retention or automatic
account creation. Provide recall-before-reveal, optional help, explanation,
unrestricted retry, replay and a clear exit. Reuse suitable presentation
components, but do not call `submitLessonCompletion` or open the owner-preview
API to anonymous visitors. Package only the approved sample and provenance;
never ship the whole local draft set. It should load without the API once its
approved static assets have been received.

### Invitation conversion

No invitation/waitlist feature currently exists in the repo. Treat it as a
visible dependency, not a button that claims success without saving a request.

Recommended beta form: email, adult-eligibility confirmation, optional track
interest, and a concise purpose/privacy statement. No password or voice data.
Explicitly distinguish an access-request email from marketing subscriptions;
any newsletter opt-in is separate and unchecked. Recommend owner-managed
invitations initially; do not choose an external email provider silently.

If authorized, implement an ASP.NET endpoint and a bounded SQLite request queue
with validated lengths, CSRF protection, duplicate-safe submission, rate limits,
generic receipt confirmation and owner-only inspection. A receipt means the
request was stored, not that an invitation was issued. Failed submission retains
input and offers retry; offline submission never promises acceptance. Approve
retention/deletion policy and usable contact/privacy details before collecting
emails. These are decisions for this new collection, not settled account policy.

The public sample must not silently grant full beta access. Real invitation
enforcement is a separate server concern: the current guest/account endpoints
are not an implemented invitation gate. Public sample availability is a
recommended product decision; if the owner prefers invite-first, make the
primary button Request a beta invite and retain a non-progress product walkthrough.
The request form and gate must be finished before describing enrollment as
enforced invite-only access. Until then, use a clearly labeled development
preview and an informational beta-interest section with no fake form.

## Technical implementation

Use the existing Vue/Vite project and design tokens. No framework migration,
new marketing CMS or billing system is needed for this bounded page.

| Area | Planned changes |
| --- | --- |
| Entry | Add an entry shell in `i-web/src/main.ts` / `AppShell.vue` that distinguishes marketing states from existing learner routes. Lazy-load `App.vue` for learner routes. |
| Landing | Add `LandingPage.vue`, scoped landing styles, small section components only where useful, and a typed content module for copy/status. Keep the existing learner lesson frame intact. |
| Sample | Add an isolated `LandingSample.vue` using approved static content and shared presentation/evaluation components. Test that it creates no learning-progress writes. |
| Artwork | Add optimized local assets under `i-web/public/landing/`, with responsive dimensions, source records and a separate marketing social preview. |
| Invitation | Add API/models/storage and owner request review only if the recommended acquisition flow is approved. Preserve existing Identity sessions and curriculum console boundaries. |
| Metadata | Revise `index.html` title/description/social image to describe current Levantine availability. Set absolute canonical/social URLs only after selecting the public landing origin. Ensure the referenced image actually exists. |
| PWA | Preserve lesson asset precaching, caches and queued completions; use learner start URL. Large marketing art must not bloat essential offline lesson downloads. |
| Hosting | Preserve the existing Vercel build and `/api/*` rewrite. Avoid applying `no-store` to static marketing assets. Backend changes need their own alwaysdata rollout. |

The current `App.vue` mounts auth, sync, dashboard and upcoming-lesson downloads
immediately. Marketing must not mount that component or start those requests
until a visitor enters the learner app. The landing copy and artwork must render
when the backend is slow or unavailable. A root render must not display “Marhaba,
Guest” briefly before marketing loads.

For discoverability, prerender the landing's main copy into the built root HTML
using a small build-time Vue rendering step, and hydrate it for interactive
sections; verify matching output and no hydration warnings. Preserve the existing
client-only learner application and avoid runtime SSR infrastructure. Metadata
alone is insufficient if the root HTML contains only an empty `#app`. If this
step is deferred from the visual prototype, treat SEO completion as pending.

Use semantic header/nav/main/section/footer elements, one H1, a skip link,
native buttons/links, native FAQ disclosures where possible, visible focus,
large touch targets, high contrast and reduced-motion support. Isolate Arabic
with proper language/direction and LTR transliteration; never encode meaning
only in color. A sample dialog must trap focus, close with Escape, mark its
background inert and restore focus to its opener.

## Delivery sequence

1. **Content and layout:** finalize the hero, section order, availability
   statements and sample-first/invite-first choice. Prepare mobile and desktop
   wireframes with real copy. Confirm which approved exchange is eligible for
   a public sample and which design/reference is final.
2. **Art and static page:** create reference-consistent landing artwork; build
   the responsive sections, navigation, metadata and prerendered root. Connect
   Sign in / Continue learning to existing app routes. Show the owner the page
   at phone and desktop sizes before treating art/copy as final.
3. **Working demonstration:** implement the isolated approved sample, help,
   feedback, replay/exit and end-of-sample invitation prompt. If approval is
   pending, keep the candidate in the local preview and use a truthful
   noninteractive product walkthrough for public deployment.
4. **Acquisition:** finish the authorized invitation queue and real submission
   states, policy copy and access enforcement, or retain the explicitly scoped
   development-preview experience. Do not ship decorative dead-end CTAs.
5. **Verification and release:** run targeted navigation/sample/invitation
   tests plus relevant existing learner regressions and the production build.
   Review the final copy/assets and deploy only when separately requested.

Each stage should produce something inspectable. The first implementation
milestone is the responsive page with existing learner entry and a local sample
preview; public email collection and beta enrollment do not need to block that.

## Acceptance checks

- A new visitor sees the landing at `/`; old learner links and installed-app
  entry still work. Navigation, refresh and browser history cause no loops.
- Hero explains Arabic, Palestinian Levantine, conversational learning and
  early-beta availability without requiring scrolling on an ordinary phone.
- Fattoush and Knafeh visibly match the existing corporate cartoon designs; Arabic
  text remains real text and unavailable art leaves the page usable.
- Primary and secondary buttons do useful, consistent things. A returning
  learner can enter the app in one action.
- Landing initial load does not fetch the dashboard, download lessons or
  submit progress. API failure cannot remove the marketing page.
- Sample uses only its approved content and roles; completion/retry/replay
  produce no course progress, XP, sync queue or review history.
- All track availability and audio/review claims match the target deployment.
  Planned speaking, MSA, Quranic, bootcamp and advanced features are labeled.
- Full keyboard operation, 200% text zoom, 320/390/768/1440 px layouts and mixed
  RTL/LTR work. Manually check the main journey with a screen reader. No autoplay,
  mandatory timer, motion dependency or horizontal overflow.
- Build HTML contains the core landing text; title, canonical and social
  metadata are correct for the intended origin. No hydration/console errors.
- Give the hero explicit dimensions and optimize responsive assets. Target
  roughly 200 KB or less for mobile hero imagery and 500 KB or less for initial
  compressed page resources, excluding deferred learner code; measure the
  actual output rather than calling the page fast by inspection.
- If collecting invitations, verify persistence, duplicate submission,
  invalid inputs, offline/API errors, rate limits, owner-only access and
  accurate success copy. Never log submitted emails into frontend analytics.
- Existing online/offline lesson completion, recordings, review, character
  fallback and exactly-once reconnection still pass after entry/PWA changes.

For the first pilot, observe whether visitors can describe Ismi, identify the
available dialect, find the sample and understand the next step. Track
sample-start/sample-finish and invite-request counts only through an approved,
minimal measurement approach. Do not add a third-party analytics provider or
publish conversion/learning claims from an invented benchmark.

## Decisions to settle before dependent implementation

1. **Main CTA:** sample-first is recommended; invite-first remains an option.
2. **Sample publication:** approve the exact source-linked slice and its
   character presentation before making it public. This does not approve the
   other six/seven curriculum drafts.
3. **Invitation operation:** approve owner-managed request handling, how access
   is enforced, minimum data/retention, and a real privacy/contact destination.
4. **Release destination:** preview first is recommended. A public root domain
   and actual beta enrollment need explicit release authorization and the
   applicable readiness gates.

Routine component, spacing and asset optimization decisions can proceed within
an authorized implementation. The recommendations here do not select paid
hosting, email/speech/AI providers, pricing, or new curriculum policy.
