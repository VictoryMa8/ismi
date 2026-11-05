# Landing mark alignment and redesign directions

## November 5 request

The owner reported that the landing page still used the old icon and requested
options for a friendlier, simpler, modern and natural landing page. This permits
the bounded icon correction and design exploration. Selecting and implementing
a complete redesign was a separate decision. The owner preferred the current
landing over the concepts and then requested pushing the Red Seal on November 5,
authorizing commit/push to `main` and its existing preview deployment.
The November 4 hold on broader review, recordings and release testing remains.

## Mark correction

Both landing brand images now import `src/assets/red-seal.svg`, the same
owner-selected asset used by the learner header/sidebar. This covers the
prerendered and hydrated header/footer without duplicating the vector. Existing
image dimensions, decorative alternative text and link names remain.

Application version: **Beta 0.0.21**, aligned in the package and lockfile. No
curriculum packages, hashes, publication notices or learner data changed.
This is a landing-page correction; the existing favicon, installed PWA icons,
About and Privacy marks are outside this bounded change.

## Design exploration

Three in-conversation concepts retain the relationship promise, Red Seal,
Ismi wordmark, Palestinian roots and factual preview/course limitations.
After seeing the first options, the owner requested fewer subtitles/eyebrows,
light backgrounds and removal of the redundant Arabic brand word beside the
calligraphic icon. The revised concepts follow those preferences and open on
the previously viewed Open notebook direction. This is concept feedback, not
a request to implement or deploy the full redesign.

- **Olive & linen:** warm paper, olive/charcoal text, a red accent and the
  existing coffee illustration. A quieter split hero, one primary action,
  compact course availability and no extra explanatory sections.
- **A little conversation:** a centered opening and a single phrase with
  Fattoush/Knafeh portraits. Meaning reveal makes the learning interaction
  tangible. Course availability follows directly, without supporting benefit copy.
- **The open notebook:** serif-led typography, warm paper and a phrase in
  the margin. Minimal imagery and a compact language list create the calmest,
  most mature option.

All revised concepts remove the eyebrows, hero descriptions, transliteration
captions, method/benefit pitches and repeated invitations. They use fixed light
surfaces even when the surrounding app is dark, one headline and primary action,
one phrase example, course availability, and a small preview/footer line.
They link to the existing About/FAQ destination. Course availability
must remain derived from the catalog in any implementation, preserving explicit
unreviewed/text-only labels and MSA's general/Quranic distinction. No new course
or content publication follows from these designs. The concepts reuse existing
phrases and art; they are not new curriculum candidates.

## Local checks

November 5, 2026:

- Production build passed, including TypeScript and landing prerendering.
- Local built-page inspection confirmed both landing images load the Red Seal
  and the footer displays Beta 0.0.21; 390/1440 px screenshots captured.
- All three design concepts loaded their embedded assets without page errors;
  at 390 px none overflowed horizontally. The meaning reveal worked.
- Revised concepts also fit 320/1024 px, with working carousel/meaning reveal
  and light surfaces confirmed under a dark host appearance.
- This is a bounded build and visual inspection, not resumption of the deferred
  physical-device, assistive-technology, curriculum or beta verification work.
- The checked candidate changes only the two landing brand images and application
  version. The owner requested its existing-preview rollout; deployment evidence
  will be recorded below. API and curriculum publication remain unchanged.
