<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FilePlus2,
  History,
  Plus,
  Rocket,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
} from '@lucide/vue'
import {
  approveCurriculumVersion,
  createCurriculumDraft,
  getCurriculumVersion,
  getCurriculumVersions,
  publishCurriculumVersion,
  rollbackCurriculumVersion,
  updateCurriculumDraft,
  validateCurriculumVersion,
} from './api'
import type {
  CurriculumSource,
  CurriculumValidationResult,
  CurriculumVersionDetail,
  CurriculumVersionSummary,
  LessonResponse,
} from './types'

defineEmits<{ close: [] }>()

const versions = ref<CurriculumVersionSummary[]>([])
const selected = ref<CurriculumVersionDetail | null>(null)
const lessonJson = ref('')
const sources = ref<CurriculumSource[]>([])
const busy = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)
const notice = ref<string | null>(null)
const validation = ref<CurriculumValidationResult | null>(null)

const canEdit = computed(() => selected.value?.status === 'draft' || selected.value?.status === 'new')
const selectedStatus = computed(() => selected.value?.status ?? 'new')

onMounted(loadVersions)

async function loadVersions(preferredId?: number) {
  loading.value = true
  error.value = null
  try {
    versions.value = await getCurriculumVersions()
    const id = preferredId ?? selected.value?.id ?? versions.value[0]?.id
    if (id) await selectVersion(id)
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    loading.value = false
  }
}

async function selectVersion(versionId: number) {
  busy.value = true
  error.value = null
  notice.value = null
  validation.value = null
  try {
    setSelected(await getCurriculumVersion(versionId))
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    busy.value = false
  }
}

function setSelected(detail: CurriculumVersionDetail) {
  selected.value = detail
  lessonJson.value = JSON.stringify(detail.lesson, null, 2)
  sources.value = detail.sources.map(source => ({ ...source }))
}

function startNewLesson() {
  const lesson: LessonResponse = {
    id: 'levantine-',
    trackId: 'levantine',
    title: 'New Levantine lesson',
    scenario: 'Describe the real-life scenario.',
    estimatedMinutes: 6,
    version: 'draft',
    steps: [
      {
        id: 'respond',
        instruction: 'Choose the response that fits the conversation.',
        prompt: { arabic: '', arabizi: '', meaning: '', audioUrl: null },
        answers: [
          { id: 'a', arabic: '', arabizi: '', meaning: '' },
          { id: 'b', arabic: '', arabizi: '', meaning: '' },
        ],
        evaluation: {
          correctAnswerId: 'a',
          correctTitle: 'That fits.',
          correctExplanation: '',
          incorrectTitle: 'Try the context again.',
          incorrectExplanation: '',
          retryHint: '',
        },
      },
    ],
  }
  selected.value = {
    id: 0,
    versionNumber: 0,
    status: 'new' as CurriculumVersionDetail['status'],
    lesson,
    sources: [],
    audit: [],
    createdAtUtc: '',
    createdBy: '',
    approvedAtUtc: null,
    approvedBy: null,
    publishedAtUtc: null,
    publishedBy: null,
  }
  lessonJson.value = JSON.stringify(lesson, null, 2)
  sources.value = [emptySource()]
  validation.value = null
  error.value = null
  notice.value = 'Complete the lesson JSON and provenance, then save the new draft.'
}

async function cloneDraft() {
  if (!selected.value) return
  busy.value = true
  clearMessages()
  try {
    const detail = await createCurriculumDraft(selected.value.lesson, selected.value.sources)
    await loadVersions(detail.id)
    notice.value = `Draft version ${detail.versionNumber} created.`
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    busy.value = false
  }
}

async function saveDraft() {
  if (!selected.value) return
  clearMessages()
  let lesson: LessonResponse
  try {
    lesson = JSON.parse(lessonJson.value) as LessonResponse
  } catch {
    error.value = 'Lesson JSON is not valid. Check commas, quotes, and brackets.'
    return
  }

  busy.value = true
  try {
    const detail = selected.value.id === 0
      ? await createCurriculumDraft(lesson, sources.value)
      : await updateCurriculumDraft(selected.value.id, lesson, sources.value)
    await loadVersions(detail.id)
    notice.value = `Draft version ${detail.versionNumber} saved.`
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    busy.value = false
  }
}

