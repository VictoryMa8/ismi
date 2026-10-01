import { ref } from 'vue'

const preferenceKey = 'ismi-interface-sounds'
function savedPreference() {
  try { return localStorage.getItem(preferenceKey) !== 'off' } catch { return true }
}
export const interfaceSoundsEnabled = ref(savedPreference())
export type UiSound = 'tap' | 'advance' | 'reveal' | 'correct' | 'retry' | 'complete'
let context: AudioContext | null = null
let output: GainNode | null = null
let lastTap = -Infinity
let otherAudioPlaying: () => boolean = () => false

// Original, local chimes. No downloads, analytics, speech service or audio assets.
// A soft fundamental and two quiet harmonics give a rounded plucked tone.
const melodies: Record<UiSound, Array<[number, number, number, number]>> = {
  tap: [[660, 0, .075, .35]],
  advance: [[523.25, 0, .13, .4], [659.25, .055, .16, .3]],
  reveal: [[440, 0, .18, .4], [659.25, .065, .23, .3]],
  correct: [[659.25, 0, .27, .65], [783.99, .085, .3, .55], [1046.5, .17, .38, .45]],
  retry: [[392, 0, .18, .3], [440, .09, .2, .25]],
  complete: [[523.25, 0, .34, .6], [659.25, .1, .36, .5], [783.99, .2, .4, .45], [1046.5, .32, .5, .4]],
}

function unlock() {
  if (!interfaceSoundsEnabled.value || document.visibilityState !== 'visible') return
  try {
    if (!context) {
      if (!window.AudioContext) return
      context = new AudioContext()
      output = context.createGain()
      output.gain.value = .12
      const warmth = context.createBiquadFilter()
      warmth.type = 'lowpass'; warmth.frequency.value = 2600; warmth.Q.value = .5
      output.connect(warmth); warmth.connect(context.destination)
    }
    if (context.state === 'suspended') void context.resume().catch(() => {})
  } catch { /* Sound is optional; restricted browsers must still work. */ }
}

export function playUiSound(kind: UiSound) {
  const audio = context
  if (!interfaceSoundsEnabled.value || !audio || !output || otherAudioPlaying() || document.visibilityState !== 'visible') return
  const play = () => {
    if (!interfaceSoundsEnabled.value || otherAudioPlaying() || audio.state !== 'running' || document.visibilityState !== 'visible') return
    const start = audio.currentTime + .005
    if (kind === 'tap' && start - lastTap < .05) return
    if (kind === 'tap') lastTap = start
    for (const [frequency, offset, duration, strength] of melodies[kind]) {
      for (const [multiple, level] of [[1, .7], [2, .16], [3, .035]] as const) {
        const tone = audio.createOscillator()
        const envelope = audio.createGain()
        tone.type = 'sine'; tone.frequency.value = frequency * multiple
        const at = start + offset
        envelope.gain.setValueAtTime(0, at)
        envelope.gain.linearRampToValueAtTime(strength * level, at + .008)
        envelope.gain.exponentialRampToValueAtTime(.0001, at + duration)
        tone.connect(envelope); envelope.connect(output!)
        tone.start(at); tone.stop(at + duration + .02)
        tone.onended = () => { tone.disconnect(); envelope.disconnect() }
      }
    }
  }
  if (audio.state === 'running') play()
  else if (audio.state === 'suspended') void audio.resume().then(play).catch(() => {})
}

export function setInterfaceSounds(enabled: boolean) {
  interfaceSoundsEnabled.value = enabled
  try { localStorage.setItem(preferenceKey, enabled ? 'on' : 'off') } catch { /* Session preference still works. */ }
  if (context && output) {
    output.gain.cancelScheduledValues(context.currentTime)
    output.gain.setTargetAtTime(enabled ? .12 : 0, context.currentTime, .01)
  }
  if (enabled) { unlock(); playUiSound('tap') }
}

export function installUiSounds(isOtherAudioPlaying: () => boolean = () => false) {
  otherAudioPlaying = isOtherAudioPlaying
  const click = (event: MouseEvent) => {
    if (!event.isTrusted || !(event.target instanceof Element)) return
    const control = event.target.closest<HTMLElement>('button, a[href], summary')
    if (!control || control.closest('[inert]') || control.matches(':disabled, [aria-disabled="true"]')) return
    const kind = control.dataset.uiSound
    // Keep prompts, recordings, curriculum actions and the mute toggle separate.
    if (kind === 'silent' || control.closest('.console-shell')) return
    unlock()
    if (kind === 'feedback') return // Play the result after grading, never in advance.
    playUiSound(kind && Object.hasOwn(melodies, kind) ? kind as UiSound : 'tap')
  }
  const storage = (event: StorageEvent) => {
    if (event.key !== preferenceKey) return
    interfaceSoundsEnabled.value = event.newValue !== 'off'
    if (context && output) output.gain.setTargetAtTime(interfaceSoundsEnabled.value ? .12 : 0, context.currentTime, .01)
  }
  document.addEventListener('click', click, true)
  window.addEventListener('storage', storage)
  return () => {
    document.removeEventListener('click', click, true)
    window.removeEventListener('storage', storage)
    if (context) void context.close().catch(() => {})
    context = null; output = null
    otherAudioPlaying = () => false
  }
}
