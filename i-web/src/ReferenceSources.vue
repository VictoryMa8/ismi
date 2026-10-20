<script setup lang="ts">
defineProps<{ locators: string[] }>()
</script>
<template>
  <details class="reference-sources"><summary>Sources</summary><ul>
    <li v-for="locator in locators" :key="locator"><a v-if="locator.startsWith('https://') || locator.startsWith('http://')" :href="locator" target="_blank" rel="noopener noreferrer"><bdi>{{ locator }}</bdi><span class="sr-only"> (opens in a new tab)</span></a><bdi v-else>{{ locator }}</bdi></li>
  </ul></details>
</template>
