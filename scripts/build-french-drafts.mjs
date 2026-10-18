// Private F25 authoring only. Never imports, approves, publishes or records review.
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const directory = fileURLToPath(new URL('../content/french/meet-01/', import.meta.url))
const data = JSON.parse(await readFile(join(directory, 'authoring.json'), 'utf8'))
const check = process.argv.includes('--check')
const json = value => JSON.stringify(value, null, 2) + '\n'
const outputs = new Map()
const variety = 'metropolitan-france'
const sourceLocators = data.sources.map(s => s.locator)
const prompt = key => {
  const [targetText, pronunciationHelp, meaning] = data.phrases[key]
  return { arabic: '', arabizi: '', targetText, pronunciationHelp, meaning, audioUrl: null }
}
const packages = data.lessons.map((spec, index) => {
  const cards = spec.cards.map(key => ({ title: data.notes[key][0], phrase: prompt(key),
    note: data.notes[key][1], recallCue: data.notes[key][2], sourceLocators,
    chunks: [{ ...prompt(key) }] }))
  const steps = spec.practice.map(([instruction, cue, correct, ...others], i) => {
    const keys = [correct, ...others]
    const shift = (i + index) % keys.length
    const order = [...keys.slice(shift), ...keys.slice(0, shift)]
    const correctExplanation = `This supplies the requested response: “${prompt(correct).meaning}” ${data.notes[correct][1]}`
    const answers = order.map((key, n) => ({ ...prompt(key), id: String.fromCharCode(97 + n),
      segments: data.phrases[key][3], rationale: key === correct ? correctExplanation
        : `This means “${prompt(key).meaning}” ${data.notes[key][1]} The task specifically requests “${prompt(correct).meaning}” This choice is not being rejected as universally incorrect French.` }))
    return { id: `${spec.slug}-${i + 1}`, instruction, prompt: prompt(cue), answers,
      evaluation: { correctAnswerId: answers[order.indexOf(correct)].id,
        correctTitle: 'That fits this situation.', correctExplanation,
        incorrectTitle: 'Check the requested response.',
        incorrectExplanation: 'Compare the assigned role, requested meaning and address in this situation.',
        retryHint: data.notes[correct][2] } }
  })
  return { lesson: { id: `french-meet-01-${String(index + 1).padStart(2, '0')}`,
    trackId: 'french', schemaVersion: 2, title: spec.title, scenario: spec.scenario,
    estimatedMinutes: index === 4 ? 7 : 5, version: 'draft', unitId: 'french-meet-01',
    unitTitle: 'Meet someone and keep the exchange going', courseOrder: index + 1,
    reviewStatus: 'owner-review', englishHelpInitiallyHidden: false,
    contentReview: { languageTag: 'fr-FR', variety, helpConvention: 'none', reviewer: '',
      reviewDisposition: 'pending', rightsDisposition: 'pending', criticalIssues: [
        'No fluent French reviewer designated; exact text, register, explanations, answers and segments need acceptance.',
        'References are not an approved source foundation or publication rights clearance; no publisher media or lessons copied.',
        'No reviewed human model audio or pronunciation assessment; repair phrases and optional spelling help require fluent verification.',
        'No actual device/input/assistive-technology checks or observed immediate/delayed learner outcomes.'
      ], sourceLanguages: Object.fromEntries(sourceLocators.map(locator => [locator, 'fr-FR'])) },
    introduction: { goal: spec.goal,
      dialogue: spec.dialogue.map(([speaker, key]) => ({ speaker, line: prompt(key) })),
      expressions: spec.cards.map(prompt), usageNote: spec.usage,
      dialectNote: 'Reference target: contemporary everyday Metropolitan French. Familiar tu and polite singular vous are explicitly assigned by scene, not inferred from age or appearance. No regional alternative is claimed without a reviewed source.',
      recordingNote: 'Unreviewed private text draft. No human model audio or phonetic transcription. Device speech, if available, is a preview, not pronunciation evidence.',
      sourceLocators, teachingCards: cards,
      scriptSupport: { title: 'Optional spelling help',
        note: 'Compare the exact taught phrases, including accents and apostrophes. Reveal meaning when useful. These examples do not assess pronunciation or general reading ability.',
        teachingCardIndexes: cards.map((_, i) => i) } },
    vocabulary: spec.cards.map((key, i) => ({ ...prompt(key), id: key, senseId: `meet-${key}`,
      kind: 'expression', dialect: variety,
      register: ['politeq', 'andpolite', 'politerepeat'].includes(key) ? 'polite-singular-scene' :
        ['nameq', 'andyou', 'casual', 'repeat', 'slow'].includes(key) ? 'familiar-scene' : 'general',
      forms: [], note: data.notes[key][1], sourceLocators, teachingCardIndex: i })), steps }, sources: data.sources }
})
for (const [index, pack] of packages.entries()) {
  const stem = String(index + 1).padStart(2, '0')
  outputs.set(`${stem}-lesson.json`, json(pack))
  const l = pack.lesson
  let review = `# ${l.title}\n\nUnreviewed private F25 draft · ${l.id} · No publication approval, rights acceptance or model audio.\n\n${l.scenario}\n\nGoal: ${l.introduction.goal}\n\n## Dialogue\n\n`
  for (const t of l.introduction.dialogue) review += `- **${t.speaker}:** ${t.line.targetText} · ${t.line.meaning}\n`
  review += '\n## Teaching and spelling help\n\n'
  for (const c of l.introduction.teachingCards) review += `### ${c.title}\n\n${c.phrase.targetText} · ${c.phrase.meaning}\n\n${c.note}\n\nRecall before reveal: ${c.recallCue}\n\n`
  review += '## Contextual practice\n\n'
  for (const s of l.steps) {
    review += `### ${s.id}\n\n${s.instruction}\n\nCue: ${s.prompt.targetText} · ${s.prompt.meaning}\n\n`
    for (const a of s.answers) review += `- **${a.id}${a.id === s.evaluation.correctAnswerId ? ' (target)' : ''}:** ${a.targetText} · ${a.meaning}\n  ${a.rationale}\n`
    review += `\nRetry help: ${s.evaluation.retryHint}\n\n`
  }
  review += '## Review blockers\n\n' + l.contentReview.criticalIssues.map(s => `- ${s}\n`).join('')
  review += '\nEvery phrase, answer rationale, segment and source needs a recorded disposition. See [implementation and source register](../../../docs/french/README.md).\n'
  outputs.set(`${stem}-review.md`, review)
}
const remainingUnits = ['Talk about people you love', 'Share food or a café visit', 'Make a plan together',
  'Describe your day', 'Find your way', 'Visit someone’s home', 'Shop together', 'Make upcoming plans',
  'Share a recent experience', 'Ask for practical help', 'Spend a day together']
