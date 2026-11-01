# Google and email-code access

## Bounded contract

F16.1 adds Google sign-in and explicit connection to an existing Ismi account.
F16.2 adds email one-time-code account creation and sign-in/recovery. Both reuse
ASP.NET Core Identity, HttpOnly cookies, the existing progress identity and guest
access. Password accounts continue to work. Neither child completes the broader
F16 deletion/retention contract or opens a beta cohort.

The owner requested both methods October 31, 2026, authorized a separate Google
Cloud project and selected their existing Resend account. Their only verified
Resend domain is `vexillologists.com`; a new domain purchase is unnecessary.
The selected sender is `Ismi <signin@vexillologists.com>`. The owner explicitly
approved Google policy acceptance, the Google web client and the domain-restricted
Resend sending key in their follow-up confirmation.

Each child finishes when its configured provider works end to end on the intended
preview, including cancellation/failure and an existing-account round trip, and
its application delivery is verified. Local tests establish software behavior,
not Google consent, inbox delivery or hosted activation. ROADMAP.md owns current
state and next actions.

## Implementation

Application Beta **0.0.15** increments 0.0.13 twice: once for Google access and
once for email-code access. Tests, privacy copy and configuration documentation
belong to those implementations and add no further increment.

- Google Identity Services loads only after the learner selects Google on Account.
  Only basic identity is used. Google's official .NET verification library checks
  signature, issuer, audience and expiry; the API additionally requires verified
  email and a protected, ten-minute browser nonce. Google subject is the stable
  login key. Identity tokens and Google API access/refresh tokens are not stored.
- The Google client ID is public configuration. This JavaScript callback flow uses
  no client secret and no OAuth redirect endpoint. A web client must authorize
  `https://ismi-arabic.vercel.app`, plus the exact localhost origins used locally.
  Do not authorize arbitrary preview domains or request Gmail/Drive scopes.
- An existing matching email is never silently linked. The learner first signs
  in to Ismi (password or email code), then explicitly connects the matching Google
  identity from Account. A different existing Google-linked identity is rejected.
- Email codes contain eight random decimal digits, expire after ten minutes, allow
  five admitted guesses and are single-use. The SQLite records contain salted slow
  hashes, never plaintext codes. Atomic SQL admits attempts and consumes the code
  once across concurrent requests. New accounts are created only after email proof.
- A new request invalidates the earlier code. A mailbox can request at most once
  per minute. A persistent global UTC-day budget defaults to 50 sends/attempted sends,
  configurable from 1 to 100; failures also consume budget. The passwordless endpoint
  limit is 20 requests per minute per server-observed source IP. Behind the existing
  proxy, a shared source IP may share the limit; forwarded headers are not trusted.
- Expired code records are removed at the next code request; used codes immediately.
  Budget records older than the previous UTC day are removed on requests. Existing
  backup retention remains a separate F16 operations decision.
- Resend receives the destination email and plain-text code. The API sends through
  its HTTPS API with a 15-second timeout. Provider response bodies and credential,
  token, code or address values are not surfaced in application errors/logging.
- CSRF applies to every state-changing endpoint, including Google. Auth responses
  are marked `no-store`. Provider failure leaves guest/password access available.
- The privacy page describes Google/Resend processing and temporary code storage.

Google Cloud project created in the owner's account: **Ismi**,
`western-trees-513319-k0`, number `203721005044`. No billing account, compute resource,
Identity Platform subscription, domain purchase or paid integration was provisioned.
Google policy acceptance and OAuth branding creation are verified after the owner's
fresh confirmation following two automatic-review rejections. The project remains
External/testing; it has not been published. The Google **Ismi web sign-in** client
was created October 31 with public client ID
`203721005044-fnev298p8erp1v1n05n43qrogjb3suis.apps.googleusercontent.com`.
Its JavaScript origins are exactly:

- `https://ismi-arabic.vercel.app`
- `http://localhost:5173`
- `http://localhost`
- `http://127.0.0.1:5173`

