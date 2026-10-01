<script setup lang="ts">
import { Volume2, VolumeX } from '@lucide/vue'
import { interfaceSoundsEnabled, setInterfaceSounds } from './uiSounds'
</script>

<template>
  <button type="button" class="sound-toggle" data-ui-sound="silent"
    aria-label="Interface sounds" :aria-pressed="interfaceSoundsEnabled"
    :title="interfaceSoundsEnabled ? 'Interface sounds on · click to mute' : 'Interface sounds off · click to enable'"
    @click="setInterfaceSounds(!interfaceSoundsEnabled)">
    <Volume2 v-if="interfaceSoundsEnabled" :size="20" aria-hidden="true" />
    <VolumeX v-else :size="20" aria-hidden="true" />
  </button>
</template>
