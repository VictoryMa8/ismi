<script setup lang="ts">
import CharacterLabel from './CharacterLabel.vue';
import { characterName } from './characters';
import type { CharacterRoles } from './types';
defineProps<{
  roles?: CharacterRoles | null;
  registryVersion?: string;
  feedback?: boolean;
}>();
</script>
<template>
  <div v-if="roles" class="character-cue">
    <CharacterLabel
      v-if="roles.speakerId && !feedback"
      :speaker-id="roles.speakerId"
      :addressee-id="roles.addresseeId"
      :registry-version="registryVersion"
      expression="attentive"
    />
    <CharacterLabel
      v-if="roles.responseSpeakerId"
      :speaker-id="roles.responseSpeakerId"
      :registry-version="registryVersion"
      :expression="feedback ? 'encouraging' : 'neutral'"
      :label="`Reply as ${characterName(roles.responseSpeakerId)} to ${characterName(roles.responseAddresseeId)}`"
    />
  </div>
</template>
