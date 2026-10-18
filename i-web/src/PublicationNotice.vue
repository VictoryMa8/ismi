<script setup lang="ts">
import type { LessonPublicationNotice } from './types'
defineProps<{ notice?: LessonPublicationNotice | null; compact?: boolean }>()
</script>
<template>
  <aside v-if="notice" class="publication-notice" :class="{ compact }" aria-label="Content status">
    <strong>{{ notice.label }}</strong>
    <p v-if="!compact">{{ notice.details.replace(/^AI-assisted draft\.\s*/, '') }}</p>
  </aside>
</template>
<style scoped>
.publication-notice { padding: .75rem 1rem; margin: .5rem 0 1rem; border: 1px solid #174b91; border-radius: .65rem; color: #182a23; background: white; overflow-wrap: anywhere; }
.publication-notice p { margin: .4rem 0 0; }
.publication-notice.compact { flex: 0 0 auto; margin: .25rem 1rem; padding: .4rem .6rem; font-size: .85rem; }
@media (forced-colors: active) { .publication-notice { border-color: CanvasText; } }
</style>
