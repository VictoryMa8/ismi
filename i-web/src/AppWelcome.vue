<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, BookOpen, MessageCircle, Compass } from '@lucide/vue'
import CharacterPortrait from './CharacterPortrait.vue'

const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const index = ref(0)
const cards = [
  { title: 'Start with a conversation', text: 'Meet Fattoush and Knafeh. Learn the phrases, then try your response.', icon: MessageCircle },
  { title: 'Help is always here', text: 'Reveal meanings, read explanations and retry as often as you like.', icon: BookOpen },
  { title: 'Make yourself at home', text: 'Start as a guest. Browse Courses or revisit lessons in Practice. “Back to landing page” takes you back whenever you want.', icon: Compass },
]
const card = computed(() => cards[index.value]!)
let previousOverflow = ''

async function move(amount: number) {
  index.value += amount
  await nextTick()
  heading.value?.focus({ preventScroll: true })
}
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  const controls = [...dialog.value!.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')]
  const first = controls[0], last = controls.at(-1)
  if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.value)) {
    event.preventDefault(); last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first?.focus()
  }
}
onMounted(() => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value?.showModal()
  heading.value?.focus({ preventScroll: true })
})
onBeforeUnmount(() => {
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <dialog ref="dialog" class="app-welcome" aria-labelledby="welcome-title" aria-describedby="welcome-card-title welcome-card-text" @cancel.prevent="emit('close')" @keydown="trapFocus">
    <header class="welcome-header">
      <p id="welcome-title">Before we let you loose</p>
      <button type="button" class="welcome-skip" @click="emit('close')">Skip intro</button>
    </header>
    <div class="welcome-art" :class="`welcome-art-${index}`" aria-hidden="true">
      <template v-if="index === 0">
        <CharacterPortrait character-id="fattoush" expression="attentive" />
        <span class="welcome-art-icon"><component :is="card.icon" :size="36" /></span>
        <CharacterPortrait character-id="knafeh" expression="encouraging" />
      </template>
      <component v-else :is="card.icon" :size="76" :stroke-width="1.5" />
    </div>
    <section class="welcome-card">
      <p class="welcome-count" aria-label="Welcome progress">{{ index + 1 }} of 3</p>
      <h2 id="welcome-card-title" ref="heading" tabindex="-1">{{ card.title }}</h2>
      <p id="welcome-card-text">{{ card.text }}</p>
    </section>
    <footer class="welcome-actions">
      <button v-if="index > 0" type="button" class="welcome-back" @click="move(-1)">Back</button>
      <span v-else />
      <button v-if="index < 2" type="button" class="welcome-next" @click="move(1)">Next <ArrowRight :size="18" /></button>
      <button v-else type="button" class="welcome-next" @click="emit('close')">Let’s go <ArrowRight :size="18" /></button>
    </footer>
  </dialog>
</template>

<style scoped>
.app-welcome { width: min(480px, calc(100% - 32px)); max-height: calc(100dvh - 32px); margin: auto; padding: 0; overflow: auto; overflow-wrap: anywhere; color: #26352f; background: #fffdf8; border: 0; border-radius: 22px; box-shadow: 0 24px 90px #152f3340; }
.app-welcome::backdrop { background: #15392b99; }
.welcome-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; padding: 20px 24px; }
.welcome-header p { margin: 0; font-size: .8125rem; font-weight: 700; }
.welcome-skip, .welcome-back { border: 0; background: transparent; color: #3b5348; font-weight: 600; padding: 12px 4px; min-height: 44px; }
.welcome-art { display: flex; align-items: center; justify-content: center; gap: 15px; min-height: 165px; margin: 0 24px; border-radius: 14px; background: #17684e; color: #fffdf8; }
.welcome-art-1 { background: #b73f4f; color: #fffdf8; }
.welcome-art-2 { background: #e8b442; color: #26352f; }
.welcome-art .character-portrait { --portrait-size: 88px; }
.welcome-art-icon { display: grid; place-items: center; }
.welcome-card { padding: 24px; }
.welcome-count { margin: 0 0 12px; color: #547060; font-size: .8125rem; font-weight: 700; }
.welcome-card h2 { margin: 0; font-size: 1.8rem; line-height: 1.2; letter-spacing: -.03em; }
.welcome-card > p:last-child { margin: 14px 0 0; color: #536258; line-height: 1.65; }
.welcome-actions { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 0 24px 24px; }
.welcome-next { display: inline-flex; justify-content: center; align-items: center; gap: 14px; min-height: 48px; padding: 12px 20px; border: 0; border-radius: 10px; background: #087456; color: white; font-weight: 700; }
.app-welcome button { cursor: pointer; }
.app-welcome :focus-visible { outline: 3px solid #087456; outline-offset: 4px; }
.welcome-card h2:focus { outline: none; }
@media (max-width: 370px) { .welcome-header, .welcome-card { padding: 18px; } .welcome-art { margin-inline: 18px; gap: 10px; } .welcome-art .character-portrait { --portrait-size: 72px; } .welcome-card h2 { font-size: 1.55rem; } .welcome-actions { padding: 0 18px 18px; } }
</style>
