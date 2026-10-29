<script setup lang="ts">
import { textAttributes } from './courses'
import ReadingHelp from './ReadingHelp.vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ApiRequestError, request } from './api'
import { getDeviceSnapshot } from './offline'
import { downloadStory, emptyStoryProgress, reconcileStories, removeStory, saveStoryProgress, storyDownloads, storyKey, verifyStory, type Story, type StoryProgress } from './stories'
import LessonScroll from './LessonScroll.vue'
import BackControl from './BackControl.vue'
import CharacterPortrait from './CharacterPortrait.vue'
import { characterName } from './characters'
const props = defineProps<{ scope: string; courseId: string; preview?: Story }>()
const episodes = ref<Story[]>([]), downloads = ref<Story[]>([]), active = ref<Story>(), progress = ref<StoryProgress>(emptyStoryProgress())
const error = ref(''), status = ref(''), loading = ref(false), busy = ref(false), answer = ref(''), feedback = ref(''), help = ref(false), heading = ref<HTMLElement>()
const dialog = ref<HTMLDialogElement>()
let opener: HTMLElement | null = null
let generation = 0
const scene = computed(() => active.value?.scenes[progress.value.position])
const check = computed(() => active.value?.checks[progress.value.position - active.value.scenes.length])
const finished = computed(() => !!active.value && progress.value.position >= active.value.scenes.length + active.value.checks.length)
async function persist() {
 if (!active.value || props.preview) return
 const token = generation, scope = props.scope, story = active.value, saved = structuredClone(JSON.parse(JSON.stringify(progress.value))) as StoryProgress
 try { await saveStoryProgress(scope, story, saved) } catch { if (token === generation) error.value = 'Progress could not be saved on this device. You can keep reading.' }
}
async function open(s: Story) {
 opener = document.activeElement as HTMLElement | null
 const token = ++generation; active.value = undefined; error.value = ''; progress.value = emptyStoryProgress(); answer.value = ''; feedback.value = ''; help.value = false
 try {
  if (!props.preview) await verifyStory(s)
  const saved = props.preview ? undefined : await getDeviceSnapshot<StoryProgress>(storyKey(props.scope, s))
  if (token !== generation) return
  if (saved && (!Number.isInteger(saved.position) || saved.position < 0 || saved.position > s.scenes.length + s.checks.length || !saved.results)) throw new Error('Invalid saved position')
  progress.value = saved ?? emptyStoryProgress(); active.value = s; await focus()
 } catch { if (token === generation) error.value = 'This story could not be opened. Refresh or download it again.' }
}
async function focus() { await nextTick(); if (dialog.value && !dialog.value.open) dialog.value.showModal(); heading.value?.focus() }
async function refresh() {
 const token = ++generation; active.value = undefined; episodes.value = []; error.value = ''; status.value = ''; loading.value = true
 try {
  downloads.value = await storyDownloads() ?? []
  let available: Story[]
  if (props.preview) available = [props.preview]
  else if (navigator.onLine) {
   try {
    available = (await request<{ episodes: Story[] }>('/api/stories')).episodes
    if (token !== generation) return
    await reconcileStories(available); downloads.value = await storyDownloads() ?? []
   } catch (e) {
    if (e instanceof ApiRequestError) throw e
    available = downloads.value; status.value = 'Connection unavailable · downloaded text only. Availability will be checked when connected.'
   }
  } else { available = downloads.value; status.value = 'Offline · downloaded text only.' }
  if (token !== generation) return
  episodes.value = available.filter(s => s.courseId === props.courseId)
  if (props.preview) await open(props.preview)
 } catch { if (token === generation) error.value = 'Stories could not be checked. Try again when connected.' }
 finally { loading.value = false }
}
async function manage(s: Story, remove = false) {
 busy.value = true; error.value = ''; const token = generation
 try { if (remove) await removeStory(s.id); else await downloadStory(s); if (token === generation) { downloads.value = await storyDownloads() ?? []; status.value = remove ? 'Download removed.' : 'Text and checks downloaded.' } }
 catch (e) { if (token === generation) error.value = e instanceof Error ? e.message : 'Download failed.' } finally { busy.value = false }
}
async function submit() {
 const c = check.value; if (busy.value || !c || !answer.value) return
 busy.value = true
 const chosen = c.choices.find(x => x.id === answer.value)!; const prior = progress.value.results[c.id]
 progress.value.results[c.id] = { first: prior?.first ?? answer.value, helped: prior?.helped ?? progress.value.helped, attempts: (prior?.attempts ?? 0) + 1 }
 feedback.value = `${answer.value === c.acceptedId ? 'That fits.' : 'Try again.'} ${chosen.rationale} ${c.explanation}`
 await persist(); busy.value = false
}
async function advance() {
 if (busy.value) return
 if (check.value && (!feedback.value || answer.value !== check.value.acceptedId)) return
 busy.value = true
 progress.value.position++; progress.value.helped = false; answer.value = ''; feedback.value = ''; help.value = false
 if (finished.value) progress.value.completed = true
 await persist(); busy.value = false; await focus()
}
async function assistance() { if (busy.value) return; busy.value = true; help.value = !help.value; progress.value.helped = true; await persist(); busy.value = false }
async function restart() { progress.value = { ...progress.value, position: 0, helped: false }; answer.value = ''; feedback.value = ''; help.value = false; await persist(); await focus() }
async function close() { generation++; active.value = undefined; await nextTick(); opener?.focus() }
watch(() => [props.scope, props.courseId, props.preview], () => void refresh())
onMounted(() => { void refresh(); window.addEventListener('online', refresh) })
onBeforeUnmount(() => { generation++; window.removeEventListener('online', refresh) })
</script>
<template>
<section class="stories" aria-labelledby="stories-heading">
 <BackControl v-if="!preview" href="#/practice">Back to Practice</BackControl>
 <h2 id="stories-heading">Mini-stories</h2>
 <p v-if="preview" role="status">Private draft preview · unreviewed · text only. No learning credit is recorded.</p>
 <p v-if="error && !active" role="alert">{{ error }}</p><p v-if="status && !active" role="status">{{ status }}</p><p v-if="loading">Loading stories…</p>
 <template v-if="!active">
  <p v-if="!loading && !episodes.length">No published stories for this course yet.</p>
  <button type="button" class="secondary-action" @click="refresh">Refresh stories</button>
  <article v-for="s in episodes" :key="s.id" class="story-card"><h3>{{ s.title }}</h3><aside v-if="s.publicationNotice" class="story-notice"><strong>{{ s.publicationNotice.label }}</strong><p>{{ s.publicationNotice.details }}</p></aside><p>{{ s.summary }}</p><p>Episode {{ s.episode }} · Text · About 2–4 minutes</p>
   <button type="button" class="primary-action" @click="open(s)">Read or resume</button>
   <button v-if="!preview" type="button" class="secondary-action" :disabled="busy" @click="manage(s)">{{ downloads.some(d => d.id === s.id && d.contentHash === s.contentHash) ? 'Download again' : 'Download story' }}</button>
   <button v-if="!preview && downloads.some(d => d.id === s.id)" type="button" class="secondary-action" :disabled="busy" @click="manage(s, true)">Remove download</button>
  </article>
 </template>
 <dialog v-else ref="dialog" class="story-frame" :aria-busy="busy" aria-labelledby="story-stage-heading" @cancel.prevent="close">
  <header><p v-if="error" role="alert">{{ error }}</p><p v-if="status" role="status">{{ status }}</p><p v-if="preview">Private draft · unreviewed · text only</p><h3 id="story-stage-heading" ref="heading" tabindex="-1">{{ finished ? 'Story complete' : scene?.title ?? check?.prompt }}</h3><p>{{ active.title }} · {{ finished ? 'Complete' : `${progress.position + 1} / ${active.scenes.length + active.checks.length}` }}</p><button type="button" class="secondary-action" @click="close">Close story</button></header>
  <LessonScroll :key="progress.position">
   <aside v-if="active.publicationNotice" class="story-notice"><strong>{{ active.publicationNotice.label }}</strong><p>{{ active.publicationNotice.details }}</p></aside>
   <template v-if="scene"><p>{{ scene.situation }}</p><article v-for="(line, i) in scene.lines" :key="i" class="story-line"><CharacterPortrait :character-id="line.speakerId" /><strong>{{ characterName(line.speakerId) }}</strong><p v-bind="textAttributes(courseId)" class="story-arabic">{{ line.text.arabic }}</p><p dir="ltr"><ReadingHelp :text="line.text.arabizi" :course="courseId" /></p><p v-if="help">{{ line.text.meaning }}</p></article></template>
   <template v-else-if="check"><p>{{ check.kind === 'response' ? 'Choose a response · assisted written practice' : 'Understand the scene' }}</p><fieldset><legend>{{ check.prompt }}</legend><label v-for="choice in check.choices" :key="choice.id" class="story-choice"><input v-model="answer" type="radio" :name="check.id" :value="choice.id" @change="feedback = ''" /><span><bdi dir="auto" :lang="check.kind === 'response' ? 'ar' : 'en'" :style="check.kind === 'response' ? textAttributes(courseId).style : {}">{{ choice.text }}</bdi><small v-if="choice.help" dir="ltr">{{ choice.help }}</small><small v-if="help && choice.meaning">{{ choice.meaning }}</small></span></label></fieldset><p v-if="help">{{ check.explanation }}</p><p v-if="feedback" role="status">{{ feedback }}</p></template>
   <template v-else><p>You read the scene and practiced understanding and responding with choices.</p><p>This is assisted written practice, not a speaking or proficiency assessment. It adds no core lesson completions, daily minutes or XP.</p><button type="button" class="secondary-action" @click="restart">Read again</button></template>
   <details><summary>Sources and version</summary><p>Episode v{{ active.version }} · {{ active.contentHash }}</p><ul><li v-for="source in active.sources" :key="source.lessonId">{{ source.lessonId }} · {{ source.version }}</li></ul><p>Urban Palestinian Levantine · text only. History stays on this device, separately for each guest/account and exact content version.</p></details>
  </LessonScroll>
  <footer v-if="!finished"><button type="button" class="secondary-action" :aria-expanded="help" :disabled="busy" @click="assistance">{{ help ? 'Hide help' : 'Show help' }}</button><button v-if="check && (!feedback || answer !== check.acceptedId)" type="button" class="primary-action" :disabled="busy || !answer" @click="submit">Check response</button><button v-else type="button" class="primary-action" :disabled="busy" @click="advance">Continue</button></footer>
 </dialog>
