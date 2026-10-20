export const characterRegistryVersion = 'ismi-cast-v2'
// Shared guides are presentation only, never inferred dialogue participants.
export const sharedGuideCast = { registryVersion: characterRegistryVersion, characterIds: ['fattoush', 'knafeh'] }
// v1 publications keep their immutable cast metadata. The owner-approved v2
// appearance is a presentation migration for that same named roster.
export function supportsCharacterRegistry(version?: string) {
  return version === 'ismi-cast-v1' || version === characterRegistryVersion
}
export const characters = {
  fattoush: { name: 'Fattoush', row: 0 },
  knafeh: { name: 'Knafeh', row: 1 },
} as const
export type CharacterExpression = 'neutral' | 'attentive' | 'encouraging' | 'welcoming'
export function characterPortrait(id: string | null | undefined, expression: CharacterExpression, registryVersion: string) {
  const person = character(id)
  if (!person || !supportsCharacterRegistry(registryVersion)) return undefined
  const currentId = renameCharacterContent(id!)
  const state = expression === 'welcoming' && currentId === 'knafeh' ? 'neutral' : expression
  return `/characters/v2/${currentId}-${state}.webp`
}

// Decorative introductory art only; never show scene pictures during recall or grading.
export function lessonScene(lesson: { id: string; unitId?: string; characters?: { registryVersion: string; characterIds: string[] } | null }) {
  if (!lesson.characters || !supportsCharacterRegistry(lesson.characters.registryVersion)
    || !['fattoush', 'knafeh'].every(id => lesson.characters!.characterIds.includes(id))) return undefined
  if (lesson.unitId === 'levantine-plans-02' || lesson.id === 'levantine-everyday-01-06') return '/characters/v2/lesson-plans.webp'
  return undefined
}
export function character(id?: string | null) {
  const currentId = id ? renameCharacterContent(id) : id
  return currentId && Object.hasOwn(characters, currentId) ? characters[currentId as keyof typeof characters] : undefined
}
export function characterName(id?: string | null) { return character(id)?.name ?? 'Conversation partner' }

// Read compatibility for immutable published snapshots and downloaded packages.
// Only character-bearing content passes through this adapter, never account data.
export function renameCharacterContent<T>(value: T): T {
  if (typeof value === 'string') return value
    .replace(/\bLina\b/g, 'Fattoush').replace(/\bOmar\b/g, 'Knafeh')
    .replace(/\blina\b/g, 'fattoush').replace(/\bomar\b/g, 'knafeh')
    .replace(/(?<![\p{L}\p{M}\p{N}_])لينا(?![\p{L}\p{M}\p{N}_])/gu, 'فتوش') as T
  if (Array.isArray(value)) return value.map(item => renameCharacterContent(item)) as T
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, renameCharacterContent(item)]),
  ) as T
  return value
}