No redirect URIs or additional Google data scopes were added. The generated client
secret is unused by this flow and was not saved or logged. The public ID, selected
sender, daily limit and Resend key are saved in ignored, mode-600 root `.env.local`. Testing audience has zero explicitly listed users.
Google's current documentation exempts basic identity-only sign-in from the testing
allowlist restriction, so no test-user change or audience publication is required
for this integration. Real provider sign-in still needs verification; do not treat
the empty testing list as an application access-control boundary.
[Google audience guidance](https://support.google.com/cloud/answer/15549945?hl=en).

The owner selected Sending access and `vexillologists.com` in the Resend form;
the restrictions were verified before creating **Ismi login codes**. The existing
Onboarding key is unchanged. The new key is stored only in ignored owner-only
configuration and is never included in frontend variables or deployment archives.

The owner approved one real code email to their specified address. Delivery was
observed in their Safari inbox; the code was consumed through the local UI, creating
a confirmed account. Account/session persistence passed a reload. The isolated local
database had one confirmed user and zero remaining codes. The real Google button
also loaded without browser errors; Google consent/sign-in/linking is still untested.
No address, code or private credential is retained in this evidence.

Existing alwaysdata site/SSH access passed `npm run deploy:api -- --check`.
The owner then explicitly authorized committing and deploying Beta 0.0.15 to the
existing development preview, including server-only provider configuration.

## Configuration and activation

Set server environment variables, never frontend `VITE_` variables for secrets:

```dotenv
Authentication__Google__ClientId=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
LoginEmail__ResendApiKey=YOUR_SENDING_ONLY_RESEND_KEY
LoginEmail__From="Ismi <signin@vexillologists.com>"
LoginEmail__DailyLimit=50
```

For local work put these in the ignored root `.env.local`; `npm run api` loads it.
Run `npm run api` and `npm run web` in separate terminals. A missing Google ID hides
Google access; missing Resend key/from hides email codes. No local fake sender or
console-code fallback is enabled in the application.

For hosting, supply the same variables in the existing alwaysdata site's environment
and restart through the authorized deployment workflow. Do not put the Resend key in
Git, chat, Vercel browser-bundled variables or the deployment archive. The deployment
script strips appsettings overrides, so rely on server environment, not an uploaded
`appsettings.Production.json`. Credential provisioning and application rollout are
separate from curriculum publication; no curriculum changes are involved.

Use a dedicated Resend key named **Ismi login codes**, Sending access, restricted to
`vexillologists.com`. Do not reuse or rotate the existing unrelated Onboarding key.
No new domain or inbox is necessary for outbound code delivery. The chosen sender
must be accepted before enabling it. Google OAuth branding requires the owner's
acceptance of Google's policy; creating persistent credentials requires explicit
browser confirmation. Keep the new Google client in testing while configuring it;
record any later audience/publishing change explicitly.

Before claiming hosted activation:

1. Verify authorized origins/client configuration and server-side values by name,
   without exposing secrets. Test actual Google sign-in, cancellation and connection
   to an existing account. Verify the same Ismi user/progress returns after logout.
2. With permission to send a test code to the owner's specified address, check actual
   inbox delivery and a one-time sign-in. Check expiry/retry/error presentation and
   password/guest fallback; never store the test code in evidence.
3. Complete authorized frontend/API delivery and verify Beta 0.0.15 on the target.
   Do not claim local browser tests as real Safari/VoiceOver/mobile acceptance.

## October 31 verification

- Full API suite: **91 passed**, including ten new passwordless tests covering
  CSRF, single-use code, account recovery identity, expiry, attempt exhaustion,
  resend/replacement, failed delivery, durable daily budget, concurrent consumption,
  Google nonce, stable subject, explicit linking and invalid token rejection.
  Google identities and delivery are injected test doubles in integration tests;
  actual Google verification is also checked with a malformed token.
- Production frontend build passes. The compiled version source contains 0.0.15.
- Three mobile Chromium UI tests pass: code request/retry/error/change-email and
  focus, password/guest fallback when provider setup fails, Google script loading
  only after selection and a recoverable script-load failure. Provider responses
  are intercepted; these checks do not establish real provider success.
- Initial browser run exposed focusing a disabled code input; fixed before the
  passing run. Initial sandbox test launches lacked socket access; successful runs
  used approved local test permissions. Existing Vite offline-module dynamic-import
  and Node color-environment warnings are unrelated and do not prevent builds.
- Real Resend inbox delivery, local code sign-in and authenticated reload passed.
  The real Google button loaded without console errors. Full Google user consent,
  sign-in/linking and hosted end-to-end access checks remain verification gates.
- Commit/deployment to the existing preview is explicitly authorized. Deployment
  evidence will record hosted configuration and exact delivered revisions; no
  curriculum publication is part of this rollout.

## Primary references

- [Google Identity Services setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
- [Google server-side ID token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
- [Google .NET verification library](https://docs.cloud.google.com/dotnet/docs/reference/Google.Apis/latest/Google.Apis.Auth.GoogleJsonWebSignature)
- [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend scoped API keys](https://resend.com/docs/api-reference/api-keys/create-api-key)
