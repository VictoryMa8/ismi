export type CulturalResource = {
  id: string; purpose: 'primary' | 'free-companion' | 'alternate'; platform: string; url: string
  durationSeconds: number; access: 'free' | 'ad-supported' | 'rental' | 'subscription' | 'unknown'
  accessNotes: string; region: string; loginRequired: boolean | null
  captionLanguages: string[]; captionOrigin: 'publisher' | 'automatic' | 'none' | 'unknown'
  transcriptUrl: string | null; supportNotes: string; checkedAtUtc: string; evidence: string
  startSeconds?: number | null; endSeconds?: number | null
}
export type CulturalItem = {
  id: string; slot: 'youtube-video' | 'film' | 'song'; title: string; arabicTitle: string | null
  creator: string; year: number | null; durationSeconds: number; language: string; dialect: string
  register: string; difficulty: 'supported' | 'stretch' | 'advanced'; difficultyReason: string
  description: string; prompt: string; textAlternative: string; contentNotes: string
  sourceEvidence: string; reviewNotes: string; resources: CulturalResource[]
}
export type CulturalEdition = { id: string; title: string; weekStartUtc: string; theme: string; items: CulturalItem[] }
export type PublicCulturalResource = Omit<CulturalResource, 'url' | 'evidence'> & { url: string | null; available: boolean; availabilityNote: string }
export type PublicCulturalItem = Omit<CulturalItem, 'sourceEvidence' | 'reviewNotes' | 'resources'> & { resources: PublicCulturalResource[] }
export type PublicCulturalEdition = Omit<CulturalEdition, 'items'> & { version: number; contentHash: string; items: PublicCulturalItem[] }
export type CulturalCatalog = { schemaVersion: 1; serverTimeUtc: string; catalogRevision: string; currentId: string | null
  isCurrentWeek: boolean; editions: PublicCulturalEdition[]; withdrawnIds: string[]; offset: number; hasMore: boolean }
export type CulturalVersion = { number: number; status: string; edition: CulturalEdition; contentHash: string
  approvedBy: string | null; approvedAtUtc: string | null; publishedAtUtc: string | null }
export type CulturalDetail = { id: string; revision: number; state: { versions: CulturalVersion[]; publishedVersion: number | null
  audit: { action: string; version: number; actor: string; atUtc: string; note: string }[]
  observations: { resourceId: string; url: string; available: boolean; atUtc: string; note: string }[] } }
export type CulturalSummary = { id: string; title: string; weekStartUtc: string; revision: number
  latestVersion: number; status: string; publishedVersion: number | null }
export type CulturalValidation = { isValid: boolean; errors: string[] }
export const culturalSlots = { 'youtube-video': 'YouTube video', film: 'Film', song: 'Song' } as const
export const culturalAccess = { free: 'Free', 'ad-supported': 'Free with ads', rental: 'Rental', subscription: 'Subscription', unknown: 'Access pending' } as const
export function safeMediaUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000) return false
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && !u.port
    && /^[a-z0-9.-]+$/i.test(u.hostname) && u.hostname.includes('.') && !/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)
    && !/(^|\.)(localhost|local|internal|test|invalid)$/.test(u.hostname) } catch { return false }
}
const date = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value))
const text = (value: unknown): value is string => typeof value === 'string' && value.length <= 2000
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object'
export function validPublicEdition(value: unknown, draftPreview = false): value is PublicCulturalEdition {
  if (!record(value) || !text(value.id) || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(value.id)
    || !text(value.title) || !date(value.weekStartUtc) || !text(value.theme) || !text(value.contentHash)
    || !Number.isInteger(value.version) || !Array.isArray(value.items) || value.items.length !== 3) return false
  const slots = new Set<string>()
  return value.items.every((i: unknown) => {
    if (!record(i) || typeof i.slot !== 'string' || !Object.hasOwn(culturalSlots, i.slot) || slots.has(i.slot)) return false
    slots.add(i.slot)
    if (!['id','title','creator','language','dialect','register','difficultyReason','description','prompt','textAlternative','contentNotes']
      .every(key => text(i[key])) || !['supported','stretch','advanced'].includes(String(i.difficulty))
      || (i.arabicTitle !== null && !text(i.arabicTitle)) || !Number.isInteger(i.durationSeconds) || Number(i.durationSeconds) < (draftPreview ? 0 : 1)
      || !Array.isArray(i.resources) || i.resources.length < 1 || i.resources.length > 5) return false
    return i.resources.every((r: unknown) => record(r) && ['id','platform','accessNotes','region','supportNotes','availabilityNote'].every(k => text(r[k]))
      && ['primary','free-companion','alternate'].includes(String(r.purpose)) && Object.hasOwn(culturalAccess, String(r.access)) && (draftPreview || r.access !== 'unknown')
      && ['publisher','automatic','none','unknown'].includes(String(r.captionOrigin)) && typeof r.available === 'boolean'
      && (r.available ? safeMediaUrl(r.url) : r.url === null) && (r.transcriptUrl === null || safeMediaUrl(r.transcriptUrl))
      && Array.isArray(r.captionLanguages) && r.captionLanguages.every(text) && date(r.checkedAtUtc) && Number.isInteger(r.durationSeconds) && Number(r.durationSeconds) >= (draftPreview ? 0 : 1))
  })
}
export function validCulturalCatalog(value: unknown): value is CulturalCatalog {
  return record(value) && value.schemaVersion === 1 && date(value.serverTimeUtc) && text(value.catalogRevision)
    && (value.currentId === null || text(value.currentId)) && typeof value.isCurrentWeek === 'boolean'
    && Array.isArray(value.editions) && value.editions.length <= 8 && value.editions.every(e => validPublicEdition(e))
    && value.editions.every(e => Date.parse(e.weekStartUtc) <= Date.parse(value.serverTimeUtc as string))
    && Array.isArray(value.withdrawnIds) && value.withdrawnIds.every(text) && Number.isInteger(value.offset)
    && typeof value.hasMore === 'boolean'
}
export function editionDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
}
export function mediaDuration(seconds: number) {
  if (seconds <= 0) return 'Runtime pending'
  const minutes = Math.floor(seconds / 60), rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}
export function emptyCulturalEdition(): CulturalEdition {
  const now = new Date(); now.setUTCHours(0, 0, 0, 0); now.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7))
  return { id: `arabic-${now.toISOString().slice(0, 10)}`, title: 'Arabic this week', weekStartUtc: now.toISOString(), theme: '',
    items: (Object.keys(culturalSlots) as CulturalItem['slot'][]).map(slot => ({ id: slot, slot, title: '', arabicTitle: null,
      creator: '', year: null, durationSeconds: 180, language: 'Arabic', dialect: '', register: '', difficulty: 'stretch',
      difficultyReason: '', description: '', prompt: '', textAlternative: '', contentNotes: '', sourceEvidence: '', reviewNotes: '',
      resources: [{ id: `${slot}-primary`, purpose: 'primary', platform: slot === 'youtube-video' ? 'YouTube' : '', url: '',
        durationSeconds: 180, access: 'free', accessNotes: '', region: '', loginRequired: null, captionLanguages: [],
        captionOrigin: 'unknown', transcriptUrl: null, supportNotes: '', checkedAtUtc: new Date().toISOString(), evidence: '' }] })) }
}
