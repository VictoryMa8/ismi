<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ApiRequestError, getCulturalCatalog, getCulturalEdition } from './api'
import { getDeviceSnapshot, saveDeviceSnapshot } from './offline'
import { editionDate, validCulturalCatalog, validPublicEdition, type CulturalCatalog, type PublicCulturalEdition } from './culture'
import CulturalMediaCards from './CulturalMediaCards.vue'
import BackControl from './BackControl.vue'
const props = defineProps<{ editionId: string | null }>()
const snapshotKey = 'cultural-catalog-v1'
const catalog = ref<CulturalCatalog | null>(null), detail = ref<PublicCulturalEdition | null>(null)
const archive = ref<PublicCulturalEdition[]>([]), busy = ref(false), offline = ref(!navigator.onLine)
const error = ref(''), cacheNotice = ref(''), missing = ref(false), nextOffset = ref(8), hasMore = ref(false)
const connected = ref(navigator.onLine)
let generation = 0
let cacheWrites = Promise.resolve()
function persist(value: { catalog: CulturalCatalog; openEdition: PublicCulturalEdition | null }, run: number) {
  cacheWrites = cacheWrites.catch(() => {}).then(async () => {
    if (run === generation) await saveDeviceSnapshot(snapshotKey, value)
  })
  return cacheWrites
}
const selected = computed(() => props.editionId ? detail.value : catalog.value?.editions.find(e => e.id === catalog.value?.currentId) ?? null)
const past = computed(() => archive.value.filter(e => e.id !== catalog.value?.currentId))
async function refresh() {
  const run = ++generation, id = props.editionId
  busy.value = true; error.value = ''; missing.value = false; detail.value = null
  // Cached content appears immediately, then is replaced only by a validated complete response.
  try {
    const stored = await getDeviceSnapshot<{ catalog?: unknown; openEdition?: unknown }>(snapshotKey)
    const saved = stored?.catalog, savedDetail = stored?.openEdition
    if (run !== generation) return
    if (validCulturalCatalog(saved)) { catalog.value = saved; archive.value = saved.editions; hasMore.value = saved.hasMore; nextOffset.value = 8 }
    if (id) {
      missing.value = catalog.value?.withdrawnIds.includes(id) ?? false
      detail.value = missing.value ? null : catalog.value?.editions.find(e => e.id === id) ?? (validPublicEdition(savedDetail) && savedDetail.id === id ? savedDetail : null)
    }
  } catch { cacheNotice.value = 'Saved picks are unavailable on this device.' }
  if (run !== generation) return
  if (!navigator.onLine) { offline.value = true; busy.value = false; return }
  try {
    const fresh = await getCulturalCatalog()
    if (!validCulturalCatalog(fresh)) throw new Error('The collection response was incomplete. Try again.')
    if (run !== generation) return
    catalog.value = fresh; archive.value = fresh.editions; hasMore.value = fresh.hasMore; nextOffset.value = 8; offline.value = false
    try {
      await persist({ catalog: fresh, openEdition: null }, run)
      cacheNotice.value = ''
    } catch { cacheNotice.value = 'Picks are visible, but could not be saved for offline use.' }
    if (run !== generation) return
    // A successful authoritative response reconciles withdrawals before any old detail is shown.
    if (id) {
      detail.value = fresh.editions.find(e => e.id === id) ?? null
      if (fresh.withdrawnIds.includes(id)) missing.value = true
      else if (!detail.value) {
        try {
          const response = await getCulturalEdition(id)
          if (run !== generation) return
          if (!validPublicEdition(response)) throw new Error('The edition response was incomplete.')
          detail.value = response
        } catch (caught) {
          if (run !== generation) return
          if (caught instanceof ApiRequestError && caught.status === 404) missing.value = true
          else throw caught
        }
      }
    }
    try {
      if (id && detail.value && !missing.value) await persist({ catalog: fresh, openEdition: detail.value }, run)
      cacheNotice.value = ''
    } catch { cacheNotice.value = 'Picks are visible, but could not be saved for offline use.' }
  } catch (caught) {
    if (run !== generation) return
    offline.value = true
    error.value = caught instanceof Error ? caught.message : 'Could not refresh picks.'
  } finally { if (run === generation) busy.value = false }
}
async function older() {
  if (busy.value || offline.value) return
  const run = generation; busy.value = true; error.value = ''
  try {
    const response = await getCulturalCatalog(nextOffset.value)
    if (run !== generation) return
    if (!validCulturalCatalog(response)) throw new Error('The archive response was incomplete.')
    // Restart pagination after a correction, withdrawal or week rollover.
    if (response.catalogRevision !== catalog.value?.catalogRevision) { busy.value = false; await refresh(); return }
    archive.value = [...archive.value, ...response.editions.filter(e => !archive.value.some(old => old.id === e.id))]
    nextOffset.value += 8; hasMore.value = response.hasMore
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not load older picks.' }
  finally { if (run === generation) busy.value = false }
}
function connectionChanged() { connected.value = navigator.onLine; if (connected.value) void refresh(); else offline.value = true }
function returnedToPage() { if (navigator.onLine && !busy.value) void refresh() }
watch(() => props.editionId, () => void refresh())
onMounted(() => { void refresh(); window.addEventListener('online', connectionChanged); window.addEventListener('offline', connectionChanged); window.addEventListener('focus', returnedToPage) })
onBeforeUnmount(() => { generation++; window.removeEventListener('online', connectionChanged); window.removeEventListener('offline', connectionChanged); window.removeEventListener('focus', returnedToPage) })
</script>
<template>
  <section class="culture-page" aria-labelledby="culture-heading" :aria-busy="busy">
    <BackControl class="page-back" :href="editionId ? '#/practice/culture' : '#/practice'">{{ editionId ? 'Back to latest picks' : 'Back to Practice' }}</BackControl>
    <header class="culture-page-heading"><h1 id="culture-heading">Watch &amp; listen</h1><button class="guest-action" type="button" :disabled="busy || !connected" @click="refresh">Refresh picks</button></header>
    <p v-if="busy && !catalog" role="status">Loading picks…</p>
    <p v-if="offline && catalog" class="culture-saved" role="status">Saved picks · playback needs internet. Last refreshed {{ editionDate(catalog.serverTimeUtc) }}.</p>
    <p v-if="error" role="alert">{{ error }}<template v-if="catalog"> Showing saved picks.</template></p>
    <p v-if="cacheNotice" role="status">{{ cacheNotice }}</p>
    <p v-if="missing">This edition is no longer available. Explore the latest picks or return to Practice.</p>
    <template v-else-if="selected">
      <p class="culture-edition-label">{{ editionId ? 'Edition' : catalog?.isCurrentWeek && !offline ? 'This week' : 'Latest picks' }} · {{ editionDate(selected.weekStartUtc) }}</p>
      <h2 class="culture-edition-title">{{ selected.title }}</h2><p v-if="selected.theme">{{ selected.theme }}</p>
      <p class="culture-optional">Choose any pick. These are optional and don’t count toward your daily goal or streak.</p>
      <CulturalMediaCards :items="selected.items" :offline="offline" />
    </template>
    <p v-else-if="!busy">{{ editionId ? 'This edition is not saved here. Reconnect to check its availability.' : offline ? 'No saved picks yet. Reconnect to load a collection.' : 'No weekly collection has been published yet.' }}</p>
    <section v-if="!editionId && past.length" class="culture-archive" aria-labelledby="culture-past-heading">
      <h2 id="culture-past-heading">Past picks</h2><ul><li v-for="edition in past" :key="edition.id"><a :href="`#/practice/culture/${edition.id}`">{{ edition.title }} · {{ editionDate(edition.weekStartUtc) }}</a></li></ul>
    </section>
    <button v-if="!editionId && hasMore" type="button" class="secondary-action" :disabled="busy || offline" @click="older">Older picks</button>
  </section>
</template>
