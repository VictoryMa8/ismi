<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { Check, ChevronDown } from '@lucide/vue'
import CultureScene from './CultureScene.vue'
import { courseFor, courses, textAttributes } from './courses'
import { playUiSound } from './uiSounds'
import type { CourseLessonSummary } from './types'
const props = defineProps<{ modelValue: string; lessons: CourseLessonSummary[]; disabled?: boolean; lastCourses?: Record<string, string> }>()
const emit = defineEmits<{ 'update:modelValue': [id: string] }>()
const panelId = useId()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const toggle = ref<HTMLButtonElement | null>(null)
const current = computed(() => courseFor(props.modelValue))
const hasLessons = (id: string) => props.lessons.some(l => (l.trackId ?? 'levantine') === id)
const languageChoices = computed(() => [...new Set(courses.map(c => c.languageId))].map(language => {
  const candidates = courses.filter(c => c.languageId === language)
  const usable = candidates.filter(c => hasLessons(c.id))
  return usable.find(c => c.id === props.lastCourses?.[language]) ?? usable[0] ?? candidates[0]!
}))
const arabicCourses = courses.filter(c => c.languageId === 'arabic')
const status = (id: string) => props.lessons.some(l => (l.trackId ?? 'levantine') === id && l.publicationNotice)
  ? 'Unreviewed preview' : hasLessons(id) ? '' : 'Planned'
const currentDetail = computed(() => [current.value.name === current.value.languageName ? '' : current.value.name, status(current.value.id)].filter(Boolean).join(' · '))

function close(restoreFocus = false) {
  open.value = false
  if (restoreFocus) void nextTick(() => toggle.value?.focus())
}
function choose(id: string) {
  if (id !== props.modelValue) { emit('update:modelValue', id); playUiSound('advance') }
  close(true)
}
function outside(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close()
}
watch(open, value => value ? document.addEventListener('pointerdown', outside) : document.removeEventListener('pointerdown', outside))
watch(() => props.disabled, value => { if (value) close() })
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
</script>
<template>
  <div ref="root" class="course-switcher" :data-course="current.id" @keydown.esc="open && close(true)" @focusout="event => event.relatedTarget && !root?.contains(event.relatedTarget as Node) && close()">
    <section class="course-banner" aria-label="Current language and course">
      <span :key="current.id" class="banner-bubble" v-bind="textAttributes(current.id)">{{ current.nativeName }}</span>
      <p class="banner-copy">
        <span class="banner-kicker">Studying</span>
        <strong>{{ current.languageName }}</strong>
        <span v-if="currentDetail" class="banner-detail">{{ currentDetail }}</span>
      </p>
      <button ref="toggle" type="button" class="banner-switch" :aria-expanded="open" :aria-controls="panelId" :disabled="disabled" data-ui-sound="reveal" @click="open = !open">
        Switch<span class="sr-only"> language or course</span><ChevronDown :size="18" aria-hidden="true" />
      </button>
    </section>
    <div v-show="open" :id="panelId" class="course-picker">
      <h2 class="picker-heading">Choose a language</h2>
      <ul class="picker-languages">
        <li v-for="course in languageChoices" :key="course.languageId">
          <button type="button" class="picker-tile" :data-course="course.id" :aria-pressed="current.languageId === course.languageId" @click="choose(course.id)">
            <span class="tile-bubble" v-bind="textAttributes(course.id)">{{ course.nativeName }}</span>
            <span class="tile-copy"><strong>{{ course.languageName }}</strong><small>{{ [course.languageName === course.name ? '' : course.name, status(course.id)].filter(Boolean).join(' · ') }}</small></span>
            <CultureScene class="tile-scene" :course="course.id" />
            <Check v-if="current.languageId === course.languageId" class="tile-check" :size="20" aria-hidden="true" />
          </button>
        </li>
      </ul>
      <h3 class="picker-heading">Arabic courses</h3>
      <ul class="picker-courses">
        <li v-for="course in arabicCourses" :key="course.id">
          <button type="button" class="picker-chip" :data-course="course.id" :aria-pressed="course.id === current.id" @click="choose(course.id)">
            {{ course.name }}<small v-if="status(course.id)"> · {{ status(course.id) }}</small>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.course-switcher { position: relative; margin: 0 0 14px; }