async function runValidation() {
  if (!selected.value?.id) return
  busy.value = true
  clearMessages()
  try {
    validation.value = await validateCurriculumVersion(selected.value.id)
    notice.value = validation.value.isValid ? 'Deterministic validation passed.' : null
    await refreshSelected()
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    busy.value = false
  }
}

async function approve() {
  if (!selected.value) return
  busy.value = true
  clearMessages()
  try {
    const detail = await approveCurriculumVersion(selected.value.id)
    await loadVersions(detail.id)
    notice.value = 'Version approved. It is still hidden from learners until publication.'
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    busy.value = false
  }
}

async function publish() {
  if (!selected.value) return
  busy.value = true
  clearMessages()
  try {
    const detail = await publishCurriculumVersion(selected.value.id)
    await loadVersions(detail.id)
    notice.value = 'Published. Learners now receive this version from the API.'
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    busy.value = false
  }
}

async function rollback() {
  if (!selected.value) return
  const confirmed = window.confirm(
    `Restore version ${selected.value.versionNumber} as the learner-facing version? The current version will remain in history.`,
  )
  if (!confirmed) return

  busy.value = true
  clearMessages()
  try {
    const detail = await rollbackCurriculumVersion(selected.value.lesson.id, selected.value.id)
    await loadVersions(detail.id)
    notice.value = `Version ${detail.versionNumber} restored.`
  } catch (caught) {
    error.value = messageFor(caught)
  } finally {
    busy.value = false
  }
}

async function refreshSelected() {
  if (!selected.value?.id) return
  setSelected(await getCurriculumVersion(selected.value.id))
}

function addSource() {
  sources.value.push(emptySource())
}

function removeSource(index: number) {
  sources.value.splice(index, 1)
}

function emptySource(): CurriculumSource {
  return { sourceType: 'review-record', title: '', locator: '', rights: '', notes: '' }
}

function clearMessages() {
  error.value = null
  notice.value = null
  validation.value = null
}

function messageFor(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'The curriculum request could not be completed.'
}

function formatDate(value: string | null): string {
  if (!value) return 'Not yet'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}
</script>

