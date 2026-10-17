# Owner-authorized alphabet inventory previews

October 16, 2026. After requesting publication and being told that linguistic review
and human recordings were unavailable, the owner directed “just publish them bruh.”
This latest instruction supersedes the earlier reviewed-only choice **for these
five exact inventory-only previews on the existing development site**. It does not
create accepted linguistic reviews, human audio, word curriculum or beta content.

`pins.json` lists exact file SHA-256 hashes. `AlphabetTextPreviewPolicy` embeds and
verifies the same hashes, requires the explicit development configuration flag,
and compares every field before the separate `approve-text-preview` action. Changed
names, extra words/audio/exercises, edited source records, new packs and fixtures do
not match. The normal full-pack validator still reports all missing content/review/
rights/audio; standard approval is not bypassed and cannot pass these previews.

Contents:

- Arabic's three course contexts: the same 28 base character/form records, with
  course labels and technical Unicode identifiers. Joining demonstrations use U+200D
  probes; they are not authentic word examples. No canonical Quran text, translation,
  commentary, recitation or interpretation is included.
- Khmer: 33 base-letter preview entries plus two entries explicitly grouped as
  Pali/Sanskrit transliteration support. The distinction follows Unicode NamesList
  annotations for U+179D/U+179E. Unicode identifiers are not pronunciation guidance;
  the exact full pedagogical inventory/help convention still requires fluent review.
- French: 26 upper/lowercase pairs; no reference accent, letter pronunciation,
  silent-letter teaching, accent/ligature coverage or course-depth claim is selected.

All reviewer/review-evidence fields remain empty. All human-recording flags are
false, and no audio URL, speaker, transcript, word example, grade or exercise is
invented. Source acceptance/rights fields remain pending; technical character data
is attributed with its bundled Unicode License V3, including in downloaded manifests.
Unicode NamesList [17.0.0](https://www.unicode.org/Public/17.0.0/ucd/NamesList.txt)
provides the Khmer support annotations. These files are not reviewed language packs.

Learners see the persistent “Unreviewed · text-only preview” notice, source/license
information, letter grid, forms and text-only download. Audio, words and graded
practice controls are not offered when content is absent. The parent F28 outcome
remains incomplete.

Operator publication uses the same draft/save, pinned exception, publication and
audit service as the owner console. No authenticated browser session is needed.
The privileged CLI is invoked over the existing owner-authorized SSH connection,
with the persistent DB/recording/key paths set, on the **deployed application**:

```sh
dotnet Ismi.Api.dll --publish-alphabet-text-previews true
```

It verifies all existing course rows before mutation, refuses changed/unrelated
packs, is idempotent for already-published exact previews, and records truthful
operator/owner-request notes. There is no automatic startup publication. Runtime
flag `Curriculum__AllowAlphabetTextPreview=true` is enabled only by the development
host launcher; the application default is disabled and hides these publications.

Before rolling back to an application that lacks preview labels, withdraw the
previews using the current service/console or:

```sh
dotnet Ismi.Api.dll --withdraw-alphabet-text-previews true
```

Do not replace the learner database as an application rollback. Publication IDs,
versions, audits and preservation evidence are recorded in `publication.json` after
actual publication. No published state is asserted by the source pins alone.
