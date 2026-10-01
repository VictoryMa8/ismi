<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { LessonStep } from './types'
import { RotateCcw, Undo2 } from '@lucide/vue'
const props = defineProps<{ step: LessonStep; disabled: boolean }>()
const emit = defineEmits<{ select: [id: string | null, complete: boolean] }>()
// The bank contains only authored responses. This is a bounded reconstruction,
// not a free-language evaluator. Preserve punctuation in matched answer records.
const words = (text: string) => text.trim().split(/\s+/)
const target = computed(() => props.step.answers.find(a => a.id.toLowerCase() === props.step.evaluation.correctAnswerId.toLowerCase())!)
const bank = computed(() => {
  const tokens = words(target.value.arabic).map((arabic, index) => ({
    id: `target-${index}`, arabic, arabizi: words(target.value.arabizi).length === words(target.value.arabic).length ? words(target.value.arabizi)[index] ?? '' : '',
  }))
  // Vary display order deterministically; preserve duplicate word instances.
  return tokens.map((token, i) => ({ token, rank: (i * 7 + 3) % (tokens.length + 1) }))
    .sort((a, b) => a.rank - b.rank || b.token.id.localeCompare(a.token.id)).map(item => item.token)
})
const picked = ref<string[]>([])
const selected = computed(() => picked.value.map(id => bank.value.find(t => t.id === id)!))
const full = computed(() => picked.value.length === bank.value.length)
const heading = ref<HTMLElement | null>(null)
function notify() {
  const assembled = selected.value.map(t => t.arabic).join(' ')
  // Unvowelled Arabic can be identical for differently pronounced address forms.
  // These tiles carry the target's transliteration, so match that authored record.
  emit('select', full.value && words(target.value.arabic).join(' ') === assembled ? target.value.id : null, full.value)
}
function add(id: string) { if (props.disabled) return; picked.value.push(id); notify() }
async function remove(id: string) {
  if (props.disabled) return
  picked.value = picked.value.filter(item => item !== id); notify()
  await nextTick(); heading.value?.focus()
}
function undo() { picked.value.pop(); notify() }
function reset() { picked.value = []; notify() }
</script>

<template>
  <section class="phrase-builder" aria-label="Build the response">
    <h4 ref="heading" tabindex="-1">Put the pieces in speaking order</h4>
    <p class="coach-caption">Use these pieces to reconstruct the response. Arabic begins on the right. Tap a placed piece to remove it.</p>
    <TransitionGroup name="phrase-piece" tag="div" class="built-phrase" dir="rtl" aria-label="Your assembled response">
      <span v-if="!picked.length" key="placeholder" class="builder-placeholder">Your phrase goes here</span>
      <button v-for="token in selected" :key="token.id" type="button" class="word-tile placed" :disabled="disabled" :aria-label="`Remove ${token.arabizi || token.arabic}`" @click="remove(token.id)">
        <span lang="ar">{{ token.arabic }}</span><small dir="ltr">{{ token.arabizi }}</small>
      </button>
    </TransitionGroup>
    <p class="sr-only" role="status">{{ selected.map(t => t.arabizi || t.arabic).join(' ') || 'No pieces placed' }}. {{ picked.length }} of {{ bank.length }} pieces placed.</p>
    <div class="word-bank" dir="rtl" aria-label="Available phrase pieces">
      <button v-for="token in bank" :key="token.id" type="button" class="word-tile" :disabled="disabled || picked.includes(token.id)" :aria-label="`Add ${token.arabizi || token.arabic}`" @click="add(token.id)">
        <span lang="ar">{{ token.arabic }}</span><small dir="ltr">{{ token.arabizi }}</small>
      </button>
    </div>
    <div class="builder-tools"><button type="button" class="text-button" :disabled="disabled || !picked.length" @click="undo"><Undo2 :size="16" aria-hidden="true" /> Undo</button><button type="button" class="text-button" :disabled="disabled || !picked.length" @click="reset"><RotateCcw :size="16" aria-hidden="true" /> Clear</button></div>
    <p v-if="full && !disabled" class="coach-caption">All pieces placed. Check your response when you’re ready.</p>
  </section>
</template>
