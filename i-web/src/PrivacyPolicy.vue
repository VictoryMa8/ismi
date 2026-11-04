<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BackControl from './BackControl.vue';
import { appVersionLabel } from './version';

const heading = ref<HTMLElement>();
onMounted(() => heading.value?.focus({ preventScroll: true }));
</script>

<template>
  <div class="privacy-page">
    <header class="privacy-header">
      <a class="privacy-brand" href="#" aria-label="Ismi landing page"
        ><img src="/ismi-mark.svg" width="30" height="30" alt="" />ismi</a
      >
      <span class="privacy-version">{{ appVersionLabel }}</span>
    </header>
    <main class="privacy-main" id="main-content">
      <BackControl href="#">Back to landing page</BackControl>
      <h1 ref="heading" tabindex="-1">Privacy policy</h1>
      <p class="privacy-meta">Effective November 3, 2026 · {{ appVersionLabel }}</p>
      <p class="privacy-lead">
        Ismi is an invite-only development preview for adults 18 and older. We
        collect as little as we can, show no ads, and never sell your data.
      </p>

      <section aria-labelledby="privacy-guest">
        <h2 id="privacy-guest">Studying as a guest</h2>
        <p>
          You can learn without an account. Your progress, study settings,
          saved words and downloaded lessons stay in this browser's storage on
          your device. We don't receive them unless you sign in. Clearing your
          browser data removes them.
        </p>
      </section>

      <section aria-labelledby="privacy-account">
        <h2 id="privacy-account">If you create an account</h2>
        <ul>
          <li>Your display name and email address.</li>
          <li>If you choose a password, it is stored only as a secure hash.</li>
          <li>If you connect Google, your Google account identifier, name and verified email address.</li>
          <li>
            Learning progress, study settings and answers you choose to sync, so
            they follow you across devices.
          </li>
        </ul>
        <p>We use this only to run your account and your learning.</p>
        <p>
          Email-code sign-in sends your email address and a temporary sign-in code
          through Resend. Codes expire after 10 minutes, are stored by Ismi only
          as secure hashes, and are removed when used or when expired records are
          cleaned up on the next code request. Resend processes delivery information
          under its <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
        </p>
        <p>
          Google sign-in loads Google's sign-in service when you choose Continue
          with Google. Google receives technical connection information and handles
          your Google authentication. Ismi receives an identity token to verify your
          account; we do not request access to your mail, files or contacts.
        </p>
      </section>

      <section aria-labelledby="privacy-cookies">
        <h2 id="privacy-cookies">Cookies</h2>
        <p>
          Ismi uses essential cookies to keep you signed in, protect forms from
          forgery and verify Google sign-in requests. Ismi does not use advertising
          or analytics cookies. If you choose Google sign-in, Google's service is
          also subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's privacy policy</a>.
        </p>
      </section>

      <section aria-labelledby="privacy-voice">
        <h2 id="privacy-voice">Voice and AI features</h2>
        <p>
          The preview doesn't record your voice or send your answers to AI
          providers. When guided speaking arrives, raw recordings will be
          deleted promptly after feedback, and providers will be configured not
          to train on your data. Keeping recordings to improve Ismi will always
          require your separate opt-in.
        </p>
      </section>

      <section aria-labelledby="privacy-hosting">
        <h2 id="privacy-hosting">Where data is processed</h2>
        <p>
          The app is served by Vercel and the account service runs on
          alwaysdata. Like most web hosts, they may keep short-lived technical
          logs such as IP addresses to deliver and secure the service.
        </p>
      </section>

      <section aria-labelledby="privacy-choices">
        <h2 id="privacy-choices">Your choices</h2>
        <p>
          You can keep studying as a guest and sign out at any time. In Account,
          choose Delete my account after signing in within the last 10 minutes.
          Confirming permanently removes your account, password hash, connected
          Google identifier, synced progress, study settings and unused email codes
          from the active Ismi database. Signing in again creates a new account.
        </p>
        <p>
          Deletion clears this account’s history and pending work in this browser.
          Other browsers that previously saved an account receipt clear their local
          account data when they next connect to Ismi. An offline device cannot be
          erased remotely; you can also clear its browser data. Guest data and shared
          lesson downloads are kept. Browsers that have not used this version need
          manual clearing of their old local account data. A minimal local deletion
          marker prevents delayed history writes. The account receipt only checks whether an
          account still exists and cannot access learning or identity data.
        </p>
        <p>
          Account deletion does not delete your Google account or erase delivery
          records held by Resend or technical logs held by hosting providers. Existing
          protected backups may still contain account data; backup expiration and
          provider retention periods have not yet been finalized for this development
          preview. Deletion does not promise immediate erasure of those copies.
          Shared curriculum, editorial audit history and reports submitted without
          an account identifier remain. To request help with access, corrections,
          backups or deletion, contact the person who invited you.
        </p>
      </section>

      <section aria-labelledby="privacy-changes">
        <h2 id="privacy-changes">Changes</h2>
        <p>
          This preview will change. If we change how we use your data, we'll
          update this page and its date before the change takes effect.
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: #fafbf9;
  color: #233630;
  border-top: 4px solid #087456;
}
.privacy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 760px;
  margin: 0 auto;
  padding: 18px 22px;
}
.privacy-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  font-size: 1.6rem;
  font-weight: 700;
  text-decoration: none;
}
.privacy-version,
.privacy-meta {
  color: #596861;
  font-size: 0.8125rem;
}
.privacy-main {
  max-width: 760px;
  margin: 0 auto;
  padding: 8px 22px 64px;
  line-height: 1.6;
}
.privacy-main h1 {
  margin: 20px 0 4px;
  font-size: clamp(2rem, 6vw, 2.6rem);
  outline: none;
}
.privacy-lead {
  margin: 20px 0 8px;
  padding: 16px 18px;
  border-left: 4px solid #b73f4f;
  background: #ffffff;
  font-size: 1.05rem;
}
.privacy-main section {
  margin-top: 28px;
}
.privacy-main h2 {
  margin: 0 0 6px;
  color: #17684e;
  font-size: 1.2rem;
}
.privacy-main p,
.privacy-main ul {
  margin: 0 0 8px;
}
.privacy-main ul {
  padding-left: 1.25rem;
}
</style>
