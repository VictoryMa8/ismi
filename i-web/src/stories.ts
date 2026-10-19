import { canonical } from './alphabet'
import { request } from './api'
import { getDeviceSnapshot, saveDeviceSnapshot, updateDeviceSnapshot } from './offline'
import type { LessonPrompt } from './types'
export type StoryPack = { id: string; courseId: string; unitId: string; arcId: string; episode: number; title: string; summary: string;
 sources: { lessonId: string; version: string }[];
 scenes: { title: string; situation: string; lines: { speakerId: string; text: LessonPrompt; sourceIndex: number }[] }[];
 checks: { id: string; kind: string; prompt: string; choices: { id: string; text: string; rationale: string; help?: string; meaning?: string }[]; acceptedId: string; explanation: string; sourceIndex: number; target: string }[];
 reviewer: string; reviewEvidence: string; rightsEvidence: string }
export type Story = Omit<StoryPack, 'reviewer' | 'reviewEvidence' | 'rightsEvidence'> & { version: number; contentHash: string; publicationNotice?: { releaseId: string; label: string; details: string } }
export type StoryVersion = { number: number; status: string; pack: StoryPack; hash: string; approvedBy: string | null; publishedAtUtc: string | null; textPreview?: boolean; previewAuthorizedBy?: string | null }
export type StoryDetail = { id: string; revision: number; state: { versions: StoryVersion[]; publishedVersion: number | null; audit: { action: string; version: number; actor: string; atUtc: string; reason: string }[] } }
export type StorySummary = { id: string; title: string; latestVersion: number; status: string }
export type StoryProgress = { position: number; completed: boolean; helped: boolean; results: Record<string, { first: string; helped: boolean; attempts: number }> }
export const storyKey = (scope: string, s: Story) => `story-progress-v1:${scope}:${s.id}:${s.contentHash}`
export const emptyStoryProgress = (): StoryProgress => ({ position: 0, completed: false, helped: false, results: {} })
export const storyDownloads = () => getDeviceSnapshot<Story[]>('story-downloads-v1')
export async function verifyStory(s: Story) {
 const bytes = new TextEncoder().encode(canonical({ ...s, contentHash: '' }))
 const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2,'0')).join('')
 if (hash !== s.contentHash) throw new Error('Story integrity check failed.')
}
export async function reconcileStories(live: Story[]) {
 await updateDeviceSnapshot<Story[]>('story-downloads-v1', old => (old ?? []).filter(p => live.some(s => s.id === p.id && s.contentHash === p.contentHash)))
}
export async function downloadStory(s: Story) {
 await verifyStory(s)
 const live = (await request<{ episodes: Story[] }>('/api/stories')).episodes
 await reconcileStories(live)
 if (!live.some(p => p.id === s.id && p.contentHash === s.contentHash)) throw new Error('This episode changed. Refresh stories.')
 await updateDeviceSnapshot<Story[]>('story-downloads-v1', old => [...(old ?? []).filter(p => p.id !== s.id), s])
}
export const removeStory = (id: string) => updateDeviceSnapshot<Story[]>('story-downloads-v1', old => (old ?? []).filter(s => s.id !== id))
export const saveStoryProgress = (scope: string, story: Story, progress: StoryProgress) => saveDeviceSnapshot(storyKey(scope, story), progress)
