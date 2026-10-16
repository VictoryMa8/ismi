import { readableLesson } from './courses'
import type { StudySettings } from './studyPlan'
import type { CulturalCatalog, PublicCulturalEdition, CulturalDetail, CulturalEdition, CulturalSummary } from './culture'
import { renameCharacterContent } from './characters'
import type {
  AuthSession,
  CurriculumSource,
  CurriculumReadinessResult,
  CurriculumValidationResult,
  CurriculumVersionDetail,
  CurriculumVersionSummary,
  DashboardResponse,
  LessonAttemptResponse,
  LessonCompletionResponse,
  LessonResponse,
} from './types'

type ApiErrorBody = {
  message?: string
  title?: string
  errors?: Record<string, string[]>
}

let csrfToken: string | null = null

export class ApiRequestError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken

  const response = await fetch('/api/auth/csrf', { credentials: 'include' })
  if (!response.ok) throw new ApiRequestError('Could not start a secure session.', response.status)

  const payload = await response.json() as { token: string }
  csrfToken = payload.token
  return csrfToken
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const method = (options?.method ?? 'GET').toUpperCase()
  const headers = new Headers(options?.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers.set('X-CSRF-TOKEN', await getCsrfToken())
  }

  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    let payload: ApiErrorBody | null = null
    try {
      payload = await response.json() as ApiErrorBody
    } catch {
      // The status fallback below remains useful for non-JSON server errors.
    }

    const validationMessage = payload?.errors
      ? Object.values(payload.errors).flat()[0]
      : undefined
    throw new ApiRequestError(
      validationMessage ?? payload?.message ?? payload?.title ?? `Ismi API returned ${response.status}`,
      response.status,
    )
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const getCulturalCatalog = (offset = 0) => request<CulturalCatalog>(`/api/culture/weekly?offset=${offset}`)
export const getCulturalEdition = (id: string) => request<PublicCulturalEdition>(`/api/culture/editions/${encodeURIComponent(id)}`)
export const listCulturalEditions = () => request<CulturalSummary[]>('/api/admin/culture/editions')
export const getCulturalDraft = (id: string) => request<CulturalDetail>(`/api/admin/culture/editions/${encodeURIComponent(id)}`)
export const saveCulturalDraft = (edition: CulturalEdition, expectedRevision?: number) => request<CulturalDetail>('/api/admin/culture/drafts', {
  method: 'POST', body: JSON.stringify({ edition, expectedRevision }) })
export function culturalCommand<T = CulturalDetail>(id: string, action: string, payload: object) {
  return request<T>(`/api/admin/culture/editions/${encodeURIComponent(id)}/${action}`, { method: 'POST', body: JSON.stringify(payload) })
}

export function getAuthSession(): Promise<AuthSession> {
  return request<AuthSession>('/api/auth/me')
}

export async function registerAccount(
  displayName: string,
  email: string,
  password: string,
): Promise<AuthSession> {
  const session = await request<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ displayName, email, password }),
  })
  csrfToken = null
  return session
}

export async function loginAccount(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<AuthSession> {
  const session = await request<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  })
  csrfToken = null
  return session
}

export async function logoutAccount(): Promise<void> {
  await request<void>('/api/auth/logout', {
    method: 'POST',
    body: '{}',
  })
  csrfToken = null
}

export function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>('/api/dashboard')
}

export function getLesson(lessonId: string): Promise<LessonResponse> {
  return request<LessonResponse>(`/api/lessons/${lessonId}`).then(renameCharacterContent).then(readableLesson)
}

export function submitLessonAttempt(
  lessonId: string,
  stepId: string,
  answerId: string,
): Promise<LessonAttemptResponse> {
  return request<LessonAttemptResponse>(`/api/lessons/${lessonId}/attempts`, {
    method: 'POST',
    body: JSON.stringify({ stepId, answerId }),
  }).then(renameCharacterContent)
}

export function submitLessonCompletion(
  lessonId: string,
  completionId: string,
  completedAt: string,
): Promise<LessonCompletionResponse> {
  return request<LessonCompletionResponse>(`/api/lessons/${lessonId}/completions`, {
    method: 'POST',
    body: JSON.stringify({ completionId, completedAt }),
  })
}

export function getCurriculumVersions(): Promise<CurriculumVersionSummary[]> {
  return request<CurriculumVersionSummary[]>('/api/admin/curriculum/versions')
}

export function getCurriculumVersion(versionId: number): Promise<CurriculumVersionDetail> {
  return request<CurriculumVersionDetail>(`/api/admin/curriculum/versions/${versionId}`).then(detail => ({ ...detail, lesson: renameCharacterContent(detail.lesson), sources: renameCharacterContent(detail.sources) }))
}

