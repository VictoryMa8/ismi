import plan from './content/levantine-course-plan.json' with { type: 'json' }
import type { CurriculumVersionSummary } from './types'

export { plan as levantineCoursePlan }
export type PlanWeek = (typeof plan.weeks)[number]

// Coverage belongs to exact slots and the connected database. Version history,
// seed demonstrations and published predecessors must not inflate draft depth.
export function courseCoverage(versions: CurriculumVersionSummary[]) {
  const weeks = plan.weeks.map(week => ({
    ...week,
    lessons: week.lessons.map(slot => {
      const history = versions.filter(v => v.lessonId === slot.lessonId)
        .sort((a, b) => b.versionNumber - a.versionNumber)
      const matches = (v: CurriculumVersionSummary) => v.trackId === plan.courseId &&
        v.unitId === week.unitId && v.courseOrder === slot.courseOrder &&
        v.reviewStatus !== 'demonstrative' && v.createdBy !== 'system migration'
      const candidates = history.filter(matches)
      const current = candidates.find(v => ['draft', 'approved', 'published'].includes(v.status))
      const published = candidates.find(v => v.status === 'published')
      return { ...slot, current, published, placementMismatch: history.some(v => !matches(v)) }
    }),
  }))
  const slots = weeks.flatMap(w => w.lessons)
  const plannedIds = new Set(slots.map(l => l.lessonId))
  return {
    weeks,
    total: slots.length,
    authored: slots.filter(l => l.current).length,
    approved: slots.filter(l => l.current && ['approved', 'published'].includes(l.current.status)).length,
    published: slots.filter(l => l.published).length,
    unmapped: versions.filter(v => v.trackId === plan.courseId && !plannedIds.has(v.lessonId))
      .filter((v, index, all) => all.findIndex(other => other.lessonId === v.lessonId) === index).length,
    metadataMissing: versions.some(v => v.trackId === undefined),
  }
}
