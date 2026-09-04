<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  BookOpen,
  BookCheck,
  Check,
  ChevronRight,
  Flame,
  Headphones,
  Home,
  LibraryBig,
  MessageCircle,
  Newspaper,
  RotateCcw,
  Sparkles,
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
  cacheDashboard,
  cacheLesson,
  getCachedDashboard,
  getCachedLesson,
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
const selectedAnswer = ref<string | null>(null)
const attemptFeedback = ref<LessonAttemptResponse | null>(null)
const apiLive = ref(false)
const lesson = ref<LessonResponse | null>(null)
const lessonLoading = ref(false)
const lessonError = ref<string | null>(null)
const currentStepIndex = ref(0)
const lessonFinished = ref(false)
const completionWasQueued = ref(false)
const pendingSyncCount = ref(0)
const accountOpen = ref(false)
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

let activeAudio: HTMLAudioElement | null = null
let playbackToken = 0

const dashboard = ref<DashboardResponse>({
  learner: { displayName: 'Maya', streakDays: 8, offlineLessonCount: 3 },
  dailyPlan: { goalMinutes: 15, completedMinutes: 8, primaryTrack: 'levantine', nextLessonId: 'levantine-day-01' },
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
const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())
const syncStatus = computed(() => {
  if (pendingSyncCount.value > 0) {
    return `${pendingSyncCount.value} completion${pendingSyncCount.value === 1 ? '' : 's'} waiting to sync`
  }
  return apiLive.value ? 'Progress synced' : 'Offline · progress stays on this device'
})

onMounted(async () => {
  window.addEventListener('online', handleOnline)
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  if (speechSupported.value) {
    loadSpeechVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadSpeechVoices)
  }

  await loadAuthSession()
  await syncPendingCompletions()
  await loadDashboard()

  const nextLessonId = dashboard.value.dailyPlan.nextLessonId
  try {
    const nextLesson = await getLesson(nextLessonId)
    await cacheLesson(nextLesson)
  } catch {
    // A previously downloaded copy remains available when the network is absent.
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('online', handleOnline)
  if (speechSupported.value) {
    window.speechSynthesis.removeEventListener('voiceschanged', loadSpeechVoices)
  }
  stopPromptAudio()
})

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
  accountOpen.value = true
}

function closeAccount() {
  if (!accountSubmitting.value) accountOpen.value = false
}

function openCurriculumConsole() {
  accountOpen.value = false
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
    accountOpen.value = false
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
    accountOpen.value = false
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
    speakingPromptId.value = null
  }

  if (step.prompt.audioUrl) {
    const audio = new Audio(step.prompt.audioUrl)
    activeAudio = audio
    audio.addEventListener('ended', finishPlayback, { once: true })
    audio.addEventListener('error', finishPlayback, { once: true })
    try {
      await audio.play()
    } catch {
      finishPlayback()
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

  if (loadedDashboard) dashboard.value = loadedDashboard

  try {
    const pending = await getPendingCompletions()
    pendingSyncCount.value = pending.length
    const pendingMinutes = pending.reduce((total, item) => total + item.estimatedMinutes, 0)
    dashboard.value.dailyPlan.completedMinutes = Math.min(
      dashboard.value.dailyPlan.goalMinutes,
      dashboard.value.dailyPlan.completedMinutes + pendingMinutes,
    )
  } catch {
    pendingSyncCount.value = 0
  }
}

async function handleOnline() {
  await syncPendingCompletions()
  await loadDashboard()
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

async function startLesson() {
  stopPromptAudio()
  lessonOpen.value = true
  selectedAnswer.value = null
  attemptFeedback.value = null
  lessonFinished.value = false
  completionWasQueued.value = false
  currentStepIndex.value = 0
  lessonError.value = null
  lessonLoading.value = true

  const lessonId = dashboard.value.dailyPlan.nextLessonId
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
  }
}

function closeLesson() {
  stopPromptAudio()
  lessonOpen.value = false
}

function chooseAnswer(id: string) {
  if (!attemptFeedback.value) selectedAnswer.value = id
}

async function checkAnswer() {
  if (!selectedAnswer.value || !lesson.value || !currentStep.value) return

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
}

function retryAnswer() {
  selectedAnswer.value = null
  attemptFeedback.value = null
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
      : step.evaluation.incorrectExplanation,
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
    return
  }

  await finishLesson()
}

