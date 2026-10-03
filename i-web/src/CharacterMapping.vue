<script setup lang="ts">
import { computed } from 'vue'
import { character, characterName, characterRegistryVersion } from './characters'
import CharacterCast from './CharacterCast.vue'
import type { LessonResponse } from './types'
const props = defineProps<{ lessonJson: string }>()
const preview = computed(() => {
  try {
    const lesson = JSON.parse(props.lessonJson) as LessonResponse
    const rows: Array<{ label: string; text: string }> = []
    const warnings: string[] = []
    const cast = lesson.characters
    function pair(speaker?: string | null, addressee?: string | null) {
      if (!speaker && !addressee) return 'Unassigned · neutral cue'
      for (const id of [speaker, addressee]) {
        if (!id || !character(id)) warnings.push(`Unknown or missing character ID: ${id ?? '(missing)'}`)
        else if (!cast?.characterIds?.includes(id)) warnings.push(`${characterName(id)} is absent from the scene cast.`)
      }
      if (speaker === addressee) warnings.push('Speaker and addressee must differ.')
      return `${characterName(speaker)} → ${characterName(addressee)}`
    }
    if (cast && cast.registryVersion !== characterRegistryVersion) warnings.push('Unknown character registry version.')
    for (const id of cast?.characterIds ?? []) if (!character(id)) warnings.push(`Unknown cast ID: ${id}`)
    for (const [i, turn] of (lesson.introduction?.dialogue ?? []).entries()) {
      const mapping = pair(turn.speakerId, turn.addresseeId)
      if (cast && !turn.speakerId) warnings.push(`Dialogue ${i + 1} has no explicit roles.`)
      if (turn.speakerId && character(turn.speakerId) && turn.speaker !== characterName(turn.speakerId) &&
          turn.speaker !== `${characterName(turn.speakerId)} → ${characterName(turn.addresseeId)}`)
        warnings.push(`Dialogue ${i + 1} conflicts with the authored speaker label.`)
      rows.push({ label: `Dialogue ${i + 1} · ${turn.speaker}`, text: mapping })
    }
    for (const [i, card] of (lesson.introduction?.teachingCards ?? []).entries())
      rows.push({ label: `Phrase ${i + 1} · ${card.title}`, text: pair(card.speakerId, card.addresseeId) })
    for (const step of lesson.steps ?? []) {
      const r = step.characters
      if (!r) { rows.push({ label: step.id, text: 'Unassigned · neutral cue' }); continue }
      if (!r.responseSpeakerId || !r.responseAddresseeId) warnings.push(`${step.id} needs both response roles.`)
      if (r.speakerId && r.responseSpeakerId && !(
        (r.responseSpeakerId === r.addresseeId && r.responseAddresseeId === r.speakerId) ||
        (r.responseSpeakerId === r.speakerId && r.responseAddresseeId === r.addresseeId))) warnings.push(`${step.id} has conflicting response roles.`)
      rows.push({ label: step.id, text: `${pair(r.speakerId, r.addresseeId)}; response: ${pair(r.responseSpeakerId, r.responseAddresseeId)}` })
    }
    return { cast, rows, warnings: [...new Set(warnings)] }
  } catch { return null }
})
</script>
<template>
  <section class="editor-section character-mapping" aria-labelledby="character-mapping-heading">
    <h3 id="character-mapping-heading">Character mapping</h3>
    <p v-if="!preview">Enter readable lesson JSON to inspect roles.</p>
    <template v-else>
      <p v-if="!preview.cast">Text-only lesson. Character roles are optional.</p>
      <CharacterCast :cast="preview.cast" />
      <ul v-if="preview.warnings.length" class="console-message error"><li v-for="warning in preview.warnings" :key="warning">{{ warning }}</li></ul>
      <details><summary>Dialogue, phrase and response roles</summary>
        <dl><div v-for="row in preview.rows" :key="row.label"><dt>{{ row.label }}</dt><dd>{{ row.text }}</dd></div></dl>
      </details>
    </template>
    <details class="character-design-review"><summary>Fattoush and Knafeh · proposed character designs</summary>
      <p>Flat corporate cartoon treatment. Fattoush above, Knafeh below: neutral, attentive, encouraging, profile. Final designs await owner selection.</p>
      <img src="/characters/v1/cast.webp" alt="Two rows of adult cartoon portraits: Fattoush with wavy hair and a green shirt; Knafeh with curly hair, a beard and a terracotta shirt. Each row shows neutral, attentive, encouraging and profile views." width="1536" height="1024" />
    </details>
  </section>
</template>