outputs.set('review-manifest.json', json({ schemaVersion: 1, feature: 'F25', unitId: 'french-meet-01', date: '2026-10-18',
  status: 'unreviewed-private-draft', ownerDecisions: { variety, targetUnits: 12, newLessonsPerUnit: 5,
    monthOneTarget: 'Five-minute guided conversation about introductions, family, food and plans at 15 minutes per day devoted to French; unproven assessment target.',
    route: 'Draft now; designate a fluent French reviewer before publication. No deployment, publication, hiring or provider spending authorized.' },
  sourceApproval: 'pending', linguisticReview: 'pending', humanModelAudio: 'missing', ownerWordingApproval: 'pending', publication: 'not authorized',
  packages: packages.map((p, i) => { const file = `${String(i + 1).padStart(2, '0')}-lesson.json`; return {
    lessonId: p.lesson.id, file, sha256: createHash('sha256').update(outputs.get(file)).digest('hex'),
    dialogueTurns: p.lesson.introduction.dialogue.length, teachingCards: p.lesson.introduction.teachingCards.length,
    practiceSteps: p.lesson.steps.length } }),
  startingCheck: { status: 'await accepted content', skipAndRetry: 'Reuse existing course-specific F24 flow; no new proficiency scale.',
    scope: 'Written intent/register recognition only; no listening, pronunciation or general A1 score.',
    phraseIds: ['hello', 'nameq', 'politeq', 'alex', 'repeat', 'slow'],
    spellingPolicy: 'Preserve accents/apostrophes exactly in display and authored tiles. Typed recall remains disabled until a reviewed French evaluator exists.' },
  recordingScript: Object.entries(data.phrases).map(([id]) => ({ id, ...prompt(id),
    status: 'Await exact script approval, speaker consent/credit/variety and playback/offline rights; no recording commissioned.' })),
  speakingBranches: [
    { intent: 'familiar introduction', targetPhraseIds: ['hello', 'nameq', 'alex', 'camille', 'andyou'] },
    { intent: 'polite introduction', targetPhraseIds: ['hello', 'politeq', 'alex', 'andpolite', 'politerepeat'] },
    { intent: 'communication repair', targetPhraseIds: ['notunderstood', 'repeat', 'slow', 'thanks'] }
  ].map(b => ({ ...b, status: 'scenario brief only; no audio, live conversation or provider feedback implemented',
    assessment: 'Appropriate intent, assigned role and intelligibility; uncertain alternatives need human review. Text alternatives required.' })),
  checkpoint: { mode: 'Existing unit checkpoint after eligible reviewed publication and completion.',
    scope: 'Written contextual recall/reconstruction, not spontaneous conversation or sound assessment.',
    transferTasks: ['Meet a different person with a different assigned name after at least 24 hours.', 'Move from a familiar friend visit to an explicitly polite first introduction; clarify a missed question.'],
    status: 'Task briefs only; exact transfer samples and accepted alternatives require review.' },
  remainingUnits: remainingUnits.map((title, i) => ({ unit: i + 2, title, newLessonTarget: 5,
    status: 'Await first-unit review and observed pilot before bulk authoring.' })) }))
for (const [name, contents] of outputs) {
  if (check) {
    if (await readFile(join(directory, name), 'utf8').catch(() => '') !== contents)
      throw new Error(`${name} differs; run node scripts/build-french-drafts.mjs`)
  } else await writeFile(join(directory, name), contents)
}
console.log(`${check ? 'Verified' : 'Built'} ${packages.length} private unreviewed French packages, review sheets and pinned manifest.`)
