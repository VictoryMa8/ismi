<script setup lang="ts">
import { computed } from 'vue';
import { courseCoverage, levantineCoursePlan as plan } from './courseCoverage';
import type { CurriculumVersionSummary } from './types';
const props = defineProps<{ versions: CurriculumVersionSummary[]; loading: boolean; unavailable: boolean }>();
defineEmits<{ select: [id: number] }>();
const coverage = computed(() => courseCoverage(props.versions));
</script>

<template>
  <details class="course-coverage">
    <summary>Levantine course plan · 12 weeks</summary>
    <p>{{ plan.model }}</p>
    <p>{{ plan.cadence }}</p>
    <p><strong>Thirty-day target:</strong> {{ plan.thirtyDayOutcome }}</p>
    <p v-if="loading" role="status">Loading stored curriculum…</p>
    <p v-else-if="unavailable || coverage.metadataMissing" role="status">Coverage unavailable. Refresh after the curriculum API is available and updated.</p>
    <template v-else>
      <p class="coverage-counts" role="status">{{ coverage.authored }} of {{ coverage.total }} planned lessons stored · {{ coverage.approved }} latest versions approved or published · {{ coverage.published }} live publications</p>
      <p>Counts describe this database. Stored drafts have not passed linguistic review. Publications alone do not establish source acceptance, reviewed audio, measured timing or learner outcomes. Unstored repository drafts appear as missing.</p>
      <p v-if="coverage.unmapped">{{ coverage.unmapped }} other Levantine lesson IDs, including demonstrations, are outside this plan and excluded from its counts.</p>
    </template>
    <p><strong>Next authoring gate:</strong> {{ plan.authoringGate }}</p>
    <ol class="coverage-weeks">
      <li v-for="week in coverage.weeks" :key="week.unitId">
        <details>
          <summary>Week {{ week.week }} · {{ week.title }}<span v-if="week.checkpoint"> · Checkpoint</span></summary>
          <p>{{ week.outcome }}</p>
          <p><strong>Language focus:</strong> {{ week.languageFocus }}</p>
          <p v-if="week.recycleFromWeeks.length">Retrieve and recombine language from {{ week.recycleFromWeeks.length === 1 ? 'week' : 'weeks' }} {{ week.recycleFromWeeks.join(', ') }}.</p>
          <ul>
            <li v-for="lesson in week.lessons" :key="lesson.lessonId">
              <button v-if="!loading && !unavailable && !coverage.metadataMissing && lesson.current" type="button" class="secondary-action" @click="$emit('select', lesson.current.id)">Review {{ lesson.title }}</button>
              <span v-else>{{ lesson.title }}</span>
              <template v-if="!loading && !unavailable && !coverage.metadataMissing">
                <span> — {{ lesson.current ? `Latest: ${lesson.current.status} v${lesson.current.versionNumber}` : 'Not stored' }}</span>
                <span v-if="lesson.published"> · Live: v{{ lesson.published.versionNumber }}</span>
                <span v-if="lesson.placementMismatch"> · Placement or demonstration mismatch in history; inspect before counting.</span>
              </template>
            </li>
          </ul>
        </details>
      </li>
    </ol>
  </details>
</template>

<style scoped>
.course-coverage { margin-block: 1.25rem; padding: 1rem; border: 1px solid var(--border, #b4bcb5); border-radius: 1rem; }
summary { cursor: pointer; font-weight: 700; min-height: 44px; padding-block: .6rem; }
.coverage-counts { font-weight: 700; }
.coverage-weeks { padding-left: 1.5rem; }
li { margin-block: .65rem; overflow-wrap: anywhere; }
button { white-space: normal; text-align: start; }
</style>
