<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  character,
  characterRegistryVersion,
  type CharacterExpression,
} from './characters';
const props = withDefaults(
  defineProps<{
    characterId?: string | null;
    expression?: CharacterExpression;
    registryVersion?: string;
  }>(),
  {
    expression: 'neutral',
    registryVersion: characterRegistryVersion,
  },
);
const failed = ref(false);
const person = computed(() =>
  props.registryVersion === characterRegistryVersion
    ? character(props.characterId)
    : undefined,
);
const column = computed(
  () => ({ neutral: 0, attentive: 1, encouraging: 2 })[props.expression],
);
watch(
  () => [props.characterId, props.registryVersion],
  () => {
    failed.value = false;
  },
);
</script>

<template>
  <span
    class="character-portrait"
    aria-hidden="true"
    :data-character="characterId"
  >
    <img
      v-if="person && !failed"
      src="/characters/v1/cast.webp"
      alt=""
      width="1024"
      height="512"
      :style="{ left: `${-column * 100}%`, top: `${-person.row * 100}%` }"
      @error="failed = true"
    />
    <span v-else class="character-placeholder">{{
      person?.name.slice(0, 1) ?? '·'
    }}</span>
  </span>
</template>
