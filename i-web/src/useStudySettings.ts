import { ref } from 'vue'
import { ApiRequestError, getStudySettings, saveStudySettings } from './api'
import { getDeviceSnapshot, saveDeviceSnapshot } from './offline'
import { defaultPreferences, validPreferences, type StudyPreferences, type StudySettings } from './studyPlan'

type LocalSettings = StudySettings & { pending: boolean }
export function useStudySettings() {
  const preferences = ref(defaultPreferences())
  const busy = ref(false)
  const message = ref('')
  const conflict = ref<StudySettings | null>(null)
  let scope = 'guest'
  let authenticated = false
  let state: LocalSettings = { preferences: defaultPreferences(), revision: 0, pending: false }
  let generation = 0
  const key = () => `study-settings:${scope}`
  async function persist() { await saveDeviceSnapshot(key(), state) }
  function showState() {
    preferences.value = structuredClone(state.preferences)
    message.value = state.pending ? 'Saved on this device. Account sync pending.'
      : scope === 'guest' ? 'Saved on this device.' : 'Study settings synced.'
  }
  async function sync() {
    if (!authenticated || !navigator.onLine) return
    if (state.pending) {
      try {
        const saved = await saveStudySettings(state)
        state = { ...saved, pending: false }
        conflict.value = null
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 409) {
          conflict.value = await getStudySettings()
          message.value = 'Your study settings changed on another device. Choose which settings to keep.'
          return
        }
        throw error
      }
    } else state = { ...await getStudySettings(), pending: false }
    showState()
    await persist()
  }
  async function load(nextScope: string, isAuthenticated: boolean) {
    const token = ++generation
    busy.value = true
    scope = nextScope
    authenticated = isAuthenticated
    conflict.value = null
    message.value = ''
    state = { preferences: defaultPreferences(), revision: 0, pending: false }
    try {
      const cached = await getDeviceSnapshot<LocalSettings>(key())
      if (token !== generation) return
      if (cached && validPreferences(cached.preferences)) state = cached
      showState()
      await sync()
    } catch {
      showState()
      if (authenticated) message.value = state.pending ? 'Saved on this device. Account sync pending.' : 'Using settings on this device. Could not reach your account.'
    } finally { if (token === generation) busy.value = false }
  }
  async function save(next: StudyPreferences) {
    if (busy.value) return
    if (!validPreferences(next)) { message.value = 'Choose at least one track and a primary track from your selection.'; return }
    busy.value = true
    message.value = 'Saving study settings…'
    const previous = state
    state = { preferences: JSON.parse(JSON.stringify(next)), revision: state.revision, pending: scope !== 'guest' }
    let localSaved = false
    try {
      try { await persist(); localSaved = true } catch { /* Online account save can still succeed. */ }
      if (!localSaved && !authenticated) throw new Error('Device storage unavailable.')
      showState()
      await sync()
      if (!localSaved && state.pending) throw new Error('Settings could not be saved.')
    } catch {
      if (!localSaved && state.pending || !localSaved && !authenticated) {
        state = previous
        showState()
        message.value = 'Settings could not be saved. Check device storage or reconnect and try again.'
      } else message.value = state.pending ? 'Saved on this device. Account sync pending.' : 'Study settings saved to your account. Device storage is unavailable.'
    } finally { busy.value = false }
  }
  async function resolve(keepLocal: boolean) {
    if (!conflict.value || busy.value || !authenticated) return
    busy.value = true
    const remote = conflict.value
    state = keepLocal ? { ...state, revision: remote.revision, pending: true } : { ...remote, pending: false }
    conflict.value = null
    try { await persist(); showState(); await sync() }
    catch { message.value = 'Could not finish syncing. Reconnect and try again.' }
    finally { busy.value = false }
  }
  return { preferences, busy, message, conflict, load, save, resolve }
}
