export const learnerHashes = ['#/today', '#/courses', '#/practice', '#/account']
export function isLearnerRoute(hash: string) {
  return learnerHashes.includes(hash.toLowerCase()) || ['#today', '#courses', '#practice', '#account'].includes(hash.toLowerCase())
}
