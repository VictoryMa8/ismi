<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  BookOpen,
  BookCheck,
  Check,
  ChevronRight,
  Headphones,
  Home,
  MessageCircle,
  Newspaper,
  RotateCcw,
  UserPlus,
  UserRound,
  Volume2,
  WifiOff,
} from '@lucide/vue'
import CurriculumConsole from './CurriculumConsole.vue'
import {
  getAuthSession,
  getDashboard,
  getLesson,
  loginAccount,
  logoutAccount,
  registerAccount,
  submitLessonAttempt,
  submitLessonCompletion,
} from './api'
import {
  recordingPlaybackUrl,
  cacheDashboard,
  cacheLesson,
  getCachedDashboard,
  getCachedLesson,
  getCachedLessonCount,
  getPendingCompletions,
  queueCompletion,
  removePendingCompletion,
} from './offline'
import type {
  AuthSession,
  DashboardResponse,
  LessonAttemptResponse,
  LessonResponse,
  LessonStep,
  PendingCompletion,
} from './types'

const lessonOpen = ref(false)
const previewMode = ref(false)
const practiceMode = ref(false)
const introductionOpen = ref(false)
const showEnglishHelp = ref(true)
let lessonOpener: HTMLElement | null = null
const selectedAnswer = ref<string | null>(null)
const attemptFeedback = ref<LessonAttemptResponse | null>(null)
const apiLive = ref(false)
const lesson = ref<LessonResponse | null>(null)
const lessonLoading = ref(false)
const lessonError = ref<string | null>(null)
const downloadError = ref<string | null>(null)
const currentStepIndex = ref(0)
const lessonFinished = ref(false)
const completionWasQueued = ref(false)
const pendingSyncCount = ref(0)
type PageName = 'today' | 'courses' | 'practice' | 'account'
const navigation = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'practice', label: 'Practice', icon: Headphones },
  { id: 'account', label: 'Account', icon: UserRound },
] as const
function readPage(): PageName {
  const path = window.location.hash.replace(/^#\/?/, '')
  return navigation.find(item => item.id === path)?.id ?? 'today'
}
const page = ref<PageName>(readPage())
function navigate(destination: PageName) {
  window.location.hash = `/${destination}`
}
async function handlePageChange() {
  const destination = readPage()
  if (page.value === destination) return
  stopPromptAudio()
  lessonOpen.value = false
  page.value = destination
  accountPassword.value = ''
  document.title = `${navigation.find(item => item.id === destination)?.label} · Ismi`
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'instant' })
  document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
}
const consoleOpen = ref(false)
const accountMode = ref<'login' | 'register'>('login')
const accountSubmitting = ref(false)
const accountError = ref<string | null>(null)
const accountDisplayName = ref('')
const accountEmail = ref('')
const accountPassword = ref('')
const rememberAccount = ref(false)
const authSession = ref<AuthSession>({
  isAuthenticated: false,
  userId: null,
  displayName: null,
  email: null,
  canManageCurriculum: false,
})
const speechSupported = ref(false)
const speechVoices = ref<SpeechSynthesisVoice[]>([])
const speakingPromptId = ref<string | null>(null)
const lessonCloseButton = ref<HTMLButtonElement | null>(null)
const practiceHeading = ref<HTMLElement | null>(null)
const feedbackPanel = ref<HTMLElement | null>(null)
const completionHeading = ref<HTMLElement | null>(null)

const audioError = ref<string | null>(null)
let activeObjectUrl: string | null = null
let activeAudio: HTMLAudioElement | null = null
let playbackToken = 0

const dashboard = ref<DashboardResponse>({
  learner: { displayName: 'Guest', streakDays: 0, offlineLessonCount: 0 },
  dailyPlan: {
    goalMinutes: 15,
    completedMinutes: 0,
    primaryTrack: 'levantine',
    nextLessonId: 'levantine-day-01',
    lessons: [],
  },
  tracks: [],
  connection: { arabic: 'يَوْم', levantine: 'yōm', formal: 'yawm', meaning: 'day' },
})

