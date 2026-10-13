import type { RecallTarget, RecallAnswer } from './types'
import type { RecallResult } from './recallStorage'

// NFC, case, whitespace, sentence punctuation, and Arabic harakat only.
// Preserve letters, internal apostrophes/hyphens, Arabizi digits and word order.
export function normalizeRecall(input: string): string {
  return input.normalize('NFC').toLowerCase().replace(/[\u064b-\u0652\u0670]/g, '')
    .replace(/[.,!?،؛؟:;…]/g, ' ').replace(/\s+/g, ' ').trim()
}
function matches(answer: RecallAnswer, input: string, mode: 'arabic' | 'arabizi'): boolean {
  const forms = mode === 'arabic' ? [answer.arabic, ...answer.arabicVariants] : [answer.arabizi, ...answer.arabiziVariants]
  return forms.some(form => normalizeRecall(form) === normalizeRecall(input))
}
export function evaluateRecall(target: RecallTarget, input: string, mode: 'arabic' | 'arabizi'): { kind: RecallResult; explanation: string } {
  const accepted = target.acceptedAnswers.find(answer => matches(answer, input, mode))
  if (accepted) return { kind: 'accepted', explanation: accepted.rationale }
  const knownError = target.knownErrors.find(answer => matches(answer, input, mode))
  if (knownError) return { kind: 'context-error', explanation: knownError.rationale }
  return { kind: 'uncertain', explanation: 'This response is outside the reviewed answer set. Compare the models, retry freely, or send it for human review. It is not marked wrong.' }
}
