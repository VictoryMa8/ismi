<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { LessonResponse } from './types'
import { textAttributes } from './courses'
import GrammarEntry from './GrammarEntry.vue'
import ReferenceSources from './ReferenceSources.vue'
const props = defineProps<{ lesson: LessonResponse; cardIndex: number }>()
const anatomy = computed(() => props.lesson.languageSupport?.phrases.find(p => p.teachingCardIndex === props.cardIndex))
const card = computed(() => props.lesson.introduction?.teachingCards?.[props.cardIndex])
const notes = computed(() => props.lesson.languageSupport?.usageNotes.filter(n => n.teachingCardIndexes.includes(props.cardIndex)) ?? [])
const selected = ref('')
const referencePanel = ref<HTMLElement>()
let opener: HTMLButtonElement | null = null
watch(() => [props.lesson, props.cardIndex], () => { selected.value = ''; opener = null })
async function openReference(id: string, event: MouseEvent) {
  opener = event.currentTarget as HTMLButtonElement
  selected.value = id
  await nextTick(); referencePanel.value?.focus()
}
async function back() {
  selected.value = ''
  await nextTick(); opener?.focus()
}
</script>
<template>
  <details v-if="anatomy && card" class="phrase-anatomy">
    <summary>How this phrase works</summary>
    <p v-if="lesson.languageSupport?.reviewDisposition !== 'accepted'" role="status">Unreviewed draft · literal meanings, grammar and usage await human acceptance.</p>
    <div v-show="!selected">
      <p><strong>Natural meaning</strong> · {{ card.phrase.meaning }}</p>
      <p><strong>Literal guide</strong> · {{ anatomy.literalMeaning }}</p>
      <dl class="anatomy-functions">
        <div v-for="part in anatomy.functions" :key="part.chunkIndex">
          <template v-if="card.chunks[part.chunkIndex]">
            <dt class="reference-target" v-bind="textAttributes(lesson.trackId)">{{ card.chunks[part.chunkIndex]!.arabic }}</dt>
            <dd><span dir="ltr">{{ card.chunks[part.chunkIndex]!.arabizi }}</span> · {{ card.chunks[part.chunkIndex]!.meaning }}<br /><strong>{{ part.label }}</strong>
              <button v-for="id in part.referenceIds" :key="id" type="button" @click="openReference(id, $event)">{{ lesson.languageSupport?.references.find(r => r.id === id)?.title ?? 'Reference unavailable' }}</button>
            </dd>
          </template>
        </div>
      </dl>
      <section v-if="notes.length" aria-label="Usage notes"><h4>When to use it</h4>
        <div v-for="note in notes" :key="note.id"><p>{{ note.text }}</p><ReferenceSources :locators="note.sourceLocators" /></div>
      </section>
      <ReferenceSources :locators="anatomy.sourceLocators" />
    </div>
    <div v-if="selected" ref="referencePanel" tabindex="-1" role="region" aria-label="Grammar reference">
      <button type="button" @click="back">← Back to phrase</button>
      <GrammarEntry :lesson="lesson" :reference-id="selected" />
    </div>
  </details>
</template>
<style>
.phrase-anatomy { margin-block: 1rem; padding: .75rem; border: 1px solid #657465; border-inline-start: 4px solid #167144; border-radius: .6rem; background: #fff; color: #202820; overflow-wrap: anywhere; }
.phrase-anatomy summary, .reference-sources summary { cursor: pointer; padding-block: .75rem; min-height: 44px; box-sizing: border-box; font-weight: 700; }
.phrase-anatomy button, .grammar-library button { min-height: 44px; padding: .65rem .85rem; margin: .4rem; border: 1px solid #167144; border-radius: .4rem; background: #fff; color: #115832; font: inherit; cursor: pointer; }
.phrase-anatomy :is(button, summary):focus-visible, .grammar-library :is(button, input, summary):focus-visible { outline: 3px solid #a73b1f; outline-offset: 3px; }
.anatomy-functions { display: grid; gap: .8rem; }
.anatomy-functions > div { border-bottom: 1px solid #c9cec8; padding-bottom: .6rem; }
.anatomy-functions dd { margin-inline-start: 0; }
.reference-target { font-size: 1.6em; line-height: 1.9; }
.grammar-entry { overflow-wrap: anywhere; }
.grammar-entry p { line-height: 1.7; }
.reference-sources li { overflow-wrap: anywhere; }
</style>