const currentStep = computed(() => lesson.value?.steps[currentStepIndex.value] ?? null)
const primaryTrack = computed(() =>
  dashboard.value.tracks.find(track => track.id === dashboard.value.dailyPlan.primaryTrack),
)
const isCorrect = computed(() => attemptFeedback.value?.isCorrect ?? false)
const selectedArabicVoice = computed(() => {
  const exactLocalePreferences = ['ar-PS', 'ar-JO', 'ar-LB', 'ar-IL']

  for (const locale of exactLocalePreferences) {
    const match = speechVoices.value.find(voice =>
      voice.lang.localeCompare(locale, undefined, { sensitivity: 'accent' }) === 0,
    )
    if (match) return match
  }

  return speechVoices.value.find(voice => voice.lang.toLowerCase().startsWith('ar')) ?? null
})
const currentPromptIsPlaying = computed(() =>
  speakingPromptId.value === currentStep.value?.id,
)
const canPlayCurrentPrompt = computed(() =>
  Boolean(currentStep.value?.prompt.audioUrl) || speechSupported.value,
)
const audioButtonLabel = computed(() => {
  if (currentPromptIsPlaying.value) return 'Stop Arabic audio'
  if (currentStep.value?.prompt.audioUrl) return 'Play the recorded Arabic prompt'
  if (!speechSupported.value) return 'Device speech is not supported in this browser'
  if (selectedArabicVoice.value) {
    return `Play Arabic using the ${selectedArabicVoice.value.name} device voice`
  }
  return 'Play Arabic using the browser-selected device voice'
})
const deviceVoiceDescription = computed(() => {
  if (!speechSupported.value) return 'Device speech is unavailable in this browser.'
  if (selectedArabicVoice.value) {
    return `Device voice preview · ${selectedArabicVoice.value.name} (${selectedArabicVoice.value.lang})`
  }
  return 'Device voice preview · browser-selected Arabic voice'
})
const accountButtonLabel = computed(() =>
  authSession.value.isAuthenticated
    ? `Open account for ${authSession.value.displayName}`
    : 'Sign in or create an account',
)
const progressPercent = computed(() =>
  Math.min(100, Math.round((dashboard.value.dailyPlan.completedMinutes / dashboard.value.dailyPlan.goalMinutes) * 100)),
)
const remainingMinutes = computed(() =>
  Math.max(0, dashboard.value.dailyPlan.goalMinutes - dashboard.value.dailyPlan.completedMinutes),
)
const progressNote = computed(() => {
  if (remainingMinutes.value === 0) return 'Daily goal complete'
  if (remainingMinutes.value === 1) return '1 minute to go'
  return `${remainingMinutes.value} minutes to go`
})
const courseUnits = computed(() => {
  const units = new Map<string, { id: string; title: string; lessons: DashboardResponse['dailyPlan']['lessons'] }>()
  for (const item of dashboard.value.dailyPlan.lessons) {
    if (!units.has(item.unitId)) units.set(item.unitId, { id: item.unitId, title: item.unitTitle, lessons: [] })
    units.get(item.unitId)!.lessons.push(item)
  }
  return [...units.values()]
})
const completedCourseLessons = computed(() =>
  dashboard.value.dailyPlan.lessons.filter(item => item.isCompleted).length,
)
const courseProgressLabel = computed(() =>
  `${completedCourseLessons.value} of ${dashboard.value.dailyPlan.lessons.length} lessons complete`,
)
const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())
const syncStatus = computed(() => {
  if (pendingSyncCount.value > 0) {
    return `${pendingSyncCount.value} completion${pendingSyncCount.value === 1 ? '' : 's'} waiting to sync`
  }
  return apiLive.value ? 'Progress synced' : 'Offline · progress stays on this device'
})

onMounted(async () => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('hashchange', handlePageChange)
  document.title = `${navigation.find(item => item.id === page.value)?.label} · Ismi`
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  if (speechSupported.value) {
    loadSpeechVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadSpeechVoices)
  }

  await loadAuthSession()
  await syncPendingCompletions()
  await loadDashboard()

  await cacheUpcomingLessons()
})

onBeforeUnmount(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('hashchange', handlePageChange)
  if (speechSupported.value) {
    window.speechSynthesis.removeEventListener('voiceschanged', loadSpeechVoices)
  }
  stopPromptAudio()
})

function focusMain() {
  document.querySelector<HTMLElement>('#main-content')?.focus()
}

function loadSpeechVoices() {
  speechVoices.value = window.speechSynthesis.getVoices()
}

async function loadAuthSession() {
  try {
    authSession.value = await getAuthSession()
  } catch {
    authSession.value = {
      isAuthenticated: false,
      userId: null,
      displayName: null,
      email: null,
      canManageCurriculum: false,
    }
  }
}

function openAccount(mode: 'login' | 'register' = 'login') {
  accountMode.value = mode
  accountError.value = null
  accountPassword.value = ''
  navigate('account')
}

function closeAccount() {
  if (!accountSubmitting.value) navigate('today')
}

function openCurriculumConsole() {
  navigate('today')
  consoleOpen.value = true
}

function selectAccountMode(mode: 'login' | 'register') {
  accountMode.value = mode
  accountError.value = null
  accountPassword.value = ''
}

async function submitAccount() {
  accountSubmitting.value = true
  accountError.value = null

  try {
    authSession.value = accountMode.value === 'register'
      ? await registerAccount(
          accountDisplayName.value,
          accountEmail.value,
          accountPassword.value,
        )
      : await loginAccount(
          accountEmail.value,
          accountPassword.value,
          rememberAccount.value,
        )
    accountPassword.value = ''
    await syncPendingCompletions()
    await loadDashboard()
    await cacheUpcomingLessons()
    navigate('today')
  } catch (error) {
    accountError.value = error instanceof Error
      ? error.message
      : 'Could not finish that account request. Try again.'
  } finally {
    accountSubmitting.value = false
  }
}

async function signOut() {
  accountSubmitting.value = true
  accountError.value = null

  try {
    await logoutAccount()
    await loadAuthSession()
    await loadDashboard()
    navigate('today')
  } catch (error) {
    accountError.value = error instanceof Error
      ? error.message
      : 'Could not sign out. Try again.'
  } finally {
    accountSubmitting.value = false
  }
}

function stopPromptAudio() {
  playbackToken += 1
  audioError.value = null
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl)
  activeObjectUrl = null

  if (activeAudio) {
    activeAudio.pause()
    activeAudio.currentTime = 0
    activeAudio = null
  }

  if (speechSupported.value) window.speechSynthesis.cancel()
  speakingPromptId.value = null
}

