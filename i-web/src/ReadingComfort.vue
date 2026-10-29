<script setup lang="ts">
import { Settings2 } from '@lucide/vue'
import { nextTick, ref, useId } from 'vue'
import { courses, courseFor, textAttributes } from './courses'
import { readingDefaults, readingFor, readingNotice, readingReady, saveReading, type ReadingPreferences } from './readingComfort'
const props = defineProps<{ course: string }>()
const titleId = useId()
const panel = ref<HTMLDialogElement>()
const selected = ref(props.course)
let trigger: HTMLElement | null = null
function open(event: Event) {
  trigger = event.currentTarget as HTMLElement
  selected.value = props.course
  panel.value?.showModal()
}
async function close() { panel.value?.close(); await nextTick(); trigger?.focus({ preventScroll: true }) }
function change(field: keyof ReadingPreferences, event: Event) {
  const value = (event.target as HTMLSelectElement).value
  saveReading(selected.value, { ...readingFor(selected.value), [field]: field === 'size' ? Number(value) : value })
}
const samples: Record<string, string> = { levantine: 'العربية', msa: 'العربية', quranic: 'العربية', french: 'Français', khmer: 'ខ្មែរ' }
</script>
<template>
  <button type="button" class="text-button reading-comfort-trigger" aria-label="Reading comfort" title="Reading comfort" @click="open"><Settings2 :size="20" aria-hidden="true" /><span>Reading comfort</span></button>
  <Teleport to="body">
    <dialog ref="panel" class="reading-comfort-panel" :aria-labelledby="titleId" @cancel.prevent="close">
      <h2 :id="titleId">Reading comfort</h2>
      <p>On this device · separate choices for each course.</p>
      <label>Course<select v-model="selected"><option v-for="course in courses" :key="course.id" :value="course.id">{{ course.name }}</option></select></label>
      <label>Target text size<select :value="readingFor(selected).size" :disabled="!readingReady" @change="change('size', $event)"><option v-for="size in [100, 125, 150, 200]" :key="size" :value="size">{{ size }}%</option></select></label>
      <label>Line spacing<select :value="readingFor(selected).spacing" :disabled="!readingReady" @change="change('spacing', $event)"><option value="standard">Standard</option><option value="spacious">Spacious</option></select></label>
      <label>{{ courseFor(selected).helpLabel }}<select :value="readingFor(selected).help" :disabled="!readingReady" @change="change('help', $event)"><option value="shown">Shown</option><option value="tap">Tap to show</option></select></label>
      <div class="reading-preview" aria-label="Reading preview"><p v-bind="textAttributes(selected)">{{ samples[selected] }}</p><p>{{ readingFor(selected).help === 'tap' ? 'Authored pronunciation help opens on tap.' : 'Authored pronunciation help stays visible.' }} Assessment reveal rules still apply.</p></div>
      <p role="status">{{ readingNotice }}</p>
      <div class="reading-comfort-actions"><button type="button" class="secondary-action" :disabled="!readingReady" @click="saveReading(selected, readingDefaults())">Reset this course</button><button type="button" class="primary-action" @click="close">Done</button></div>
    </dialog>
  </Teleport>
</template>
