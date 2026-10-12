<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { LoaderCircle, Pause, Play } from '@lucide/vue';
import words from './content/loading-words.json';

defineProps<{ compact?: boolean }>();
const frame = ref(0);
const paused = ref(false);
const reducedMotion = ref(false);
const word = computed(() => words[Math.floor(frame.value / 3) % words.length]!);
const phase = computed(() => frame.value % 3);
const faces = computed(() => [word.value.arabizi, word.value.arabic, word.value.meaning]);
let timer: ReturnType<typeof setInterval> | undefined;
let motion: MediaQueryList | undefined;
function updatePlayback() {
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
  if (paused.value || reducedMotion.value || document.hidden) return;
  timer = setInterval(() => { frame.value++; }, 1600);
}
function updateMotion() {
  reducedMotion.value = Boolean(motion?.matches);
  updatePlayback();
}
function togglePause() {
  paused.value = !paused.value;
  updatePlayback();
}
onMounted(() => {
  motion = matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updatePlayback);
  updateMotion();
});
onBeforeUnmount(() => {
  if (timer !== undefined) clearInterval(timer);
  motion?.removeEventListener('change', updateMotion);
  document.removeEventListener('visibilitychange', updatePlayback);
});
</script>

<template>
  <section class="dashboard-loading" :class="{ 'initial-loading': !compact, compact }">
    <div class="loading-header">
      <div class="loading-status" role="status" aria-live="polite">
        <LoaderCircle class="loading-spinner" :size="18" aria-hidden="true" />
        <strong>{{ compact ? 'Updating your study plan…' : 'Loading your study plan…' }}</strong>
      </div>
      <button v-if="!reducedMotion" type="button" class="word-reel-pause" data-ui-sound="silent"
        :aria-label="paused ? 'Resume word animation' : 'Pause word animation'"
        :aria-pressed="paused" @click="togglePause">
        <component :is="paused ? Play : Pause" :size="18" aria-hidden="true" />
      </button>
    </div>
    <div class="loading-word" role="group" :aria-label="`${word.arabizi}, ${word.arabic}, ${word.meaning}`">
      <!-- Decorative rolling faces stay out of the loading live region. -->
      <div v-if="reducedMotion" class="loading-word-still" aria-hidden="true">
        <span>{{ word.arabizi }}</span>
        <bdi lang="ar" dir="rtl">{{ word.arabic }}</bdi>
        <span>{{ word.meaning }}</span>
      </div>
      <div v-else class="word-reel-window" aria-hidden="true">
        <Transition name="word-roll">
          <bdi :key="frame" class="word-reel-face" :class="{ arabic: phase === 1 }"
            :lang="phase === 1 ? 'ar' : 'en'" :dir="phase === 1 ? 'rtl' : 'ltr'">{{ faces[phase] }}</bdi>
        </Transition>
      </div>
    </div>
    <div v-if="!reducedMotion" class="word-reel-steps" aria-hidden="true">
      <span v-for="step in 3" :key="step" :class="{ active: phase === step - 1 }" />
    </div>
  </section>
</template>

<style scoped>
.dashboard-loading { margin: 20px 0; padding: 20px 24px; border-radius: 20px; background: var(--teal-dark); color: white; overflow: hidden; }
.loading-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.loading-status { display: flex; align-items: center; gap: 10px; min-width: 0; font-size: .875rem; }
.loading-status strong { font-weight: 600; }
.word-reel-pause { display: grid; place-items: center; flex: 0 0 auto; width: 44px; height: 44px; border: 1px solid #ffffff70; border-radius: 50%; color: white; background: transparent; cursor: pointer; }
.word-reel-pause:focus-visible { outline: 3px solid var(--gold-bright); outline-offset: 3px; }
.loading-word { margin: 24px 0 16px; }
.word-reel-window { display: grid; place-items: center; position: relative; height: 5.5rem; overflow: hidden; }
.word-reel-face { display: flex; align-items: center; justify-content: center; text-align: center; width: 100%; height: 100%; font-size: clamp(2rem, 7vw, 3.25rem); font-weight: 700; line-height: 1.2; color: var(--gold-bright); }
.word-reel-face.arabic { font-family: "Noto Naskh Arabic", serif; font-size: clamp(2.75rem, 9vw, 4rem); color: white; }
.word-roll-enter-active, .word-roll-leave-active { transition: transform 400ms cubic-bezier(.22,1,.36,1), opacity 300ms ease; }
.word-roll-leave-active { position: absolute; inset: 0; }
.word-roll-enter-from { transform: translateY(90%); opacity: 0; }
.word-roll-leave-to { transform: translateY(-90%); opacity: 0; }
.word-reel-steps { display: flex; justify-content: center; gap: 8px; padding: 4px; }
.word-reel-steps span { width: 6px; height: 6px; border-radius: 50%; background: #ffffff70; }
.word-reel-steps span.active { background: var(--gold-bright); }
.loading-word-still { display: grid; gap: 4px; text-align: center; font-size: 1.25rem; line-height: 1.4; }
.loading-word-still bdi { font-family: "Noto Naskh Arabic", serif; font-size: 2rem; }
.compact .loading-word { margin: 8px 0; }
.compact .word-reel-window { height: 3.5rem; }
.compact .word-reel-face { font-size: 1.75rem; }
.compact .word-reel-face.arabic { font-size: 2.25rem; }
@media (prefers-reduced-motion: reduce) { .word-roll-enter-active, .word-roll-leave-active { transition: none; } }
</style>
