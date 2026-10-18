# F19.1 Azure audio release rights — October 17, 2026

The owner explicitly requested “push and publish” after the eight selected prompt
mappings and local integration were prepared. This authorizes the existing
development application rollout and exact audio publication if its gates pass.
It does not authorize a paid Azure resource, spending or fabrication of rights.

## Verified primary-source restriction

[Microsoft Azure Product Terms, MCA — Text-to-Speech services](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzureServices/MCA/)
restrict the prebuilt neural-voice output-use grant to paid-tier TTS customers.
The condition is explicit: **“For Customers of the paid tier TTS Service only”**.
The same restriction appears in the
[all-programs Azure terms](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzure/allprograms).
Both primary pages were checked October 17, 2026. Microsoft's
[March 2026 clarification](https://learn.microsoft.com/en-us/answers/questions/5805156/please-clarify-the-conflicting-information-regardi)
also distinguishes free-tier evaluation/testing from paid-tier output use.

The exact selected six unique WAVs were generated on **F0**, not S0. The saved
manifests pin the tier, voice, request and output hashes. No independent permission
covering public playback/offline redistribution of these F0 artifacts has been
provided. Therefore their `rightsStatus` remains `pending`, and the normal
approval/publication validator continues rejecting the package. A free development
website or user publication instruction is not recorded as provider permission.

## Delivery boundary and next route

- Commit/push and deploy the tested application support to the existing free
  frontend/API hosts. Application code contains no real WAVs, resource keys or
  private fixture database. Existing published lessons/assets must be preserved.
- Keep the exact F0 clips in their private local draft; do not publish, upload to
  the hosted recording catalog, relabel as human, or bypass the rights validator.
- To release audio, either obtain permission covering these exact F0 outputs, or
  explicitly authorize a suitable paid-tier generation route. A plan change is not
  assumed to retroactively clear existing F0 artifacts. Any regenerated outputs
  need their own hashes, provenance and acceptance reconciliation before release.
- No paid resource, new synthesis, provider contact, contract acceptance or spending
  is performed by this investigation. The existing F0 resource remains unchanged.

The application rollout is unaffected by this content gate. Its exact release
evidence belongs in the dated release note and ROADMAP.md; this file records the
rights finding, not a second current feature-status inventory.

## Subsequent S0 authorization

After inspecting Azure in Safari, the portal showed $200.00 remaining trial credit
and 30 days remaining. The owner then authorized the explained S0 regeneration
route ("ok lets do it then"). This covers switching the existing Speech resource
and regenerating the six exact selected requests, validation and publication;
it does not authorize upgrading the whole subscription to pay-as-you-go.
`regenerate_selected.py` validates the original SSML hashes and requires verified
S0 configuration, preserves attempted outputs and performs no retries. Offline
preflight: six requests, 1,384 UTF-8 SSML bytes. No provider requests made yet.
The portal currently renders its shell/search but fails to load resource controls;
no tier change, credit consumption, or new publication has occurred.

## October 18 tier-change attempt

The owner opened the pricing page. Agent selected **S0 Standard** and pressed
**Apply** under the existing authorization. Azure displayed "Updating pricing tier
from F0 to S0..."; the operation ended and Apply became disabled with S0 selected.
A reload to independently confirm persisted configuration again rendered only the
portal shell. Saved-tier confirmation remains pending; the local resource config
has not been relabeled S0 and no synthesis requests have been made.
The release exporter requires regenerated PCM to match the owner-selected audio
exactly before carrying listening acceptance forward. Changed audio needs listening
acceptance, rather than silently inheriting it from unchanged SSML.

## October 18 verified resolution

The fresh pricing panel eventually loaded with S0 selected and Apply disabled;
the owner independently confirmed S0. Six exact selected requests were generated
once under S0. New files have tiny sample differences; automated timing/waveform
comparison reconciled the original listening selections without claiming new owner
listening or native review. The resulting S0 package was validated, approved and
published as lesson-one v4. See the [dated release](releases/2026-10-18-s0-audio.md)
for hashes, comparison limits, service audits and preservation checks. Earlier
pending statements above describe the sequence, not the final outcome.
