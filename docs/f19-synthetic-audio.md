# F19 local synthetic-audio draft — October 17, 2026

The bounded F19 local implementation contract is satisfied: reproducible audition
and selection tooling, eight owner-selected prompt mappings, structured synthetic
provenance, private console draft integration and focused playback/offline checks.
Application changes and documentation are **local/uncommitted**. No selected audio
was approved, published or deployed. F19.1 owns rights acceptance and an authorized
development-preview rollout; F09 still requires actual reviewed human recordings.

## Exact draft and content preservation

- Approved input: F22 recall lesson-one package
  `e03c6db0d6cf6cb8bb9169283e6f78de6e797ab1443c3d009131214f791d35bc`.
- Eight exercise mappings, six unique saved WAVs. Male lighter is selected; female
  lighter is an owner-permitted fallback with the heavier m explicitly acknowledged.
  [Exact choices and generation provenance](azure-selected-lesson-one-2026-10-17.json).
- The normal owner upload endpoint received all six WAVs, then the normal draft
  endpoint saved local **record 7, version 1**, `levantine-everyday-01-01`, in the
  isolated ignored `tools/azure-speech/.cache/f19-preview.db` database.
- Exact language, answers, rationales, recall targets, vocabulary, authored character
  mappings and original sources are unchanged. Only exercise audio fields, factual
  recording-status note, draft version and additional synthetic sources differ.
  A male-only audition is not a final character-voice design.
- Draft readiness passes. Publication readiness fails on eight explicit pending
  synthetic playback/offline-redistribution rights errors. The isolated published
  lesson set is unchanged. Existing local and hosted databases were not modified.

## Application behavior

`LessonRecording` has optional `origin` and structured `synthesis` metadata. Legacy
human JSON omits both new null fields, preserving old snapshot representation.
Synthetic records retain provider, exact voice/locale, exposed-or-unknown model
revision, timestamp, original SSML/hash, output hash, owner disposition/notes and
separate rights status/evidence. Transcript fallback, SSML voice/locale and uploaded
asset hash must agree. XML external entities/DTDs are prohibited.

Draft validation allows honestly pending rights; approval/publication requires
cleared rights with evidence and recorded listening acceptance. Synthetic metadata
cannot be relabeled human while retaining synthesis provenance. These gates apply
through normal save/readiness/approval/publication services, not a special release
bypass. Other course and preview gates remain intact.

The console preserves imported metadata, exposes origin/provenance editing and
shows listening and rights states. Replacing synthetic audio retains its origin
and provenance so stale output hashes fail validation rather than silently becoming
human recordings. Learner, review and glossary attribution distinguish AI-generated
audio from human recordings and do not label an ar-JO synthetic voice as verified
Palestinian audio. Existing attached-audio error/retry behavior remains; errors do
not silently trigger device speech.

## Verification

[Machine-readable evidence](azure-local-draft-integration-2026-10-17.json) records
the draft/export hashes, readiness result, content comparison and limits.

| Boundary | Evidence |
| --- | --- |
| API/model/validation | All **55 API tests pass**, including synthetic metadata round-trip, legacy serialization, bad hashes/transcript/voice, human relabel refusal, owner-only draft audio and pending-rights approval rejection |
| Synthesis tooling | **14 Python checks pass**; original artifacts preserved, no regeneration during integration |
| Frontend | TypeScript/Vue production build passes |
| Browser flows | Five focused Chromium flows pass: saved private preview, human audio offline playback, synthetic audio offline playback/stop/labels, missing download preservation, corrupt download preservation |
| Real chosen files | All eight asset mappings verified; real saved draft opened, seven teaching cards traversed without progress writes, provider/voice/locale label displayed and actual selected Azure clip entered playing state |
| Publication boundary | Real local draft structure passes; all eight pending-rights approval errors retained; published set unchanged |

The offline tests use generated transport fixtures in disposable databases. Their
synthetic approval/publication is test-only and does not clear or publish the chosen
Azure audio. Real chosen audio is not downloaded into ordinary learner caches from
the private preview. The selected archive is separately hash-verified for offline
listening. No actual Safari offline, physical-device, assistive-technology,
independent Palestinian review, human-recording or beta-readiness claim is made.

One browser test initially selected both published and superseded baseline versions;
its selector was corrected to select the published baseline explicitly, and the
synthetic flow passed on rerun. The in-app browser did not render Vite's development
modules; the verified production build rendered correctly and was used for the real
draft walkthrough. No unrelated application fix was inferred from that limitation.

## Reopen the isolated local preview

The preview is running at `http://localhost:5175/#/account` with the owner console
open in this chat. It uses a deliberately public fixture identity
`f19-preview@example.test`, password `local-f19-fixture-only-password`; never reuse
these for a real account. `localhost` separates its cookies from the usual
`127.0.0.1` development session. Its data, recordings and cookie keys are isolated.

Prepare/export and import only through the isolated F19 API:

```sh
python3 tools/azure-speech/prepare_draft.py
python3 tools/azure-speech/import_local_draft.py
```

Start the isolated API from the repository root in its own terminal:

```sh
ISMI_API_PORT=5064 ISMI_WEB_PORT=5174 Database__Path="$PWD/tools/azure-speech/.cache/f19-preview.db" Recordings__Path="$PWD/tools/azure-speech/.cache/f19-recordings" DataProtection__KeysPath="$PWD/tools/azure-speech/.cache/f19-keys" Curriculum__ApproverEmail=f19-preview@example.test npm run api
```

For normal local editing, use `ISMI_API_PORT=5064 ISMI_WEB_PORT=5174 npm run web`
in a separate terminal. To reproduce the built preview used here:

```sh
npm --prefix i-web run build
ISMI_API_PROXY_TARGET=http://127.0.0.1:5064 npm --prefix i-web run preview -- --host 127.0.0.1 --port 5175 --strictPort
```

The importer is pinned to `localhost:5064`, never approves/publishes and refuses to
overwrite a different existing draft. Source exports, credentials, databases and
real WAVs remain ignored. No new Azure requests or spending occurred in this stage.
