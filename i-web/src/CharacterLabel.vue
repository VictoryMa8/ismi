<script setup lang="ts">
import CharacterPortrait from './CharacterPortrait.vue';
import { characterName, type CharacterExpression } from './characters';
defineProps<{
  speakerId?: string | null;
  addresseeId?: string | null;
  label?: string;
  expression?: CharacterExpression;
  registryVersion?: string;
}>();
</script>
<template>
  <div class="character-label">
    <CharacterPortrait
      :character-id="speakerId"
      :expression="expression"
      :registry-version="registryVersion"
    />
    <strong
      >{{
        label || `${characterName(speakerId)} → ${characterName(addresseeId)}`
      }}<template v-if="label && addresseeId && !label.includes('→')">
        → {{ characterName(addresseeId) }}</template
      ></strong
    >
  </div>
</template>
