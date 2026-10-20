// Original F12 authoring compiler. Writes portable packages/reviews only; no DB access.
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
const dir = fileURLToPath(new URL('../content/levantine/expansion-20/', import.meta.url))
const data = JSON.parse(await readFile(join(dir, 'authoring.json'), 'utf8'))
const check = process.argv.includes('--check')
const json = value => JSON.stringify(value, null, 2) + '\n'
const hash = value => createHash('sha256').update(value).digest('hex')
const base = 'https://resources.lingualism.com/levantine-arabic/'
const sourcesByUnit = {
  'levantine-home-03': ['around-the-house-2/', 'adverbs-3/'],
  'levantine-family-04': ['family-3/', 'verbs-3/'],
  'levantine-food-05': ['food-and-drink-3/', 'verbs-3/'],
  'levantine-neighborhood-06': ['cars-and-other-transportation-3/', 'adverbs-3/'],
}
const outputs = new Map()
const packages = []
for (const spec of data.lessons) {
  const name = `${spec.courseOrder}-lesson.json`
  const original = `internal:ismi/f12-expansion/${spec.lessonId}/v1`
  const refs = sourcesByUnit[spec.unitId].map(path => base + path)
  const locators = [...refs, original]
  const sources = refs.map(locator => ({ sourceType: 'publisher-reference',
    title: `Lingualism Palestinian Arabic · ${locator.split('/').filter(Boolean).at(-1)}`,
    locator, rights: 'Consultation for lexical facts only. No publisher dialogues, exercises, datasets or recordings redistributed; no broader rights clearance claimed.',
    notes: `Reference pointers checked October 19, 2026. ${spec.note} Original compositions and contextual grading remain unreviewed; publisher varieties are not proof of urban Palestinian speaker acceptance.` }))
  sources.push({ sourceType: 'original-authoring-record', title: `Ismi F12 · ${spec.title}`, locator: original,
    rights: 'Original AI-assisted composition for Ismi. No external media copied. Exact linguistic/source acceptance remains pending.',
    notes: `Authored October 19, 2026. ${spec.scene} No human reviewer, human recordings, measured learner timing or outcome evidence. Owner authorized this twenty-lesson development preview batch after being informed of those gaps.` })
  const prompt = n => Object.fromEntries(['arabic', 'arabizi', 'meaning'].map(key => [key, spec.phrases[n][key].join(' ')]).concat([['audioUrl', null]]))
  const cards = [0, 1, 3, 5].map(n => ({ title: prompt(n).meaning, phrase: prompt(n),
    note: `${spec.note} In this scene: ${prompt(n).meaning}`, recallCue: `In this scene, express: ${prompt(n).meaning}`,
    chunks: spec.phrases[n].arabic.map((arabic, i) => ({ arabic, arabizi: spec.phrases[n].arabizi[i], meaning: spec.phrases[n].meaning[i] })),
    sourceLocators: locators, speakerId: n % 2 ? 'knafeh' : 'fattoush', addresseeId: n % 2 ? 'fattoush' : 'knafeh' }))
  const steps = [1, 3, 5, 1, 3, 5].map((target, i) => {
    // Alternatives are grammatical scene turns with a different requested intent.
    const alternatives = [target, (target + 2) % 6, (target + 4) % 6]
    const shift = (i + spec.courseOrder) % 3
    const order = [...alternatives.slice(shift), ...alternatives.slice(0, shift)]
    const correct = `${prompt(target).meaning} ${spec.note}`
    const answers = order.map((n, k) => ({ id: String.fromCharCode(97 + k),
      arabic: prompt(n).arabic, arabizi: prompt(n).arabizi, meaning: prompt(n).meaning,
      rationale: n === target ? `This gives the requested response: ${correct}`
        : `This says “${prompt(n).meaning}” The requested response is “${prompt(target).meaning}” It changes the requested detail or conversational purpose; it can be appropriate in another context.` }))
    return { id: `context-${i + 1}`,
      instruction: i < 3 ? `As Knafeh in this exchange, respond with this meaning: ${prompt(target).meaning}`
        : `You are helping Fattoush reconstruct the agreed details for a later message. As Knafeh, preserve this meaning: ${prompt(target).meaning}`,
      prompt: prompt(target - 1), answers,
      evaluation: { correctAnswerId: answers[order.indexOf(target)].id, correctTitle: 'That fits the exchange.',
        correctExplanation: `This gives the requested response: ${correct}`, incorrectTitle: 'Check the intended meaning.',
        incorrectExplanation: `The reply must preserve the requested detail: ${prompt(target).meaning}`,
        retryHint: `Keep this meaning and perspective: ${prompt(target).meaning}` },
      characters: { speakerId: 'fattoush', addresseeId: 'knafeh', responseSpeakerId: 'knafeh', responseAddresseeId: 'fattoush' } }
  })
  const recall = [1, 3, 5].map((n, i) => ({ id: `recall-${i + 1}`, intent: `Respond in context: ${prompt(n).meaning}`,
    dialect: 'palestinian-urban', register: 'conversational', requiredConcepts: [prompt(n).meaning], sourceLocators: locators,
    acceptedAnswers: [{ arabic: prompt(n).arabic, arabizi: prompt(n).arabizi, meaning: prompt(n).meaning,
      rationale: 'This is the exact authored model for the assigned meaning and perspective. Other plausible forms require review; this preview has no accepted human linguistic review.',
      arabicVariants: [], arabiziVariants: [] }], knownErrors: [], hint: prompt(n).meaning,
    variants: [
      { id: 'scene', situation: `${spec.scene} Respond to: ${prompt(n - 1).meaning} Your intended meaning: ${prompt(n).meaning}`, reservedForLater: false },
      { id: 'message', situation: `Later, summarize this detail in a message to the same person without changing speaker perspective: ${prompt(n).meaning}`, reservedForLater: true },
    ] }))
  const lesson = { id: spec.lessonId, trackId: 'levantine', title: spec.title, scenario: spec.scene,
    steps, estimatedMinutes: 7, version: 'draft', unitId: spec.unitId, unitTitle: spec.unitTitle,
    courseOrder: spec.courseOrder, reviewStatus: 'owner-review', englishHelpInitiallyHidden: true,
    characters: { registryVersion: 'ismi-cast-v1', characterIds: ['fattoush', 'knafeh'] },
    contentReview: { languageTag: 'ar-PS', variety: 'palestinian-urban', helpConvention: 'ismi-levantine-help-v1', reviewer: '',
      reviewDisposition: 'pending', rightsDisposition: 'pending', sourceLanguages: Object.fromEntries(locators.map(l => [l, 'ar-PS'])),
      criticalIssues: ['Exact dialogue, urban usage, gender/address, transliteration, teaching chunks, alternatives and rationales await linguistic acceptance.',
        'Reference consultation is not blanket source-rights acceptance.', 'No human model audio, actual device/accessibility or observed timing/recall evidence.'] },
    introduction: { goal: `Use the dialogue to ${spec.title.toLowerCase()}.`,
      dialogue: spec.phrases.map((_, n) => ({ speaker: n % 2 ? 'Knafeh' : 'Fattoush', line: prompt(n),
        speakerId: n % 2 ? 'knafeh' : 'fattoush', addresseeId: n % 2 ? 'fattoush' : 'knafeh' })),
      expressions: [0, 1, 3, 5].map(prompt), usageNote: spec.note,
      dialectNote: 'Urban Palestinian reference model, unreviewed. Fattoush uses feminine self-reference where relevant and addresses Knafeh as male; Knafeh addresses Fattoush as female. Pronunciation help is approximate and not reviewed sound evidence. No unlabeled Jordanian alternative is introduced.',
      recordingNote: 'Unreviewed, text-only development preview. No human audio; optional device speech is not a reviewed model.', sourceLocators: locators, teachingCards: cards },
    recall }
  const bytes = json({ lesson, sources })
  outputs.set(name, bytes)
  const review = [`# ${spec.courseOrder} · ${spec.title}`, '', '**Unreviewed, text-only development preview.** No human linguistic/source acceptance or human audio.', '',
    `Scenario: ${spec.scene}`, '', `Teaching note: ${spec.note}`, '', '## Dialogue', '',
    ...lesson.introduction.dialogue.map(t => `- ${t.speaker}: ${t.line.arabic} — ${t.line.arabizi} — ${t.line.meaning}`), '',
    '## Teaching cards and authored chunks', '', ...cards.flatMap(c => [`### ${c.title}`, '', c.note, '', ...c.chunks.map(b => `- ${b.arabic} · ${b.arabizi} · ${b.meaning}`), '']),
    '## Context practice and complete answer rationales', '', ...steps.flatMap(s => [`### ${s.id}`, '', s.instruction, '', `Prompt: ${s.prompt.arabic} / ${s.prompt.arabizi} / ${s.prompt.meaning}`, '',
      ...s.answers.map(a => `- ${a.id}${a.id === s.evaluation.correctAnswerId ? ' (model)' : ''}: ${a.arabic} / ${a.arabizi} / ${a.meaning} — ${a.rationale}`), '', `Retry: ${s.evaluation.retryHint}`, '']),
    '## Recall', '', ...recall.map(r => `- ${r.id}: ${r.intent} — immediate scene and later-message contexts; exact model only, uncertain alternatives enter review.`), '',
    '## Review checklist', '', '- Check naturalness, urban dialect, listener gender, perspective, help/chunks and all contextual grading.',
    '- Disposition exact source consultation/rights and record actual reviewer; do not turn delegated preview approval into accepted linguistic review.',
    '- Seven minutes is an estimate. No speaking outcome, human-audio or beta claim.', '', '## Provenance', '',
    ...sources.map(s => `- ${s.title}: ${s.locator} — ${s.rights} ${s.notes}`), '', `Package SHA-256: \`${hash(bytes)}\``, ''].join('\n')
  outputs.set(`${spec.courseOrder}-review.md`, review)
  packages.push({ path: name, lessonId: spec.lessonId, courseOrder: spec.courseOrder, unitId: spec.unitId,
    sha256: hash(bytes), dialogueTurns: 6, teachingCards: 4, practiceSteps: 6, recallTargets: 3,
    reviewer: '', reviewDisposition: 'pending', rightsDisposition: 'pending', humanAudio: false })
}
outputs.set('review-manifest.json', json({ releaseId: 'levantine-expansion-20-text-preview-2026-10-19',
  authoredOn: data.authoredOn, status: data.status, packages }))
for (const [name, value] of outputs) {
  if (check) {
    if (await readFile(join(dir, name), 'utf8').catch(() => '') !== value) throw new Error(`Changed ${name}; regenerate and revalidate before delivery.`)
  } else await writeFile(join(dir, name), value)
}
console.log(`${check ? 'Verified' : 'Built'} ${packages.length} original text packages and complete review sheets; no import, approval or publication performed.`)
