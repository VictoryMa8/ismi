<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  ArrowLeft,
  ChevronRight,
  Lightbulb,
  MessageCircle,
  RotateCcw,
} from '@lucide/vue';
import type { TeachingCheckpoint } from './lessonSessions';
import { textAttributes } from './courses';
import type { LessonResponse, LessonTeachingCard } from './types';
import LessonTransition from './LessonTransition.vue';
import LessonStages from './LessonStages.vue';
import LessonScroll from './LessonScroll.vue';
import CharacterCast from './CharacterCast.vue';
import CharacterLabel from './CharacterLabel.vue';
import { characterName, lessonScene, sharedGuideCast } from './characters';

const props = defineProps<{ lesson: LessonResponse; review: boolean; startCardIndex?: number; checkpoint?: TeachingCheckpoint }>();
const emit = defineEmits<{ done: []; checkpoint: [value: TeachingCheckpoint] }>();
const stage = ref<'scene' | 'learn' | 'recall' | 'pattern'>('scene');
const index = ref(0);
const revealed = ref(false);
const sceneSource = computed(() => lessonScene(props.lesson));
// The shared cast acts out the existing preview scripts. Role names are explicit
// because self-introductions/accepted answers still contain those authored names.
const sharedRoles = computed((): Record<string, string> => props.lesson.characters ? {} :
  props.lesson.trackId === 'french' ? { Alex: 'knafeh', Camille: 'fattoush' } :
  props.lesson.trackId === 'khmer' ? { Alex: 'knafeh', Sam: 'fattoush', Host: 'fattoush', Guest: 'knafeh' } : {});
const sceneCast = computed(() => Object.keys(sharedRoles.value).length ? sharedGuideCast : props.lesson.characters);
const dialogue = computed(() => (props.lesson.introduction?.dialogue ?? []).map(turn => {
  const id = sharedRoles.value[turn.speaker];
  return id ? { ...turn, speakerId: id, speaker: `${characterName(id)} (as ${turn.speaker})` } : turn;
}));
const sceneFailed = ref(false);
const heading = ref<HTMLElement | null>(null);
const cards = computed<LessonTeachingCard[]>(() => {
  if (props.lesson.introduction?.teachingCards?.length)
    return props.lesson.introduction.teachingCards;
  if (props.lesson.introduction?.expressions.length)
    return props.lesson.introduction.expressions.map((phrase) => ({
      title: 'A useful expression',
      phrase,
      note: '',
      chunks: [],
    }));
  // Legacy demonstration packages still teach a response before asking for one.
  return props.lesson.steps.flatMap((step) => {
    const answer = step.answers.find(
      (a) =>
        a.id.toLowerCase() === step.evaluation.correctAnswerId.toLowerCase(),
    )!;
    return [
      {
        title: 'Understand the question',
        phrase: step.prompt,
        note: '',
        chunks: [],
      },
      {
        title: 'A response that fits',
        phrase: { ...answer, audioUrl: null },
        note: step.evaluation.correctExplanation,
        chunks: [],
      },
    ];
  });
});
if (props.startCardIndex !== undefined && props.startCardIndex >= 0 && props.startCardIndex < cards.value.length) {
  index.value = props.startCardIndex;
  stage.value = 'learn';
}
if (props.checkpoint && props.checkpoint.index >= 0 && props.checkpoint.index < cards.value.length) {
  stage.value = props.checkpoint.stage; index.value = props.checkpoint.index; revealed.value = props.checkpoint.revealed;
}
watch([stage, index, revealed], () => emit('checkpoint', { stage: stage.value, index: index.value, revealed: revealed.value }));
const card = computed(() => cards.value[index.value]!);
const patternNotes = computed(() =>
  props.lesson.introduction
    ? (props.lesson.introduction.usageNote.match(
        /[^.!?]+[.!?]+(?:[”’])?|[^.!?]+$/g,
      ) ?? [])
    : props.lesson.steps.map((step) => step.evaluation.correctExplanation),
);
async function focusHeading() {
  await nextTick();
  const content = heading.value?.closest<HTMLElement>('.lesson-content');
  if (content) content.scrollTop = 0;
  heading.value?.focus({ preventScroll: true });
}
async function advance() {
  if (stage.value === 'scene') stage.value = 'learn';
  else if (stage.value === 'learn') {
    stage.value = 'recall';
    revealed.value = false;
  } else if (stage.value === 'recall' && index.value < cards.value.length - 1) {
    index.value++;
    stage.value = 'learn';
    revealed.value = false;
  } else stage.value = 'pattern';
  await focusHeading();
}
async function reveal() {
  revealed.value = true;
  await focusHeading();
}
async function back() {
  if (stage.value === 'recall') stage.value = 'learn';
  else if (index.value > 0) {
    index.value--;
    stage.value = 'learn';
  } else stage.value = 'scene';
  await focusHeading();
}
</script>

