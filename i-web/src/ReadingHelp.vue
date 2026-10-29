<script setup lang="ts">
import { ref, watch } from 'vue'
import { courseFor } from './courses'
import { readingFor } from './readingComfort'
const props = defineProps<{ text?: string | null; course?: string }>()
const emit = defineEmits<{ reveal: [] }>()
const revealed = ref(false)
watch(() => [props.text, props.course, readingFor(props.course).help], () => { revealed.value = false })
</script>
<template>
  <span v-if="text" class="reading-help" dir="ltr">
    <span v-if="readingFor(course).help === 'shown' || revealed">{{ text }}</span>
    <button v-else type="button" class="text-button" @click="revealed = true; emit('reveal')">Show {{ courseFor(course).helpLabel.toLowerCase() }}</button>
  </span>
</template>
