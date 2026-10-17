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
