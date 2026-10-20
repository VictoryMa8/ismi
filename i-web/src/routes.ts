export function isAboutRoute(hash: string) {
  return hash.toLowerCase() === '#/about'
}
export const learnerHashes = ['#/today', '#/courses', '#/practice', '#/practice/review', '#/practice/checkpoints', '#/practice/recall', '#/practice/lessons', '#/practice/stories', '#/practice/grammar', '#/progress', '#/words', '#/account']
export function isPrivacyRoute(hash: string) {
  return hash.toLowerCase() === '#/privacy'
}
export function isLearnerRoute(hash: string) {
  return /^#\/practice\/alphabet(?:\/[a-z0-9][a-z0-9-]{0,79})?$/.test(hash.toLowerCase())
    || /^#\/practice\/culture(?:\/[a-z0-9][a-z0-9-]{0,79})?$/.test(hash.toLowerCase())
    || learnerHashes.includes(hash.toLowerCase()) || ['#today', '#courses', '#practice', '#progress', '#words', '#account'].includes(hash.toLowerCase())
}
