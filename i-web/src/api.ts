import type { StudySettings } from './studyPlan'
import { renameCharacterContent } from './characters'
import type {
  AuthSession,
  CurriculumSource,
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
  return request<LessonResponse>(`/api/lessons/${lessonId}`).then(renameCharacterContent)
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

export function createCurriculumDraft(
  lesson: LessonResponse,
  sources: CurriculumSource[],
): Promise<CurriculumVersionDetail> {
  return request<CurriculumVersionDetail>('/api/admin/curriculum/drafts', {
    method: 'POST',
    body: JSON.stringify({ lesson, sources }),
  })
}

export function updateCurriculumDraft(
  versionId: number,
  lesson: LessonResponse,
  sources: CurriculumSource[],
): Promise<CurriculumVersionDetail> {
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
