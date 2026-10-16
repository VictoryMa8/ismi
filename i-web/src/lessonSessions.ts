import { getDeviceSnapshot, saveDeviceSnapshot } from './offline'
import type { LessonAttemptResponse } from './types'
export type TeachingCheckpoint = { stage: 'scene' | 'learn' | 'recall' | 'pattern'; index: number; revealed: boolean }
export type StartedLesson = {
  lessonId: string; version: string; stepIndex: number; introductionOpen: boolean; teachingWasCompleted: boolean
  practiceMode: boolean; responseMode: 'recall' | 'choose' | 'build'; selectedAnswer: string | null
  feedback: LessonAttemptResponse | null; help: boolean; answerHelp: boolean; practiceHelpUsed: boolean
  retryCount: number; buildComplete: boolean; pieces: string[]; teaching?: TeachingCheckpoint
  responses: Record<string, { firstCorrect: boolean; helpUsed: boolean }>
}
export const loadStartedLesson = (scope: string, courseId: string) => getDeviceSnapshot<StartedLesson>(`started-lesson-v1:${scope}:${courseId}`)
export const storeStartedLesson = (scope: string, courseId: string, state: StartedLesson | null) => saveDeviceSnapshot(`started-lesson-v1:${scope}:${courseId}`, state)
