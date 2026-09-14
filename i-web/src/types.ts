export type DashboardResponse = {
  learner: {
    displayName: string
    streakDays: number
    offlineLessonCount: number
  }
  dailyPlan: {
    goalMinutes: number
    completedMinutes: number
    primaryTrack: string
    nextLessonId: string
    lessons: CourseLessonSummary[]
  }
  tracks: Array<{
    id: string
    name: string
    label: string
    currentLessonTitle: string
    plannedMinutes: number
    progressPercent: number
    isPrimary: boolean
  }>
  connection: {
    arabic: string
    levantine: string
    formal: string
    meaning: string
  }
}

export type CourseLessonSummary = {
  id: string
  title: string
  unitId: string
  unitTitle: string
  courseOrder: number
  estimatedMinutes: number
  reviewStatus: 'demonstrative' | 'reviewed'
  isCompleted: boolean
  isCurrent: boolean
}

export type LessonRecording = {
  transcript: string
  speaker: string
  dialect: 'palestinian-urban' | 'jordanian'
  sourceLocator: string
  reviewNotes: string
}

export type LessonPrompt = {
  arabic: string
  arabizi: string
  meaning: string
  audioUrl: string | null
  recording?: LessonRecording | null
}

export type LessonAnswer = {
  id: string
  arabic: string
  arabizi: string
  meaning: string
}

export type LessonEvaluation = {
  correctAnswerId: string
  correctTitle: string
  correctExplanation: string
  incorrectTitle: string
  incorrectExplanation: string
  retryHint: string
}

export type LessonStep = {
  id: string
  instruction: string
  prompt: LessonPrompt
  answers: LessonAnswer[]
  evaluation: LessonEvaluation
}

export type LessonResponse = {
  id: string
  trackId: string
  title: string
  scenario: string
  steps: LessonStep[]
  estimatedMinutes: number
  version: string
  unitId: string
  unitTitle: string
  courseOrder: number
  reviewStatus: 'demonstrative' | 'reviewed'
}

export type LessonAttemptResponse = {
  stepId: string
  isCorrect: boolean
  correctAnswerId: string
  feedbackTitle: string
  explanation: string
  retryHint: string | null
}

export type LessonCompletionResponse = {
  accepted: boolean
  alreadyRecorded: boolean
  completedMinutes: number
  goalMinutes: number
}

export type PendingCompletion = {
  completionId: string
  lessonId: string
  completedAt: string
  estimatedMinutes: number
}

export type AuthSession = {
  isAuthenticated: boolean
  userId: string | null
  displayName: string | null
  email: string | null
  canManageCurriculum: boolean
}

export type CurriculumSource = {
  sourceType: string
  title: string
  locator: string
  rights: string
  notes: string
}

export type CurriculumVersionSummary = {
  id: number
  lessonId: string
  title: string
  versionNumber: number
  status: 'new' | 'draft' | 'approved' | 'published' | 'superseded'
  createdAtUtc: string
  createdBy: string
  publishedAtUtc: string | null
}

export type CurriculumAuditEntry = {
  id: number
  action: string
  actor: string
  occurredAtUtc: string
  details: string
}

export type CurriculumVersionDetail = {
  id: number
  versionNumber: number
  status: 'new' | 'draft' | 'approved' | 'published' | 'superseded'
  lesson: LessonResponse
  sources: CurriculumSource[]
  audit: CurriculumAuditEntry[]
  createdAtUtc: string
  createdBy: string
  approvedAtUtc: string | null
  approvedBy: string | null
  publishedAtUtc: string | null
  publishedBy: string | null
}

export type CurriculumValidationResult = {
  isValid: boolean
  errors: string[]
}