async function playPromptAudio() {
  const step = currentStep.value
  if (!step || !canPlayCurrentPrompt.value) return

  if (currentPromptIsPlaying.value) {
    stopPromptAudio()
    return
  }

  stopPromptAudio()
  const token = playbackToken
  speakingPromptId.value = step.id

  const finishPlayback = () => {
    if (token !== playbackToken) return
    activeAudio = null
    if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl)
    activeObjectUrl = null
    speakingPromptId.value = null
  }

  if (step.prompt.audioUrl) {
    const url = await recordingPlaybackUrl(step.prompt.audioUrl)
    if (token !== playbackToken) {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      return
    }
    activeObjectUrl = url.startsWith('blob:') ? url : null
    const audio = new Audio(url)
    const failPlayback = () => {
      if (token !== playbackToken) return
      audioError.value = 'The recording could not play. You can read the transcript and continue, or try again.'
      finishPlayback()
    }
    activeAudio = audio
    audio.addEventListener('ended', finishPlayback, { once: true })
    audio.addEventListener('error', failPlayback, { once: true })
    try {
      await audio.play()
    } catch {
      failPlayback()
    }
    return
  }

  const utterance = new SpeechSynthesisUtterance(step.prompt.arabic)
  utterance.lang = selectedArabicVoice.value?.lang ?? 'ar-JO'
  utterance.rate = 0.9
  if (selectedArabicVoice.value) utterance.voice = selectedArabicVoice.value
  utterance.addEventListener('end', finishPlayback, { once: true })
  utterance.addEventListener('error', finishPlayback, { once: true })
  window.speechSynthesis.resume()
  window.speechSynthesis.speak(utterance)
}

async function loadDashboard() {
  let loadedDashboard: DashboardResponse | undefined

  try {
    loadedDashboard = await getDashboard()
    apiLive.value = true
    try {
      await cacheDashboard(loadedDashboard)
    } catch {
      // The live dashboard is still usable when device storage is unavailable.
    }
  } catch {
    apiLive.value = false
    try {
      loadedDashboard = await getCachedDashboard()
    } catch {
      loadedDashboard = undefined
    }
  }

  if (loadedDashboard) {
    loadedDashboard.dailyPlan.lessons ??= []
    dashboard.value = loadedDashboard
  }

  try {
    const pending = await getPendingCompletions()
    pendingSyncCount.value = pending.length
    const completedIds = new Set(
      dashboard.value.dailyPlan.lessons
        .filter(item => item.isCompleted)
        .map(item => item.id),
    )
    const pendingMinutes = pending
      .filter(item => !completedIds.has(item.lessonId))
      .reduce((total, item) => total + item.estimatedMinutes, 0)
    dashboard.value.dailyPlan.completedMinutes = Math.min(
      dashboard.value.dailyPlan.goalMinutes,
      dashboard.value.dailyPlan.completedMinutes + pendingMinutes,
    )
    for (const completion of pending) {
      await markLessonCompletedLocally(completion.lessonId)
    }
  } catch {
    pendingSyncCount.value = 0
  }
}

async function cacheUpcomingLessons() {
  if (!apiLive.value) return

  downloadError.value = null
  const upcoming = dashboard.value.dailyPlan.lessons
    .filter(item => !item.isCompleted)
    .slice(0, 3)
  for (const item of upcoming) {
    try {
      await cacheLesson(await getLesson(item.id))
    } catch {
      downloadError.value = 'Some lesson downloads could not finish. Previously downloaded lessons remain available. Reconnect to retry.'
      break
    }
  }

  try {
    dashboard.value.learner.offlineLessonCount = await getCachedLessonCount()
    await cacheDashboard(dashboard.value)
  } catch {
    // Learning remains available when storage reporting is unavailable.
  }
}

async function markLessonCompletedLocally(lessonId: string) {
  const completed = dashboard.value.dailyPlan.lessons.find(item => item.id === lessonId)
  if (completed) {
    completed.isCompleted = true
    completed.isCurrent = false
  }
  const next = dashboard.value.dailyPlan.lessons.find(item => !item.isCompleted)
    ?? dashboard.value.dailyPlan.lessons.at(-1)
  if (next) {
    next.isCurrent = true
    dashboard.value.dailyPlan.nextLessonId = next.id
    const track = dashboard.value.tracks.find(item => item.id === dashboard.value.dailyPlan.primaryTrack)
    if (track) {
      track.currentLessonTitle = next.title
      track.label = next.unitTitle
      track.plannedMinutes = next.estimatedMinutes
      track.progressPercent = Math.round(
        completedCourseLessons.value * 100 / dashboard.value.dailyPlan.lessons.length,
      )
    }
  }
  try {
    await cacheDashboard(dashboard.value)
  } catch {
    // The completion event remains the durable offline source of truth.
  }
}

async function handleOnline() {
  await syncPendingCompletions()
  await loadDashboard()
  await cacheUpcomingLessons()
}

async function syncPendingCompletions() {
  if (!navigator.onLine) return

  let pending: PendingCompletion[]
  try {
    pending = await getPendingCompletions()
  } catch {
    return
  }

  for (const completion of pending) {
    try {
      await submitLessonCompletion(
        completion.lessonId,
        completion.completionId,
        completion.completedAt,
      )
      apiLive.value = true
    } catch {
      apiLive.value = false
      break
    }

    try {
      await removePendingCompletion(completion.completionId)
    } catch {
      // The server endpoint is idempotent, so this event can be retried safely.
      break
    }
  }

  try {
    pendingSyncCount.value = (await getPendingCompletions()).length
  } catch {
    pendingSyncCount.value = 0
  }
}

async function previewLesson(draft: LessonResponse, opener: HTMLElement) {
  lessonOpener = opener
  stopPromptAudio()
  previewMode.value = true
  showEnglishHelp.value = !draft.englishHelpInitiallyHidden
  lesson.value = draft
  lessonOpen.value = true
  introductionOpen.value = Boolean(draft.introduction)
  selectedAnswer.value = null
  attemptFeedback.value = null
  lessonFinished.value = false
  completionWasQueued.value = false
  currentStepIndex.value = 0
  lessonError.value = null
  lessonLoading.value = false
  await nextTick()
  lessonCloseButton.value?.focus()
}

