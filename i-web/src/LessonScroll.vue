<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowDown } from '@lucide/vue';

const scroller = ref<HTMLElement | null>(null);
const inner = ref<HTMLElement | null>(null);
const moreBelow = ref(false);
let observer: ResizeObserver | null = null;
let changes: MutationObserver | null = null;
let frame = 0;
function measure() {
  const area = scroller.value;
  moreBelow.value = Boolean(
    area && area.scrollHeight - area.clientHeight - area.scrollTop > 8,
  );
}
function scheduleMeasure() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    measure();
  });
}
function scrollMore() {
  const area = scroller.value;
  if (!area) return;
  area.focus({ preventScroll: true });
  area.scrollBy({
    top: Math.max(100, area.clientHeight * 0.75),
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
  });
}
onMounted(async () => {
  await nextTick();
  observer = new ResizeObserver(scheduleMeasure);
  changes = new MutationObserver(scheduleMeasure);
  if (scroller.value) observer.observe(scroller.value);
  if (inner.value) {
    observer.observe(inner.value);
    changes.observe(inner.value, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
  measure();
});
onBeforeUnmount(() => {
  observer?.disconnect();
  changes?.disconnect();
  if (frame) cancelAnimationFrame(frame);
});
</script>

<template>
  <div class="lesson-scroll-region">
    <div
      ref="scroller"
      class="lesson-content"
      role="region"
      aria-label="Lesson content"
      tabindex="0"
      @scroll="measure"
    >
      <div ref="inner" class="lesson-scroll-inner"><slot /></div>
    </div>
    <div v-if="moreBelow" class="lesson-scroll-cue">
      <button type="button" class="scroll-more-button" @click="scrollMore">
        Scroll for more <ArrowDown :size="16" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
