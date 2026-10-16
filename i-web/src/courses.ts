import type { LessonResponse } from './types'

export const courses = [
  { id: 'levantine', languageId: 'arabic', languageName: 'Arabic', name: 'Palestinian Levantine', tag: 'ar-PS', direction: 'rtl', font: 'arabic', helpLabel: 'Transliteration', audioLocale: 'ar-PS', accent: 'green' },
  { id: 'msa', languageId: 'arabic', languageName: 'Arabic', name: 'Modern Standard Arabic', tag: 'ar', direction: 'rtl', font: 'arabic', helpLabel: 'Transliteration', audioLocale: 'ar', accent: 'gold' },
  { id: 'quranic', languageId: 'arabic', languageName: 'Arabic', name: 'Quranic Arabic', tag: 'ar', direction: 'rtl', font: 'arabic', helpLabel: 'Transliteration', audioLocale: 'ar', accent: 'ink' },
  { id: 'french', languageId: 'french', languageName: 'French', name: 'French', tag: 'fr', direction: 'ltr', font: 'latin', helpLabel: 'Pronunciation help', audioLocale: 'fr', accent: 'ink' },
  { id: 'khmer', languageId: 'khmer', languageName: 'Khmer', name: 'Khmer', tag: 'km', direction: 'ltr', font: 'khmer', helpLabel: 'Pronunciation help', audioLocale: 'km-KH', accent: 'blue' },
] as const
export type CourseId = typeof courses[number]['id']
export function courseFor(id?: string) { return courses.find(course => course.id === id) ?? courses[0] }
export function textAttributes(id?: string) {
  const course = courseFor(id)
  return { lang: course.tag, dir: course.direction, 'data-script': course.font }
}

// Adapt in memory only. Published JSON, IDs, versions and IndexedDB records remain intact.
// New packages use targetText/pronunciationHelp; old Arabic aliases remain readable.
export function readableLesson(lesson: LessonResponse): LessonResponse {
  function adapt(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(adapt)
    if (!value || typeof value !== 'object') return value
    const item = Object.fromEntries(Object.entries(value).map(([key, child]) => [key, adapt(child)]))
    if (typeof item.targetText === 'string') item.arabic = item.targetText
    if (typeof item.pronunciationHelp === 'string') item.arabizi = item.pronunciationHelp
    return item
  }
  return adapt(lesson) as LessonResponse
}
