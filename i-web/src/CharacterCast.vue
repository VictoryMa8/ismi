<script setup lang="ts">
import CharacterPortrait from './CharacterPortrait.vue';
import { characterName } from './characters';
import type { LessonCast } from './types';
defineProps<{ cast?: LessonCast | null; compact?: boolean }>();
</script>
<template>
  <div
    v-if="cast?.characterIds?.length"
    class="character-cast"
    :class="{ compact }"
    :aria-hidden="compact ? true : undefined"
  >
    <span v-for="id in cast.characterIds" :key="id">
      <CharacterPortrait
        :character-id="id"
        :registry-version="cast.registryVersion"
      />
      <strong v-if="!compact">{{ characterName(id) }}</strong>
    </span>
  </div>
</template>