<template>
  <section class="teaching-journey" aria-label="Learn the conversation">
    <div class="teaching-toolbar">
      <LessonStages
        :stage="
          stage === 'scene' ? 'meet' : stage === 'pattern' ? 'use' : 'learn'
        "
      />
      <button
        v-if="review"
        type="button"
        class="text-button teaching-return"
        @click="emit('done')"
      >
        Go to practice <ChevronRight :size="16" aria-hidden="true" />
      </button>
    </div>
    <LessonScroll>
      <p v-if="!lesson.publicationNotice && lesson.contentReview && lesson.contentReview.reviewDisposition !== 'accepted'" class="draft-review-notice" role="status">
        Unreviewed draft · fluent linguistic review pending.
      </p>
      <details v-if="lesson.contentReview && stage === 'scene'" class="content-review-record">
        <summary>Course and review record</summary>
        <p>{{ lesson.contentReview.languageTag }} · {{ lesson.contentReview.variety }} · {{ lesson.version }}</p>
        <p>Review credit: {{ lesson.contentReview.reviewer || 'Reviewer not yet designated' }} · {{ lesson.contentReview.reviewDisposition }}</p>
        <p>Pronunciation help: {{ lesson.contentReview.helpConvention }}. Rights: {{ lesson.contentReview.rightsDisposition }}.</p>
        <p v-if="lesson.contentReview.engineeringFixture">Engineering fixture · not approved curriculum.</p>
      </details>
      <details v-if="stage === 'scene' && lesson.introduction?.scriptSupport" class="script-support">
        <summary>{{ lesson.introduction.scriptSupport.title }}</summary>
        <p>{{ lesson.introduction.scriptSupport.note }}</p>
        <ol>
          <li v-for="cardIndex in lesson.introduction.scriptSupport.teachingCardIndexes" :key="cardIndex">
            <template v-if="cards[cardIndex]">
              <p v-bind="textAttributes(lesson.trackId)">{{ cards[cardIndex]!.phrase.arabic }}</p>
              <details><summary>{{ cards[cardIndex]!.phrase.arabizi ? 'Show pronunciation help and meaning' : 'Show meaning' }}</summary>
                <p v-if="cards[cardIndex]!.phrase.arabizi" dir="ltr">{{ cards[cardIndex]!.phrase.arabizi }}</p>
                <p>{{ cards[cardIndex]!.phrase.meaning }}</p>
              </details>
            </template>
          </li>
        </ol>
        <p>No score is recorded. Continue the lesson whenever you are ready.</p>
      </details>
      <LessonTransition @after-enter="focusHeading">
        <div :key="`${stage}-${index}-${revealed}`" class="teaching-page">
          <template v-if="stage === 'scene'">
            <span class="coach-icon"
              ><MessageCircle :size="24" aria-hidden="true"
            /></span>
            <h3 ref="heading" tabindex="-1">
              {{ lesson.introduction?.goal ?? lesson.title }}
            </h3>
            <p class="coach-context">{{ lesson.scenario }}</p>
            <img v-if="sceneSource && !sceneFailed" class="lesson-scene-art" :src="sceneSource" alt="" aria-hidden="true" width="960" height="640" @error="sceneFailed = true" />
            <CharacterCast :cast="sceneCast" />
            <p v-if="Object.keys(sharedRoles).length" class="coach-caption">Fattoush and Knafeh act out this conversation using the names in the dialogue.</p>
            <ol
              v-if="lesson.introduction"
              class="dialogue-transcript dialogue-bubbles"
              aria-label="Dialogue transcript"
            >
              <li
                v-for="(turn, i) in dialogue"
                :key="i"
                :class="{
                  reply: Boolean(
                    turn.speakerId &&
                    sceneCast?.characterIds.indexOf(turn.speakerId) ===
                      1,
                  ),
                }"
              >
                <CharacterLabel
                  v-if="turn.speakerId"
                  :speaker-id="turn.speakerId"
                  :addressee-id="turn.addresseeId"
                  :label="turn.speaker"
                  :registry-version="sceneCast?.registryVersion"
                  expression="attentive"
                />
                <strong v-else>{{ turn.speaker }}</strong>
                <p v-bind="textAttributes(lesson.trackId)">{{ turn.line.arabic }}</p>
                <p class="phrase-transliteration" dir="ltr">
                  {{ turn.line.arabizi }}
                </p>
                <p class="phrase-meaning">{{ turn.line.meaning }}</p>
              </li>
            </ol>
          </template>
          <template v-else-if="stage === 'learn' || stage === 'recall'">
            <p class="section-kicker">
              {{ index + 1 }} of {{ cards.length }}
            </p>
            <h3 ref="heading" tabindex="-1">
              {{ stage === 'learn' ? card.title : 'How would you say this?' }}
            </h3>
            <CharacterLabel
              v-if="card.speakerId"
              :speaker-id="card.speakerId"
              :addressee-id="card.addresseeId"
              :registry-version="lesson.characters?.registryVersion"
            />
            <CharacterCast v-else compact />
            <p v-if="stage === 'recall'" class="recall-cue">
              {{ card.recallCue || card.phrase.meaning }}
            </p>
            <div v-if="stage === 'learn' || revealed" class="phrase-spotlight">
              <p class="spotlight-arabic" v-bind="textAttributes(lesson.trackId)">
                {{ card.phrase.arabic }}
              </p>
              <p class="phrase-transliteration" dir="ltr">
                {{ card.phrase.arabizi }}
              </p>
              <p class="phrase-meaning">{{ card.phrase.meaning }}</p>
            </div>
            <dl
              v-if="stage === 'learn' && card.chunks.length"
              class="phrase-chunks"
              aria-label="Phrase building blocks"
            >
              <div v-for="(chunk, n) in card.chunks" :key="n">
                <dt v-bind="textAttributes(lesson.trackId)">{{ chunk.arabic }}</dt>
                <dd>
                  <span dir="ltr">{{ chunk.arabizi }}</span
                  ><strong>{{ chunk.meaning }}</strong>
                </dd>
              </div>
            </dl>
            <p v-if="stage === 'learn' && card.note" class="coach-insight">
              <Lightbulb :size="19" aria-hidden="true" />{{ card.note }}
            </p>
            <details
              v-if="stage === 'learn' && card.sourceLocators?.length"
              class="coach-reference"
            >
              <summary>Phrase sources</summary>
              <ul>
                <li v-for="source in card.sourceLocators" :key="source">
                  <a
                    v-if="
                      source.startsWith('https://') ||
                      source.startsWith('http://')
                    "
                    :href="source"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ source }}
                    <span class="sr-only">(opens in a new tab)</span></a
                  ><span v-else>{{ source }}</span>
                </li>
              </ul>
            </details>
            <p v-if="stage === 'recall' && revealed" class="coach-caption">
              Compare the meaning and the person you’re addressing. This
              reflection doesn’t grade your speech.
            </p>
          </template>
          <template v-else>
            <span class="coach-icon"
              ><Lightbulb :size="24" aria-hidden="true"
            /></span>
            <h3 ref="heading" tabindex="-1">Notice the pattern</h3>
            <div class="pattern-notes">
              <p v-for="(note, n) in patternNotes" :key="n">
                {{ note.trim() }}
              </p>
            </div>
            <details v-if="lesson.introduction" class="coach-reference">
              <summary>Dialect, recording status & sources</summary>
              <p>{{ lesson.introduction.dialectNote }}</p>
              <p>{{ lesson.introduction.recordingNote }}</p>
              <p>
                {{
                  lesson.reviewStatus === 'demonstrative'
                    ? 'Demonstrative material'
                    : 'AI-assisted content · no native-expert review'
                }}
              </p>
              <ul>
                <li
                  v-for="source in lesson.introduction.sourceLocators"
                  :key="source"
                >
                  {{ source }}
                </li>
              </ul>
            </details>
          </template>
        </div>
      </LessonTransition>
    </LessonScroll>
    <footer class="coach-actions" aria-label="Lesson navigation">
      <button
        v-if="stage === 'scene'"
        type="button"
        class="primary-action"
        data-ui-sound="advance"
        @click="advance"
      >
        Learn the phrases <ChevronRight :size="18" aria-hidden="true" />
      </button>
      <template v-else-if="stage === 'learn' || stage === 'recall'">
        <button type="button" class="text-button" @click="back">
          <ArrowLeft :size="16" aria-hidden="true" /> Look back
        </button>
        <button
          v-if="stage === 'recall' && !revealed"
          type="button"
          class="primary-action"
          data-ui-sound="reveal"
          @click="reveal"
        >
          Reveal phrase <RotateCcw :size="18" aria-hidden="true" />
        </button>
        <button
          v-else
          type="button"
          class="primary-action"
          data-ui-sound="advance"
          @click="advance"
        >
          {{
            stage === 'learn'
              ? 'Try from memory'
              : index === cards.length - 1
                ? 'Notice the pattern'
                : 'Next phrase'
          }}
          <ChevronRight :size="18" aria-hidden="true" />
        </button>
      </template>
      <button
        v-else
        type="button"
        class="primary-action"
        data-ui-sound="advance"
        @click="emit('done')"
      >
        Start practice <ChevronRight :size="18" aria-hidden="true" />
      </button>
    </footer>
  </section>
</template>

<style scoped>
.script-support { padding: .75rem 1rem; margin-bottom: 1rem; border: 1px solid currentColor; border-radius: .75rem; }
.script-support summary { cursor: pointer; min-height: 44px; padding-block: .65rem; box-sizing: border-box; font-weight: 700; }
.script-support p { overflow-wrap: anywhere; }
.script-support [lang^="km"] { font-size: 1.6em; line-height: 2; }
.draft-review-notice { font-weight: 700; }
</style>
