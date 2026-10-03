export const characterRegistryVersion = 'ismi-cast-v1'
export const characters = {
  fattoush: { name: 'Fattoush', row: 0 },
  knafeh: { name: 'Knafeh', row: 1 },
} as const
export type CharacterExpression = 'neutral' | 'attentive' | 'encouraging'
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
    .replace(/لينا/g, 'فتوش') as T
  if (Array.isArray(value)) return value.map(item => renameCharacterContent(item)) as T
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, renameCharacterContent(item)]),
  ) as T
  return value
}