</section>
</template>
<style scoped>
.story-notice { border:2px solid #966c19; padding:.75rem; margin:.75rem 0; border-radius:10px; } .story-card { padding:1rem; border:1px solid #7f9689; border-radius:16px; margin:1rem 0; } button { min-height:48px; margin:.25rem; } .story-frame { width:min(700px,calc(100% - 1rem)); max-width:none; padding:0; margin:auto; height:min(760px,calc(100dvh - 1rem)); max-height:calc(100dvh - 1rem); min-height:0; display:flex; flex-direction:column; border:2px solid #296248; border-radius:16px; overflow:hidden; background:white; } .story-frame::backdrop { background:rgb(15 35 26 / .65); } header,footer { padding:.75rem; flex:none; } header h3 { margin:0; } .story-frame :deep(.lesson-scroll-region) { flex:1; min-height:0; } .story-frame :deep(.lesson-content) { height:100%; } .story-line { margin:1rem 0; } .story-line :deep(.character-portrait) { --portrait-size:48px; } .story-arabic { font-size:1.8rem; line-height:1.8; } .story-choice small { display:block; line-height:1.6; } .story-choice { display:flex; align-items:center; gap:.75rem; padding:.8rem; min-height:48px; } fieldset { border:1px solid #7f9689; } details { margin:1rem 0; overflow-wrap:anywhere; } :focus-visible { outline:3px solid #ad2b32; outline-offset:3px; }
</style>
