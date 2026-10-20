<script setup lang="ts">
import { computed } from 'vue'
import type { LessonResponse } from './types'
import PhraseAnatomy from './PhraseAnatomy.vue'
const props = defineProps<{ lessonJson: string }>()
const lesson = computed(() => { try { return JSON.parse(props.lessonJson) as LessonResponse } catch { return null } })
// This panel reads unsaved JSON, which may be structurally incomplete while editing.
const previewable = computed(() => {
  const support = lesson.value?.languageSupport
  const cards = lesson.value?.introduction?.teachingCards
  return support && Array.isArray(cards) && cards.every(c => c?.phrase && Array.isArray(c.chunks) && c.chunks.every(Boolean))
    && Array.isArray(support.phrases) && support.phrases.every(p => p && Array.isArray(p.functions) && Array.isArray(p.sourceLocators) && p.functions.every(f => f && Array.isArray(f.referenceIds)))
    && Array.isArray(support.references) && support.references.every(r => r && Array.isArray(r.exampleCardIndexes) && Array.isArray(r.sourceLocators))
    && Array.isArray(support.usageNotes) && support.usageNotes.every(n => n && Array.isArray(n.teachingCardIndexes) && Array.isArray(n.sourceLocators))
})
</script>
<template>
  <section v-if="lesson?.languageSupport" class="editor-section" aria-label="Phrase anatomy review">
    <h3>Phrase anatomy review</h3>
    <p>{{ lesson.languageSupport.phrases?.length ?? 0 }} phrases · {{ lesson.languageSupport.references?.length ?? 0 }} grammar references · {{ lesson.languageSupport.usageNotes?.length ?? 0 }} usage notes</p>
    <p>Disposition: {{ lesson.languageSupport.reviewDisposition }} · Reviewer: {{ lesson.languageSupport.reviewer || 'Not designated' }}</p>
    <p>Review literal guides, chunk functions, examples, situational claims and exact source records. Record human acceptance in languageSupport before approval. Saving or validating does not approve content.</p>
    <template v-if="previewable">
      <PhraseAnatomy v-for="phrase in lesson.languageSupport.phrases" :key="phrase.teachingCardIndex" :lesson="lesson" :card-index="phrase.teachingCardIndex" />
    </template>
    <p v-else role="status">Language support is incomplete. Validate the draft to inspect errors.</p>
  </section>
</template>
