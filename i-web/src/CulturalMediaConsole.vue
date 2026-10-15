<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { culturalCommand, getCulturalDraft, listCulturalEditions, saveCulturalDraft } from './api'
import { emptyCulturalEdition, editionDate, validPublicEdition, type CulturalDetail, type CulturalEdition, type CulturalSummary, type CulturalValidation, type PublicCulturalEdition } from './culture'
import CulturalMediaCards from './CulturalMediaCards.vue'
const editions = ref<CulturalSummary[]>([]), selected = ref<CulturalDetail | null>(null), version = ref(1)
const json = ref(''), savedJson = ref(''), busy = ref(false), error = ref(''), notice = ref(''), reason = ref(''), preview = ref(false)
const validation = ref<CulturalValidation | null>(null)
const current = computed(() => selected.value?.state.versions.find(v => v.number === version.value))
const dirty = computed(() => json.value !== savedJson.value || !selected.value)
const projected = computed<PublicCulturalEdition | null>(() => {
  try {
    const e = JSON.parse(json.value) as CulturalEdition
    const p = { ...e, version: version.value, contentHash: 'draft-preview', items: e.items.map(i => ({ ...i,
      resources: i.resources.map(r => ({ ...r, available: true, availabilityNote: '' })) })) }
    return validPublicEdition(p, true) ? p : null
  } catch { return null }
})
function set(detail: CulturalDetail, n?: number) {
  selected.value = detail; version.value = n ?? detail.state.versions.at(-1)!.number
  json.value = JSON.stringify(detail.state.versions.find(v => v.number === version.value)!.edition, null, 2)
  savedJson.value = json.value; validation.value = null
}
async function run(action: () => Promise<void>) {
  if (busy.value) return
  busy.value = true; error.value = ''; notice.value = ''
  try { await action() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'The collection request failed.' }
  finally { busy.value = false }
}
async function load(id: string) { await run(async () => set(await getCulturalDraft(id))) }
function create() {
  selected.value = null; version.value = 1; json.value = JSON.stringify(emptyCulturalEdition(), null, 2)
  savedJson.value = ''; error.value = ''; notice.value = ''; validation.value = null; preview.value = false
}
async function save() {
  await run(async () => {
    const detail = await saveCulturalDraft(JSON.parse(json.value) as CulturalEdition, selected.value?.revision)
    set(detail); editions.value = await listCulturalEditions(); notice.value = 'Draft saved. It remains hidden from learners.'
  })
}
async function command(action: string) {
  if (!selected.value || dirty.value) return
  await run(async () => {
    const payload = { expectedRevision: selected.value!.revision, version: version.value, reason: reason.value }
    if (action === 'validate') {
      validation.value = await culturalCommand<CulturalValidation>(selected.value!.id, action, payload)
      notice.value = validation.value.isValid ? 'Validation passed. Human review is still required.' : ''
    } else {
      const n = version.value
      set(await culturalCommand(selected.value!.id, action, payload), n)
      editions.value = await listCulturalEditions()
      notice.value = action === 'publish' ? 'Published for the edition date. Future editions stay hidden until Monday 00:00 UTC.'
        : action === 'withdraw' ? 'Withdrawn. Reconnecting clients will remove the edition.'
        : action === 'approve' ? 'Exact saved revision approved. Publish when ready.' : 'Previously published revision restored.'
    }
  })
}
async function check(resourceId: string, available: boolean) {
  if (!selected.value) return
  if (!reason.value.trim()) { error.value = 'Enter an availability check or correction note first.'; return }
  await run(async () => { const n = version.value; set(await culturalCommand(selected.value!.id, 'check-link', {
    expectedRevision: selected.value!.revision, version: n, resourceId, available, note: reason.value }), n)
    notice.value = available ? 'Availability check recorded.' : 'Link suppressed. Other links and the text alternative remain available.' })
}
async function importFile(event: Event) {
  const input = event.target as HTMLInputElement, file = input.files?.[0]
  if (!file) return
  if (file.size > 120000) { error.value = 'Choose a collection file smaller than 120 KB.'; input.value = ''; return }
  await run(async () => {
    const parsed = JSON.parse(await file.text()); const edition = parsed.edition ?? parsed
    if (!edition || typeof edition.id !== 'string' || !Array.isArray(edition.items)) throw new Error('Choose an edition JSON file.')
    const existing = editions.value.find(e => e.id === edition.id)
    if (existing) set(await getCulturalDraft(existing.id))
    else selected.value = null
    json.value = JSON.stringify(edition, null, 2); validation.value = null; notice.value = 'File loaded for review. Save it as a draft.'
  }); input.value = ''
}
onMounted(() => void run(async () => { editions.value = await listCulturalEditions(); create() }))
</script>
<template>
  <section class="media-console" aria-labelledby="media-console-heading">
    <h2 id="media-console-heading">Weekly media collections</h2>
    <p>One YouTube video, one film and one song. Monday 00:00 UTC. Review exact sources and access before approval.</p>
    <p v-if="error" class="console-message error" role="alert">{{ error }}</p><p v-if="notice" class="console-message success" role="status">{{ notice }}</p>
    <div class="culture-admin-toolbar"><button type="button" class="secondary-action" :disabled="busy" @click="create">New collection</button><label>Import collection JSON<input type="file" accept=".json,application/json" :disabled="busy" @change="importFile" /></label></div>
    <div class="culture-admin-layout">
      <aside aria-label="Media editions"><h3>Editions</h3><p v-if="!editions.length">No drafts yet.</p><button v-for="edition in editions" :key="edition.id" type="button" class="culture-edition-button" :disabled="busy" :aria-pressed="selected?.id === edition.id" @click="load(edition.id)"><strong>{{ edition.title }}</strong><span>{{ editionDate(edition.weekStartUtc) }} · {{ edition.status }}</span></button></aside>
      <div>
        <label v-if="selected" class="culture-version-select">Revision<select :value="version" :disabled="busy" @change="set(selected!, Number(($event.target as HTMLSelectElement).value))"><option v-for="v in selected.state.versions" :key="v.number" :value="v.number">v{{ v.number }} · {{ v.status }}</option></select></label>
        <p v-if="current">Saved revision: {{ current.status }} · approval {{ current.approvedAtUtc ? editionDate(current.approvedAtUtc) : 'pending' }}. Editing an approved or published revision creates a new draft.</p>
        <label for="culture-json">Collection JSON</label><textarea id="culture-json" v-model="json" class="culture-json" spellcheck="false" :disabled="busy" />
        <div class="culture-admin-toolbar"><button class="primary-action" type="button" :disabled="busy || !dirty" @click="save">Save media draft</button><button type="button" class="secondary-action" :disabled="busy || dirty" @click="command('validate')">Validate media</button><button type="button" class="secondary-action" :disabled="!projected" :aria-expanded="preview" @click="preview = !preview">{{ preview ? 'Hide preview' : 'Preview collection' }}</button></div>
        <ul v-if="validation && !validation.isValid" role="alert"><li v-for="message in validation.errors" :key="message">{{ message }}</li></ul>
        <div class="culture-admin-toolbar"><button type="button" class="secondary-action" :disabled="busy || dirty || current?.status !== 'draft'" @click="command('approve')">Approve media revision</button><button type="button" class="secondary-action" :disabled="busy || dirty || current?.status !== 'approved'" @click="command('publish')">Publish media revision</button><button type="button" class="secondary-action" :disabled="busy || dirty || !current?.publishedAtUtc || selected?.state.publishedVersion === version" @click="command('rollback')">Restore media revision</button></div>
        <template v-if="selected && !dirty && current">
          <label for="culture-check-note">Availability check or correction note</label><textarea id="culture-check-note" v-model="reason" rows="2" maxlength="500" :disabled="busy" />
          <button class="secondary-action" type="button" :disabled="busy || selected.state.publishedVersion !== version || !reason.trim()" @click="command('withdraw')">Withdraw collection</button>
          <details class="culture-checks"><summary>Link checks and suppression</summary><div v-for="item in current.edition.items" :key="item.id"><h3>{{ item.title }}</h3><div v-for="r in item.resources" :key="r.id" class="culture-resource-check"><span>{{ r.id }} · {{ r.url }}</span><button class="guest-action" type="button" :disabled="busy || !reason.trim()" @click="check(r.id, true)">Record available: {{ r.id }}</button><button class="guest-action" type="button" :disabled="busy || !reason.trim()" @click="check(r.id, false)">Suppress: {{ r.id }}</button><p v-if="selected.state.observations.some(o => o.resourceId === r.id && o.url === r.url)">Last check: {{ selected.state.observations.filter(o => o.resourceId === r.id && o.url === r.url).at(-1)?.available ? 'available' : 'suppressed' }}</p></div></div></details>
          <details><summary>Media audit history</summary><ol class="culture-audit"><li v-for="(entry, index) in selected.state.audit" :key="index">{{ entry.action }} · v{{ entry.version }} · {{ entry.actor }} · {{ entry.atUtc }}<p v-if="entry.note">{{ entry.note }}</p></li></ol></details>
        </template>
      </div>
    </div>
    <section v-if="preview && projected" class="culture-preview" aria-label="Media draft preview"><h2>{{ projected.title }} · draft preview</h2><p>{{ projected.theme }}</p><CulturalMediaCards :items="projected.items" /></section>
  </section>
</template>
