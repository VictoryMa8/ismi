<script setup lang="ts">
import { nextTick, ref } from 'vue'

defineProps<{ busy: boolean; error: string; disabled: boolean }>()
const emit = defineEmits<{ delete: [confirmation: string] }>()
const open = ref(false)
const confirmation = ref('')
const input = ref<HTMLInputElement>()
const opener = ref<HTMLButtonElement>()
async function show() { open.value = true; confirmation.value = ''; await nextTick(); input.value?.focus() }
async function cancel() { open.value = false; confirmation.value = ''; await nextTick(); opener.value?.focus() }
</script>

<template>
  <section class="account-deletion" aria-labelledby="delete-account-heading">
    <h2 id="delete-account-heading">Delete account</h2>
    <button v-if="!open" ref="opener" type="button" class="secondary-action" :disabled="disabled || busy" @click="show">Delete my account</button>
    <form v-else @submit.prevent="emit('delete', confirmation)">
      <p id="deletion-effects">Permanently delete your account, synced progress and study settings, plus this account’s history and pending work in this browser. Guest data and shared downloads stay. This cannot be undone.</p>
      <p>Sign in within the last 10 minutes to delete. Other browsers clear this account’s local data when they reconnect to Ismi. Backups and provider logs are separate; see the <a href="#/privacy">privacy policy</a>.</p>
      <label for="delete-confirmation">Type DELETE to confirm</label>
      <input id="delete-confirmation" ref="input" v-model="confirmation" autocomplete="off" spellcheck="false" :disabled="busy" aria-describedby="deletion-effects" />
      <p v-if="error" role="alert" class="auth-error">{{ error }}</p>
      <div class="account-actions">
        <button type="submit" class="primary-action" :disabled="disabled || busy || confirmation !== 'DELETE'">{{ busy ? 'Deleting account…' : 'Permanently delete account' }}</button>
        <button type="button" class="secondary-action" :disabled="busy" @click="cancel">Cancel</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.account-deletion { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #d7ddd8; }
form { display: grid; gap: 1rem; }
p { margin: 0; line-height: 1.5; }
input { width: 100%; min-height: 48px; box-sizing: border-box; border: 1px solid #69776e; border-radius: 8px; padding: .7rem; font: inherit; }
.primary-action { background: #a52e37; color: white; box-shadow: none; }
.primary-action:hover:not(:disabled) { background: #84242c; box-shadow: none; transform: none; }
a { color: var(--teal-dark); text-underline-offset: .15em; }
</style>
