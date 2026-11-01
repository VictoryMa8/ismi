<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { getSignInOptions, getGoogleNonce, requestEmailCode, verifyEmailCode, signInWithGoogle, type SignInOptions } from './api'
import type { AuthSession } from './types'

const props = defineProps<{ signedIn: boolean; disabled: boolean }>()
const emit = defineEmits<{ authenticated: [session: AuthSession] }>()
const options = ref<SignInOptions>({ googleClientId: null, emailCode: false })
const email = ref('')
const code = ref('')
const challenge = ref('')
const sentTo = ref('')
const remember = ref(false)
const busy = ref(false)
const error = ref('')
const googleReady = ref(false)
const googleContainer = ref<HTMLElement | null>(null)
const codeInput = ref<HTMLInputElement | null>(null)
let disposed = false
type GoogleApi = { accounts: { id: {
  initialize: (config: { client_id: string; nonce: string; auto_select: boolean; callback: (response: { credential: string }) => void }) => void
  renderButton: (element: HTMLElement, options: { type: string; theme: string; size: string; text: string }) => void
} } }
const googleApi = () => (window as Window & { google?: GoogleApi }).google

async function loadGoogle() {
  if (googleApi()) return
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-ismi-google]')
    const script = existing ?? document.createElement('script')
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error('Google did not load. Check your connection and try again.')) }, 12000)
    const cleanup = () => { window.clearTimeout(timeout); script.removeEventListener('load', loaded); script.removeEventListener('error', failed) }
    const loaded = () => { cleanup(); resolve() }
    const failed = () => { cleanup(); script.remove(); reject(new Error('Google could not load. Try again.')) }
    script.addEventListener('load', loaded, { once: true })
    script.addEventListener('error', failed, { once: true })
    if (!existing) { script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.dataset.ismiGoogle = 'true'; document.head.append(script) }
  })
}

async function prepareGoogle() {
  if (busy.value || props.disabled) return
  busy.value = true; error.value = ''
  try {
    await loadGoogle()
    const { nonce } = await getGoogleNonce()
    if (disposed) return
    googleReady.value = true
    await nextTick()
    googleApi()!.accounts.id.initialize({ client_id: options.value.googleClientId!, nonce, auto_select: false,
      callback: response => { void completeGoogle(response.credential) } })
    googleApi()!.accounts.id.renderButton(googleContainer.value!, { type: 'standard', theme: 'outline', size: 'large', text: props.signedIn ? 'continue_with' : 'signin_with' })
  } catch (e) { error.value = e instanceof Error ? e.message : 'Google sign-in could not start.'; googleReady.value = false }
  finally { busy.value = false }
}

async function completeGoogle(credential: string) {
  if (disposed || busy.value || props.disabled) return
  busy.value = true; error.value = ''
  try { emit('authenticated', await signInWithGoogle(credential, remember.value)) }
  catch (e) { error.value = e instanceof Error ? e.message : 'Google sign-in failed.'; googleReady.value = false }
  finally { busy.value = false }
}

async function sendCode() {
  if (busy.value || props.disabled) return
  busy.value = true; error.value = ''
  try {
    const result = await requestEmailCode(email.value)
    challenge.value = result.challengeId; sentTo.value = email.value.trim(); code.value = ''
    busy.value = false
    await nextTick(); codeInput.value?.focus()
  } catch (e) { error.value = e instanceof Error ? e.message : 'Could not send a code.' }
  finally { busy.value = false }
}

async function verifyCode() {
  if (busy.value || props.disabled) return
  busy.value = true; error.value = ''
  try { emit('authenticated', await verifyEmailCode(challenge.value, code.value, remember.value)) }
  catch (e) { error.value = e instanceof Error ? e.message : 'Could not verify that code.' }
  finally { busy.value = false }
}

onMounted(async () => { try { options.value = await getSignInOptions() } catch { /* Existing password and guest access remain available. */ } })
onBeforeUnmount(() => { disposed = true })
</script>

<template>
  <section v-if="options.googleClientId || (!signedIn && options.emailCode)" class="passwordless-sign-in" aria-label="Sign-in options" :aria-busy="busy">
    <template v-if="options.googleClientId">
      <p v-if="signedIn">Connect Google to this account.</p>
      <button v-if="!googleReady" type="button" class="secondary-action" :disabled="busy || disabled" @click="prepareGoogle">{{ busy ? 'Please wait…' : signedIn ? 'Connect Google' : 'Continue with Google' }}</button>
      <div v-show="googleReady" ref="googleContainer" :inert="busy || disabled || undefined" />
    </template>
    <template v-if="!signedIn && options.emailCode">
      <form v-if="!challenge" class="auth-form" @submit.prevent="sendCode">
        <label><span>Email</span><input v-model="email" type="email" autocomplete="email" maxlength="254" required :disabled="busy || disabled" /></label>
        <button class="secondary-action" :disabled="busy || disabled">Email me a sign-in code</button>
        <p class="account-copy">New here? Your first code creates an account.</p>
      </form>
      <form v-else class="auth-form" @submit.prevent="verifyCode">
        <p role="status">Code sent to {{ sentTo }}. It expires in 10 minutes.</p>
        <label><span>8-digit code</span><input ref="codeInput" v-model="code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" minlength="8" maxlength="8" required :disabled="busy || disabled" /></label>
        <button class="primary-action" :disabled="busy || disabled">{{ busy ? 'Please wait…' : 'Verify and sign in' }}</button>
        <button type="button" class="guest-action" :disabled="busy || disabled" @click="sendCode">Send a new code</button>
        <button type="button" class="guest-action" :disabled="busy || disabled" @click="challenge = ''; code = ''; error = ''">Use another email</button>
      </form>
    </template>
    <label v-if="!signedIn" class="remember-account"><input v-model="remember" type="checkbox" :disabled="busy || disabled" /><span>Keep me signed in on this device</span></label>
    <p v-if="error" class="auth-error" role="alert">{{ error }}</p>
  </section>
</template>

<style scoped>
.passwordless-sign-in { display: grid; gap: 12px; margin: 20px 0; padding: 20px 0; border-bottom: 1px solid var(--line, #d4d9d4); }
.remember-account { display: flex; align-items: center; gap: 10px; }
input[type='text'], input[type='email'] { width: 100%; min-width: 0; box-sizing: border-box; font: inherit; padding: 12px; border: 1px solid #707970; border-radius: 8px; }
p { overflow-wrap: anywhere; }
</style>
