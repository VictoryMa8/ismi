<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps<{ text: string; target: string; occurrences: number[] }>()
const word = ref<HTMLElement>(), marks = ref<{ left: number; top: number; width: number; height: number }[]>([])
let observer: ResizeObserver | undefined, frame = 0, alive = true
function measure() {
  frame = 0; const element = word.value, node = element?.firstChild
  if (!element || !node || node.nodeType !== Node.TEXT_NODE) return
  const bounds = element.getBoundingClientRect(), scale = element.offsetWidth ? bounds.width / element.offsetWidth : 1, result: typeof marks.value = []
  for (const offset of props.occurrences) {
    if (offset < 0 || offset + props.target.length > props.text.length) continue
    const range = document.createRange(); range.setStart(node, offset); range.setEnd(node, offset + props.target.length)
    for (const rect of range.getClientRects()) result.push({ left: (rect.left - bounds.left) / scale, top: (rect.top - bounds.top) / scale, width: rect.width / scale, height: rect.height / scale })
  }
  marks.value = result
}
function schedule() { if (!frame && alive) frame = requestAnimationFrame(measure) }
watch(() => [props.text, props.target, props.occurrences], async () => { await nextTick(); schedule() }, { deep: true })
onMounted(() => { observer = new ResizeObserver(schedule); if (word.value) observer.observe(word.value); void document.fonts.ready.then(schedule); schedule() })
onBeforeUnmount(() => { alive = false; observer?.disconnect(); if (frame) cancelAnimationFrame(frame) })
</script>
<template><span ref="word" class="alphabet-marked-word">{{ text }}<span v-for="(mark, i) in marks" :key="i" class="alphabet-target-mark" aria-hidden="true" :style="{ left: `${mark.left}px`, top: `${mark.top}px`, width: `${mark.width}px`, height: `${mark.height}px` }"></span></span></template>
<style scoped>
/* Range overlays keep one untouched text node: no split Arabic joins or Khmer clusters. */
.alphabet-marked-word { position:relative; display:inline-block; max-width:100%; white-space:pre-wrap; }
.alphabet-target-mark { position:absolute; pointer-events:none; border-bottom:3px solid #936600; box-shadow:inset 0 -.22em 0 rgba(230,176,40,.22); }
@media (forced-colors:active) { .alphabet-target-mark { border-color:Highlight; box-shadow:none; } }
</style>
