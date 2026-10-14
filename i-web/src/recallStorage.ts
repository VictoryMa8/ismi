import { ApiRequestError, submitRecallReport, type RecallReport } from './api'
import { getDeviceSnapshot, updateDeviceSnapshot } from './offline'

export type RecallResult = 'accepted' | 'context-error' | 'uncertain'
export type RecallEvidence = {
  id: string; scope: string; lessonId: string; version: string; targetId: string; variantId: string
  shownAt: string; completedAt: string | null; firstResult: RecallResult | null
  firstHelped: boolean; helped: boolean; repeated: boolean
  // Review deadline captured at prompt exposure, before this answer reschedules it.
  // Older F22 records lack this fact and cannot establish a due-day demonstration.
  reviewDueAt?: string | null
  attempts: Array<{ result: RecallResult; at: string; inputMode: 'arabic' | 'arabizi'; helped: boolean }>
}
const evidenceKey = (scope: string) => `recall-evidence-v1:${scope}`
export async function getRecallEvidence(scope: string): Promise<RecallEvidence[]> {
  return await getDeviceSnapshot<RecallEvidence[]>(evidenceKey(scope)) ?? []
}
export async function saveRecallEvidence(value: RecallEvidence): Promise<void> {
  await updateDeviceSnapshot<RecallEvidence[]>(evidenceKey(value.scope), current => {
    const all = current ?? []
    const index = all.findIndex(item => item.id === value.id)
    if (index < 0) all.push(value); else all[index] = value
    return all
  })
}
export type QueuedRecallReport = { report: RecallReport; error?: string }
const reportsKey = (scope: string) => `recall-reports-v1:${scope}`
export async function getPendingRecallReports(scope: string): Promise<QueuedRecallReport[]> {
  return await getDeviceSnapshot<QueuedRecallReport[]>(reportsKey(scope)) ?? []
}
export async function queueRecallReport(scope: string, report: RecallReport): Promise<void> {
  await updateDeviceSnapshot<QueuedRecallReport[]>(reportsKey(scope), current => {
    const pending = current ?? []
    if (!pending.some(item => item.report.id === report.id)) pending.push({ report })
    return pending
  })
}
export async function discardRecallReport(scope: string, id: string): Promise<void> {
  await updateDeviceSnapshot<QueuedRecallReport[]>(reportsKey(scope), current => (current ?? []).filter(item => item.report.id !== id))
}
const flushing = new Set<string>()
export async function flushRecallReports(scope: string): Promise<void> {
  if (!navigator.onLine || flushing.has(scope)) return
  flushing.add(scope)
  try {
    const pending = await getPendingRecallReports(scope)
    for (const item of pending) {
      if (item.error) continue
      try {
        await submitRecallReport(item.report)
        await discardRecallReport(scope, item.report.id)
      } catch (error) {
        if (error instanceof ApiRequestError && [400, 403, 404, 410].includes(error.status)) {
          await updateDeviceSnapshot<QueuedRecallReport[]>(reportsKey(scope), current => {
            const latest = current ?? []
            const failed = latest.find(p => p.report.id === item.report.id)
            if (failed) failed.error = error.message
            return latest
          })
        }
        break // Network/CSRF/rate failures retain the consented report for reconnection.
      }
    }
  } finally { flushing.delete(scope) }
}
