import type { LessonResponse, LessonStep } from './types'

export const placementVersion = 1
export type PlacementQuestion = { lessonId: string; title: string; version: string; sources: string[]; dialogue: NonNullable<LessonResponse['introduction']>['dialogue']; step: LessonStep }
export type PlacementAnswer = { lessonId: string; version: string; stepId: string; answerId: string; correct: boolean; help: boolean; sources: string[] }
export type PlacementResult = {
  policyVersion: number; trackId: 'levantine'; completedAt: string; skipped: boolean
  readingSupport: boolean; soundSupport: boolean; answers: PlacementAnswer[]
  recommendation?: { lessonId: string; title: string; version: string }
}

// Select only published packages supplied by the catalog; fixtures are not placement content.
export function placementQuestions(packages: LessonResponse[]): PlacementQuestion[] {
  return packages.filter(p => p.trackId === 'levantine' && p.reviewStatus !== 'demonstrative'
    && p.introduction?.sourceLocators.length)
    .sort((a, b) => a.courseOrder - b.courseOrder || a.id.localeCompare(b.id)).slice(0, 3)
    .flatMap(p => p.steps.filter(step => step.answers.length >= 2
      && step.answers.every(answer => Boolean(answer.rationale))
      && step.answers.some(answer => answer.id === step.evaluation.correctAnswerId)
      && step.evaluation.correctExplanation).slice(0, 2)
      .map(step => ({ lessonId: p.id, title: p.title, version: p.version,
        sources: [...p.introduction!.sourceLocators], dialogue: p.introduction!.dialogue, step })))
}

// Start at the first sampled lesson that needed help; never infer untested proficiency.
export function placementRecommendation(questions: PlacementQuestion[], answers: PlacementAnswer[]) {
  const firstNeedingPractice = questions.find(q => {
    const a = answers.find(a => a.lessonId === q.lessonId && a.version === q.version && a.stepId === q.step.id)
    return !a?.correct || a.help
  })
  const q = firstNeedingPractice ?? questions.at(-1)
  return q ? { lessonId: q.lessonId, title: q.title, version: q.version } : undefined
}
export function placementStorageKey(scope: string) { return `placement-v1:${scope}:levantine` }
