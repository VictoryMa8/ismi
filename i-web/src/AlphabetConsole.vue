<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { request, uploadRecording } from './api'
import { blankAlphabet, type AlphabetDetail, type AlphabetSummary, type AlphabetDraftPack, type AlphabetPack } from './alphabet'
import { courses, type CourseId } from './courses'
import AlphabetExplorer from './AlphabetExplorer.vue'
const summaries = ref<AlphabetSummary[]>([]), selected = ref<AlphabetDetail | null>(null), version = ref(1), course = ref<CourseId>('levantine')
const json = ref(''), saved = ref(''), busy = ref(false), error = ref(''), notice = ref(''), reason = ref('')
const validation = ref<{ isValid: boolean; errors: string[] } | null>(null), preview = ref<AlphabetPack | null>(null), uploadedUrl = ref('')
const current = computed(() => selected.value?.state.versions.find(v => v.number === version.value))
const dirty = computed(() => !selected.value || json.value !== saved.value)
async function run(work: () => Promise<void>) { if (busy.value) return; busy.value = true; error.value = ''; notice.value = ''; try { await work() } catch (e) { error.value = e instanceof Error ? e.message : 'Alphabet request failed.' } finally { busy.value = false } }
const list = () => request<AlphabetSummary[]>('/api/admin/alphabet/packs')
function set(d: AlphabetDetail, n?: number) { selected.value = d; version.value = n ?? d.state.versions.at(-1)!.number; course.value = current.value!.pack.courseId; json.value = JSON.stringify(current.value!.pack, null, 2); saved.value = json.value; preview.value = null; validation.value = null }
function create() { selected.value = null; json.value = JSON.stringify(blankAlphabet(course.value), null, 2); saved.value = ''; version.value = 1; validation.value = null; preview.value = null }
async function load(id: string) { await run(async () => set(await request<AlphabetDetail>(`/api/admin/alphabet/packs/${id}`))) }
async function save() { await run(async () => { const p = JSON.parse(json.value) as AlphabetDraftPack; set(await request<AlphabetDetail>('/api/admin/alphabet/drafts', { method: 'POST', body: JSON.stringify({ pack: p, expectedRevision: selected.value?.revision }) })); summaries.value = await list(); notice.value = 'Alphabet draft saved privately.' }) }
async function command(action: string) {
  if (!selected.value || dirty.value) return
  await run(async () => {
    const base = `/api/admin/alphabet/packs/${selected.value!.id}`
    if (action === 'preview') { preview.value = await request<AlphabetPack>(`${base}/preview/${version.value}`); return }
    const payload = { expectedRevision: selected.value!.revision, version: version.value, reason: reason.value }
    if (action === 'validate') { validation.value = await request(`${base}/validate`, { method: 'POST', body: JSON.stringify(payload) }); notice.value = validation.value?.isValid ? 'Validation passed. Exact human approval is still required.' : ''; return }
    const n = version.value; set(await request<AlphabetDetail>(`${base}/${action}`, { method: 'POST', body: JSON.stringify(payload) }), n); summaries.value = await list()
    notice.value = action === 'approve-text-preview' ? 'Owner text-preview exception recorded. No linguistic approval or human audio.' : action === 'approve' ? 'Exact alphabet version approved. Publication remains separate.' : action === 'publish' ? 'Alphabet version published.' : action === 'withdraw' ? 'Alphabet withdrawn. Reconnecting clients will remove its download.' : 'Previous alphabet publication restored.'
  })
}
async function importJson(event: Event) {
  const input = event.target as HTMLInputElement, file = input.files?.[0]; if (!file) return
  await run(async () => {
    if (file.size > 2_000_000) throw new Error('Choose a pack smaller than 2 MB.')
    const p = JSON.parse(await file.text()) as AlphabetDraftPack
    if (!p || typeof p.id !== 'string' || !courses.some(c => c.id === p.courseId)) throw new Error('Choose an alphabet pack JSON file.')
    const existing = summaries.value.find(s => s.id === p.id)
    if (existing) set(await request(`/api/admin/alphabet/packs/${existing.id}`)); else selected.value = null
    json.value = JSON.stringify(p, null, 2); course.value = p.courseId; preview.value = null; validation.value = null; notice.value = 'File loaded. Save a private draft before validation.'
  }); input.value = ''
}
async function upload(event: Event) { const input = event.target as HTMLInputElement, file = input.files?.[0]; if (!file) return; await run(async () => { uploadedUrl.value = (await uploadRecording(file)).audioUrl; notice.value = 'Recording uploaded privately. Add its URL, exact transcript, speaker, review and rights evidence to the pack.' }); input.value = '' }
onMounted(() => void run(async () => { summaries.value = await list(); create() }))
</script>
<template>
  <section class="alphabet-console" aria-labelledby="alphabet-console-heading">
    <h2 id="alphabet-console-heading">Alphabet packs</h2>
    <p>Draft → validate → approve → publish. Review exact inventories, examples and answer rationales. Text-only packs use visual practice; audio packs also require reviewed human recordings. MSA and Quranic publication require further track controls.</p>
    <p v-if="error" role="alert" class="console-message error">{{ error }}</p><p v-if="notice" role="status" class="console-message success">{{ notice }}</p>
    <div class="alphabet-console-toolbar"><label>New pack course<select v-model="course" :disabled="busy"><option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option></select></label><button type="button" class="secondary-action" :disabled="busy" @click="create">New alphabet draft</button><label>Import alphabet JSON<input type="file" accept=".json,application/json" :disabled="busy" @change="importJson" /></label></div>
    <ul><li v-for="s in summaries" :key="s.id"><button type="button" class="secondary-action" :disabled="busy" @click="load(s.id)">{{ s.title }} · {{ s.courseId }} · {{ s.status }} · v{{ s.latestVersion }}</button></li></ul>
    <label v-if="selected">Saved alphabet version<select v-model="version" :disabled="busy" @change="set(selected!, version)"><option v-for="v in selected.state.versions" :key="v.number" :value="v.number">v{{ v.number }} · {{ v.status }}</option></select></label>
    <label>Alphabet pack JSON<textarea v-model="json" spellcheck="false" rows="20" :disabled="busy" @input="preview = null; validation = null" /></label>
    <p v-if="dirty">Unsaved draft. Save before validating, previewing or approving.</p>
    <div class="alphabet-console-toolbar"><button type="button" class="primary-action" :disabled="busy || !dirty" @click="save">Save alphabet draft</button><button type="button" class="secondary-action" :disabled="busy || dirty" @click="command('validate')">Validate alphabet</button><button type="button" class="secondary-action" :disabled="busy || dirty" @click="command('preview')">Preview alphabet</button><button type="button" class="secondary-action" :disabled="busy || dirty || current?.status !== 'draft' || !validation?.isValid" @click="command('approve')">Approve alphabet version</button><button type="button" class="primary-action" :disabled="busy || dirty || !['approved','approved-text-preview'].includes(current?.status ?? '')" @click="command('publish')">Publish alphabet version</button></div>
    <p>The exact five October 16 inventory-only previews have a separate owner publication exception. It grants no linguistic review, human audio, graded exercises or beta eligibility.</p>
    <button type="button" class="secondary-action" :disabled="busy || dirty || current?.status !== 'draft'" @click="command('approve-text-preview')">Authorize exact text preview</button>
    <div v-if="validation" aria-label="Alphabet validation"><p>{{ validation.isValid ? 'Validation passed.' : `${validation.errors.length} issues block approval/publication.` }}</p><ul><li v-for="(issue, i) in validation.errors" :key="i">{{ issue }}</li></ul></div>
    <details><summary>Upload a reviewed human recording</summary><p>16-bit PCM WAV, mono/stereo, 8–48 kHz, up to 10 MB. Upload alone does not approve or publish audio.</p><input type="file" accept=".wav,audio/wav" aria-label="Alphabet recording" :disabled="busy" @change="upload" /><p v-if="uploadedUrl"><code>{{ uploadedUrl }}</code></p></details>
    <label>Alphabet withdrawal or rollback reason<input v-model="reason" maxlength="1000" /></label>
    <div class="alphabet-console-toolbar"><button type="button" class="secondary-action" :disabled="busy || dirty || !reason.trim() || selected?.state.publishedVersion !== version" @click="command('withdraw')">Withdraw alphabet</button><button type="button" class="secondary-action" :disabled="busy || dirty || !reason.trim() || !current?.publishedAtUtc || selected?.state.publishedVersion === version" @click="command('rollback')">Restore alphabet version</button></div>
    <details v-if="selected"><summary>Alphabet audit history</summary><ol><li v-for="(a, i) in selected.state.audit" :key="i">{{ a.atUtc }} · {{ a.action }} · v{{ a.version }} · {{ a.actor }} · {{ a.reason }}</li></ol></details>
    <section v-if="preview" aria-label="Private alphabet preview"><AlphabetExplorer :key="`${preview.id}:${preview.version}`" :course-id="preview.courseId" scope="private-preview" :preview-pack="preview" /></section>
  </section>
</template>
<style scoped>
.alphabet-console { min-width:0; } .alphabet-console label { display:flex; flex-direction:column; gap:.5rem; margin:1rem 0; font-weight:650; }
.alphabet-console input,.alphabet-console select,.alphabet-console textarea { max-width:100%; min-height:48px; font:inherit; padding:.75rem; border:1px solid #7f9689; border-radius:8px; background:#fff; color:#263a34; }
.alphabet-console textarea { width:100%; font: .875rem/1.6 ui-monospace,monospace; } .alphabet-console-toolbar { display:flex; flex-wrap:wrap; gap:.75rem; align-items:center; margin:1rem 0; }
.alphabet-console li { overflow-wrap:anywhere; margin:.5rem 0; } .alphabet-console details { margin:1.5rem 0; } .alphabet-console button { min-height:48px; }
</style>