<template>
  <div class="console-shell">
    <header class="console-header">
      <div>
        <span class="section-kicker">Internal · publication control</span>
        <h1>Curriculum console</h1>
        <p>Draft, validate, approve, and publish source-linked Levantine lessons.</p>
      </div>
      <button class="secondary-action" type="button" @click="$emit('close')">
        <ArrowLeft :size="18" aria-hidden="true" /> Back to learner app
      </button>
    </header>

    <div class="console-safety-note">
      <ShieldCheck :size="22" aria-hidden="true" />
      <p><strong>Human publish gate is active.</strong> Drafts and approved versions remain invisible to learners. Quranic and MSA publishing are blocked in this bounded slice.</p>
    </div>

    <p v-if="error" class="console-message error" role="alert">{{ error }}</p>
    <p v-if="notice" class="console-message success" role="status">{{ notice }}</p>

    <div class="console-layout">
      <aside class="version-panel" aria-label="Curriculum versions">
        <div class="version-panel-heading">
          <div>
            <span class="section-kicker">Version history</span>
            <h2>Lessons</h2>
          </div>
          <button class="icon-action" type="button" aria-label="Create a new lesson" title="Create a new lesson" @click="startNewLesson">
            <Plus :size="20" aria-hidden="true" />
          </button>
        </div>

        <div v-if="loading" class="console-empty" role="status">Loading versions…</div>
        <div v-else class="version-list">
          <button
            v-for="version in versions"
            :key="version.id"
            type="button"
            class="version-item"
            :class="{ selected: selected?.id === version.id }"
            @click="selectVersion(version.id)"
          >
            <span class="version-item-top">
              <strong>{{ version.title }}</strong>
              <span class="status-badge" :class="version.status">{{ version.status }}</span>
            </span>
            <span>{{ version.lessonId }} · v{{ version.versionNumber }}</span>
          </button>
        </div>

        <button v-if="selected?.id" class="secondary-action clone-action" type="button" :disabled="busy" @click="cloneDraft">
          <FilePlus2 :size="17" aria-hidden="true" /> New draft from selected
        </button>
      </aside>

      <main class="editor-panel">
        <div v-if="!selected" class="console-empty">Select a version or create a lesson.</div>
        <template v-else>
          <div class="editor-heading">
            <div>
              <span class="status-badge" :class="selectedStatus">{{ selectedStatus }}</span>
              <h2>{{ selected.lesson.title }}</h2>
              <p v-if="selected.id">Version {{ selected.versionNumber }} · created by {{ selected.createdBy }} on {{ formatDate(selected.createdAtUtc) }}</p>
              <p v-else>New unpublished lesson</p>
            </div>
            <div class="workflow-actions">
              <button v-if="canEdit" class="secondary-action" type="button" :disabled="busy" @click="saveDraft">
                <Save :size="17" aria-hidden="true" /> Save draft
              </button>
              <button v-if="selected.status === 'draft'" class="secondary-action" type="button" :disabled="busy" @click="runValidation">
                <ClipboardCheck :size="17" aria-hidden="true" /> Validate
              </button>
              <button v-if="selected.status === 'draft'" class="primary-action" type="button" :disabled="busy" @click="approve">
                <CheckCircle2 :size="17" aria-hidden="true" /> Approve
              </button>
              <button v-if="selected.status === 'approved'" class="primary-action" type="button" :disabled="busy" @click="publish">
                <Rocket :size="17" aria-hidden="true" /> Publish
              </button>
              <button v-if="selected.status === 'superseded'" class="secondary-action" type="button" :disabled="busy" @click="rollback">
                <RotateCcw :size="17" aria-hidden="true" /> Restore this version
              </button>
            </div>
          </div>

          <div v-if="validation" class="validation-card" :class="{ valid: validation.isValid }" role="status">
            <strong>{{ validation.isValid ? 'Ready for approval' : `${validation.errors.length} validation issue(s)` }}</strong>
            <ul v-if="validation.errors.length">
              <li v-for="item in validation.errors" :key="item">{{ item }}</li>
            </ul>
          </div>

          <section class="editor-section" aria-labelledby="lesson-json-heading">
            <div class="editor-section-heading">
              <div>
                <span class="section-kicker">Structured lesson</span>
                <h3 id="lesson-json-heading">Lesson JSON</h3>
              </div>
              <span>{{ canEdit ? 'Editable draft' : 'Immutable snapshot' }}</span>
            </div>
            <textarea v-model="lessonJson" class="json-editor" :readonly="!canEdit" spellcheck="false" aria-label="Structured lesson JSON"></textarea>
          </section>

          <section class="editor-section" aria-labelledby="provenance-heading">
            <div class="editor-section-heading">
              <div>
                <span class="section-kicker">Required for approval</span>
                <h3 id="provenance-heading">Provenance</h3>
              </div>
              <button v-if="canEdit" class="text-button" type="button" @click="addSource"><Plus :size="16" aria-hidden="true" /> Add source</button>
            </div>

            <div v-if="sources.length === 0" class="console-empty">No source records attached.</div>
            <fieldset v-for="(source, index) in sources" :key="index" class="source-card" :disabled="!canEdit">
              <legend>Source {{ index + 1 }}</legend>
              <label>Type<input v-model="source.sourceType" type="text" /></label>
              <label>Title<input v-model="source.title" type="text" /></label>
              <label class="wide">URL or stable locator<input v-model="source.locator" type="text" /></label>
              <label class="wide">Rights / permission<input v-model="source.rights" type="text" /></label>
              <label class="wide">Notes<textarea v-model="source.notes" rows="2"></textarea></label>
              <button v-if="canEdit" class="remove-source" type="button" :aria-label="`Remove source ${index + 1}`" @click="removeSource(index)">
                <Trash2 :size="16" aria-hidden="true" /> Remove
              </button>
            </fieldset>
          </section>

          <section v-if="selected.id" class="editor-section" aria-labelledby="audit-heading">
            <div class="editor-section-heading">
              <div>
                <span class="section-kicker">Immutable history</span>
                <h3 id="audit-heading"><History :size="18" aria-hidden="true" /> Audit trail</h3>
              </div>
            </div>
            <ol class="audit-list">
              <li v-for="entry in selected.audit" :key="entry.id">
                <span class="audit-mark" aria-hidden="true"></span>
                <div><strong>{{ entry.action }}</strong><p>{{ entry.details }}</p><span>{{ entry.actor }} · {{ formatDate(entry.occurredAtUtc) }}</span></div>
              </li>
            </ol>
          </section>
        </template>
      </main>
    </div>
  </div>
</template>
