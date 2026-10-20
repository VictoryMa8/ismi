<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { CourseLessonSummary, LessonResponse } from './types'
import { ApiRequestError, getLesson } from './api'
import { cacheLesson, getCachedLesson, removeCachedLesson } from './offline'
import { glossarySearchText } from './glossary'
import GrammarEntry from './GrammarEntry.vue'
const props = defineProps<{ scope: string; lessons: CourseLessonSummary[] }>()
defineEmits<{ 'open-lesson': [id: string, cardIndex: number] }>()
const packages = ref<LessonResponse[]>([])
const query = ref('')
const notice = ref('')
const loading = ref(false)
let generation = 0
const entries = computed(() => packages.value.flatMap(lesson => (lesson.languageSupport?.references ?? []).map(reference => ({ lesson, reference }))))
const filtered = computed(() => entries.value.filter(({ lesson, reference }) => {
  const examples = reference.exampleCardIndexes.map(i => lesson.introduction?.teachingCards?.[i]?.phrase)
  const haystack = glossarySearchText([reference.title, reference.explanation, ...reference.searchTerms,
    ...examples.flatMap(p => p ? [p.arabic, p.arabizi, p.meaning] : [])].join(' '))
  return glossarySearchText(query.value).split(/\s+/).every(term => haystack.includes(term))
}))
async function refresh() {
  const token = ++generation
  loading.value = true; notice.value = ''; packages.value = []
  const available: LessonResponse[] = []
  let missing = 0; let unsaved = false; let cached = false
  for (const summary of props.lessons) {
    let lesson: LessonResponse | undefined
    try {
      if (!navigator.onLine) throw new Error('Offline')
      lesson = await getLesson(summary.id)
      if (token !== generation) return
      try { await cacheLesson(lesson) } catch { unsaved = true }
    } catch (error) {
      if (token !== generation) return
      if (error instanceof ApiRequestError && [403, 404, 410].includes(error.status)) {
        try { await removeCachedLesson(summary.id) } catch { /* Hide withdrawn records even if removal fails. */ }
      } else {
        try { lesson = await getCachedLesson(summary.id); if (lesson) cached = true } catch { /* Report missing downloads. */ }
      }
    }
    if (token !== generation) return
    if (lesson) available.push(lesson); else missing++
  }
  packages.value = available
  notice.value = [missing ? `${missing} lesson(s) unavailable. Reconnect to refresh references.` : '', unsaved ? 'Some references could not be saved for offline use.' : '', cached ? 'Showing downloaded lesson versions. Reconnect to check for revisions.' : ''].filter(Boolean).join(' ')
  loading.value = false
}
watch(() => [props.scope, props.lessons.map(l => l.id).join('|')], () => { query.value = ''; void refresh() }, { immediate: true })
window.addEventListener('online', refresh)
onBeforeUnmount(() => { generation++; window.removeEventListener('online', refresh) })
</script>
<template>
  <section class="grammar-library" aria-label="Grammar reference" :aria-busy="loading">
    <label>Search grammar<input v-model="query" type="search" placeholder="Topic, Arabic or Arabizi" dir="auto" /></label>
    <p v-if="loading" role="status">Loading references…</p>
    <template v-else>
      <p role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'reference' : 'references' }}</p>
      <p v-if="!entries.length">No grammar references in the available lesson versions yet.</p>
      <p v-else-if="!filtered.length">No matching references. Try another topic, Arabic phrase or pronunciation help.</p>
      <GrammarEntry v-for="entry in filtered" :key="`${entry.lesson.id}:${entry.lesson.version}:${entry.reference.id}`" :lesson="entry.lesson" :reference-id="entry.reference.id" link-contexts @open-lesson="(id, i) => $emit('open-lesson', id, i)" />
    </template>
    <p v-if="notice" role="status">{{ notice }}</p>
    <button type="button" @click="refresh">Refresh references</button>
  </section>
</template>
<style scoped>
.grammar-library { padding: 1rem; background: #fff; color: #202820; border: 1px solid #657465; border-radius: .75rem; }
label { display: grid; gap: .5rem; font-weight: 700; }
input { min-width: 0; width: 100%; box-sizing: border-box; padding: .8rem; border: 1px solid #657465; border-radius: .4rem; font: inherit; }
:deep(.grammar-entry) { border-top: 3px solid #167144; padding-block: 1rem; margin-top: 1rem; }
</style>
