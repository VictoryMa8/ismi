export const learnerHashes = ['#/today', '#/courses', '#/practice', '#/practice/review', '#/practice/checkpoints', '#/practice/recall', '#/practice/lessons', '#/progress', '#/words', '#/account']
export function isLearnerRoute(hash: string) {
  return learnerHashes.includes(hash.toLowerCase()) || ['#today', '#courses', '#practice', '#progress', '#words', '#account'].includes(hash.toLowerCase())
}
