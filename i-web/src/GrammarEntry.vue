<script setup lang="ts">
import ReadingHelp from './ReadingHelp.vue'
import { computed } from 'vue'
import type { LessonResponse } from './types'
import { textAttributes } from './courses'
import ReferenceSources from './ReferenceSources.vue'
const props = defineProps<{ lesson: LessonResponse; referenceId: string; linkContexts?: boolean }>()
defineEmits<{ 'open-lesson': [id: string, cardIndex: number] }>()
const entry = computed(() => props.lesson.languageSupport?.references.find(r => r.id === props.referenceId))
</script>
<template>
  <article v-if="entry" class="grammar-entry">
    <h4>{{ entry.title }}</h4><p>{{ entry.explanation }}</p>
    <ul aria-label="Teaching examples">
      <li v-for="i in entry.exampleCardIndexes" :key="i">
        <template v-if="lesson.introduction?.teachingCards?.[i]">
          <p class="reference-target" v-bind="textAttributes(lesson.trackId)">{{ lesson.introduction.teachingCards[i]!.phrase.arabic }}</p>
          <p dir="ltr"><ReadingHelp :text="lesson.introduction.teachingCards[i]!.phrase.arabizi" :course="lesson.trackId" /></p>
          <p>{{ lesson.introduction.teachingCards[i]!.phrase.meaning }}</p>
          <button v-if="linkContexts" type="button" @click="$emit('open-lesson', lesson.id, i)">Open lesson: {{ lesson.title }} · Phrase {{ i + 1 }}</button>
        </template>
      </li>
    </ul>
    <small>{{ lesson.version }} · {{ lesson.languageSupport?.reviewDisposition === 'accepted' ? `Accepted by ${lesson.languageSupport.reviewer} · no native-expert review claimed` : 'Unreviewed draft · human acceptance pending' }}</small>
    <ReferenceSources :locators="entry.sourceLocators" />
  </article>
  <p v-else role="status">Reference unavailable in this lesson version. Reconnect to refresh the lesson.</p>
</template>