.course-banner { position: relative; display: flex; align-items: center; gap: 14px; min-height: 76px; padding: 12px 12px 16px 14px; overflow: hidden; border-radius: 18px; color: var(--course-ink); background: var(--course-surface); box-shadow: 0 8px 22px #1a2b2414; }
.course-banner::after { content: ''; position: absolute; inset: auto 0 0; height: 6px; background: var(--course-stripe); }
.banner-bubble { position: relative; display: grid; place-items: center; flex-shrink: 0; min-width: 64px; height: 50px; padding: 0 12px; border-radius: 16px 16px 16px 5px; color: var(--course-band-ink); background: var(--course-band); font-size: 21px; font-weight: 700; line-height: 1 !important; padding-block: 0 !important; animation: bubble-pop 420ms cubic-bezier(.3, 1.6, .5, 1); }
.banner-bubble::after { content: ''; position: absolute; left: 6px; bottom: -8px; border: 8px solid transparent; border-top-color: var(--course-band); border-left-color: var(--course-band); border-bottom: 0; }
.banner-copy { display: grid; flex: 1; min-width: 0; margin: 0; line-height: 1.2; }
.banner-kicker { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; opacity: .85; }
.banner-copy strong { font-size: 22px; }
.banner-detail { font-size: 13px; line-height: 1.25; opacity: .92; }
.banner-switch { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; min-height: 48px; padding: 0 12px 0 16px; border: 0; border-radius: 999px; color: var(--course-text); background: white; font: inherit; font-weight: 800; cursor: pointer; box-shadow: 0 3px 0 #0000002a; transition: transform 160ms ease; }
.banner-switch svg { transition: transform 200ms ease; }
.banner-switch[aria-expanded='true'] svg { transform: rotate(180deg); }
.banner-switch:hover:not(:disabled) { transform: translateY(-1px); }
.banner-switch:focus-visible { outline: 3px solid var(--course-ink); outline-offset: 3px; }
.banner-switch:disabled { cursor: not-allowed; opacity: .6; }
.course-picker { position: absolute; z-index: 30; top: calc(100% + 8px); left: 0; right: 0; padding: 16px; border: 1px solid var(--line); border-radius: 18px; background: white; box-shadow: 0 18px 40px #1a2b2430; animation: picker-in 180ms ease-out; }
.picker-heading { margin: 0 0 10px; color: var(--ink-soft); font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
h3.picker-heading { margin-top: 16px; }
.picker-languages, .picker-courses { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
.picker-languages { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
.picker-courses { display: flex; flex-wrap: wrap; gap: 8px; }
.picker-tile { position: relative; display: flex; align-items: center; gap: 12px; width: 100%; min-height: 76px; padding: 10px 72px 10px 12px; overflow: hidden; border: 3px solid transparent; border-radius: 14px; color: var(--course-ink); background: var(--course-surface); font: inherit; text-align: start; cursor: pointer; transition: transform 160ms ease; }
.picker-tile:hover { transform: translateY(-2px); }
.picker-tile[aria-pressed='true'] { border-color: var(--ink); box-shadow: 0 0 0 2px white inset; }
.picker-tile:focus-visible, .picker-chip:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
.tile-bubble { flex-shrink: 0; min-width: 52px; padding: 6px 10px; border-radius: 12px 12px 12px 4px; color: var(--course-band-ink); background: var(--course-band); font-size: 16px; font-weight: 700; text-align: center; line-height: 1.3 !important; }
.tile-copy { position: relative; z-index: 1; display: grid; min-width: 0; line-height: 1.25; }
.tile-copy strong { font-size: 17px; }
.tile-copy small { font-size: 12px; opacity: .92; }
.tile-scene { position: absolute; right: -4px; bottom: -8px; width: 84px; opacity: .6; }
.tile-check { position: absolute; z-index: 1; top: 8px; right: 8px; padding: 2px; border-radius: 50%; color: var(--course-text); background: white; }
.picker-chip { min-height: 44px; padding: 8px 14px; border: 2px solid var(--course-text); border-radius: 999px; color: var(--course-text); background: white; font: inherit; font-weight: 700; cursor: pointer; }
.picker-chip[aria-pressed='true'] { color: var(--course-ink); background: var(--course-surface); border-color: var(--course-surface); }
.picker-chip small { font-weight: 600; }
@keyframes bubble-pop { from { transform: scale(.6) rotate(-6deg); } to { transform: none; } }
@keyframes picker-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@media (max-width: 520px) {
  .course-switcher { margin-bottom: 10px; }
  .course-banner { gap: 10px; min-height: 0; padding: 8px 10px 12px 12px; }
  .banner-bubble { min-width: 56px; height: 44px; font-size: 18px; }
  .banner-kicker { font-size: 10px; }
  .banner-copy strong { font-size: 19px; }
  .banner-detail { font-size: 12.5px; }
  .banner-switch { padding: 0 10px 0 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .banner-bubble, .course-picker { animation: none; }
  .banner-switch, .banner-switch svg, .picker-tile { transition: none; }
  .picker-tile:hover, .banner-switch:hover:not(:disabled) { transform: none; }
}
@media (forced-colors: active) {
  .course-banner, .picker-tile, .banner-bubble, .tile-bubble { border: 2px solid CanvasText; }
  .picker-tile[aria-pressed='true'] { outline: 3px solid Highlight; }
}
</style>