async function startLesson(requestedId?: string, practiceOnly = false) {
  lessonOpener = document.activeElement as HTMLElement | null
  previewMode.value = false
  practiceMode.value = practiceOnly || Boolean(dashboard.value.dailyPlan.lessons.find(item => item.id === (requestedId ?? dashboard.value.dailyPlan.nextLessonId))?.isCompleted)
  stopPromptAudio()
  lessonOpen.value = true
  selectedAnswer.value = null
  attemptFeedback.value = null
  lessonFinished.value = false
  completionWasQueued.value = false
  currentStepIndex.value = 0
  lessonError.value = null
  lessonLoading.value = true

  const lessonId = requestedId ?? dashboard.value.dailyPlan.nextLessonId
  try {
    lesson.value = await getLesson(lessonId)
    apiLive.value = true
    try {
      await cacheLesson(lesson.value)
    } catch {
      // Keep the live lesson available even if device storage is blocked.
    }
  } catch {
    apiLive.value = false
    try {
      lesson.value = (await getCachedLesson(lessonId)) ?? null
    } catch {
      lesson.value = null
    }
    if (!lesson.value) {
      lessonError.value = 'This lesson has not been downloaded yet. Reconnect once to make it available offline.'
    }
  } finally {
    lessonLoading.value = false
    introductionOpen.value = Boolean(lesson.value?.introduction)
    showEnglishHelp.value = !lesson.value?.englishHelpInitiallyHidden
    await nextTick()
    lessonCloseButton.value?.focus()
  }
}

function closeLesson() {
  stopPromptAudio()
  lessonOpen.value = false
  nextTick(() => lessonOpener?.focus())
}

function trapLessonFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  const sheet = event.currentTarget as HTMLElement
  const controls = [...sheet.querySelectorAll<HTMLElement>('button:not(:disabled), summary, a[href], [tabindex="0"]')]
    .filter(element => element.getClientRects().length > 0)
  const first = controls[0]
  const last = controls.at(-1)
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

function chooseAnswer(id: string) {
  if (!attemptFeedback.value) selectedAnswer.value = id
}

async function beginPractice() {
  introductionOpen.value = false
  await nextTick()
  practiceHeading.value?.focus()
}

async function checkAnswer() {
  if (!selectedAnswer.value || !lesson.value || !currentStep.value) return

  if (previewMode.value) {
    attemptFeedback.value = evaluateOffline(currentStep.value, selectedAnswer.value)
    await nextTick()
    feedbackPanel.value?.focus()
    return
  }

  try {
    attemptFeedback.value = await submitLessonAttempt(
      lesson.value.id,
      currentStep.value.id,
      selectedAnswer.value,
    )
    apiLive.value = true
  } catch {
    apiLive.value = false
    attemptFeedback.value = evaluateOffline(currentStep.value, selectedAnswer.value)
  }
  await nextTick()
  feedbackPanel.value?.focus()
}

async function retryAnswer() {
  selectedAnswer.value = null
  attemptFeedback.value = null
  await nextTick()
  practiceHeading.value?.focus()
}

function evaluateOffline(step: LessonStep, answerId: string): LessonAttemptResponse {
  const isAnswerCorrect = step.evaluation.correctAnswerId.toLowerCase() === answerId.toLowerCase()
  return {
    stepId: step.id,
    isCorrect: isAnswerCorrect,
    correctAnswerId: step.evaluation.correctAnswerId,
    feedbackTitle: isAnswerCorrect
      ? step.evaluation.correctTitle
      : step.evaluation.incorrectTitle,
    explanation: isAnswerCorrect
      ? step.evaluation.correctExplanation
      : step.answers.find(answer => answer.id === answerId)?.rationale ?? step.evaluation.incorrectExplanation,
    retryHint: isAnswerCorrect ? null : step.evaluation.retryHint,
  }
}

async function continueLesson() {
  if (!isCorrect.value || !lesson.value) return

  if (currentStepIndex.value < lesson.value.steps.length - 1) {
    stopPromptAudio()
    currentStepIndex.value += 1
    selectedAnswer.value = null
    attemptFeedback.value = null
    await nextTick()
    practiceHeading.value?.focus()
    return
  }

  await finishLesson()
  await nextTick()
  completionHeading.value?.focus()
}

async function finishLesson() {
  if (!lesson.value || lessonFinished.value) return

  stopPromptAudio()

  if (previewMode.value || practiceMode.value) {
    lessonFinished.value = true
    return
  }

  const completion: PendingCompletion = {
    completionId: crypto.randomUUID?.() ?? `${lesson.value.id}-${Date.now()}`,
    lessonId: lesson.value.id,
    completedAt: new Date().toISOString(),
    estimatedMinutes: lesson.value.estimatedMinutes,
  }

  try {
    await queueCompletion(completion)
    pendingSyncCount.value += 1
  } catch {
    // Online submission can still succeed when device storage is unavailable.
  }

  dashboard.value.dailyPlan.completedMinutes = Math.min(
    dashboard.value.dailyPlan.goalMinutes,
    dashboard.value.dailyPlan.completedMinutes + lesson.value.estimatedMinutes,
  )
  await markLessonCompletedLocally(lesson.value.id)

  try {
    const result = await submitLessonCompletion(
      completion.lessonId,
      completion.completionId,
      completion.completedAt,
    )
    dashboard.value.dailyPlan.completedMinutes = result.completedMinutes
    apiLive.value = true
    try {
      await removePendingCompletion(completion.completionId)
      pendingSyncCount.value = Math.max(0, pendingSyncCount.value - 1)
      await loadDashboard()
      await cacheUpcomingLessons()
    } catch {
      // The idempotent completion can safely be cleared on the next sync attempt.
    }
  } catch {
    apiLive.value = false
    completionWasQueued.value = true
  }

  lessonFinished.value = true
}
</script>

