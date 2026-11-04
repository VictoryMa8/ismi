<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { Check, ChevronDown } from '@lucide/vue'
import CultureScene from './CultureScene.vue'
import { courseFor, courses, courseGroups, textAttributes } from './courses'
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
const arabicCourses = courseGroups.filter(c => c.languageId === 'arabic')
const status = (id: string) => props.lessons.some(l => (l.trackId ?? 'levantine') === id && l.publicationNotice)
  ? 'Unreviewed preview' : hasLessons(id) ? '' : 'Planned'

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
    <button ref="toggle" type="button" class="banner-switch" :aria-label="`Switch language or course: ${current.name}`" :aria-expanded="open" :aria-controls="panelId" :disabled="disabled" data-ui-sound="reveal" @click="open = !open">
      <span class="banner-detail">{{ current.name }}</span>
      <ChevronDown :size="17" aria-hidden="true" />
    </button>
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
          <fieldset v-if="course.paths.length > 1" class="picker-paths" :data-course-group="course.id">
            <legend>{{ course.name }}</legend>
            <button v-for="path in course.paths" :key="path.id" type="button" class="picker-chip" :data-course="path.id" :aria-pressed="path.id === current.id" @click="choose(path.id)">
              {{ path.pathName }}<small v-if="status(path.id)"> · {{ status(path.id) }}</small>
            </button>
          </fieldset>
          <button v-else type="button" class="picker-chip" :data-course="course.id" :aria-pressed="course.id === current.id" @click="choose(course.id)">
            {{ course.name }}<small v-if="status(course.id)"> · {{ status(course.id) }}</small>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.course-switcher { min-width: 0; }
.banner-switch { display: flex; align-items: center; gap: 7px; min-height: 44px; max-width: 100%; padding: 6px 10px; border: 1px solid #8ab5a1; border-radius: 12px; color: #fff8e6; background: #1d634f; font: inherit; font-size: .85rem; font-weight: 750; line-height: 1.2; text-align: start; cursor: pointer; }
.banner-detail { min-width: 0; overflow-wrap: anywhere; }
.banner-switch svg { flex: none; transition: transform 200ms ease; }
.banner-switch[aria-expanded='true'] svg { transform: rotate(180deg); }
.banner-switch:hover:not(:disabled) { background: #246f59; }
.banner-switch:focus-visible { outline: 3px solid #ffd477; outline-offset: 3px; }
.banner-switch:disabled { cursor: not-allowed; opacity: .65; }
.course-picker { position: absolute; z-index: 30; top: calc(100% + 8px); inset-inline: 0; padding: 16px; border: 1px solid var(--line); border-radius: 18px; color: var(--ink); background: white; box-shadow: 0 18px 40px #1a2b2430; animation: picker-in 180ms ease-out; }
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
.picker-paths { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; margin: 0; padding: 8px; border: 1px solid var(--line); border-radius: 14px; }
.picker-paths legend { padding: 0 4px; font-size: 13px; font-weight: 700; }
.picker-chip { min-height: 44px; padding: 8px 14px; border: 2px solid var(--course-text); border-radius: 999px; color: var(--course-text); background: white; font: inherit; font-weight: 700; cursor: pointer; }
.picker-chip[aria-pressed='true'] { color: var(--course-ink); background: var(--course-surface); border-color: var(--course-surface); }
.picker-chip small { font-weight: 600; }
@keyframes picker-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@media (max-width: 520px) {
  .banner-switch { font-size: .75rem; gap: 4px; padding-inline: 7px; }
  .banner-switch svg { width: 13px; }
  .picker-languages { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .course-picker { animation: none; }
  .banner-switch svg, .picker-tile { transition: none; }
  .picker-tile:hover { transform: none; }
}
@media (forced-colors: active) {
  .banner-switch, .picker-tile, .tile-bubble { border: 2px solid CanvasText; }
  .picker-tile[aria-pressed='true'] { outline: 3px solid Highlight; }
}
</style>