async function finishLesson() {
  if (!lesson.value || lessonFinished.value) return

  stopPromptAudio()

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
      await cacheDashboard(dashboard.value)
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
  <a class="skip-link" href="#main-content">Skip to today’s lesson</a>

  <div class="app-shell">
    <aside class="side-nav" aria-label="Primary navigation">
      <a class="brand" href="#" aria-label="Ismi home">
        <span class="brand-mark" aria-hidden="true">ا</span>
        <span class="brand-word">ismi</span>
      </a>

      <nav class="nav-links">
        <a class="nav-link active" href="#" aria-current="page">
          <Home :size="21" aria-hidden="true" />
          <span>Today</span>
        </a>
        <a class="nav-link" href="#practice">
          <Headphones :size="21" aria-hidden="true" />
          <span>Practice</span>
        </a>
        <a class="nav-link" href="#words">
          <LibraryBig :size="21" aria-hidden="true" />
          <span>My words</span>
        </a>
        <button class="nav-link account-nav-link" type="button" @click="openAccount()">
          <UserRound :size="21" aria-hidden="true" />
          <span>{{ authSession.isAuthenticated ? authSession.displayName : 'Account' }}</span>
        </button>
        <button v-if="authSession.canManageCurriculum" class="nav-link account-nav-link" type="button" @click="openCurriculumConsole">
          <BookCheck :size="21" aria-hidden="true" />
          <span>Curriculum</span>
        </button>
      </nav>

      <div class="side-note">
        <Sparkles :size="18" aria-hidden="true" />
        <p><strong>One language, three lenses.</strong> Your tracks connect when it helps.</p>
      </div>
    </aside>

    <main id="main-content" class="main-content">
      <header class="mobile-header">
        <a class="brand" href="#" aria-label="Ismi home">
          <span class="brand-mark" aria-hidden="true">ا</span>
          <span class="brand-word">ismi</span>
        </a>
        <button class="profile-button" type="button" :aria-label="accountButtonLabel" @click="openAccount()">
          <UserRound :size="23" aria-hidden="true" />
        </button>
      </header>

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
          <div class="status-pill streak-pill">
            <Flame :size="19" aria-hidden="true" />
            <span><strong>{{ dashboard.learner.streakDays }}</strong> day streak</span>
          </div>
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
          <div class="lesson-visual" aria-hidden="true">
            <span class="speech-bubble bubble-one">كيف كان يومك؟</span>
            <span class="speech-bubble bubble-two">كان منيح!</span>
            <span class="lesson-visual-caption">kīf kān yōmak?</span>
          </div>

          <div class="lesson-details">
            <div class="track-label levantine-label">
              <MessageCircle :size="17" aria-hidden="true" />
              <span>{{ primaryTrack?.name ?? 'Palestinian Levantine' }} · {{ primaryTrack?.label ?? 'Unit 2' }}</span>
            </div>
            <h3>{{ primaryTrack?.currentLessonTitle ?? 'Tell them about your day' }}</h3>
            <p>Respond naturally, add one detail, and preview each prompt aloud.</p>

            <div class="skill-list" aria-label="Skills practiced">
              <span><Volume2 :size="15" aria-hidden="true" /> Listening</span>
              <span><MessageCircle :size="15" aria-hidden="true" /> Speaking</span>
            </div>

            <button class="primary-action" type="button" @click="startLesson">
              Continue in {{ primaryTrack?.name?.includes('Levantine') ? 'Levantine' : (primaryTrack?.name ?? 'your track') }}
              <ChevronRight :size="20" aria-hidden="true" />
            </button>
          </div>
        </article>
      </section>

      <section class="section-block" aria-labelledby="tracks-heading">
        <div class="section-heading compact-heading">
          <div>
            <span class="section-kicker">Your other tracks</span>
            <h2 id="tracks-heading">Keep every lens moving</h2>
          </div>
          <button class="text-button" type="button">Adjust plan</button>
        </div>

        <div class="track-grid">
          <article class="track-card msa-card">
            <div class="track-card-icon"><Newspaper :size="22" aria-hidden="true" /></div>
            <div class="track-card-copy">
              <span class="track-name">MSA · 4 min</span>
              <h3>Reading the headline</h3>
              <p>Spot the action and identify who did it.</p>
              <div class="mini-progress" aria-label="MSA unit progress: 60 percent"><span style="width: 60%"></span></div>
            </div>
            <button type="button" class="round-action" aria-label="Continue MSA lesson">
              <ChevronRight :size="20" aria-hidden="true" />
            </button>
          </article>

          <article class="track-card quran-card">
            <div class="track-card-icon"><BookOpen :size="22" aria-hidden="true" /></div>
            <div class="track-card-copy">
              <span class="track-name">Quranic · 5 min</span>
              <h3>Al-Ikhlas: core words</h3>
              <p>Connect three recurring words to their direct meaning.</p>
              <div class="mini-progress" aria-label="Quranic unit progress: 35 percent"><span style="width: 35%"></span></div>
            </div>
            <button type="button" class="round-action" aria-label="Continue Quranic Arabic lesson">
              <ChevronRight :size="20" aria-hidden="true" />
            </button>
          </article>
        </div>
      </section>

      <section id="words" class="connection-card" aria-labelledby="connection-heading">
        <div class="connection-icon" aria-hidden="true"><Sparkles :size="21" /></div>
        <div>
          <span class="section-kicker">Connection of the day</span>
          <h2 id="connection-heading">One idea, different registers</h2>
          <p><span lang="ar" dir="rtl">{{ dashboard.connection.arabic }}</span> · <strong>{{ dashboard.connection.levantine }}</strong> in conversation · <strong>{{ dashboard.connection.formal }}</strong> in MSA and Quranic Arabic</p>
        </div>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="Mobile navigation">
      <a class="active" href="#" aria-current="page"><Home :size="21" aria-hidden="true" /><span>Today</span></a>
      <a href="#practice"><Headphones :size="21" aria-hidden="true" /><span>Practice</span></a>
      <a href="#words"><LibraryBig :size="21" aria-hidden="true" /><span>Words</span></a>
      <button type="button" :aria-label="accountButtonLabel" @click="openAccount()"><UserRound :size="21" aria-hidden="true" /><span>Profile</span></button>
    </nav>
  </div>

  <div v-if="accountOpen" class="lesson-overlay" role="presentation" @click.self="closeAccount">
    <section class="account-sheet" role="dialog" aria-modal="true" aria-labelledby="account-title" @keydown.esc="closeAccount">
      <header class="account-sheet-header">
        <div>
          <span class="section-kicker">Your Ismi account</span>
          <h2 id="account-title">
            {{ authSession.isAuthenticated ? 'Account and sync' : accountMode === 'login' ? 'Welcome back' : 'Create your account' }}
          </h2>
        </div>
        <button class="close-button" type="button" aria-label="Close account" :disabled="accountSubmitting" @click="closeAccount">×</button>
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
  </div>

  <div v-if="lessonOpen" class="lesson-overlay" role="presentation" @click.self="closeLesson">
    <section class="lesson-sheet" role="dialog" aria-modal="true" aria-labelledby="lesson-title" @keydown.esc="closeLesson">
      <header class="lesson-sheet-header">
        <div>
          <span v-if="lesson && currentStep && !lessonFinished" class="section-kicker">
            Guided conversation · {{ currentStepIndex + 1 }} of {{ lesson.steps.length }}
          </span>
          <span v-else class="section-kicker">Guided conversation</span>
          <h2 id="lesson-title">{{ lesson?.title ?? 'Your lesson' }}</h2>
        </div>
        <button class="close-button" type="button" aria-label="Close lesson" @click="closeLesson">×</button>
      </header>

      <div v-if="lessonLoading" class="lesson-state" role="status">
        <span class="lesson-state-mark" aria-hidden="true">ا</span>
        <strong>Opening your downloaded lesson…</strong>
        <p>Checking for the newest reviewed copy.</p>
      </div>

      <div v-else-if="lessonError" class="lesson-state lesson-error" role="alert">
        <WifiOff :size="28" aria-hidden="true" />
        <strong>Lesson unavailable offline</strong>
        <p>{{ lessonError }}</p>
        <button class="secondary-action" type="button" @click="startLesson">Try again</button>
      </div>

      <div v-else-if="lessonFinished" class="lesson-state lesson-success" role="status">
        <span class="completion-mark"><Check :size="32" aria-hidden="true" /></span>
        <strong>Conversation complete</strong>
        <p>You practiced describing your day, adding a detail, and making a plan.</p>
        <p v-if="completionWasQueued" class="queued-note">
          Saved on this device. Ismi will sync it when you reconnect.
        </p>
        <button class="primary-action" type="button" @click="closeLesson">Back to today</button>
      </div>

      <template v-else-if="lesson && currentStep">
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
            <p class="prompt-meaning">{{ currentStep.prompt.meaning }}</p>
            <p v-if="!currentStep.prompt.audioUrl" class="audio-source-note">
              {{ deviceVoiceDescription }}
            </p>
          </div>
        </div>

        <fieldset class="answer-group" :disabled="Boolean(attemptFeedback)">
          <legend>{{ currentStep.instruction }}</legend>
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
              <span class="answer-meaning">{{ answer.meaning }}</span>
            </span>
            <Check v-if="attemptFeedback && answer.id === attemptFeedback.correctAnswerId" :size="21" aria-label="Correct answer" />
          </button>
        </fieldset>

        <div v-if="attemptFeedback" class="feedback-panel" :class="isCorrect ? 'positive' : 'try-again'" aria-live="polite">
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
      </template>
    </section>
  </div>

  <CurriculumConsole v-if="consoleOpen" @close="consoleOpen = false" />
</template>
