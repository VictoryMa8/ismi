<script setup lang="ts">
import { ExternalLink, Film, Music2, Play } from '@lucide/vue'
import { culturalAccess, culturalSlots, editionDate, mediaDuration, safeMediaUrl, type PublicCulturalItem } from './culture'
defineProps<{ items: PublicCulturalItem[]; offline?: boolean }>()
const icons = { 'youtube-video': Play, film: Film, song: Music2 }
function action(slot: string, purpose: string) {
  return purpose === 'free-companion' ? 'Free companion' : purpose === 'alternate' ? 'Alternative link' : slot === 'film' ? 'Full film' : slot === 'song' ? 'Listen' : 'Watch'
}
</script>
<template>
  <div class="culture-cards">
    <article v-for="item in items" :key="item.id" class="culture-card" :class="`culture-${item.slot}`">
      <header class="culture-card-heading"><span class="culture-icon" aria-hidden="true"><component :is="icons[item.slot]" :size="22" /></span><span>{{ culturalSlots[item.slot] }}</span></header>
      <h2>{{ item.title }} <span v-if="item.arabicTitle" lang="ar" dir="rtl">{{ item.arabicTitle }}</span></h2>
      <p class="culture-credit">{{ item.creator }}<template v-if="item.year"> · {{ item.year }}</template> · {{ mediaDuration(item.durationSeconds) }}</p>
      <p class="culture-labels">{{ item.language }} · {{ item.dialect }} · {{ item.register }}</p>
      <p>{{ item.description }}</p>
      <p><strong>{{ item.difficulty === 'advanced' ? 'Advanced listening' : item.difficulty === 'supported' ? 'Supported' : 'Stretch' }}:</strong> {{ item.difficultyReason }}</p>
      <div v-for="resource in item.resources" :key="resource.id" class="culture-resource">
        <p><strong>{{ action(item.slot, resource.purpose) }}</strong> · {{ culturalAccess[resource.access] }} · {{ mediaDuration(resource.durationSeconds) }}</p>
        <p>{{ resource.accessNotes }}</p>
        <a v-if="!offline && resource.available && safeMediaUrl(resource.url)" class="secondary-action culture-external" :href="resource.url" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">
          {{ action(item.slot, resource.purpose) }} on {{ resource.platform }} <ExternalLink :size="15" aria-hidden="true" /><span class="sr-only"> (opens in a new tab)</span>
        </a>
        <p v-else class="culture-unavailable">{{ offline ? 'Playback needs internet.' : resource.availabilityNote || 'This link is unavailable. Use the text alternative below.' }}</p>
      </div>
      <details :open="offline || item.resources.some(r => r.purpose === 'primary' && !r.available)">
        <summary>Listening prompt and access details</summary>
        <p><strong>Try this:</strong> {{ item.prompt }}</p>
        <p><strong>Text alternative:</strong> {{ item.textAlternative }}</p>
        <p v-if="item.contentNotes"><strong>Content notes:</strong> {{ item.contentNotes }}</p>
        <section v-for="resource in item.resources" :key="resource.id" class="culture-access" :aria-label="`${action(item.slot, resource.purpose)} details`">
          <h3>{{ action(item.slot, resource.purpose) }} · {{ resource.platform }}</h3>
          <p>{{ resource.region }} · {{ resource.loginRequired === true ? 'Sign-in required' : resource.loginRequired === false ? 'No sign-in observed' : 'Sign-in requirements not confirmed' }}</p>
          <p>Captions: {{ resource.captionLanguages.length ? resource.captionLanguages.join(', ') : 'None confirmed' }} · {{ resource.captionOrigin }}</p>
          <p>{{ resource.supportNotes }}</p>
          <p v-if="resource.startSeconds != null">Suggested window: {{ mediaDuration(resource.startSeconds) }}–{{ mediaDuration(resource.endSeconds ?? resource.durationSeconds) }}</p>
          <a v-if="!offline && resource.available && safeMediaUrl(resource.transcriptUrl)" :href="resource.transcriptUrl" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Publisher text support<span class="sr-only"> (opens in a new tab)</span></a>
          <p>Availability checked {{ editionDate(resource.checkedAtUtc) }}. Access can change by region.</p>
        </section>
      </details>
    </article>
  </div>
</template>
