<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const emit = defineEmits<{ afterEnter: [element: Element] }>()
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
const reducedMotion = ref(motionPreference.matches)
function updateMotionPreference() { reducedMotion.value = motionPreference.matches }
motionPreference.addEventListener('change', updateMotionPreference)
function beforeLeave(element: Element) {
  if (element.contains(document.activeElement) && document.activeElement instanceof HTMLElement) document.activeElement.blur()
  element.setAttribute('inert', '')
  element.setAttribute('aria-hidden', 'true')
}
function enter(element: Element) {
  element.removeAttribute('inert')
  element.removeAttribute('aria-hidden')
  const content = element.closest<HTMLElement>('.lesson-content')
  if (content) content.scrollTop = 0
}
function afterEnter(element: Element) {
  element.removeAttribute('inert')
  element.removeAttribute('aria-hidden')
  emit('afterEnter', element)
}
onBeforeUnmount(() => {
  motionPreference.removeEventListener('change', updateMotionPreference)
})
</script>

<template>
  <div class="lesson-stage">
    <Transition name="lesson-card" :css="!reducedMotion" @before-leave="beforeLeave" @enter="enter" @after-enter="afterEnter">
      <slot />
    </Transition>
  </div>
</template>
