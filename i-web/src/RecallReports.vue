<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getRecallReports, resolveRecallReport } from './api'
import type { RecallReviewCase } from './api'
const reports = ref<RecallReviewCase[]>([])
const error = ref('')
const busy = ref(false)
const notes = ref<Record<string, string>>({})
async function load() {
  busy.value = true
  try { reports.value = await getRecallReports(); error.value = '' }
  catch (e) { error.value = e instanceof Error ? e.message : 'Could not load reports.' }
  finally { busy.value = false }
}
async function resolve(id: string) {
  busy.value = true
  try { await resolveRecallReport(id, notes.value[id] ?? ''); await load() }
  catch (e) { error.value = e instanceof Error ? e.message : 'Could not resolve report.' }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template>
  <details class="recall-reports">
    <summary>Recall answer reports ({{ reports.filter(r => r.status === 'open').length }} open)</summary>
    <button class="secondary-action" :disabled="busy" @click="load">Refresh reports</button>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="!busy && !reports.length">No recall reports.</p>
    <article v-for="item in reports" :key="item.id" class="checkpoint-card">
      <div>
        <h3>{{ item.report.targetId }} · {{ item.status }}</h3>
        <p>{{ item.report.lessonId }} · {{ item.report.version }} · {{ item.report.variantId }}</p>
        <p>{{ item.dialect }} · {{ item.register }} · {{ item.evaluation }}</p>
        <p>{{ item.target.variants.find(v => v.id === item.report.variantId)?.situation }}</p>
        <p :lang="item.report.inputMode === 'arabic' ? 'ar' : 'en'" :dir="item.report.inputMode === 'arabic' ? 'rtl' : 'ltr'">{{ item.report.response }}</p>
        <p>{{ item.report.explanation || 'No learner explanation supplied.' }}</p>
        <details><summary>Source records and accepted responses</summary>
          <p v-for="answer in item.target.acceptedAnswers" :key="answer.arabic"><span lang="ar" dir="rtl">{{ answer.arabic }}</span> · {{ answer.arabizi }} · {{ answer.rationale }}</p>
          <p v-for="source in item.sources" :key="source.locator">{{ source.title }} · {{ source.locator }} · {{ source.rights }}</p>
        </details>
        <template v-if="item.status === 'open'">
          <label :for="`resolution-${item.id}`">Review decision</label>
          <textarea :id="`resolution-${item.id}`" v-model="notes[item.id]" maxlength="1000" rows="3" />
          <p>Accepted-answer changes require a separate validated lesson revision and publication.</p>
          <button class="secondary-action" :disabled="busy || !notes[item.id]?.trim()" @click="resolve(item.id)">Resolve report</button>
        </template>
        <p v-else>{{ item.resolution }} · {{ item.resolvedBy }} · {{ item.resolvedAtUtc }}</p>
      </div>
    </article>
  </details>
</template>
