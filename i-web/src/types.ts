export type TargetText = { targetText?: string; pronunciationHelp?: string }
export type DashboardResponse = {
  learner: {
    displayName: string
    streakDays: number
    offlineLessonCount: number
  }
  dailyPlan: {
    studyDate?: string
    studyMinutesToday?: number
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
  publicationNotice?: LessonPublicationNotice | null
  trackId?: string
  completedToday?: boolean
  characters?: LessonCast | null
  id: string
  title: string
  unitId: string
  unitTitle: string
  courseOrder: number
  estimatedMinutes: number
  reviewStatus: 'demonstrative' | 'reviewed' | 'owner-review'
  isCompleted: boolean
  isCurrent: boolean
}

export type LessonRecording = {
  origin?: 'human' | 'synthetic' | null
  synthesis?: SyntheticAudioProvenance | null
  transcript: string
  speaker: string
  dialect: string
  languageTag?: string
  sourceLocator: string
  reviewNotes: string
}

export type SyntheticAudioProvenance = {
  provider: string; voice: string; locale: string; modelRevision: string
  generatedAt: string; ssml: string; ssmlSha256: string; audioSha256: string
  reviewDisposition: 'pending' | 'accepted' | 'accepted-fallback'
  ownerReview: string; rightsStatus: 'pending' | 'cleared'; rightsEvidence?: string | null
}

export type LessonPrompt = TargetText & {
  arabic: string
  arabizi: string
  meaning: string
  audioUrl: string | null
  recording?: LessonRecording | null
}

export type LessonPhraseChunk = TargetText & { arabic: string; arabizi: string; meaning: string }
export type LessonCast = { registryVersion: string; characterIds: string[] }
export type CharacterRoles = {
  speakerId?: string | null; addresseeId?: string | null
  responseSpeakerId?: string | null; responseAddresseeId?: string | null
}
export type LessonTeachingCard = {
  speakerId?: string | null; addresseeId?: string | null
  title: string; phrase: LessonPrompt; note: string; chunks: LessonPhraseChunk[]
  recallCue?: string | null; sourceLocators?: string[] | null
}

export type LessonIntroduction = {
  scriptSupport?: { title: string; note: string; teachingCardIndexes: number[] } | null
  teachingCards?: LessonTeachingCard[] | null
  goal: string
  dialogue: Array<{ speaker: string; line: LessonPrompt; speakerId?: string | null; addresseeId?: string | null }>
  expressions: LessonPrompt[]
  usageNote: string
  dialectNote: string
  recordingNote: string
  sourceLocators: string[]
}

export type LessonAnswer = TargetText & {
  segments?: string[]
  rationale?: string
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
  characters?: CharacterRoles | null
  id: string
  instruction: string
  prompt: LessonPrompt
  answers: LessonAnswer[]
  evaluation: LessonEvaluation
}

export type LessonVocabulary = TargetText & {
  id: string; senseId: string; kind: 'word' | 'expression'
  arabic: string; arabizi: string; meaning: string
  dialect: string; register: string; forms: string[]; note: string
  sourceLocators: string[]; teachingCardIndex: number
}

export type LessonPublicationNotice = { releaseId: string; label: string; details: string }
export type LessonLanguageSupport = {
  reviewDisposition: 'pending' | 'accepted'; reviewer: string
  phrases: Array<{ teachingCardIndex: number; literalMeaning: string; functions: Array<{ chunkIndex: number; label: string; referenceIds: string[] }>; sourceLocators: string[] }>
  references: Array<{ id: string; title: string; explanation: string; searchTerms: string[]; exampleCardIndexes: number[]; sourceLocators: string[] }>
  usageNotes: Array<{ id: string; text: string; teachingCardIndexes: number[]; sourceLocators: string[] }>
}
export type LessonResponse = {
  languageSupport?: LessonLanguageSupport | null
  publicationNotice?: LessonPublicationNotice | null
  schemaVersion?: number
  contentReview?: { languageTag: string; variety: string; helpConvention: string; reviewer: string; reviewDisposition: string; rightsDisposition: string; criticalIssues: string[]; engineeringFixture?: boolean; sourceLanguages?: Record<string, string> }
  recall?: RecallTarget[] | null
  vocabulary?: LessonVocabulary[] | null
  characters?: LessonCast | null
  englishHelpInitiallyHidden?: boolean
  introduction?: LessonIntroduction | null
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
  reviewStatus: 'demonstrative' | 'reviewed' | 'owner-review'
}

export type RecallAnswer = {
  arabic: string; arabizi: string; meaning: string; rationale: string
  arabicVariants: string[]; arabiziVariants: string[]
}
export type RecallTarget = {
  id: string; intent: string; dialect: string; register: string
  requiredConcepts: string[]; sourceLocators: string[]
  acceptedAnswers: RecallAnswer[]; knownErrors: RecallAnswer[]
  hint: string; variants: Array<{ id: string; situation: string; reservedForLater: boolean }>
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
  scope?: string
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
  trackId?: string
  unitId?: string
  courseOrder?: number
  reviewStatus?: string
  id: number
  lessonId: string
  title: string
  versionNumber: number
  status: 'new' | 'draft' | 'approved' | 'published' | 'superseded' | 'withdrawn'
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
  status: 'new' | 'draft' | 'approved' | 'published' | 'superseded' | 'withdrawn'
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

export type CurriculumReadinessResult = {
  draft: CurriculumValidationResult
  publication: CurriculumValidationResult
}
