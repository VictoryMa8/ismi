// Build private F26 candidates. This command never imports, approves or publishes.
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const directory = fileURLToPath(new URL('../content/khmer/meet-01/', import.meta.url))
const data = JSON.parse(await readFile(join(directory, 'authoring.json'), 'utf8'))
const check = process.argv.includes('--check')
const outputs = new Map()
const json = value => JSON.stringify(value, null, 2) + '\n'
const sourceLocators = data.sources.map(s => s.locator)
const variety = 'cambodian-phnom-penh'
const helpConvention = 'Ismi readable draft help v0; provisional, not IPA or approved romanization'
const prompt = key => {
  const [targetText, pronunciationHelp, meaning] = data.phrases[key]
  return { arabic: '', arabizi: '', targetText, pronunciationHelp, meaning, audioUrl: null }
}
const packages = data.lessons.map((spec, index) => {
  const id = `khmer-meet-01-${String(index + 1).padStart(2, '0')}`
  const cards = spec.cards.map(key => {
    const [title, note, recallCue] = data.notes[key]
    const { audioUrl, ...phrase } = prompt(key)
    return { title, phrase: { ...phrase, audioUrl }, note, recallCue, sourceLocators,
      chunks: [{ ...phrase }] }
  })
  const steps = spec.practice.map(([instruction, cue, correct, ...others], i) => {
    const keys = [correct, ...others]
    // Rotate the correct position, retaining explicit authored intent and rationale.
    const shift = (i + index) % keys.length
    const order = [...keys.slice(shift), ...keys.slice(0, shift)]
    const correctExplanation = `The requested response is “${prompt(correct).meaning}” in this situation. ${data.notes[correct][1]}`
    const answers = order.map((key, n) => {
      const { audioUrl, ...phrase } = prompt(key)
      return { ...phrase, id: String.fromCharCode(97 + n), segments: data.phrases[key][3],
        rationale: key === correct ? correctExplanation
          : `This says “${phrase.meaning}” It does not supply the response requested here: “${prompt(correct).meaning}” It may fit a different situation; it is not being rejected as universally incorrect Khmer.` }
    })
    return { id: `${spec.slug}-${i + 1}`, instruction, prompt: prompt(cue), answers,
      evaluation: { correctAnswerId: answers[order.indexOf(correct)].id,
        correctTitle: 'That fits this situation.', correctExplanation,
        incorrectTitle: 'Look at the requested response.',
        incorrectExplanation: 'Compare the requested meaning with the meaning of your selected response.',
        retryHint: data.notes[correct][2] } }
  })
  return { lesson: { id, trackId: 'khmer', schemaVersion: 2, title: spec.title, scenario: spec.scenario,
    estimatedMinutes: index === 4 ? 7 : 5, version: 'draft', unitId: 'khmer-meet-01',
    unitTitle: 'Meet someone and keep the exchange going', courseOrder: index + 1,
    reviewStatus: 'owner-review', englishHelpInitiallyHidden: false,
    contentReview: { languageTag: 'km-KH', variety, helpConvention, reviewer: '', reviewDisposition: 'pending',
      rightsDisposition: 'pending', criticalIssues: [
        'No fluent Khmer reviewer designated; all wording, accepted choices, address and cultural notes need review.',
        'Reference access is not reuse clearance; source selection and publication rights await owner review.',
        'Readable pronunciation help is provisional; modern script compositions and historical repair patterns need verification.',
        'No reviewed human model audio, sound modules, real-device/AT or observed learning evidence.'
      ], sourceLanguages: Object.fromEntries(sourceLocators.map(locator => [locator, 'km-KH'])) },
    introduction: { goal: spec.goal, dialogue: spec.dialogue.map(([speaker, key]) => ({ speaker, line: prompt(key) })),
      expressions: spec.cards.map(prompt), usageNote: spec.usage,
      dialectNote: 'Target model: contemporary Cambodian Khmer with a Phnom Penh reference. This candidate has no verified model speaker. Same-age peer address is provisional; do not generalize it to older relatives or formal settings.',
      recordingNote: 'Unreviewed text draft. No human model audio is supplied. Device speech, if available, is only a preview and does not validate the pronunciation help.',
      sourceLocators, teachingCards: cards,
      scriptSupport: { title: 'Optional script practice',
        note: 'Compare these whole expressions with the dialogue. Try recognizing a familiar expression before revealing its help. These are draft reading examples, not a decoding or pronunciation assessment.',
        teachingCardIndexes: cards.map((_, i) => i) } },
    vocabulary: spec.cards.map((key, i) => {
      const { audioUrl, ...phrase } = prompt(key)
      return { ...phrase, id: key, senseId: `meet-${key}`, kind: 'expression', dialect: variety,
        register: key === 'formal' ? 'formal-greeting-candidate' : 'same-age-peer-candidate', forms: [],
        note: data.notes[key][1], sourceLocators, teachingCardIndex: i }
    }), steps }, sources: data.sources }
})
for (const [index, pack] of packages.entries()) {
  const stem = String(index + 1).padStart(2, '0')
  outputs.set(`${stem}-lesson.json`, json(pack))
  const l = pack.lesson
  let review = `# ${l.title}\n\nUnreviewed F26 candidate · ${l.id} · no publication approval or model audio.\n\n${l.scenario}\n\nGoal: ${l.introduction.goal}\n\n## Dialogue\n\n`
  for (const t of l.introduction.dialogue) review += `- **${t.speaker}:** ${t.line.targetText} · ${t.line.pronunciationHelp} · ${t.line.meaning}\n`
  review += '\n## Teaching and optional script inventory\n\n'
  for (const c of l.introduction.teachingCards) review += `### ${c.title}\n\n${c.phrase.targetText}\n\n${c.phrase.pronunciationHelp} · ${c.phrase.meaning}\n\n${c.note}\n\nRecall: ${c.recallCue}\n\n`
  review += '## Contextual practice\n\n'
  for (const s of l.steps) {
    review += `### ${s.id}\n\n${s.instruction}\n\nCue: ${s.prompt.targetText} · ${s.prompt.meaning}\n\n`
    for (const a of s.answers) review += `- **${a.id}${a.id === s.evaluation.correctAnswerId ? ' (target)' : ''}:** ${a.targetText} · ${a.pronunciationHelp} · ${a.meaning}\n  ${a.rationale}\n`
    review += `\nRetry help: ${s.evaluation.retryHint}\n\n`
  }
  review += '## Review blockers\n\n' + l.contentReview.criticalIssues.map(s => `- ${s}\n`).join('')
  review += '\nSources and exact rights notes: see this lesson’s JSON package and [the source register](../../../docs/research/khmer-course-sources.md).\n'
  outputs.set(`${stem}-review.md`, review)
}
const manifest = {
  schemaVersion: 1, feature: 'F26', unitId: 'khmer-meet-01', date: '2026-10-16', status: 'unreviewed-draft',
  ownerDecisions: { variety, targetUnits: 12, newLessonsPerUnit: 5, optionalScript: true,
    route: 'Draft now; designate fluent Khmer reviewer before publication.' },
  sourceApproval: 'pending', linguisticReview: 'pending', pronunciationHelp: 'provisional-v0',
  humanModelAudio: 'missing', ownerWordingApproval: 'pending', publication: 'not-authorized',
  packages: packages.map((p, i) => { const file = `${String(i + 1).padStart(2, '0')}-lesson.json`; return {
    lessonId: p.lesson.id, file, sha256: createHash('sha256').update(outputs.get(file)).digest('hex'),
    dialogueTurns: p.lesson.introduction.dialogue.length, teachingCards: p.lesson.introduction.teachingCards.length,
    practiceSteps: p.lesson.steps.length } }),
  readingInventory: ['hello', 'thanks', 'sorry', 'nameq', 'alex', 'fromq', 'repeat', 'slow'].map(key => ({
    phraseId: key, targetText: prompt(key).targetText, kind: 'whole-expression recognition candidate',
    rubric: 'Recognize the requested taught expression among alternatives; record help separately. No unrestricted decoding/literacy claim.' })),
  checkpoint: { mode: 'existing unit checkpoint after eligible completion',
    scope: 'Contextual written choice/reconstruction only; no listening/speaking or general literacy score.',
    laterSituations: ['Meet a different peer at a visit; exchange a different assigned name.', 'After a delay, clarify a missed introduction in a noisy gathering.'],
    newSituationStatus: 'English task briefs only; exact prompts/answers await fluent review and pilot setup.' },
  recordingScript: Object.entries(data.phrases).map(([id]) => ({ id, ...prompt(id),
    status: 'Do not record until exact script/help/meaning approved; speaker credit, consent and playback/offline rights required.' })),
  speakingBranches: [
    { intent: 'introduction', roles: ['Alex', 'Sam'], targetPhraseIds: ['hello', 'alex', 'sam', 'nameq'],
      assessment: 'Intelligible assigned name and an appropriate greeting/question; text alternatives remain available.' },
    { intent: 'origin', targetPhraseIds: ['fromq', 'frompp', 'fromus'],
      assessment: 'Supply the assigned origin; meaning and intent before accent imitation.' },
    { intent: 'repair', targetPhraseIds: ['repeat', 'slow', 'thanks'],
      assessment: 'Request suitable clarification and respond after help; uncertain feedback must not reject natural language.' }
  ],
  remainingUnits: ['Meet family and friends', 'Share a meal', 'Make a plan together', 'Describe your day', 'Find a place',
    'Visit someone’s home', 'Shop together', 'Share a recent experience', 'Make upcoming plans', 'Ask for practical help', 'Spend a day together']
    .map((title, i) => ({ unit: i + 2, title, newLessonTarget: 5, status: 'await first-unit review and pilot; no authored lessons' }))
}
outputs.set('review-manifest.json', json(manifest))
for (const [name, contents] of outputs) {
  if (check) {
    const existing = await readFile(join(directory, name), 'utf8').catch(() => '')
    if (existing !== contents) throw new Error(`${name} differs; run node scripts/build-khmer-drafts.mjs`)
  } else await writeFile(join(directory, name), contents)
}
console.log(`${check ? 'Verified' : 'Built'} ${packages.length} unpublished Khmer draft packages, readable reviews and manifest.`)
