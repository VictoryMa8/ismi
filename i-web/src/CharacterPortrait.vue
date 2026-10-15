<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  character,
  characterRegistryVersion,
  characterPortrait,
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
const person = computed(() => character(props.characterId));
const source = computed(() => characterPortrait(props.characterId, props.expression, props.registryVersion));
watch(
  source,
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
    :data-expression="expression"
  >
    <img
      v-if="source && !failed"
      :src="source"
      alt=""
      width="512"
      height="512"
      @error="failed = true"
    />
    <span v-else class="character-placeholder">{{
      person?.name.slice(0, 1) ?? '·'
    }}</span>
  </span>
</template>