<template>
  <a class="skip-link" href="#main-content" @click.prevent="focusMain">Skip to main content</a>

  <div class="app-shell" :inert="lessonOpen || consoleOpen">
    <aside class="side-nav" aria-label="Primary navigation">
      <a class="brand" href="#/today" aria-label="Ismi home">
        <span class="brand-mark" aria-hidden="true">ا</span>
        <span class="brand-word">ismi</span>
      </a>

      <nav class="nav-links">
        <a v-for="item in navigation" :key="item.id" class="nav-link" :class="{ active: page === item.id }" :href="`#/${item.id}`" :aria-current="page === item.id ? 'page' : undefined">
          <component :is="item.icon" :size="21" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </a>
        <button v-if="authSession.canManageCurriculum" class="nav-link account-nav-link" type="button" @click="openCurriculumConsole">
          <BookCheck :size="21" aria-hidden="true" />
          <span>Curriculum</span>
        </button>
      </nav>

      <div class="side-note">
        <p>Speak with the people you love.</p>
      </div>
    </aside>

    <main id="main-content" class="main-content" tabindex="-1">
      <header class="mobile-header">
        <a class="brand" href="#/today" aria-label="Ismi home">
          <span class="brand-mark" aria-hidden="true">ا</span>
          <span class="brand-word">ismi</span>
        </a>
        <button class="profile-button" type="button" :aria-label="accountButtonLabel" @click="openAccount()">
          <UserRound :size="23" aria-hidden="true" />
        </button>
      </header>

      <p v-if="downloadError" role="status">{{ downloadError }}</p>

      <template v-if="page === 'today'">
      <section class="welcome-row" aria-labelledby="today-heading">
        <div>
          <p class="eyebrow">{{ todayLabel }} · Your {{ dashboard.dailyPlan.goalMinutes }}-minute plan</p>
          <h1 id="today-heading">Marhaba, {{ dashboard.learner.displayName }}.</h1>
          <p class="welcome-copy">A little closer to the conversations that matter.</p>
        </div>

        <div class="status-cluster" aria-label="Learning status">
          <button class="status-pill account-status" type="button" @click="openAccount()">
            <UserRound :size="18" aria-hidden="true" />
            <span>{{ authSession.isAuthenticated ? 'Account synced' : 'Studying as guest' }}</span>
          </button>
          <div class="status-pill offline-pill" :class="{ 'sync-pending': pendingSyncCount > 0 }">
            <Check v-if="apiLive && pendingSyncCount === 0" :size="18" aria-hidden="true" />
            <WifiOff v-else :size="18" aria-hidden="true" />
            <span>{{ syncStatus }}</span>
          </div>
        </div>
      </section>

      <section class="daily-progress" aria-labelledby="progress-heading">
        <div class="progress-copy">
          <span class="section-kicker">Today’s rhythm</span>
          <h2 id="progress-heading">{{ dashboard.dailyPlan.completedMinutes }} of {{ dashboard.dailyPlan.goalMinutes }} minutes</h2>
        </div>
        <div class="progress-track" role="progressbar" aria-valuemin="0" :aria-valuemax="dashboard.dailyPlan.goalMinutes" :aria-valuenow="dashboard.dailyPlan.completedMinutes" :aria-label="`${dashboard.dailyPlan.completedMinutes} of ${dashboard.dailyPlan.goalMinutes} daily minutes complete`">
          <span class="progress-fill" :style="{ width: `${progressPercent}%` }"></span>
        </div>
        <span class="progress-note">{{ progressNote }}</span>
      </section>

      <section class="section-block" aria-labelledby="next-heading">
        <div class="section-heading">
          <div>
            <span class="section-kicker">Up next</span>
            <h2 id="next-heading">Continue your main track</h2>
          </div>
          <span class="time-chip">{{ primaryTrack?.plannedMinutes ?? 6 }} min</span>
        </div>

        <article class="primary-lesson-card">
          <div class="lesson-details">
            <div class="track-label levantine-label">
              <MessageCircle :size="17" aria-hidden="true" />
              <span>{{ primaryTrack?.name ?? 'Palestinian Levantine' }} · {{ primaryTrack?.label ?? 'Week 1' }}</span>
            </div>
            <h3>{{ primaryTrack?.currentLessonTitle ?? 'Tell them about your day' }}</h3>
            <p>Read a conversation and practice choosing a response that fits.</p>
            <p class="review-status-note">{{ dashboard.dailyPlan.lessons.find(item => item.isCurrent)?.reviewStatus === 'demonstrative' ? 'Demonstrative content · not reviewed launch curriculum' : 'Owner-approved content · no native-expert review' }}</p>

            <div class="skill-list" aria-label="Skills practiced">
              <span><Volume2 :size="15" aria-hidden="true" /> Text comprehension</span>
              <span><MessageCircle :size="15" aria-hidden="true" /> Guided responses</span>
            </div>

            <button class="primary-action" type="button" @click="startLesson()">
              Continue in {{ primaryTrack?.name?.includes('Levantine') ? 'Levantine' : (primaryTrack?.name ?? 'your track') }}
              <ChevronRight :size="20" aria-hidden="true" />
            </button>
          </div>
        </article>

        <p class="review-status-note">{{ courseProgressLabel }}</p>
        <a class="page-link" href="#/courses">View course path <ChevronRight :size="16" aria-hidden="true" /></a>
      </section>
      </template>

      <template v-if="page === 'courses'">
        <header class="page-heading">
          <p class="eyebrow">Learn at your pace</p>
          <h1>Courses</h1>
          <p class="welcome-copy">Palestinian Levantine</p>
          <p class="review-status-note">{{ courseProgressLabel }}</p>
          <p class="review-status-note" role="status">{{ syncStatus }}</p>
        </header>
        <div class="course-units">
        <section v-for="unit in courseUnits" :key="unit.id" :aria-label="unit.title">
        <h2>{{ unit.title }}</h2>
        <ol class="course-path" aria-label="Levantine course path">
          <li
            v-for="item in unit.lessons"
            :key="item.id"
            :class="{ completed: item.isCompleted, current: item.isCurrent }"
          >
            <span class="course-path-marker" aria-hidden="true">
              <Check v-if="item.isCompleted" :size="16" />
              <span v-else>{{ item.courseOrder }}</span>
            </span>
            <span class="course-path-copy">
              <strong>{{ item.title }}</strong>
              <span>{{ item.estimatedMinutes }} min · {{ item.isCompleted ? 'Complete' : item.isCurrent ? 'Up next' : 'Later' }}</span>
            </span>
            <button class="text-button" type="button" :aria-label="`${item.isCompleted ? 'Review' : 'Open'} ${item.title}`" @click="startLesson(item.id)">{{ item.isCompleted ? 'Review' : 'Open' }}<span class="sr-only"> {{ item.title }}</span></button>
          </li>
        </ol>
        <div v-if="unit.lessons.every(item => item.isCompleted)" class="unit-complete" role="status">
          <h3>Unit complete</h3>
          <p>Keep the conversation going. Revisit any lesson for practice.</p>
          <button class="secondary-action" type="button" @click="startLesson(unit.lessons[0]?.id)">Review the unit</button>
        </div>
        </section>
        </div>
      <section class="section-block" aria-labelledby="tracks-heading">
        <div class="section-heading compact-heading">
          <div>
            <span class="section-kicker">Coming later</span>
            <h2 id="tracks-heading">More ways to learn Arabic</h2>
          </div>
          <span class="review-status-note">Additional tracks are not available yet</span>
        </div>

        <div class="track-grid">
          <article class="track-card msa-card">
            <div class="track-card-icon"><Newspaper :size="22" aria-hidden="true" /></div>
            <div class="track-card-copy">
              <span class="track-name">MSA · coming later</span>
              <h3>MSA pilot not yet published</h3>
              <p>Read and understand everyday formal Arabic.</p>
              <div class="mini-progress" aria-label="MSA unit progress: 0 percent"><span style="width: 0%"></span></div>
            </div>
            <button type="button" class="round-action" aria-label="MSA lessons are not yet available" disabled>
              <ChevronRight :size="20" aria-hidden="true" />
            </button>
          </article>

          <article class="track-card quran-card">
            <div class="track-card-icon"><BookOpen :size="22" aria-hidden="true" /></div>
            <div class="track-card-copy">
              <span class="track-name">Quranic · coming later</span>
              <h3>Quranic pilot not yet published</h3>
              <p>Build vocabulary and understand direct textual meaning.</p>
              <div class="mini-progress" aria-label="Quranic unit progress: 0 percent"><span style="width: 0%"></span></div>
            </div>
            <button type="button" class="round-action" aria-label="Quranic Arabic lessons are not yet available" disabled>
              <ChevronRight :size="20" aria-hidden="true" />
            </button>
          </article>
        </div>
      </section>

      </template>

      <template v-if="page === 'practice'">
        <header class="page-heading">
          <p class="eyebrow">Keep it familiar</p>
          <h1>Practice</h1>
          <p class="welcome-copy">Revisit a conversation. Take as many tries as you need.</p>
        </header>
        <section class="practice-list" aria-label="Practice lessons">
          <button v-for="item in dashboard.dailyPlan.lessons" :key="item.id" class="practice-item" type="button" @click="startLesson(item.id, true)">
            <RotateCcw :size="20" aria-hidden="true" />
            <span><strong>{{ item.title }}</strong><small>{{ item.estimatedMinutes }} min · {{ item.isCompleted ? 'Completed lesson' : 'Try a lesson' }}</small></span>
            <ChevronRight :size="18" aria-hidden="true" />
          </button>
          <p v-if="!dashboard.dailyPlan.lessons.length">Lessons will appear here when your course is available. Connect to download your first lessons.</p>
        </section>
      </template>
    <section v-if="page === 'account'" class="account-sheet account-page" aria-labelledby="account-title">
      <header class="account-sheet-header">
        <div>
          <span class="section-kicker">Your Ismi account</span>
          <h1 id="account-title">
            {{ authSession.isAuthenticated ? 'Account and sync' : accountMode === 'login' ? 'Welcome back' : 'Create your account' }}
          </h1>
        </div>
      </header>

      <template v-if="authSession.isAuthenticated">
        <div class="account-profile">
          <span class="account-avatar" aria-hidden="true">{{ authSession.displayName?.slice(0, 1).toUpperCase() }}</span>
          <div>
            <strong>{{ authSession.displayName }}</strong>
            <span>{{ authSession.email }}</span>
          </div>
        </div>
        <p class="account-copy">Your lesson progress is saved to this account and restored when you sign in again.</p>
        <p v-if="accountError" class="auth-error" role="alert">{{ accountError }}</p>
        <div class="account-actions">
          <button class="secondary-action" type="button" :disabled="accountSubmitting" @click="signOut">
            {{ accountSubmitting ? 'Signing out…' : 'Sign out' }}
          </button>
          <button class="primary-action" type="button" @click="closeAccount">Continue learning</button>
        </div>
        <button v-if="authSession.canManageCurriculum" class="guest-action curriculum-console-link" type="button" @click="openCurriculumConsole">
          <BookCheck :size="18" aria-hidden="true" /> Open curriculum console
        </button>
      </template>

      <template v-else>
        <div class="auth-tabs" aria-label="Account action">
          <button type="button" :class="{ active: accountMode === 'login' }" :aria-pressed="accountMode === 'login'" @click="selectAccountMode('login')">Sign in</button>
          <button type="button" :class="{ active: accountMode === 'register' }" :aria-pressed="accountMode === 'register'" @click="selectAccountMode('register')">Create account</button>
        </div>

        <form class="auth-form" @submit.prevent="submitAccount">
          <label v-if="accountMode === 'register'">
            <span>Display name</span>
            <input v-model="accountDisplayName" name="name" type="text" autocomplete="name" minlength="2" maxlength="40" required />
          </label>
          <label>
            <span>Email</span>
            <input v-model="accountEmail" name="email" type="email" autocomplete="email" inputmode="email" required />
          </label>
          <label>
            <span>Password</span>
            <input v-model="accountPassword" name="password" type="password" :autocomplete="accountMode === 'login' ? 'current-password' : 'new-password'" minlength="8" required />
          </label>
          <label v-if="accountMode === 'login'" class="remember-account">
            <input v-model="rememberAccount" type="checkbox" />
            <span>Keep me signed in on this device</span>
          </label>

          <p v-if="accountError" class="auth-error" role="alert">{{ accountError }}</p>
          <button class="primary-action auth-submit" type="submit" :disabled="accountSubmitting">
            <UserPlus v-if="accountMode === 'register'" :size="18" aria-hidden="true" />
            {{ accountSubmitting ? 'Please wait…' : accountMode === 'login' ? 'Sign in' : 'Create account' }}
          </button>
        </form>

        <button class="guest-action" type="button" :disabled="accountSubmitting" @click="closeAccount">Continue as guest</button>
        <p class="account-privacy">An account is optional. It stores your progress for future sessions; core lessons remain available to guests.</p>
      </template>
    </section>
    </main>

    <nav class="bottom-nav" aria-label="Mobile navigation">
      <a v-for="item in navigation" :key="item.id" :class="{ active: page === item.id }" :href="`#/${item.id}`" :aria-current="page === item.id ? 'page' : undefined"><component :is="item.icon" :size="21" aria-hidden="true" /><span>{{ item.label }}</span></a>
    </nav>
  </div>

  <div v-if="lessonOpen" class="lesson-overlay" :class="{ 'preview-overlay': previewMode }" role="presentation" @click.self="closeLesson">
    <section class="lesson-sheet" role="dialog" aria-modal="true" aria-labelledby="lesson-title" @keydown.esc="closeLesson" @keydown="trapLessonFocus">
      <header class="lesson-sheet-header">
        <div>
          <span v-if="lesson && currentStep && !lessonFinished" class="section-kicker">
            Guided conversation · {{ currentStepIndex + 1 }} of {{ lesson.steps.length }}
          </span>
          <span v-else class="section-kicker">Guided conversation</span>
          <h2 id="lesson-title">{{ lesson?.title ?? 'Your lesson' }}</h2>
        </div>
        <button ref="lessonCloseButton" class="close-button" type="button" aria-label="Close lesson" @click="closeLesson">×</button>
      </header>

      <div v-if="lessonLoading" class="lesson-state" role="status">
        <span class="lesson-state-mark" aria-hidden="true">ا</span>
        <strong>Opening your downloaded lesson…</strong>
        <p>Checking for the latest published version.</p>
      </div>

      <div v-else-if="lessonError" class="lesson-state lesson-error" role="alert">
        <WifiOff :size="28" aria-hidden="true" />
        <strong>Lesson unavailable offline</strong>
        <p>{{ lessonError }}</p>
        <button class="secondary-action" type="button" @click="startLesson()">Try again</button>
      </div>

      <div v-else-if="lessonFinished" class="lesson-state lesson-success" role="status">
        <span class="completion-mark"><Check :size="32" aria-hidden="true" /></span>
        <strong ref="completionHeading" tabindex="-1">{{ previewMode ? 'Preview complete' : 'Conversation complete' }}</strong>
        <p>{{ lesson?.introduction?.goal ?? 'You practiced responding in a guided conversation.' }}</p>
        <p v-if="previewMode">No learner progress was saved. Preview does not approve or publish content.</p>
        <p v-if="completionWasQueued" class="queued-note">
          Saved on this device. Ismi will sync it when you reconnect.
        </p>
        <button class="primary-action" type="button" @click="closeLesson">{{ previewMode ? 'Back to curriculum' : page === 'courses' ? 'Back to courses' : page === 'practice' ? 'Back to practice' : 'Back to today' }}</button>
      </div>

      <template v-else-if="lesson && currentStep">
        <button class="text-button" type="button" :aria-pressed="showEnglishHelp" @click="showEnglishHelp = !showEnglishHelp">{{ showEnglishHelp ? 'Hide' : 'Show' }} English help</button>
        <p v-if="previewMode" class="preview-notice" role="status">Owner preview · {{ lesson.version }} · no progress saved</p>
        <section v-if="lesson.introduction" class="lesson-introduction" aria-label="Conversation and teaching notes">
          <h3>{{ lesson.introduction.goal }}</h3>
          <p>{{ lesson.scenario }}</p>
          <button class="text-button" type="button" :aria-expanded="introductionOpen" @click="introductionOpen = !introductionOpen">{{ introductionOpen ? 'Hide' : 'Show' }} dialogue and notes</button>
          <div v-if="introductionOpen">
            <ol class="dialogue-transcript" aria-label="Dialogue transcript">
              <li v-for="(turn, index) in lesson.introduction.dialogue" :key="index">
                <strong>{{ turn.speaker }}</strong>
                <p lang="ar" dir="rtl">{{ turn.line.arabic }}</p>
                <p>{{ turn.line.arabizi }}</p>
                <p v-if="showEnglishHelp">{{ turn.line.meaning }}</p>
              </li>
            </ol>
            <h4>Expressions from the conversation</h4>
            <ul class="expression-list">
              <li v-for="expression in lesson.introduction.expressions" :key="expression.arabic"><span lang="ar" dir="rtl">{{ expression.arabic }}</span> · {{ expression.arabizi }}<span v-if="showEnglishHelp"> · {{ expression.meaning }}</span></li>
            </ul>
            <h4>Notice the pattern</h4>
            <p>{{ lesson.introduction.usageNote }}</p>
            <p>{{ lesson.introduction.dialectNote }}</p>
            <p class="audio-source-note">{{ lesson.introduction.recordingNote }}</p>
            <p class="review-status-note">{{ lesson.reviewStatus === 'demonstrative' ? 'Demonstrative material' : previewMode ? 'Draft/version preview · no native-expert review' : 'Owner-approved for publication · no native-expert review' }}</p>
            <details><summary>Language references</summary><ul><li v-for="source in lesson.introduction.sourceLocators" :key="source">{{ source }}</li></ul></details>
            <button class="primary-action" type="button" @click="beginPractice">Start practice</button>
          </div>
        </section>
        <div v-show="!introductionOpen">
        <div class="lesson-step-progress" aria-hidden="true">
          <span :style="{ width: `${((currentStepIndex + 1) / lesson.steps.length) * 100}%` }"></span>
        </div>

        <div class="scenario-panel">
          <button
            type="button"
            class="audio-button"
            :class="{ speaking: currentPromptIsPlaying }"
            :disabled="!canPlayCurrentPrompt"
            :aria-label="audioButtonLabel"
            :aria-pressed="currentPromptIsPlaying"
            :title="audioButtonLabel"
            @click="playPromptAudio"
          >
            <Volume2 :size="21" aria-hidden="true" />
          </button>
          <div>
            <p class="arabic-prompt" lang="ar" dir="rtl">{{ currentStep.prompt.arabic }}</p>
            <p class="arabizi-prompt">{{ currentStep.prompt.arabizi }}</p>
            <p v-if="showEnglishHelp" class="prompt-meaning">{{ currentStep.prompt.meaning }}</p>
            <template v-if="currentStep.prompt.recording">
              <p class="audio-source-note">Recorded · {{ currentStep.prompt.recording.speaker }} · {{ currentStep.prompt.recording.dialect === 'jordanian' ? 'Jordanian variant' : 'Urban Palestinian' }}</p>
              <details class="recording-details">
                <summary>Recording transcript and source</summary>
                <p lang="ar" dir="rtl">{{ currentStep.prompt.recording.transcript }}</p>
                <p>Source: {{ currentStep.prompt.recording.sourceLocator }}</p>
              </details>
            </template>
            <p v-if="audioError" role="alert">{{ audioError }}</p>
            <p v-if="!currentStep.prompt.audioUrl" class="audio-source-note">
              {{ deviceVoiceDescription }}
            </p>
          </div>
        </div>

        <fieldset class="answer-group" :disabled="Boolean(attemptFeedback)">
          <legend ref="practiceHeading" tabindex="-1">{{ currentStep.instruction }}</legend>
          <button
            v-for="answer in currentStep.answers"
            :key="answer.id"
            type="button"
            class="answer-option"
            :class="{
              selected: selectedAnswer === answer.id,
              correct: Boolean(attemptFeedback) && answer.id === attemptFeedback?.correctAnswerId,
              incorrect: Boolean(attemptFeedback) && selectedAnswer === answer.id && !isCorrect,
            }"
            :aria-pressed="selectedAnswer === answer.id"
            @click="chooseAnswer(answer.id)"
          >
            <span class="answer-marker">{{ answer.id.toUpperCase() }}</span>
            <span class="answer-copy">
              <span class="answer-arabic" lang="ar" dir="rtl">{{ answer.arabic }}</span>
              <span class="answer-arabizi">{{ answer.arabizi }}</span>
              <span v-if="showEnglishHelp" class="answer-meaning">{{ answer.meaning }}</span>
            </span>
            <Check v-if="attemptFeedback && answer.id === attemptFeedback.correctAnswerId" :size="21" aria-label="Correct answer" />
          </button>
        </fieldset>

        <div v-if="attemptFeedback" ref="feedbackPanel" tabindex="-1" class="feedback-panel" :class="isCorrect ? 'positive' : 'try-again'" aria-live="polite">
          <strong>{{ attemptFeedback.feedbackTitle }}</strong>
          <p>{{ attemptFeedback.explanation }}</p>
          <p v-if="!isCorrect && attemptFeedback.retryHint"><em>{{ attemptFeedback.retryHint }}</em></p>
        </div>

        <footer class="lesson-actions">
          <button v-if="attemptFeedback && !isCorrect" type="button" class="secondary-action" @click="retryAnswer">
            <RotateCcw :size="18" aria-hidden="true" /> Try again
          </button>
          <button v-else-if="attemptFeedback" type="button" class="primary-action lesson-check" @click="continueLesson">
            {{ currentStepIndex === lesson.steps.length - 1 ? 'Complete lesson' : 'Next step' }}
            <ChevronRight :size="20" aria-hidden="true" />
          </button>
          <button v-else type="button" class="primary-action lesson-check" :disabled="!selectedAnswer" @click="checkAnswer">
            Check answer
            <ChevronRight :size="20" aria-hidden="true" />
          </button>
        </footer>
        </div>
      </template>
    </section>
  </div>

  <CurriculumConsole v-if="consoleOpen" :inert="lessonOpen" @close="consoleOpen = false" @preview="previewLesson" />
</template>