async function ensureRecallSupport(lesson: LessonResponse): Promise<void> {
  if (!lesson.recall?.length && lesson.schemaVersion !== 2) return
  const health = await request<{ features?: string[] }>('/api/health')
  if (lesson.schemaVersion === 2 && !health.features?.includes('multi-language-v1'))
    throw new ApiRequestError('Deploy the API with multi-language support before importing or saving schema-2 content.', 409)
  if (lesson.recall?.length && !health.features?.includes('typed-recall-v1'))
    throw new ApiRequestError('Deploy the API with recall support before importing or saving recall content.', 409)
}

export async function createCurriculumDraft(
  lesson: LessonResponse,
  sources: CurriculumSource[],
): Promise<CurriculumVersionDetail> {
  await ensureRecallSupport(lesson)
  return request<CurriculumVersionDetail>('/api/admin/curriculum/drafts', {
    method: 'POST',
    body: JSON.stringify({ lesson, sources }),
  })
}

export async function updateCurriculumDraft(
  versionId: number,
  lesson: LessonResponse,
  sources: CurriculumSource[],
): Promise<CurriculumVersionDetail> {
  await ensureRecallSupport(lesson)
  return request<CurriculumVersionDetail>(`/api/admin/curriculum/versions/${versionId}`, {
    method: 'PUT',
    body: JSON.stringify({ lesson, sources }),
  })
}

export function validateCurriculumVersion(versionId: number): Promise<CurriculumValidationResult> {
  return request<CurriculumValidationResult>(`/api/admin/curriculum/versions/${versionId}/validate`, {
    method: 'POST',
    body: '{}',
  })
}

export function checkCurriculumReadiness(versionId: number): Promise<CurriculumReadinessResult> {
  return request<CurriculumReadinessResult>(`/api/admin/curriculum/versions/${versionId}/readiness`, {
    method: 'POST',
    body: '{}',
  })
}

export function approveCurriculumVersion(versionId: number): Promise<CurriculumVersionDetail> {
  return request<CurriculumVersionDetail>(`/api/admin/curriculum/versions/${versionId}/approve`, {
    method: 'POST',
    body: '{}',
  })
}

export function publishCurriculumVersion(versionId: number): Promise<CurriculumVersionDetail> {
  return request<CurriculumVersionDetail>(`/api/admin/curriculum/versions/${versionId}/publish`, {
    method: 'POST',
    body: '{}',
  })
}

export function rollbackCurriculumVersion(
  lessonId: string,
  targetVersionId: number,
): Promise<CurriculumVersionDetail> {
  return request<CurriculumVersionDetail>(`/api/admin/curriculum/lessons/${lessonId}/rollback`, {
    method: 'POST',
    body: JSON.stringify({ targetVersionId }),
  })
}

export function uploadRecording(file: File): Promise<{ audioUrl: string }> {
  return request('/api/admin/curriculum/recordings', {
    method: 'POST',
    headers: { 'Content-Type': 'audio/wav' },
    body: file,
  })
}

export function getStudySettings(): Promise<StudySettings> {
  return request('/api/study-settings')
}
export function saveStudySettings(settings: StudySettings): Promise<StudySettings> {
  return request('/api/study-settings', { method: 'POST', body: JSON.stringify(settings) })
}

export type RecallReport = {
  id: string; lessonId: string; version: string; targetId: string; variantId: string
  inputMode: 'arabic' | 'arabizi'; response: string; explanation: string
}
export type RecallReviewCase = {
  id: string; status: string; createdAtUtc: string; report: RecallReport
  dialect: string; register: string; evaluation: string
  target: import('./types').RecallTarget; sources: CurriculumSource[]
  resolution: string | null; resolvedBy: string | null; resolvedAtUtc: string | null
}
export function submitRecallReport(report: RecallReport): Promise<{ accepted: boolean; id: string }> {
  return request('/api/recall/reports', { method: 'POST', body: JSON.stringify(report) })
}
export function getRecallReports(): Promise<RecallReviewCase[]> {
  return request('/api/admin/curriculum/recall-reports')
}
export function resolveRecallReport(id: string, resolution: string): Promise<RecallReviewCase> {
  return request(`/api/admin/curriculum/recall-reports/${id}/resolve`, { method: 'POST', body: JSON.stringify({ resolution }) })
}

export function withdrawCurriculumVersion(versionId: number, reason: string): Promise<CurriculumVersionDetail> {
  return request(`/api/admin/curriculum/versions/${versionId}/withdraw`, { method: 'POST', body: JSON.stringify({ reason }) })
}
