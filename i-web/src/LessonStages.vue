<script setup lang="ts">
defineProps<{ stage: 'meet' | 'learn' | 'use' }>();
</script>

<template>
  <div class="journey-rail" aria-label="Lesson stages">
    <span
      :class="{ active: stage === 'meet' }"
      :aria-current="stage === 'meet' ? 'step' : undefined"
      >Meet</span
    ><span aria-hidden="true">→</span>
    <span
      :class="{ active: stage === 'learn' }"
      :aria-current="stage === 'learn' ? 'step' : undefined"
      >Learn & recall</span
    ><span aria-hidden="true">→</span>
    <span
      :class="{ active: stage === 'use' }"
      :aria-current="stage === 'use' ? 'step' : undefined"
      >Use it</span
    >
  </div>
</template>
