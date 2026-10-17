<script setup lang="ts">
import type { LessonRecording } from './types'
defineProps<{ recording: LessonRecording; trackId?: string }>()
</script>

<template>
  <span v-if="recording.origin === 'synthetic'">
    AI-generated audio · {{ recording.synthesis?.provider }} · {{ recording.synthesis?.voice || recording.speaker }}
    · {{ recording.synthesis?.locale }} voice · pronunciation not independently verified
  </span>
  <span v-else>
    Recorded · {{ recording.speaker }} · {{ recording.dialect === 'jordanian' ? 'Jordanian variant' : recording.dialect === 'palestinian-urban' ? 'Urban Palestinian' : recording.dialect }}
  </span>
</template>
