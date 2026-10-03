<script setup lang="ts">
import { computed, ref } from 'vue';
import { uploadRecording } from './api';
import type {
  CurriculumSource,
  LessonRecording,
  LessonResponse,
} from './types';

const props = defineProps<{ modelValue: string; editable: boolean }>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
  source: [source: CurriculumSource];
  busy: [value: boolean];
}>();
const busy = ref(false);
const message = ref('');
const lesson = computed(() => {
  try {
    const value = JSON.parse(props.modelValue) as LessonResponse;
    return Array.isArray(value?.steps) &&
      value.steps.every((step) => step?.prompt && typeof step.id === 'string')
      ? value
      : null;
  } catch {
    return null;
  }
});

function update(index: number, field: keyof LessonRecording, event: Event) {
  const current = lesson.value;
  const recording = current?.steps[index]?.prompt.recording;
  if (!recording || !current) return;
  Object.assign(recording, {
    [field]: (event.target as HTMLInputElement).value,
  });
  emit('update:modelValue', JSON.stringify(current, null, 2));
}

async function upload(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const current = lesson.value;
  const step = current?.steps[index];
  if (!file || !current || !step) return;
  message.value = '';
  if (file.size > 10 * 1024 * 1024) {
    message.value = 'Choose a WAV file no larger than 10 MB.';
    return;
  }
  busy.value = true;
  emit('busy', true);
  try {
    const { audioUrl } = await uploadRecording(file);
    step.prompt.audioUrl = audioUrl;
    step.prompt.recording = {
      transcript: step.prompt.arabic,
      speaker: '',
      dialect: 'palestinian-urban',
      sourceLocator: audioUrl,
      reviewNotes: '',
    };
    emit('update:modelValue', JSON.stringify(current, null, 2));
    emit('source', {
      sourceType: 'recording',
      title: file.name,
      locator: audioUrl,
      rights: '',
      notes:
        'Document the recording origin and permission for playback and offline distribution.',
    });
    message.value =
      'Recording attached locally. Complete its metadata and source permissions, then save the draft.';
  } catch (error) {
    message.value =
      error instanceof Error ? error.message : 'Recording upload failed.';
  } finally {
    busy.value = false;
    emit('busy', false);
    input.value = '';
  }
}

function remove(index: number) {
  const current = lesson.value;
  const step = current?.steps[index];
  if (!current || !step) return;
  step.prompt.audioUrl = null;
  step.prompt.recording = null;
  emit('update:modelValue', JSON.stringify(current, null, 2));
}
</script>

<template>
  <section class="editor-section" aria-labelledby="recordings-heading">
    <h3 id="recordings-heading">Prompt recordings</h3>
    <p>
      Upload 16-bit PCM WAV files, mono or stereo, 8–48 kHz, up to 10 MB each.
      Listen and check the transcript before approval. Use a speaker credit or
      agreed pseudonym.
    </p>
    <p v-if="message" role="status">{{ message }}</p>
    <p v-if="!lesson">Fix the lesson JSON to edit recordings.</p>
    <fieldset
      v-for="(step, index) in lesson?.steps"
      :key="index"
      class="source-card"
      :disabled="!editable || busy"
    >
      <legend>Recording · {{ step.id }}</legend>
      <label v-if="editable" class="wide"
        >Upload recording for {{ step.id }}
        <input
          type="file"
          accept=".wav,audio/wav"
          @change="upload(index, $event)"
        />
      </label>
      <template v-if="step.prompt.recording">
        <label
          >Speaker<input
            :value="step.prompt.recording.speaker"
            @input="update(index, 'speaker', $event)"
        /></label>
        <label
          >Dialect<select
            :value="step.prompt.recording.dialect"
            @change="update(index, 'dialect', $event)"
          >
            <option value="palestinian-urban">Urban Palestinian</option>
            <option value="jordanian">Jordanian variant</option>
          </select></label
        >
        <label class="wide"
          >Arabic transcript<textarea
            lang="ar"
            dir="rtl"
            :value="step.prompt.recording.transcript"
            @input="update(index, 'transcript', $event)"
          ></textarea>
        </label>
        <label class="wide"
          >Recording source locator<input
            :value="step.prompt.recording.sourceLocator"
            @input="update(index, 'sourceLocator', $event)"
        /></label>
        <label class="wide"
          >Review notes<textarea
            :value="step.prompt.recording.reviewNotes"
            @input="update(index, 'reviewNotes', $event)"
          ></textarea>
        </label>
      </template>
      <button
        v-if="editable && step.prompt.audioUrl"
        type="button"
        @click="remove(index)"
      >
        Remove recording from step
      </button>
      <p v-if="!step.prompt.audioUrl">
        No recording attached. Learners receive the labeled device-voice
        preview.
      </p>
    </fieldset>
    <div
      v-for="step in lesson?.steps.filter((step) => step.prompt.audioUrl)"
      :key="step.id"
    >
      <p>Preview · {{ step.id }}</p>
      <audio
        :key="step.prompt.audioUrl!"
        controls
        preload="none"
        :src="step.prompt.audioUrl!"
        :aria-label="`Recording preview for ${step.id}`"
      ></audio>
      <p lang="ar" dir="rtl">{{ step.prompt.recording?.transcript }}</p>
    </div>
  </section>
</template>
