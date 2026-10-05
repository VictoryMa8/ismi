<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { studyTracks, type StudyPreferences, type TrackId } from './studyPlan'
const props = defineProps<{ preferences: StudyPreferences; busy: boolean; message: string; conflict: boolean; accountScoped: boolean }>()
const emit = defineEmits<{ save: [value: StudyPreferences]; resolve: [keepLocal: boolean] }>()
const draft = ref<StudyPreferences>({ ...props.preferences, selectedTrackIds: [...props.preferences.selectedTrackIds] })
watch(() => props.preferences, value => { draft.value = { ...value, selectedTrackIds: [...value.selectedTrackIds] } }, { deep: true })
const selected = computed(() => studyTracks.filter(t => draft.value.selectedTrackIds.includes(t.id)))
function toggle(id: TrackId, checked: boolean) {
  if (checked) draft.value.selectedTrackIds.push(id)
  else draft.value.selectedTrackIds = draft.value.selectedTrackIds.filter(t => t !== id)
  if (!draft.value.selectedTrackIds.includes(draft.value.primaryTrack) && draft.value.selectedTrackIds[0])
    draft.value.primaryTrack = draft.value.selectedTrackIds[0]
}
</script>

<template>
  <section class="study-settings" aria-labelledby="study-settings-title">
    <h2 id="study-settings-title">Study settings</h2>
    <form @submit.prevent="emit('save', draft)">
      <fieldset :disabled="busy">
        <legend>Daily goal</legend>
        <div class="goal-options">
          <label v-for="minutes in [5, 10, 15, 30]" :key="minutes">
            <input v-model="draft.goalMinutes" type="radio" name="daily-goal" :value="minutes" /> {{ minutes }} min
          </label>
        </div>
      </fieldset>
      <fieldset :disabled="busy">
        <legend>Tracks</legend>
        <label v-for="track in studyTracks" :key="track.id" class="study-track-option">
          <input type="checkbox" :checked="draft.selectedTrackIds.includes(track.id)" @change="toggle(track.id, ($event.target as HTMLInputElement).checked)" />
          <span>{{ track.name }}<small v-if="track.id !== 'levantine'">Lessons not yet available</small></span>
        </label>
      </fieldset>
      <div class="primary-track-select">
        <label for="primary-study-track">Primary track</label>
        <select id="primary-study-track" v-model="draft.primaryTrack" :disabled="busy || !selected.length">
          <option v-for="track in selected" :key="track.id" :value="track.id">{{ track.name }}</option>
        </select>
      </div>
      <p v-if="!selected.length" role="alert">Select at least one track.</p>
      <p class="study-settings-note">{{ accountScoped ? 'Account settings sync when connected.' : 'Guest settings stay on this device.' }}</p>
      <button class="primary-action" type="submit" :disabled="busy || !selected.length || conflict">{{ busy ? 'Saving…' : 'Save study settings' }}</button>
    </form>
    <p v-if="message" role="status">{{ message }}</p>
    <div v-if="conflict" class="settings-conflict">
      <button class="secondary-action" :disabled="busy" @click="emit('resolve', false)">Use account settings</button>
      <button class="secondary-action" :disabled="busy" @click="emit('resolve', true)">Keep this device’s settings</button>
    </div>
  </section>
</template>

<style scoped>
.study-settings { margin: 1.5rem 0; padding: 1.25rem; border: 1px solid #b5c2b8; border-radius: 1rem; color: #192b23; background: #fff; }
h2 { margin-top: 0; }
fieldset { border: 0; padding: 0; margin: 1rem 0; min-width: 0; }
legend, .primary-track-select { font-weight: 700; }
.goal-options { display: flex; flex-wrap: wrap; gap: .5rem; }
.goal-options label { display: flex; gap: .35rem; align-items: center; padding: .65rem; border: 1px solid #738d7b; border-radius: .5rem; }
input { accent-color: #12613f; width: 1.1rem; height: 1.1rem; }
.study-track-option { display: flex; align-items: center; gap: .65rem; min-height: 48px; margin-top: .4rem; }
small { display: block; font-size: .8rem; font-weight: 400; }
.primary-track-select { display: grid; gap: .5rem; }
select { max-width: 100%; min-height: 44px; padding: .5rem; background: white; color: inherit; border: 1px solid #738d7b; border-radius: .5rem; font: inherit; }
.study-settings-note { font-size: .9rem; }
.settings-conflict { display: flex; flex-wrap: wrap; gap: .5rem; }
</style>
