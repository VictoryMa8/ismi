import { readingStyle } from './readingComfort'
import type { LessonResponse } from './types'

export const courses = [
  { id: 'levantine', groupId: 'levantine', pathName: '', languageId: 'arabic', languageName: 'Arabic', nativeName: 'العربية', name: 'Palestinian Levantine', tag: 'ar-PS', direction: 'rtl', font: 'arabic', helpLabel: 'Transliteration', audioLocale: 'ar-PS', accent: 'green' },
  { id: 'msa', groupId: 'msa', pathName: 'General MSA', languageId: 'arabic', languageName: 'Arabic', nativeName: 'العربية', name: 'Modern Standard Arabic', tag: 'ar', direction: 'rtl', font: 'arabic', helpLabel: 'Transliteration', audioLocale: 'ar', accent: 'gold' },
  { id: 'quranic', groupId: 'msa', pathName: 'Quranic Arabic', languageId: 'arabic', languageName: 'Arabic', nativeName: 'العربية', name: 'MSA · Quranic Arabic', tag: 'ar', direction: 'rtl', font: 'arabic', helpLabel: 'Transliteration', audioLocale: 'ar', accent: 'gold' },
  { id: 'french', groupId: 'french', pathName: '', languageId: 'french', languageName: 'French', nativeName: 'Français', name: 'French', tag: 'fr', direction: 'ltr', font: 'latin', helpLabel: 'Pronunciation help', audioLocale: 'fr', accent: 'blue' },
  { id: 'khmer', groupId: 'khmer', pathName: '', languageId: 'khmer', languageName: 'Khmer', nativeName: 'ខ្មែរ', name: 'Khmer', tag: 'km', direction: 'ltr', font: 'khmer', helpLabel: 'Pronunciation help', audioLocale: 'km-KH', accent: 'red' },
] as const
export type CourseId = typeof courses[number]['id']
export function courseFor(id?: string) { return courses.find(course => course.id === id) ?? courses[0] }
// One learner-facing MSA umbrella; stable path IDs preserve all saved learning data.
export const courseGroups = courses.filter(course => course.id === course.groupId).map(course => ({
  ...course, paths: courses.filter(path => path.groupId === course.id),
}))
export function groupFor(id?: string) { return courseGroups.find(group => group.id === courseFor(id).groupId)! }
export function textAttributes(id?: string) {
  const course = courseFor(id)
  return { lang: course.tag, dir: course.direction, 'data-script': course.font, style: readingStyle(course.id) }
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
