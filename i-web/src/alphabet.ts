import type { CourseId } from './courses'
export type AlphabetForm = { label: string; text: string; note: string }
export type ScriptEntry = { id: string; category: string; text: string; forms: AlphabetForm[] }
export type AlphabetClip = { url: string; transcript: string }
export type AlphabetExample = { id: string; text: string; meaning: string; help: string; target: string; occurrences: number[]; note: string; sourceIds: string[]; audio: AlphabetClip }
export type AlphabetActivity = { id: string; kind: 'shape' | 'listening' | 'spot' | 'repeat'; prompt: string; choices: { id: string; text: string }[]; acceptedIds: string[]; explanation: string; rationale: string; exampleId: string | null; audioUrl: string | null }
export type AlphabetEntry = { id: string; name: string; help: string; note: string; soundContext: string; sourceIds: string[]; nameAudio: AlphabetClip; soundAudio: AlphabetClip; examples: AlphabetExample[]; activities: AlphabetActivity[] }
export type AlphabetPack = { id: string; courseId: CourseId; version: number; contentHash: string; title: string; variety: string; helpConvention: string; inventoryId: string; inventoryVersion: number; fonts: { url: string; hash: string }[]; basicEntryIds: string[]; scriptEntries: ScriptEntry[]; entries: AlphabetEntry[]; sources: { id: string; citation: string; locator: string; version: string }[] }
export type AlphabetCatalog = { schemaVersion: number; courses: { courseId: CourseId; packId: string | null; version: number | null; contentHash: string | null }[]; withdrawnIds: string[] }
export type AlphabetEvidence = { id: string; packId: string; courseId: CourseId; version: number; contentHash: string; entryId: string; activityId: string | null; kind: 'viewed' | AlphabetActivity['kind']; firstAnswer: string | null; answers: string[]; help: boolean; correct: boolean | null; selfChecked: boolean; at: string }
export type AlphabetDraftPack = { id: string; courseId: CourseId; title: string; [key: string]: unknown }
export type AlphabetDetail = { id: string; revision: number; state: { versions: { number: number; status: string; pack: AlphabetDraftPack; hash: string; approvedBy: string | null; publishedAtUtc: string | null }[]; publishedVersion: number | null; audit: { action: string; version: number; actor: string; atUtc: string; reason: string }[] } }
export type AlphabetSummary = { id: string; courseId: CourseId; title: string; revision: number; latestVersion: number; status: string; publishedVersion: number | null }
export const alphabetAudio = (p: AlphabetPack) => [...new Set(p.entries.flatMap(e => [e.nameAudio.url, e.soundAudio.url, ...e.examples.map(w => w.audio.url)]))]
export function blankAlphabet(courseId: CourseId): AlphabetDraftPack {
  return { id: `${courseId}-alphabet`, courseId, title: 'Alphabet', variety: '', helpConvention: '',
    inventory: { id: `${courseId === 'levantine' || courseId === 'msa' || courseId === 'quranic' ? 'arabic' : courseId}-basic`, version: 1, basicEntryIds: [], entries: [], reviewer: '', reviewEvidence: '' },
    entries: [], sources: [], reviewer: '', reviewEvidence: '', engineeringFixture: false }
}
// Stable property sorting avoids runtime serializer differences; arrays retain authored order.
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value !== null && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`
  if (typeof value === 'string') return '"' + value.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join('') + '"'
  return JSON.stringify(value)
}
