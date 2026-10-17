<script setup lang="ts">
import { computed } from 'vue'
import { courses } from './courses'
import type { CourseLessonSummary } from './types'
const props = defineProps<{ modelValue: string; lessons: CourseLessonSummary[]; disabled?: boolean; lastCourses?: Record<string, string> }>()
const languageChoices = computed(() => [...new Set(courses.map(c => c.languageId))].map(language => {
  const candidates = courses.filter(c => c.languageId === language)
  const usable = candidates.filter(c => props.lessons.some(l => (l.trackId ?? 'levantine') === c.id))
  return usable.find(c => c.id === props.lastCourses?.[language]) ?? usable[0] ?? candidates[0]!
}))
const otherCourses = computed(() => courses.filter(c => !languageChoices.value.some(choice => choice.id === c.id)))
const emit = defineEmits<{ 'update:modelValue': [id: string] }>()
const status = (id: string) => props.lessons.some(l => (l.trackId ?? 'levantine') === id && l.publicationNotice)
  ? ' · Unreviewed preview' : props.lessons.some(l => (l.trackId ?? 'levantine') === id) ? '' : ' · Planned'
</script>
<template>
  <div class="course-switcher">
    <label for="viewed-course">Language / course <span>Switch</span></label>
    <select id="viewed-course" :value="modelValue" :disabled="disabled" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <optgroup label="Languages">
        <option v-for="course in languageChoices" :key="course.id" :value="course.id">{{ course.languageName === course.name ? course.name : `${course.languageName} · ${course.name}` }}{{ status(course.id) }}</option>
      </optgroup>
      <optgroup v-if="otherCourses.length" label="Other Arabic courses">
        <option v-for="course in otherCourses" :key="course.id" :value="course.id">{{ course.name }}{{ lessons.some(l => (l.trackId ?? 'levantine') === course.id) ? '' : ' · Planned' }}</option>
      </optgroup>
    </select>
  </div>
</template>
<style scoped>
.course-switcher { margin: 0 0 .5rem; max-width: 32rem; }
label { display:flex; justify-content:space-between; gap:1rem; font-size:.85rem; font-weight:700; margin-bottom:.35rem; }
label span { color:#174b91; }
select { width:100%; min-height:48px; padding:.65rem .8rem; color:#182a23; background:white; border:2px solid #174b91; border-radius:.7rem; font:inherit; text-overflow:ellipsis; }
@media (min-width: 901px) {
  .course-switcher { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 1rem; max-width: none; }
  label { margin-bottom: 0; gap: .5rem; }
}
</style>
