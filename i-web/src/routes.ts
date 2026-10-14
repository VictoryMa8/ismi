export const learnerHashes = ['#/today', '#/courses', '#/practice', '#/account', '#/words']
export function isLearnerRoute(hash: string) {
  return learnerHashes.includes(hash.toLowerCase()) || ['#today', '#courses', '#practice', '#account', '#words'].includes(hash.toLowerCase())
}
