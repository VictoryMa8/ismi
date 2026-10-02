export const characterRegistryVersion = 'ismi-cast-v1'
export const characters = {
  lina: { name: 'Lina', row: 0 },
  omar: { name: 'Omar', row: 1 },
} as const
export type CharacterExpression = 'neutral' | 'attentive' | 'encouraging'
export function character(id?: string | null) {
  return id && Object.hasOwn(characters, id) ? characters[id as keyof typeof characters] : undefined
}
export function characterName(id?: string | null) { return character(id)?.name ?? 'Conversation partner' }
