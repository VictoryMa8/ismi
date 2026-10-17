<script setup lang="ts">
import { computed } from 'vue';
import CharacterPortrait from './CharacterPortrait.vue';
import { characterName, sharedGuideCast } from './characters';
import type { LessonCast } from './types';
const props = defineProps<{ cast?: LessonCast | null; compact?: boolean }>();
const displayedCast = computed(() => props.cast ?? sharedGuideCast);
</script>
<template>
  <div
    v-if="displayedCast.characterIds?.length"
    class="character-cast"
    :class="{ compact }"
    :aria-hidden="compact ? true : undefined"
    :aria-label="!compact && !cast ? 'Learning guides' : undefined"
  >
    <span v-for="id in displayedCast.characterIds" :key="id">
      <CharacterPortrait
        :character-id="id"
        :registry-version="displayedCast.registryVersion"
      />
      <strong v-if="!compact">{{ characterName(id) }}</strong>
    </span>
  </div>
</template>
