<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ stage: 'meet' | 'learn' | 'use' }>();
const steps = { meet: ['Meet', 1], learn: ['Learn & practise', 2], use: ['Use it', 3] } as const;
const current = computed(() => steps[props.stage]);
</script>

<template>
  <div class="journey-rail" role="group" aria-label="Lesson stages">
    <span class="journey-count" :aria-label="`Stage ${current[1]} of 3`">{{ current[1] }} / 3</span>
    <span class="journey-label" aria-current="step">{{ current[0] }}</span>
    <span class="journey-bars" aria-hidden="true">
      <span v-for="step in 3" :key="step" :class="{ reached: step <= current[1] }" />
    </span>
  </div>
</template>
