import catalog from './content/glossary-catalog.json' with { type: 'json' }
import type { LessonRecording, LessonResponse, LessonTeachingCard, LessonVocabulary } from './types'

export type GlossaryContext = {
  lessonId: string; title: string; version: string; cardIndex: number
  note: string; sourceLocators: string[]; audioUrl: string | null; recording: LessonRecording | null
}
export type GlossaryEntry = LessonVocabulary & { trackId: string; contexts: GlossaryContext[] }

function sameCard(a: LessonTeachingCard, b: LessonTeachingCard): boolean {
  return a.phrase.arabic === b.phrase.arabic && a.phrase.arabizi === b.phrase.arabizi
    && a.phrase.meaning === b.phrase.meaning && a.note === b.note
    && JSON.stringify(a.chunks) === JSON.stringify(b.chunks)
    && JSON.stringify(a.sourceLocators ?? []) === JSON.stringify(b.sourceLocators ?? [])
}

export function vocabularyForLesson(lesson: LessonResponse): LessonVocabulary[] {
  if (lesson.vocabulary != null) return lesson.vocabulary
  // Older publications use a pinned catalog copied from approved teaching records.
  // Never scan answers/distractors or create new linguistic text from a changed payload.
  const legacy = catalog.find(record => record.lessonId === lesson.id)
  if (!legacy || lesson.trackId !== 'levantine') return []
  return legacy.cards.flatMap(record => {
    const current = lesson.introduction?.teachingCards?.[record.entries[0]!.teachingCardIndex]
    return current && sameCard(current, record.teachingCard) ? record.entries as LessonVocabulary[] : []
  })
}

export function learnedVocabulary(lessons: LessonResponse[]): GlossaryEntry[] {
  const entries = new Map<string, GlossaryEntry>()
  for (const lesson of lessons) {
    for (const word of vocabularyForLesson(lesson)) {
      const card = lesson.introduction?.teachingCards?.[word.teachingCardIndex]
      if (!card) continue
      // Reviewed prompt audio is reusable only for the exact taught text/sense.
      const recording = lesson.steps.find(step => step.prompt.arabic === word.arabic
        && step.prompt.arabizi === word.arabizi && step.prompt.meaning === word.meaning
        && step.prompt.audioUrl && step.prompt.recording)
      const context: GlossaryContext = { lessonId: lesson.id, title: lesson.title, version: lesson.version,
        cardIndex: word.teachingCardIndex, note: word.note, sourceLocators: word.sourceLocators,
        audioUrl: recording?.prompt.audioUrl ?? null, recording: recording?.prompt.recording ?? null }
      // Preserve distinct senses, transliterations, registers and dialect variants.
      const key = JSON.stringify([lesson.trackId, word.id, word.senseId, word.arabic,
        word.arabizi, word.meaning, word.dialect, word.register, word.kind, word.forms])
      const existing = entries.get(key)
      if (existing) {
        if (!existing.contexts.some(item => item.lessonId === context.lessonId && item.cardIndex === context.cardIndex))
          existing.contexts.push(context)
      } else entries.set(key, { ...word, trackId: lesson.trackId, contexts: [context] })
    }
  }
  return [...entries.values()].sort((a, b) => a.arabic.localeCompare(b.arabic, 'ar') || a.meaning.localeCompare(b.meaning))
}

export function glossarySearchText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, '')
    .toLocaleLowerCase().replace(/[أإآ]/g, 'ا').replace(/[ʿʾ‘’']/g, '').trim()
}
export function matchesGlossary(entry: GlossaryEntry, query: string): boolean {
  const haystack = glossarySearchText([entry.arabic, entry.arabizi, entry.meaning, ...entry.forms].join(' '))
  return glossarySearchText(query).split(/\s+/).every(term => haystack.includes(term))
}
export function glossaryCaution(entry: GlossaryEntry): string {
  if (entry.arabizi.toLowerCase().includes('mnīḥīn'))
    return 'Plural form under review. This is the wording in your lesson; a Palestinian form correction is pending.'
  if (/\blaw\b/i.test(entry.arabizi)) return 'Pronunciation help: aw sounds like “how.”'
  if (entry.arabizi === 'Fattoush') return 'Character name spelling; not a phonetic transcription.'
  return ''
}
