<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  BookOpen,
  BookCheck,
  Check,
  ChevronRight,
  Flame,
  Headphones,
  Home,
  RotateCcw,
  Search,
  Settings2,
  Trophy,
  UserPlus,
  UserRound,
  Volume2,
  WifiOff,
  Clapperboard,
} from '@lucide/vue';
import CurriculumConsole from './CurriculumConsole.vue';
import StudySettings from './StudySettings.vue';
import LearningHabits from './LearningHabits.vue';
import { useLearningHabits } from './useLearningHabits';
import { emptyReviewAvailability, streakSummary, type QuestTask, type StudyActivity } from './learningHabits';
import LoadingWords from './LoadingWords.vue';
import PlacementCheck from './PlacementCheck.vue';
import { buildStudyPlan, type TrackId } from './studyPlan';
import { courses, courseFor, textAttributes, readableLesson } from './courses';
import { loadStartedLesson, storeStartedLesson, type StartedLesson, type TeachingCheckpoint } from './lessonSessions';
import CourseSwitcher from './CourseSwitcher.vue';
import PublicationNotice from './PublicationNotice.vue';
import { ApiRequestError } from './api';
import { useStudySettings } from './useStudySettings';
import LessonTeaching from './LessonTeaching.vue';
import PhraseBuilder from './PhraseBuilder.vue';
import LessonTransition from './LessonTransition.vue';
import LessonStages from './LessonStages.vue';
import LessonScroll from './LessonScroll.vue';
import SoundToggle from './SoundToggle.vue';
import ReviewPractice from './ReviewPractice.vue';
import RecallPractice from './RecallPractice.vue';
import LearnedWords from './LearnedWords.vue';
import CulturalPicks from './CulturalPicks.vue';
import AlphabetExplorer from './AlphabetExplorer.vue';
import BackControl from './BackControl.vue';
import CharacterCast from './CharacterCast.vue';
import CharacterCue from './CharacterCue.vue';
import CharacterPortrait from './CharacterPortrait.vue';
import { isLearnerRoute } from './routes';
import { appVersionLabel } from './version';
import { evaluateOffline } from './evaluation';
import { installUiSounds, playUiSound } from './uiSounds';
import {
  getAuthSession,
  getDashboard,
  getLesson,
  loginAccount,
  logoutAccount,
  registerAccount,
  submitLessonAttempt,
  submitLessonCompletion,
} from './api';
import {
  recordingPlaybackUrl,
  cacheDashboard,
  migrateLegacyDashboard,
  cacheLesson,
  getCachedDashboard,
  getCachedLesson,
  getCachedLessonCount,
  removeCachedLesson,
  getPendingCompletions,
  queueCompletion,
  removePendingCompletion,
  getDeviceSnapshot,
  saveDeviceSnapshot,
  updateDeviceSnapshot,
  saveReviewAttempt,
} from './offline';
import type {
  AuthSession,
  DashboardResponse,
  LessonAttemptResponse,
  LessonResponse,
  PendingCompletion,
} from './types';

const studySettings = useStudySettings();
const learningHabits = useLearningHabits();
const habitNow = ref(Date.now());
let habitClock: ReturnType<typeof setInterval> | undefined;
const questReview = ref<InstanceType<typeof ReviewPractice> | null>(null);
const questReviewAvailability = ref(emptyReviewAvailability());
const offlineQuestLessonIds = ref<string[]>([]);
const lessonOpen = ref(false);
const previewMode = ref(false);
const practiceMode = ref(false);
const reviewOpen = ref(false);
const reviewAudioPlaying = ref(false);
const alphabetAudioPlaying = ref(false);
const reviewScope = ref('guest');
const dashboardScope = ref('');
const startupLoading = ref(true);
const dashboardLoads = ref(0);
const dashboardUnavailable = ref(false);
const dashboardLoading = computed(() => startupLoading.value || dashboardLoads.value > 0);
const initialDashboardLoading = computed(() => dashboardLoading.value && dashboardScope.value !== reviewScope.value);
const studyPageAvailable = computed(() => !initialDashboardLoading.value && !dashboardUnavailable.value);
const reviewHistoryError = ref('');
const reviewHistoryRevision = ref(0);
let stepAttemptCount = 0;
const introductionOpen = ref(false);
const glossaryCardIndex = ref<number | undefined>();
const teachingWasCompleted = ref(false);
const buildComplete = ref(false);
const showEnglishHelp = ref(false);
const practiceHelpUsed = ref(false);
const showAnswerMeanings = ref(false);
const responseMode = ref<'recall' | 'choose' | 'build'>('recall');
const checkingAnswer = ref(false);
const retryCount = ref(0);
let lessonOpener: HTMLElement | null = null;
let lessonSession = 0;
let lessonActivityId = '';
let lessonActivityScope = 'guest';
const teachingCheckpoint = ref<TeachingCheckpoint>();
const savedPieces = ref<string[]>([]);
const resumableLessonId = ref<string>();
let restoringLesson = false;
const selectedAnswer = ref<string | null>(null);
const attemptFeedback = ref<LessonAttemptResponse | null>(null);
const apiLive = ref(false);
const lesson = ref<LessonResponse | null>(null);
const lessonLoading = ref(false);
const lessonError = ref<string | null>(null);
const downloadError = ref<string | null>(null);
const currentStepIndex = ref(0);
const lessonFinished = ref(false);
const completionWasQueued = ref(false);
// Session-only facts, never inferred mastery or a score for spoken recall.
const sessionResponses = ref<Record<string, { firstCorrect: boolean; helpUsed: boolean }>>({});
const dailyGoalReached = ref(false);
const completionSummary = computed(() => {
  const responses = Object.values(sessionResponses.value);
  return {
    total: responses.length,
    firstCorrect: responses.filter(item => item.firstCorrect).length,
    helped: responses.filter(item => item.helpUsed).length,
    phrases: (lesson.value?.steps ?? [])
      .filter(step => sessionResponses.value[step.id])
      .map(step => step.answers.find(answer => answer.id.toLowerCase() === step.evaluation.correctAnswerId.toLowerCase()))
      .filter(answer => Boolean(answer)),
  };
});
const pendingSyncCount = ref(0);
type PageName = 'today' | 'courses' | 'practice' | 'practice-review' | 'practice-checkpoints' | 'practice-recall' | 'practice-lessons' | 'practice-culture' | 'practice-alphabet' | 'progress' | 'words' | 'account';
const pageNames: Record<string, PageName> = {
  today: 'today', courses: 'courses', practice: 'practice', 'practice/review': 'practice-review',
  'practice/checkpoints': 'practice-checkpoints', 'practice/recall': 'practice-recall', 'practice/lessons': 'practice-lessons',
  'practice/culture': 'practice-culture', 'practice/alphabet': 'practice-alphabet',
  progress: 'progress', words: 'words', account: 'account',
};
const pageTitles: Record<PageName, string> = {
  today: 'Today', courses: 'Courses', practice: 'Practice', 'practice-review': 'Review',
  'practice-checkpoints': 'Checkpoints', 'practice-recall': 'Recall', 'practice-lessons': 'Lesson practice',
  'practice-culture': 'Watch & listen', 'practice-alphabet': 'Alphabet',
  progress: 'Progress', words: 'Learned words', account: 'Account',
};
const navigation = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'practice', label: 'Practice', icon: Headphones },
  { id: 'progress', label: 'Progress', icon: Trophy },
  { id: 'words', label: 'Words', icon: Search },
] as const;
function readPage(): PageName {
  const path = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (/^practice\/culture(?:\/[a-z0-9][a-z0-9-]{0,79})?$/.test(path)) return 'practice-culture';
  if (/^practice\/alphabet(?:\/[a-z0-9][a-z0-9-]{0,79})?$/.test(path)) return 'practice-alphabet';
  return pageNames[path] ?? 'today';
}
const page = ref<PageName>(readPage());
const culturalEditionId = ref<string | null>(window.location.hash.split('/')[3] ?? null);
const primaryPage = computed(() => page.value.startsWith('practice') ? 'practice' : page.value);
const pageTitle = computed(() => pageTitles[page.value]);
const reviewView = computed(() => page.value === 'practice' ? 'tiles' : page.value === 'practice-review' ? 'review' : page.value === 'practice-checkpoints' ? 'checkpoints' : 'hidden');
const recallView = computed(() => page.value === 'practice' ? 'tile' : page.value === 'practice-recall' ? 'recall' : page.value === 'progress' ? 'can-do' : 'hidden');
const practiceChild = computed(() => page.value.startsWith('practice-') && page.value !== 'practice-culture' && page.value !== 'practice-alphabet');
function navigate(destination: PageName) {
  window.location.hash = `/${Object.keys(pageNames).find(path => pageNames[path] === destination) ?? destination}`;
}
async function handlePageChange() {
  if (!isLearnerRoute(window.location.hash)) return;
  const destination = readPage();
  const oldEditionId = culturalEditionId.value;
  culturalEditionId.value = destination === 'practice-culture' ? window.location.hash.split('/')[3] ?? null : null;
  if (page.value === destination && oldEditionId === culturalEditionId.value) return;
  stopPromptAudio();
  lessonOpen.value = false;
  page.value = destination;
  accountPassword.value = '';
  document.title = `${pageTitle.value} · Ismi`;
  await nextTick();
  window.scrollTo({ top: 0, behavior: 'instant' });
  document
    .querySelector<HTMLElement>('#main-content')
    ?.focus({ preventScroll: true });
}
const consoleOpen = ref(false);
let consoleOpener: HTMLElement | null = null;
const accountMode = ref<'login' | 'register'>('login');
const accountSubmitting = ref(false);
const accountError = ref<string | null>(null);
const accountDisplayName = ref('');
const accountEmail = ref('');
const accountPassword = ref('');
const rememberAccount = ref(false);
const authSession = ref<AuthSession>({
  isAuthenticated: false,
  userId: null,
  displayName: null,
  email: null,
  canManageCurriculum: false,
});
const speechSupported = ref(false);
const speechVoices = ref<SpeechSynthesisVoice[]>([]);
const speakingPromptId = ref<string | null>(null);
let removeUiSounds: (() => void) | undefined;
const lessonCloseButton = ref<HTMLButtonElement | null>(null);
const practiceHeading = ref<HTMLElement | null>(null);
const feedbackPanel = ref<HTMLElement | null>(null);
const completionHeading = ref<HTMLElement | null>(null);

const audioError = ref<string | null>(null);
let activeObjectUrl: string | null = null;
let activeAudio: HTMLAudioElement | null = null;
let playbackToken = 0;

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
  connection: {
    arabic: 'يَوْم',
    levantine: 'yōm',
    formal: 'yawm',
    meaning: 'day',
  },
});

const buildSuggested = computed(() =>
  Boolean(
    lesson.value &&
    currentStep.value &&
    lesson.value.steps.length > 1 &&
    (currentStepIndex.value % 3 === 1 ||
      currentStepIndex.value >= lesson.value.steps.length - 2) &&
    currentStep.value.answers
      .find(
        (a) =>
          a.id.toLowerCase() ===
          currentStep.value?.evaluation.correctAnswerId.toLowerCase(),
      )
      && (lesson.value.trackId === 'khmer' ? Boolean(currentStep.value.answers.find(a => a.id === currentStep.value?.evaluation.correctAnswerId)?.segments?.length) : currentStep.value.answers.find(a => a.id === currentStep.value?.evaluation.correctAnswerId)?.arabic.trim().includes(' ')),
  ),
);
function resetPracticeSupport() {
  stepAttemptCount = 0;
  practiceHelpUsed.value = false;
  buildComplete.value = false;
  savedPieces.value = [];
  showEnglishHelp.value = false;
  showAnswerMeanings.value = false;
  responseMode.value = buildSuggested.value ? 'build' : 'recall';
}
async function showChoices() {
  practiceHelpUsed.value = true;
  buildComplete.value = false;
  responseMode.value = 'choose';
  selectedAnswer.value = null;
  await nextTick();
  focusPractice();
}
const currentStep = computed(
  () => lesson.value?.steps[currentStepIndex.value] ?? null,
);
const viewedCourse = ref<TrackId>('levantine');
const viewedReady = ref(false);
const lastCourses = ref<Record<string, string>>({});
const courseStorageError = ref('');
const activeCourse = computed(() => courseFor(viewedCourse.value));
const lessonCourse = computed(() => courseFor(lesson.value?.trackId));
const activeLessons = computed(() => dashboardScope.value === reviewScope.value
  ? dashboard.value.dailyPlan.lessons.filter(item => (item.trackId ?? 'levantine') === viewedCourse.value) : []);
let courseGeneration = 0;
watch(reviewScope, async scope => {
  const token = ++courseGeneration;
  viewedReady.value = false;
  viewedCourse.value = 'levantine';
  lastCourses.value = {};
  try {
    const [saved, previous] = await Promise.all([getDeviceSnapshot<TrackId>(`viewed-course-v1:${scope}`),
      getDeviceSnapshot<Record<string, string>>(`viewed-language-courses-v1:${scope}`)]);
    if (token !== courseGeneration) return;
    lastCourses.value = previous ?? {};
    if (courses.some(c => c.id === saved)) viewedCourse.value = saved!;
  } catch { courseStorageError.value = 'Course selection cannot be saved on this device.'; }
  if (token === courseGeneration) viewedReady.value = true;
}, { immediate: true });
async function switchViewedCourse(id: string) {
  if (!courses.some(c => c.id === id)) return;
  stopPromptAudio();
  viewedCourse.value = id as TrackId;
  const scope = reviewScope.value;
  lastCourses.value = { ...lastCourses.value, [courseFor(id).languageId]: id };
  try {
    await saveDeviceSnapshot(`viewed-course-v1:${scope}`, id);
    await saveDeviceSnapshot(`viewed-language-courses-v1:${scope}`, lastCourses.value);
  }
  catch { courseStorageError.value = 'Course selection cannot be saved on this device.'; }
}
watch(reviewScope, () => {
  if (lessonOpen.value) closeLesson();
  lesson.value = null;
  resumableLessonId.value = undefined;
});
const plannedReview = ref<InstanceType<typeof ReviewPractice> | null>(null);
const dueByCourse = ref<Record<string, number>>({});
const planReviewAvailability = ref(emptyReviewAvailability());
const studyDay = computed(() => new Date(habitNow.value).toISOString().slice(0, 10));
const dailyReviewSessions = ref<string[]>([]);
const dailyReviewMinutes = computed(() => dailyReviewSessions.value.length * 5);
watch([reviewScope, studyDay], async ([scope, day]) => {
  dailyReviewSessions.value = [];
  try {
    const sessions = await getDeviceSnapshot<string[]>(`daily-review-time-v1:${scope}:${day}`);
    if (scope === reviewScope.value && day === studyDay.value) dailyReviewSessions.value = sessions ?? [];
  } catch { /* In-memory sessions still count for this visit. */ }
}, { immediate: true });
const studyPlan = computed(() => buildStudyPlan(studySettings.preferences.value, dashboard.value.dailyPlan.lessons, studyDay.value, dueByCourse.value, dailyReviewMinutes.value));
const todayReviewLessons = computed(() => dashboard.value.dailyPlan.lessons.filter(item =>
  studySettings.preferences.value.selectedTrackIds.some(id => id === (item.trackId ?? 'levantine')),
));
const hubReviewLessons = computed(() => activeLessons.value);
const streak = computed(() => streakSummary(learningHabits.state.value, habitNow.value));
const questsDone = computed(() => learningHabits.state.value.tasks.filter(task => task.completedBy).length);
const dailyGoal = computed(() => studySettings.preferences.value.goalMinutes);
const questLessons = computed(() => dashboardScope.value === reviewScope.value
  ? todayReviewLessons.value.filter(item => apiLive.value || offlineQuestLessonIds.value.includes(item.id)) : []);
watch(reviewScope, scope => {
  learningHabits.load(scope);
  dueByCourse.value = {};
  planReviewAvailability.value = emptyReviewAvailability();
  questReviewAvailability.value = emptyReviewAvailability();
  offlineQuestLessonIds.value = [];
}, { immediate: true });
watch(() => [learningHabits.state.value.questsEnabled, studySettings.preferences.value,
  questLessons.value, planReviewAvailability.value, habitNow.value, studySettings.busy.value, page.value] as const, () => {
  if (studyPageAvailable.value && !studySettings.busy.value)
    learningHabits.plan(studySettings.preferences.value, questLessons.value, planReviewAvailability.value);
}, { deep: true });
function updateHabitClock() {
  habitNow.value = Date.now();
  learningHabits.refresh();
}
function handleHabitStorage(event: StorageEvent) {
  if (event.key === null || event.key === `ismi-learning-habits-v1:${reviewScope.value}`) updateHabitClock();
}
function creditStudyActivity(activity: StudyActivity, scope: string) {
  learningHabits.credit(activity, scope);
  if (activity.kind !== 'lesson' && scope === reviewScope.value && activity.completedAt.slice(0, 10) === studyDay.value) {
    if (!dailyReviewSessions.value.includes(activity.id)) dailyReviewSessions.value.push(activity.id);
    const day = studyDay.value;
    void updateDeviceSnapshot<string[]>(`daily-review-time-v1:${scope}:${day}`, saved => [...new Set([...(saved ?? []), activity.id])])
      .then(() => getDeviceSnapshot<string[]>(`daily-review-time-v1:${scope}:${day}`))
      .then(saved => { if (scope === reviewScope.value && day === studyDay.value) dailyReviewSessions.value = saved ?? dailyReviewSessions.value; })
      .catch(() => { /* Current-session minutes remain visible when storage is unavailable. */ });
  }
}
async function startQuest(task: QuestTask) {
  if (task.kind === 'lesson') await startLesson(task.lessonId);
  else await plannedReview.value?.start(task.kind === 'checkpoint' ? 'checkpoint' : task.due ? 'due' : 'mixed', task.unitId);
}
async function refreshOfflineQuestLessons() {
  const scope = reviewScope.value;
  const ids: string[] = [];
  for (const item of todayReviewLessons.value) {
    try { if (await getCachedLesson(item.id)) ids.push(item.id); } catch { /* Unavailable offline. */ }
  }
  if (scope === reviewScope.value) offlineQuestLessonIds.value = ids;
}
const dailyCompleted = computed(() => Math.min(dailyGoal.value,
  (dashboard.value.dailyPlan.studyMinutesToday ?? dashboard.value.dailyPlan.completedMinutes) + dailyReviewMinutes.value));
const nextStudyLesson = computed(() => {
  const scheduled = studyPlan.value.queue.find(item => (item.trackId ?? 'levantine') === viewedCourse.value);
  if (scheduled) return scheduled;
  // Viewing a course is independent of the daily allocation. Keep manual entry
  // available for unselected/omitted courses and when review takes today's slot.
  return activeLessons.value.find(item => !item.isCompleted) ?? activeLessons.value.at(-1);
});
const manualCourseStudy = computed(() => Boolean(nextStudyLesson.value
  && !studyPlan.value.queue.some(item => item.id === nextStudyLesson.value!.id)));
const upcomingPlanLessons = computed(() => studyPlan.value.queue.filter(item => item.id !== nextStudyLesson.value?.id));
const nextStudyTrack = computed(() => ({ name: activeCourse.value.name }));
const isCorrect = computed(() => attemptFeedback.value?.isCorrect ?? false);
const selectedArabicVoice = computed(() => {
  const exactLocalePreferences = lessonCourse.value.id === 'levantine' ? ['ar-PS', 'ar-JO', 'ar-LB', 'ar-IL'] : [lessonCourse.value.audioLocale];

  for (const locale of exactLocalePreferences) {
    const match = speechVoices.value.find(
      (voice) =>
        voice.lang.localeCompare(locale, undefined, {
          sensitivity: 'accent',
        }) === 0,
    );
    if (match) return match;
  }

  return (
    speechVoices.value.find((voice) =>
      voice.lang.toLowerCase().split('-')[0] === lessonCourse.value.tag.split('-')[0],
    ) ?? null
  );
});
const currentPromptIsPlaying = computed(
  () => speakingPromptId.value === currentStep.value?.id,
);
const canPlayCurrentPrompt = computed(
  () => !lesson.value?.publicationNotice && (Boolean(currentStep.value?.prompt.audioUrl) || (speechSupported.value && Boolean(selectedArabicVoice.value))),
);
const audioButtonLabel = computed(() => {
  if (lesson.value?.publicationNotice) return 'Text-only preview · audio unavailable';
  if (currentPromptIsPlaying.value) return `Stop ${lessonCourse.value.languageName} audio`;
  if (currentStep.value?.prompt.audioUrl)
    return `Play the recorded ${lessonCourse.value.languageName} prompt`;
  if (!speechSupported.value)
    return 'Device speech is not supported in this browser';
  if (selectedArabicVoice.value) {
    return `Play ${lessonCourse.value.languageName} using the ${selectedArabicVoice.value.name} device voice`;
  }
  return `No ${lessonCourse.value.languageName} device voice available; read the transcript`;
});
const deviceVoiceDescription = computed(() => {
  if (lesson.value?.publicationNotice) return 'Text-only preview. Read the transcript and continue.';
  if (!speechSupported.value)
    return 'Device speech is unavailable in this browser.';
  if (selectedArabicVoice.value) {
    return `Device voice preview · ${selectedArabicVoice.value.name} (${selectedArabicVoice.value.lang})`;
  }
  return `No ${lessonCourse.value.languageName} device voice available. Read the transcript and continue.`;
});
const progressPercent = computed(() =>
  Math.min(
    100,
    Math.round(
      (dailyCompleted.value / dailyGoal.value) *
        100,
    ),
  ),
);
const courseUnits = computed(() => {
  const units = new Map<
    string,
    {
      id: string;
      title: string;
      lessons: DashboardResponse['dailyPlan']['lessons'];
    }
  >();
  for (const item of activeLessons.value) {
    if (!units.has(item.unitId))
      units.set(item.unitId, {
        id: item.unitId,
        title: item.unitTitle,
        lessons: [],
      });
    units.get(item.unitId)!.lessons.push(item);
  }
  return [...units.values()];
});
const completedCourseLessons = computed(
  () =>
    activeLessons.value.filter((item) => item.isCompleted).length,
);
const courseProgressLabel = computed(
  () =>
    `${completedCourseLessons.value} of ${activeLessons.value.length} lessons complete`,
);
const syncStatus = computed(() => {
  if (pendingSyncCount.value > 0) {
    return `${pendingSyncCount.value} completion${pendingSyncCount.value === 1 ? '' : 's'} waiting to sync`;
  }
  return apiLive.value
    ? 'Progress synced'
    : 'Offline · progress stays on this device';
});

onMounted(async () => {
  habitClock = setInterval(updateHabitClock, 30_000);
  window.addEventListener('focus', updateHabitClock);
  window.addEventListener('storage', handleHabitStorage);
  try {
    localStorage.setItem('ismi-learner-visited', 'yes');
  } catch {
    /* Study works without localStorage. */
  }
  removeUiSounds = installUiSounds(
    () => speakingPromptId.value !== null || reviewAudioPlaying.value || alphabetAudioPlaying.value,
  );
  window.addEventListener('online', handleOnline);
  window.addEventListener('hashchange', handlePageChange);
  document.title = `${pageTitle.value} · Ismi`;
  speechSupported.value =
    'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  if (speechSupported.value) {
    loadSpeechVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadSpeechVoices);
  }

  try { await migrateLegacyDashboard(); } catch { /* Existing online study remains available. */ }
  try {
    await loadAuthSession();
    await syncPendingCompletions();
    await loadDashboard();
  } finally {
    startupLoading.value = false;
  }
  await cacheUpcomingLessons();
});

onBeforeUnmount(() => {
  clearInterval(habitClock);
  window.removeEventListener('focus', updateHabitClock);
  window.removeEventListener('storage', handleHabitStorage);
  removeUiSounds?.();
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('hashchange', handlePageChange);
  if (speechSupported.value) {
    window.speechSynthesis.removeEventListener(
      'voiceschanged',
      loadSpeechVoices,
    );
  }
  stopPromptAudio();
});

function focusMain() {
  document.querySelector<HTMLElement>('#main-content')?.focus();
}

function loadSpeechVoices() {
  speechVoices.value = window.speechSynthesis.getVoices();
}

async function loadAuthSession() {
  try {
    authSession.value = await getAuthSession();
    reviewScope.value = authSession.value.userId
      ? `user:${authSession.value.userId}`
      : 'guest';
    try {
      await saveDeviceSnapshot('review-scope', reviewScope.value);
    } catch {
      /* Review can run in memory. */
    }
  } catch {
    try {
      reviewScope.value =
        (await getDeviceSnapshot<string>('review-scope')) ?? 'guest';
    } catch {
      reviewScope.value = 'guest';
    }
    authSession.value = {
      isAuthenticated: false,
      userId: null,
      displayName: null,
      email: null,
      canManageCurriculum: false,
    };
  }
}

function openAccount(mode: 'login' | 'register' = 'login') {
  accountMode.value = mode;
  accountError.value = null;
  accountPassword.value = '';
  navigate('account');
}

function closeAccount() {
  if (!accountSubmitting.value) navigate('today');
}

function openCurriculumConsole() {
  consoleOpener = document.activeElement as HTMLElement | null;
  consoleOpen.value = true;
}

async function closeCurriculumConsole() {
  consoleOpen.value = false;
  await nextTick();
  (consoleOpener?.isConnected ? consoleOpener : document.querySelector<HTMLElement>('#main-content'))?.focus({ preventScroll: true });
}

function selectAccountMode(mode: 'login' | 'register') {
  accountMode.value = mode;
  accountError.value = null;
  accountPassword.value = '';
}

async function submitAccount() {
  if (studySettings.busy.value) return;
  accountSubmitting.value = true;
  accountError.value = null;

  try {
    authSession.value =
      accountMode.value === 'register'
        ? await registerAccount(
            accountDisplayName.value,
            accountEmail.value,
            accountPassword.value,
          )
        : await loginAccount(
            accountEmail.value,
            accountPassword.value,
            rememberAccount.value,
          );
    accountPassword.value = '';
    reviewScope.value = authSession.value.userId
      ? `user:${authSession.value.userId}`
      : 'guest';
    try {
      await saveDeviceSnapshot('review-scope', reviewScope.value);
    } catch {
      /* Learning remains available. */
    }
    await syncPendingCompletions();
    await loadDashboard();
    await cacheUpcomingLessons();
    navigate('today');
  } catch (error) {
    accountError.value =
      error instanceof Error
        ? error.message
        : 'Could not finish that account request. Try again.';
  } finally {
    accountSubmitting.value = false;
  }
}

async function signOut() {
  if (studySettings.busy.value) return;
  accountSubmitting.value = true;
  accountError.value = null;

  try {
    await logoutAccount();
    await loadAuthSession();
    await loadDashboard();
    navigate('today');
  } catch (error) {
    accountError.value =
      error instanceof Error ? error.message : 'Could not sign out. Try again.';
  } finally {
    accountSubmitting.value = false;
  }
}

function stopPromptAudio() {
  playbackToken += 1;
  audioError.value = null;
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  activeObjectUrl = null;

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if (speechSupported.value) window.speechSynthesis.cancel();
  speakingPromptId.value = null;
}

async function playPromptAudio() {
  const step = currentStep.value;
  if (!step || !canPlayCurrentPrompt.value) return;

  if (currentPromptIsPlaying.value) {
    stopPromptAudio();
    return;
  }

  stopPromptAudio();
  const token = playbackToken;
  speakingPromptId.value = step.id;

  const finishPlayback = () => {
    if (token !== playbackToken) return;
    activeAudio = null;
    if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
    speakingPromptId.value = null;
  };

  if (step.prompt.audioUrl) {
    const url = await recordingPlaybackUrl(step.prompt.audioUrl);
    if (token !== playbackToken) {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      return;
    }
    activeObjectUrl = url.startsWith('blob:') ? url : null;
    const audio = new Audio(url);
    const failPlayback = () => {
      if (token !== playbackToken) return;
      audioError.value =
        'The recording could not play. You can read the transcript and continue, or try again.';
      finishPlayback();
    };
    activeAudio = audio;
    audio.addEventListener('ended', finishPlayback, { once: true });
    audio.addEventListener('error', failPlayback, { once: true });
    try {
      await audio.play();
    } catch {
      failPlayback();
    }
    return;
  }

  const utterance = new SpeechSynthesisUtterance(step.prompt.arabic);
  utterance.lang = selectedArabicVoice.value?.lang ?? lessonCourse.value.audioLocale;
  utterance.rate = 0.9;
  if (selectedArabicVoice.value) utterance.voice = selectedArabicVoice.value;
  utterance.addEventListener('end', finishPlayback, { once: true });
  utterance.addEventListener('error', finishPlayback, { once: true });
  window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
}

async function loadDashboard() {
  dashboardLoads.value++;
  try {
    await loadDashboardData();
  } finally {
    dashboardLoads.value--;
  }
}

async function loadDashboardData() {
  const scope = reviewScope.value;
  await studySettings.load(reviewScope.value, authSession.value.isAuthenticated);
  let loadedDashboard: DashboardResponse | undefined;

  try {
    loadedDashboard = await getDashboard();
    if (scope !== reviewScope.value) return;
    apiLive.value = true;
    try {
      await cacheDashboard(loadedDashboard, reviewScope.value);
    } catch {
      // The live dashboard is still usable when device storage is unavailable.
    }
  } catch {
    apiLive.value = false;
    try {
      loadedDashboard = await getCachedDashboard(scope);
    } catch {
      loadedDashboard = undefined;
    }
  }

  if (scope !== reviewScope.value) return;
  dashboardUnavailable.value = !loadedDashboard && dashboardScope.value !== scope;
  if (loadedDashboard) {
    loadedDashboard.dailyPlan.lessons ??= [];
    const today = new Date().toISOString().slice(0, 10);
    if (loadedDashboard.dailyPlan.studyDate && loadedDashboard.dailyPlan.studyDate !== today) {
      loadedDashboard.dailyPlan.studyMinutesToday = 0;
      loadedDashboard.dailyPlan.completedMinutes = 0;
      loadedDashboard.dailyPlan.lessons.forEach(item => { item.completedToday = false; });
    }
    loadedDashboard.dailyPlan.studyDate = today;
    dashboard.value = loadedDashboard;
    dashboardScope.value = scope;
  }

  try {
    const pending = await getPendingCompletions(reviewScope.value);
    pendingSyncCount.value = pending.length;
    const completedIds = new Set(
      dashboard.value.dailyPlan.lessons
        .filter((item) => item.isCompleted)
        .map((item) => item.id),
    );
    const pendingMinutes = pending
      .filter((item) => !completedIds.has(item.lessonId) && item.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10))
      .reduce((total, item) => total + item.estimatedMinutes, 0);
    dashboard.value.dailyPlan.studyMinutesToday =
      (dashboard.value.dailyPlan.studyMinutesToday ?? dashboard.value.dailyPlan.completedMinutes) + pendingMinutes;
    dashboard.value.dailyPlan.completedMinutes = dailyCompleted.value;
    for (const completion of pending) {
      await markLessonCompletedLocally(completion.lessonId, completion.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10));
    }
  } catch {
    pendingSyncCount.value = 0;
  }
  await refreshOfflineQuestLessons();
}

async function cacheUpcomingLessons() {
  if (!apiLive.value) return;

  downloadError.value = null;
  const upcoming = studyPlan.value.queue;
  for (const item of upcoming) {
    try {
      await cacheLesson(await getLesson(item.id));
    } catch {
      downloadError.value =
        'Some lesson downloads could not finish. Previously downloaded lessons remain available. Reconnect to retry.';
      break;
    }
  }

  try {
    dashboard.value.learner.offlineLessonCount = await getCachedLessonCount();
    await cacheDashboard(dashboard.value, reviewScope.value);
  } catch {
    // Learning remains available when storage reporting is unavailable.
  }
  await refreshOfflineQuestLessons();
}

async function markLessonCompletedLocally(lessonId: string, completedToday = true) {
  const completed = dashboard.value.dailyPlan.lessons.find(
    (item) => item.id === lessonId,
  );
  if (completed) {
    completed.isCompleted = true;
    completed.completedToday = completedToday;
    completed.isCurrent = false;
  }
  for (const track of dashboard.value.tracks) {
    const items = dashboard.value.dailyPlan.lessons.filter(item => (item.trackId ?? 'levantine') === track.id);
    const next = items.find(item => !item.isCompleted) ?? items.at(-1);
    for (const item of items) item.isCurrent = item.id === next?.id;
    if (next) {
      track.currentLessonTitle = next.title; track.label = next.unitTitle; track.plannedMinutes = next.estimatedMinutes;
      track.progressPercent = Math.round(items.filter(item => item.isCompleted).length * 100 / items.length);
    }
  }
  try {
    await cacheDashboard(dashboard.value, reviewScope.value);
  } catch {
    // The completion event remains the durable offline source of truth.
  }
}

async function handleOnline() {
  if (studySettings.busy.value || accountSubmitting.value) return;
  await loadAuthSession();
  await syncPendingCompletions();
  await loadDashboard();
  await cacheUpcomingLessons();
}

async function syncPendingCompletions() {
  if (!navigator.onLine) return;

  let pending: PendingCompletion[];
  try {
    pending = await getPendingCompletions(reviewScope.value);
  } catch {
    return;
  }

  for (const completion of pending) {
    try {
      await submitLessonCompletion(
        completion.lessonId,
        completion.completionId,
        completion.completedAt,
      );
      apiLive.value = true;
    } catch {
      apiLive.value = false;
      break;
    }

    try {
      await removePendingCompletion(completion.completionId);
    } catch {
      // The server endpoint is idempotent, so this event can be retried safely.
      break;
    }
  }

  try {
    pendingSyncCount.value = (await getPendingCompletions(reviewScope.value)).length;
  } catch {
    pendingSyncCount.value = 0;
  }
}

async function previewLesson(draft: LessonResponse, opener: HTMLElement) {
  teachingCheckpoint.value = undefined;
  savedPieces.value = [];
  glossaryCardIndex.value = undefined;
  lessonSession++;
  checkingAnswer.value = false;
  lessonOpener = opener;
  stopPromptAudio();
  previewMode.value = true;
  practiceMode.value = false;
  teachingWasCompleted.value = false;
  showEnglishHelp.value = false;
  lesson.value = readableLesson(draft);
  lessonOpen.value = true;
  introductionOpen.value = true;
  selectedAnswer.value = null;
  attemptFeedback.value = null;
  lessonFinished.value = false;
  completionWasQueued.value = false;
  sessionResponses.value = {};
  dailyGoalReached.value = false;
  currentStepIndex.value = 0;
  resetPracticeSupport();
  lessonError.value = null;
  lessonLoading.value = false;
  await nextTick();
  lessonCloseButton.value?.focus();
}

async function openGlossaryLesson(id: string, cardIndex: number) {
  await startLesson(id, true, cardIndex);
}

async function saveStartedLesson() {
  if (!lesson.value || previewMode.value || lessonLoading.value || restoringLesson) return;
  const scope = lessonActivityScope;
  const state: StartedLesson | null = lessonFinished.value ? null : {
    lessonId: lesson.value.id, version: lesson.value.version, stepIndex: currentStepIndex.value,
    introductionOpen: introductionOpen.value, teachingWasCompleted: teachingWasCompleted.value,
    practiceMode: practiceMode.value, responseMode: responseMode.value, selectedAnswer: selectedAnswer.value,
    feedback: attemptFeedback.value, help: showEnglishHelp.value, answerHelp: showAnswerMeanings.value,
    practiceHelpUsed: practiceHelpUsed.value, retryCount: retryCount.value, buildComplete: buildComplete.value,
    pieces: savedPieces.value, teaching: teachingCheckpoint.value, responses: sessionResponses.value,
  };
  try { await storeStartedLesson(scope, lesson.value.trackId, state); }
  catch { /* An open lesson remains usable when device storage is unavailable. */ }
}
watch([currentStepIndex, introductionOpen, responseMode, selectedAnswer, attemptFeedback, showEnglishHelp,
  showAnswerMeanings, teachingCheckpoint, savedPieces, lessonFinished], () => {
  if (lessonOpen.value && !restoringLesson) void saveStartedLesson();
}, { deep: true });
watch([viewedCourse, reviewScope, reviewHistoryRevision], async () => {
  const scope = reviewScope.value, course = viewedCourse.value;
  try {
    const saved = await loadStartedLesson(scope, course);
    if (scope === reviewScope.value && course === viewedCourse.value) resumableLessonId.value = saved?.lessonId;
  } catch { resumableLessonId.value = undefined; }
}, { immediate: true });

async function startLesson(requestedId?: string, practiceOnly = false, cardIndex?: number) {
  restoringLesson = true;
  teachingCheckpoint.value = undefined;
  savedPieces.value = [];
  glossaryCardIndex.value = cardIndex;
  const session = ++lessonSession;
  lessonActivityId = crypto.randomUUID();
  lessonActivityScope = reviewScope.value;
  checkingAnswer.value = false;
  lessonOpener = document.activeElement as HTMLElement | null;
  previewMode.value = false;
  teachingWasCompleted.value = false;
  practiceMode.value =
    practiceOnly ||
    Boolean(
      dashboard.value.dailyPlan.lessons.find(
        (item) =>
          item.id === (requestedId ?? nextStudyLesson.value?.id ?? ''),
      )?.isCompleted,
    );
  stopPromptAudio();
  lessonOpen.value = true;
  selectedAnswer.value = null;
  attemptFeedback.value = null;
  lessonFinished.value = false;
  completionWasQueued.value = false;
  sessionResponses.value = {};
  dailyGoalReached.value = false;
  currentStepIndex.value = 0;
  lessonError.value = null;
  lessonLoading.value = true;

  const lessonId = requestedId ?? nextStudyLesson.value?.id ?? '';
  try {
    const fetched = await getLesson(lessonId);
    if (session !== lessonSession) return;
    lesson.value = fetched;
    apiLive.value = true;
    try {
      await cacheLesson(lesson.value);
    } catch {
      // Keep the live lesson available even if device storage is blocked.
    }
  } catch (error) {
    if (session !== lessonSession) return;
    if (error instanceof ApiRequestError && [403, 404, 410].includes(error.status)) {
      lesson.value = null;
      try { await removeCachedLesson(lessonId); } catch { /* Do not serve withdrawn content. */ }
      lessonError.value = 'This lesson is no longer available.';
      return;
    }
    apiLive.value = false;
    try {
      const cached = (await getCachedLesson(lessonId)) ?? null;
      if (session !== lessonSession) return;
      lesson.value = cached;
    } catch {
      lesson.value = null;
    }
    if (!lesson.value) {
      lessonError.value =
        'This lesson has not been downloaded yet. Reconnect once to make it available offline.';
    }
  } finally {
    if (session !== lessonSession) return;
    introductionOpen.value = Boolean(lesson.value);
    resetPracticeSupport();
    if (lesson.value && cardIndex === undefined && !practiceOnly) {
      try {
        const saved = await loadStartedLesson(reviewScope.value, lesson.value.trackId);
        if (session !== lessonSession) return;
        if (saved?.lessonId === lesson.value.id && saved.version === lesson.value.version && lesson.value.steps[saved.stepIndex]) {
          currentStepIndex.value = saved.stepIndex; introductionOpen.value = saved.introductionOpen;
          teachingWasCompleted.value = saved.teachingWasCompleted; practiceMode.value = saved.practiceMode;
          responseMode.value = saved.responseMode; selectedAnswer.value = saved.selectedAnswer;
          attemptFeedback.value = saved.feedback; showEnglishHelp.value = saved.help; showAnswerMeanings.value = saved.answerHelp;
          practiceHelpUsed.value = saved.practiceHelpUsed; retryCount.value = saved.retryCount;
          savedPieces.value = saved.pieces ?? []; buildComplete.value = saved.buildComplete;
          teachingCheckpoint.value = saved.teaching; sessionResponses.value = saved.responses;
        }
      } catch { /* Resume is optional if storage is unavailable. */ }
    }
    // Teaching initializes from its saved checkpoint on mount. Keep the loading
    // frame until restoration finishes so it cannot mount at the opening scene.
    lessonLoading.value = false;
    restoringLesson = false;
    await nextTick();
    lessonCloseButton.value?.focus();
  }
}

function closeLesson() {
  void saveStartedLesson();
  resumableLessonId.value = !lessonFinished.value ? lesson.value?.id : undefined;
  lessonSession++;
  checkingAnswer.value = false;
  stopPromptAudio();
  lessonOpen.value = false;
  if (!previewMode.value) reviewHistoryRevision.value++;
  nextTick(() => lessonOpener?.focus());
}

function trapLessonFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return;
  const sheet = event.currentTarget as HTMLElement;
  const controls = [
    ...sheet.querySelectorAll<HTMLElement>(
      'button:not(:disabled), summary, a[href], [tabindex="0"]',
    ),
  ].filter(
    (element) =>
      element.getClientRects().length > 0 && !element.closest('[inert]'),
  );
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function activatePractice(element: Element) {
  element.removeAttribute('inert');
  focusPractice();
}

function focusPractice() {
  const content =
    practiceHeading.value?.closest<HTMLElement>('.lesson-content');
  if (content) content.scrollTop = 0;
  practiceHeading.value?.focus({ preventScroll: true });
}

function chooseAnswer(id: string) {
  if (!attemptFeedback.value) selectedAnswer.value = id;
}

async function beginPractice() {
  if (!teachingWasCompleted.value) resetPracticeSupport();
  teachingWasCompleted.value = true;
  introductionOpen.value = false;
  await nextTick();
  focusPractice();
}

async function checkAnswer() {
  if (
    checkingAnswer.value ||
    (!selectedAnswer.value && !buildComplete.value) ||
    !lesson.value ||
    !currentStep.value
  )
    return;
  if (responseMode.value === 'build' && !selectedAnswer.value) {
    attemptFeedback.value = {
      stepId: currentStep.value.id,
      isCorrect: false,
      correctAnswerId: currentStep.value.evaluation.correctAnswerId,
      feedbackTitle: 'Compare the phrase order',
      explanation:
        'For this reconstruction, use the order shown in the lesson model below. This checks only the supplied phrase, not every possible response.',
      retryHint:
        'Choose Try again to rebuild the phrase. Response choices are available for help on the retry.',
    };
    playUiSound('retry');
    await rememberAttempt(attemptFeedback.value);
    await nextTick();
    feedbackPanel.value?.focus();
    return;
  }
  const submittedLesson = lesson.value;
  const submittedStep = currentStep.value;
  const answerId = selectedAnswer.value!;
  const session = lessonSession;
  checkingAnswer.value = true;
  let feedback: LessonAttemptResponse;
  try {
    feedback = previewMode.value
      ? evaluateOffline(submittedStep, answerId)
      : await submitLessonAttempt(
          submittedLesson.id,
          submittedStep.id,
          answerId,
        );
    if (!previewMode.value) apiLive.value = true;
  } catch {
    apiLive.value = false;
    feedback = evaluateOffline(submittedStep, answerId);
  } finally {
    if (session === lessonSession) checkingAnswer.value = false;
  }
  if (session !== lessonSession || !lessonOpen.value) return;
  attemptFeedback.value = feedback;
  await rememberAttempt(feedback);
  playUiSound(feedback.isCorrect ? 'correct' : 'retry');
  await nextTick();
  feedbackPanel.value?.focus();
}

async function retryAnswer() {
  savedPieces.value = [];
  retryCount.value++;
  buildComplete.value = false;
  selectedAnswer.value = null;
  attemptFeedback.value = null;
  await nextTick();
  focusPractice();
}

async function rememberAttempt(feedback: LessonAttemptResponse) {
  if (!lesson.value || !currentStep.value) return;
  const first = stepAttemptCount++ === 0;
  const previous = sessionResponses.value[currentStep.value.id];
  sessionResponses.value[currentStep.value.id] = {
    firstCorrect: previous?.firstCorrect ?? feedback.isCorrect,
    helpUsed: Boolean(previous?.helpUsed || practiceHelpUsed.value),
  };
  if (previewMode.value) return;
  try {
    await saveReviewAttempt(
      reviewScope.value,
      lesson.value,
      currentStep.value.id,
      selectedAnswer.value,
      feedback.isCorrect,
      feedback.explanation,
      first,
      practiceHelpUsed.value,
    );
    reviewHistoryError.value = '';
  } catch {
    reviewHistoryError.value =
      'Review history could not be saved on this device. Practice and retries remain available.';
  }
}

async function continueLesson() {
  if (!isCorrect.value || !lesson.value) return;

  if (currentStepIndex.value < lesson.value.steps.length - 1) {
    stopPromptAudio();
    currentStepIndex.value += 1;
    resetPracticeSupport();
    selectedAnswer.value = null;
    attemptFeedback.value = null;
    await nextTick();
    focusPractice();
    return;
  }

  const session = lessonSession;
  await finishLesson();
  if (session === lessonSession && lessonOpen.value && lessonFinished.value)
    playUiSound('complete');
  await nextTick();
  completionHeading.value?.focus();
}

async function finishLesson() {
  if (!lesson.value || lessonFinished.value) return;

  stopPromptAudio();

  if (previewMode.value || practiceMode.value) {
    if (!previewMode.value) creditStudyActivity({ id: lessonActivityId,
      kind: 'lesson', lessonId: lesson.value.id, practiceOnly: true, completedAt: new Date().toISOString() }, lessonActivityScope);
    lessonFinished.value = true;
    return;
  }

  const completion: PendingCompletion = {
    scope: reviewScope.value,
    completionId: lessonActivityId,
    lessonId: lesson.value.id,
    completedAt: new Date().toISOString(),
    estimatedMinutes: lesson.value.estimatedMinutes,
  };
  creditStudyActivity({ id: completion.completionId, kind: 'lesson', lessonId: completion.lessonId,
    completedAt: completion.completedAt }, lessonActivityScope);

  try {
    await queueCompletion(completion);
    pendingSyncCount.value += 1;
  } catch {
    // Online submission can still succeed when device storage is unavailable.
  }

  const wasBelowGoal = dailyCompleted.value < dailyGoal.value;
  dashboard.value.dailyPlan.studyMinutesToday =
    (dashboard.value.dailyPlan.studyMinutesToday ?? dashboard.value.dailyPlan.completedMinutes) + lesson.value.estimatedMinutes;
  dashboard.value.dailyPlan.completedMinutes = dailyCompleted.value;
  dailyGoalReached.value = wasBelowGoal && dailyCompleted.value >= dailyGoal.value;
  await markLessonCompletedLocally(lesson.value.id);

  try {
    await submitLessonCompletion(
      completion.lessonId,
      completion.completionId,
      completion.completedAt,
    );
    apiLive.value = true;
    try {
      await removePendingCompletion(completion.completionId);
      pendingSyncCount.value = Math.max(0, pendingSyncCount.value - 1);
      await loadDashboard();
      await cacheUpcomingLessons();
    } catch {
      // The idempotent completion can safely be cleared on the next sync attempt.
    }
  } catch {
    apiLive.value = false;
    completionWasQueued.value = true;
  }

  lessonFinished.value = true;
}
</script>

<template>
  <a
    class="skip-link"
    href="#main-content"
    :inert="reviewOpen"
    @click.prevent="focusMain"
    >Skip to main content</a
  >

  <div class="app-shell" :data-course="activeCourse.id" :inert="lessonOpen || consoleOpen || reviewOpen">
    <aside class="side-nav" aria-label="Primary navigation">
      <a class="brand" href="#" aria-label="Ismi landing page">
        <img
          class="brand-mark"
          src="/ismi-mark.svg"
          width="38"
          height="38"
          alt=""
          aria-hidden="true"
        />
        <span class="brand-word">ismi</span>
      </a>

      <nav class="nav-links">
        <a
          v-for="item in navigation"
          :key="item.id"
          class="nav-link"
          :class="{ active: primaryPage === item.id }"
          :href="`#/${item.id}`"
          :aria-current="primaryPage === item.id ? 'page' : undefined"
        >
          <component :is="item.icon" :size="21" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </a>
        <button
          v-if="authSession.canManageCurriculum"
          class="nav-link account-nav-link"
          type="button"
          @click="openCurriculumConsole"
        >
          <BookCheck :size="21" aria-hidden="true" />
          <span>Curriculum</span>
        </button>
      </nav>

      <div class="side-note">
        <a
          class="nav-link"
          :class="{ active: page === 'account' }"
          href="#/account"
          :aria-current="page === 'account' ? 'page' : undefined"
        >
          <UserRound :size="21" aria-hidden="true" />
          <span>Account</span>
        </a>
        <BackControl class="landing-return" href="#">Back to landing page</BackControl>
        <div class="sound-preference">
          <SoundToggle /><span>Interface sounds</span>
        </div>
      </div>
    </aside>

    <main id="main-content" class="main-content" tabindex="-1">
      <header class="mobile-header">
        <a class="brand" href="#" aria-label="Ismi landing page">
          <img
            class="brand-mark"
            src="/ismi-mark.svg"
            width="38"
            height="38"
            alt=""
            aria-hidden="true"
          />
          <span class="brand-word">ismi</span>
        </a>
        <div class="header-controls">
          <SoundToggle /><a
            class="profile-button"
            href="#/account"
            :aria-current="page === 'account' ? 'page' : undefined"
            @click.prevent="openAccount()"
          >
            <UserRound :size="23" aria-hidden="true" />
            <span class="sr-only">Account</span>
          </a>
        </div>
      </header>

      <BackControl class="landing-return mobile-landing-return" href="#">Back to landing page</BackControl>

      <CourseSwitcher :last-courses="lastCourses" :model-value="viewedCourse" :lessons="dashboard.dailyPlan.lessons" :disabled="!viewedReady || (!studyPageAvailable && page !== 'practice-alphabet') || lessonOpen || reviewOpen" @update:model-value="switchViewedCourse" />
      <PublicationNotice :notice="activeLessons.find(l => l.publicationNotice)?.publicationNotice" />
      <button v-if="resumableLessonId && activeLessons.some(l => l.id === resumableLessonId)" type="button" class="secondary-action resume-course" @click="startLesson(resumableLessonId)">Resume {{ activeCourse.name }} lesson</button>
      <p v-if="courseStorageError" role="status">{{ courseStorageError }}</p>
      <section v-if="studyPageAvailable && !activeLessons.length && page !== 'account' && page !== 'practice-alphabet'" class="course-empty" role="status">
        <h2>{{ activeCourse.name }}</h2><p>Lessons not yet available. Your saved progress and daily study settings are unchanged.</p>
      </section>
      <p v-if="downloadError" role="status">{{ downloadError }}</p>

      <LoadingWords v-if="dashboardLoading && page !== 'practice-culture' && page !== 'practice-alphabet'" :compact="!initialDashboardLoading" />
      <section v-else-if="dashboardUnavailable && page !== 'account' && page !== 'practice-culture' && page !== 'practice-alphabet'" class="dashboard-error" aria-labelledby="dashboard-error-heading">
        <WifiOff :size="28" aria-hidden="true" />
        <h1 id="dashboard-error-heading">Your study plan couldn’t load</h1>
        <p>Reconnect and try again. No saved plan is available on this device.</p>
        <button type="button" class="primary-action" @click="loadDashboard">Try again</button>
      </section>

      <template v-if="page === 'today' && studyPageAvailable">
        <section class="welcome-row" aria-labelledby="today-heading">
          <div>
            <h1 id="today-heading">
              {{ activeCourse.languageId === 'arabic' ? 'Marhaba' : 'Welcome' }}, {{ dashboard.learner.displayName }}.
            </h1>
          </div>

          <div
            v-if="!apiLive || pendingSyncCount > 0"
            class="status-cluster"
            aria-label="Learning status"
            role="status"
          >
            <div
              class="status-pill offline-pill"
              :class="{ 'sync-pending': pendingSyncCount > 0 }"
            >
              <WifiOff :size="18" aria-hidden="true" />
              <span>{{ syncStatus }}</span>
            </div>
          </div>
        </section>

        <section class="status-strip" aria-label="Today’s shortcuts">
          <a class="feature-tile accent-gold" href="#/progress">
            <span class="feature-badge" aria-hidden="true"><Flame :size="18" /></span>
            <span class="feature-copy">
              <strong>Streak</strong>
              <small>{{ learningHabits.state.value.streakEnabled ? `${streak.studyDays} days · ${streak.graceRemaining} grace` : 'Off' }}</small>
            </span>
          </a>
          <a class="feature-tile accent-gold" href="#/progress">
            <span class="feature-badge" aria-hidden="true"><Trophy :size="18" /></span>
            <span class="feature-copy">
              <strong>This week</strong>
              <small>{{ learningHabits.state.value.questsEnabled ? `${questsDone} of ${learningHabits.state.value.tasks.length}` : 'Off' }}</small>
            </span>
          </a>
          <button
            type="button"
            class="feature-tile accent-green"
            :disabled="!questReviewAvailability.due"
            @click="questReview?.start('due')"
          >
            <span class="feature-badge" aria-hidden="true"><RotateCcw :size="18" /></span>
            <span class="feature-copy">
              <strong>Review due</strong>
              <small>{{ questReviewAvailability.dueCount ?? 0 }}</small>
            </span>
          </button>
        </section>

        <section v-if="nextStudyLesson" class="section-block" aria-labelledby="next-heading">
          <div class="section-heading">
            <div>
              <h2 id="next-heading">{{ dailyCompleted >= dailyGoal ? 'Keep practicing' : manualCourseStudy ? `Study ${activeCourse.name}` : 'Next lesson' }}</h2>
            </div>
            <span class="time-chip"
              >{{ nextStudyLesson?.estimatedMinutes ?? 0 }} min</span
            >
          </div>

          <article class="primary-lesson-card">
            <div class="track-label hero-track-label">
              <span class="hero-bubble" v-bind="textAttributes(activeCourse.id)">{{ activeCourse.nativeName }}</span>
              <span class="hero-track-copy">
                <span>{{ activeCourse.languageName }}</span>
                <small v-if="activeCourse.name !== activeCourse.languageName">{{ nextStudyTrack.name }}</small>
              </span>
            </div>
            <div class="lesson-details">
              <CharacterCast
                :cast="
                  nextStudyLesson?.characters
                "
                compact
              />
              <h3>
                {{
                  nextStudyLesson?.title
                }}
              </h3>
              <button
                class="primary-action"
                type="button"
                data-ui-sound="advance"
                :aria-label="manualCourseStudy ? `Open ${nextStudyLesson.title}` : `Continue in ${nextStudyTrack?.name?.includes('Levantine') ? 'Levantine' : (nextStudyTrack?.name ?? 'your track')}`"
                @click="startLesson()"
              >
                {{ manualCourseStudy ? 'Open lesson' : 'Continue' }}
                <ChevronRight :size="20" aria-hidden="true" />
              </button>
              <details class="lesson-about">
                <summary>About this lesson</summary>
                <p>
                  {{
                    nextStudyLesson?.publicationNotice?.label ?? (nextStudyLesson?.reviewStatus === 'demonstrative'
                      ? 'Demonstration · not reviewed launch curriculum.'
                      : 'Owner-approved · no native-expert review.')
                  }}
                </p>
              </details>
            </div>
          </article>
          <p v-if="manualCourseStudy && dailyCompleted < dailyGoal" class="review-status-note">Outside today’s plan · study settings unchanged.</p>

          <a class="page-link" href="#/courses"
            ><span>{{ courseProgressLabel }}</span
            ><ChevronRight :size="16" aria-hidden="true"
          /></a>
        </section>
        <section class="daily-progress" :class="{ 'goal-complete': dailyCompleted >= dailyGoal }" aria-labelledby="progress-heading">
          <div class="progress-copy">
            <span class="section-kicker"><Check v-if="dailyCompleted >= dailyGoal" :size="16" aria-hidden="true" /> {{ dailyCompleted >= dailyGoal ? 'Daily goal complete' : 'Daily goal' }}</span>
            <h2 id="progress-heading">
              {{ dailyCompleted }} of
              {{ dailyGoal }} minutes
            </h2>
          </div>
          <div
            class="progress-track"
            role="progressbar"
            aria-valuemin="0"
            :aria-valuemax="dailyGoal"
            :aria-valuenow="dailyCompleted"
            :aria-label="`${dailyCompleted} of ${dailyGoal} daily minutes complete`"
          >
            <span
              class="progress-fill"
              :style="{ width: `${progressPercent}%` }"
            ></span>
          </div>
        </section>

        <section class="study-plan section-block" aria-labelledby="study-plan-heading">
          <div class="section-heading">
            <div><h2 id="study-plan-heading">Your plan</h2><p class="plan-total">{{ studyPlan.plannedMinutes }} min planned</p></div>
            <a class="plan-settings" href="#/account" aria-label="Edit study settings"><Settings2 :size="17" aria-hidden="true" /> Settings</a>
          </div>
          <h3 v-if="upcomingPlanLessons.length" class="up-next-heading">Up next</h3>
          <ol v-if="upcomingPlanLessons.length" class="study-queue" aria-label="Today’s lesson queue">
            <li v-for="(item, index) in upcomingPlanLessons" :key="item.id">
              <button type="button" class="plan-lesson" :aria-label="`Open ${item.title} · ${item.estimatedMinutes} min`" @click="startLesson(item.id)">
                <span class="plan-step" aria-hidden="true">{{ index + 1 }}</span>
                <span class="plan-lesson-copy"><strong>{{ item.title }}</strong><span>{{ courseFor(item.trackId).name }} · {{ item.estimatedMinutes }} min</span></span>
                <ChevronRight :size="20" aria-hidden="true" />
              </button>
            </li>
          </ol>
          <p v-else-if="studyPlan.queue.length" class="plan-empty">Your next lesson is ready above.</p>
          <div v-else class="plan-empty">
            <p>{{ dailyCompleted >= dailyGoal ? 'Daily goal complete. Practice is always available.' : 'No new lessons are available for this plan.' }}</p>
            <a :href="dailyCompleted >= dailyGoal ? '#/practice' : '#/courses'">{{ dailyCompleted >= dailyGoal ? 'Open practice' : 'Explore courses' }} <ChevronRight :size="16" aria-hidden="true" /></a>
          </div>
          <p v-if="studyPlan.overrunMinutes" class="plan-overrun"><span>+{{ studyPlan.overrunMinutes }} min</span> to finish whole lessons</p>
          <p v-for="allocation in studyPlan.allocations.filter(a => a.reviewMinutes)" :key="allocation.id"><button class="secondary-action" @click="plannedReview?.start('due', undefined, allocation.id)">Review {{ allocation.name }} first · {{ allocation.reviewMinutes }} min</button></p>
          <details class="plan-details">
            <summary>Study time by course</summary>
          <ul class="study-allocations">
            <li v-for="allocation in studyPlan.allocations" :key="allocation.id">
              <div><strong>{{ allocation.name }}</strong> · {{ allocation.minutes }} min</div>
              <span v-if="!allocation.available">Lessons not yet available</span>
              <span v-else-if="allocation.omitted">Not scheduled today · manual study available</span>
              <span v-else-if="allocation.reviewMinutes">Due review first</span>
            </li>
          </ul>
          </details>
        </section>

        <a v-if="activeCourse.languageId === 'arabic'" class="page-link culture-today-link" href="#/practice/culture"><Clapperboard :size="18" aria-hidden="true" /> Watch &amp; listen</a>
      </template>

      <template v-if="page === 'courses' && studyPageAvailable">
        <header class="page-heading">
          <h1>Courses</h1>
          <p class="review-status-note"><span>{{ activeCourse.name }}</span> · <span>{{ courseProgressLabel }}</span></p>
          <p
            v-if="!apiLive || pendingSyncCount > 0"
            class="review-status-note"
            role="status"
          >
            {{ syncStatus }}
          </p>
        </header>
        <a class="page-link" href="#/practice/alphabet"><BookOpen :size="18" aria-hidden="true" /> Alphabet · {{ activeCourse.name }}</a>
        <div class="course-units">
          <section
            v-for="unit in courseUnits"
            :key="unit.id"
            :aria-label="unit.title"
          >
            <h2>{{ unit.title }}</h2>
            <ol class="course-path" :aria-label="`${activeCourse.id === 'levantine' ? 'Levantine' : activeCourse.name} course path`">
              <li
                v-for="item in unit.lessons"
                :key="item.id"
                :class="{
                  completed: item.isCompleted,
                  current: item.isCurrent,
                }"
              >
                <span class="course-path-marker" aria-hidden="true">
                  <Check v-if="item.isCompleted" :size="16" />
                  <span v-else>{{ item.courseOrder }}</span>
                </span>
                <span class="course-path-copy">
                  <strong>{{ item.title }}</strong>
                  <span v-if="item.publicationNotice">{{ item.publicationNotice.label }}</span>
                  <span
                    >{{ item.estimatedMinutes }} min ·
                    {{
                      item.isCompleted
                        ? 'Complete'
                        : item.isCurrent
                          ? 'Up next'
                          : 'Later'
                    }}</span
                  >
                </span>
                <CharacterCast :cast="item.characters" compact />
                <button
                  class="text-button"
                  type="button"
                  :aria-label="`${item.isCompleted ? 'Review' : 'Open'} ${item.title}`"
                  @click="startLesson(item.id)"
                >
                  {{ item.isCompleted ? 'Review' : 'Open'
                  }}<span class="sr-only"> {{ item.title }}</span>
                </button>
              </li>
            </ol>
            <div
              v-if="unit.lessons.every((item) => item.isCompleted)"
              class="unit-complete"
              role="status"
            >
              <h3>Unit complete</h3>
              <button
                class="secondary-action"
                type="button"
                @click="navigate('practice-checkpoints')"
              >
                Review and checkpoint
              </button>
            </div>
          </section>
        </div>
        <section class="section-block" aria-labelledby="tracks-heading">
          <div class="section-heading compact-heading">
            <div>
              <h2 id="tracks-heading">Coming later</h2>
            </div>
          </div>

          <div class="track-grid">
            <article v-for="course in courses.filter(c => !dashboard.dailyPlan.lessons.some(l => l.trackId === c.id))" :key="course.id" class="track-card">
              <div class="track-card-copy"><h3>{{ course.name }}</h3><p>Planned · Lessons not yet available</p></div>
              <button class="secondary-action" @click="switchViewedCourse(course.id)">View status</button>
            </article>
          </div>
        </section>
      </template>

      <template v-if="page === 'practice' && studyPageAvailable">
        <header class="page-heading">
          <h1>Practice</h1>
        </header>
        <div id="practice-hub" class="feature-grid">
          <a class="feature-tile accent-gold tile-alphabet" href="#/practice/alphabet">
            <span class="feature-badge" aria-hidden="true"><BookOpen :size="26" /></span><span class="feature-copy"><strong>Alphabet</strong><small>{{ activeCourse.name }}</small></span>
          </a>
          <a v-if="activeCourse.languageId === 'arabic'" class="feature-tile accent-ink tile-culture" href="#/practice/culture">
            <span class="feature-badge" aria-hidden="true"><Clapperboard :size="18" /></span>
            <span class="feature-copy"><strong>Watch &amp; listen</strong><small>Weekly Arabic picks</small></span>
          </a>
          <a class="feature-tile accent-green tile-lessons" href="#/practice/lessons" :aria-label="`Lesson practice, ${activeLessons.length} lessons`">
            <span class="feature-badge" aria-hidden="true"><Headphones :size="18" /></span>
            <span class="feature-copy"><strong>Lesson practice</strong><small>{{ activeLessons.length }} lessons</small></span>
            <span class="feature-count">{{ activeLessons.length }}</span>
          </a>
        </div>
        <p v-if="reviewHistoryError" role="alert">{{ reviewHistoryError }}</p>
      </template>
      <AlphabetExplorer v-if="page === 'practice-alphabet' && viewedReady" :course-id="viewedCourse" :scope="reviewScope" :suspended="lessonOpen || reviewOpen || consoleOpen" @audio="alphabetAudioPlaying = $event" />
      <p v-if="page === 'practice-culture' && viewedReady && activeCourse.languageId !== 'arabic'">Watch &amp; listen currently covers Arabic. Switch to an Arabic course to view its collections.</p>
      <CulturalPicks v-if="page === 'practice-culture' && viewedReady && activeCourse.languageId === 'arabic'" :edition-id="culturalEditionId" />
      <template v-if="practiceChild && studyPageAvailable">
        <BackControl class="page-back" href="#/practice">Back to Practice</BackControl>
        <header class="page-heading"><h1>{{ pageTitle }}</h1></header>
        <div v-if="page === 'practice-review'" id="practice-review"></div>
        <div v-if="page === 'practice-checkpoints'" id="practice-checkpoints"></div>
        <div v-if="page === 'practice-recall'" id="practice-recall"></div>
        <section v-if="page === 'practice-lessons'" class="practice-list" aria-label="Practice lessons">
          <button
            v-for="item in activeLessons"
            :key="item.id"
            class="practice-item"
            type="button"
            @click="startLesson(item.id, true)"
          >
            <RotateCcw :size="20" aria-hidden="true" />
            <span
              ><strong>{{ item.title }}</strong
              ><small>{{ item.estimatedMinutes }} min</small></span
            >
            <ChevronRight :size="18" aria-hidden="true" />
          </button>
          <p v-if="!activeLessons.length">
            Lessons will appear here when your course is available. Connect to
            download your first lessons.
          </p>
        </section>
      </template>
      <template v-if="page === 'progress' && studyPageAvailable">
        <header class="page-heading"><h1>Progress</h1><p><span>{{ activeCourse.name }}</span> · <span>{{ courseProgressLabel }}</span></p></header>
        <LearningHabits section="streak" :state="learningHabits.state.value" :now="habitNow" :error="learningHabits.error.value" @toggle="learningHabits.toggle" />
        <LearningHabits section="quests" :state="learningHabits.state.value" :now="habitNow" :error="''" :review-ready="questReviewAvailability.ready" @toggle="learningHabits.toggle" @start="startQuest" />
        <div id="progress-cando"></div>
        <LearningHabits section="rules" :state="learningHabits.state.value" :now="habitNow" error="" />
      </template>
      <ReviewPractice v-if="studyPageAvailable" ref="plannedReview" view="hidden" :scope="reviewScope"
        :history-revision="reviewHistoryRevision" :lessons="todayReviewLessons"
        @availability="value => { dueByCourse = value.dueByCourse ?? {}; planReviewAvailability = value; }"
        @open-change="reviewOpen = $event" @prompt-playback="reviewAudioPlaying = $event" @activity-complete="creditStudyActivity" />
      <ReviewPractice
        v-if="studyPageAvailable"
        ref="questReview"
        :view="reviewView"
        :scope="reviewScope"
        :history-revision="reviewHistoryRevision"
        :lessons="hubReviewLessons"
        @open-change="reviewOpen = $event"
        @prompt-playback="reviewAudioPlaying = $event"
        @availability="questReviewAvailability = $event"
        @activity-complete="creditStudyActivity"
      />
      <RecallPractice
        v-if="studyPageAvailable"
        :view="recallView"
        :scope="reviewScope"
        :lessons="activeLessons"
        :history-revision="reviewHistoryRevision"
        @open-change="reviewOpen = $event"
      />
      <template v-if="page === 'words' && studyPageAvailable">
        <LearnedWords
          :scope="reviewScope"
          :lessons="activeLessons"
          :suspended="lessonOpen || reviewOpen"
          @open-lesson="openGlossaryLesson"
          @prompt-playback="reviewAudioPlaying = $event"
        />
      </template>
      <section
        v-if="page === 'account'"
        class="account-sheet account-page"
        aria-labelledby="account-title"
      >
        <BackControl class="page-back" href="#/today">Back to Today</BackControl>
        <header class="account-sheet-header">
          <div>
            <h1 id="account-title">
              {{
                authSession.isAuthenticated
                  ? 'Account'
                  : accountMode === 'login'
                    ? 'Welcome back'
                    : 'Create your account'
              }}
            </h1>
          </div>
        </header>

        <StudySettings
          :available-course-ids="dashboard.dailyPlan.lessons.map(l => l.trackId ?? 'levantine')" :preferences="studySettings.preferences.value" :busy="studySettings.busy.value"
          :message="studySettings.message.value" :conflict="Boolean(studySettings.conflict.value)"
          @save="async value => { await studySettings.save(value); await cacheUpcomingLessons(); }"
          @resolve="studySettings.resolve"
        />
        <PlacementCheck :key="viewedCourse" :course-id="viewedCourse" :scope="reviewScope" :selected-track-ids="studySettings.preferences.value.selectedTrackIds"
          :lessons="dashboardScope === reviewScope ? dashboard.dailyPlan.lessons : []" @open-lesson="id => startLesson(id)" />
        <template v-if="authSession.isAuthenticated">
          <div class="account-profile">
            <span class="account-avatar" aria-hidden="true">{{
              authSession.displayName?.slice(0, 1).toUpperCase()
            }}</span>
            <div>
              <strong>{{ authSession.displayName }}</strong>
              <span>{{ authSession.email }}</span>
            </div>
          </div>
          <p class="account-copy" role="status">{{ syncStatus }}</p>
          <p v-if="accountError" class="auth-error" role="alert">
            {{ accountError }}
          </p>
          <div class="account-actions">
            <button
              class="secondary-action"
              type="button"
              :disabled="accountSubmitting || studySettings.busy.value"
              @click="signOut"
            >
              {{ accountSubmitting ? 'Signing out…' : 'Sign out' }}
            </button>
            <BackControl @click="closeAccount" :disabled="accountSubmitting || studySettings.busy.value">
              Continue learning
            </BackControl>
          </div>
          <button
            v-if="authSession.canManageCurriculum"
            class="guest-action curriculum-console-link"
            type="button"
            @click="openCurriculumConsole"
          >
            <BookCheck :size="18" aria-hidden="true" /> Open curriculum console
          </button>
        </template>

        <template v-else>
          <div class="auth-tabs" aria-label="Account action">
            <button
              type="button"
              :class="{ active: accountMode === 'login' }"
              :aria-pressed="accountMode === 'login'"
              @click="selectAccountMode('login')"
            >
              Sign in
            </button>
            <button
              type="button"
              :class="{ active: accountMode === 'register' }"
              :aria-pressed="accountMode === 'register'"
              @click="selectAccountMode('register')"
            >
              Create account
            </button>
          </div>

          <form class="auth-form" @submit.prevent="submitAccount">
            <label v-if="accountMode === 'register'">
              <span>Display name</span>
              <input
                v-model="accountDisplayName"
                name="name"
                type="text"
                autocomplete="name"
                minlength="2"
                maxlength="40"
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                v-model="accountEmail"
                name="email"
                type="email"
                autocomplete="email"
                inputmode="email"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                v-model="accountPassword"
                name="password"
                type="password"
                :autocomplete="
                  accountMode === 'login' ? 'current-password' : 'new-password'
                "
                minlength="8"
                required
              />
            </label>
            <label v-if="accountMode === 'login'" class="remember-account">
              <input v-model="rememberAccount" type="checkbox" />
              <span>Keep me signed in on this device</span>
            </label>

            <p v-if="accountError" class="auth-error" role="alert">
              {{ accountError }}
            </p>
            <button
              class="primary-action auth-submit"
              type="submit"
              :disabled="accountSubmitting || studySettings.busy.value"
            >
              <UserPlus
                v-if="accountMode === 'register'"
                :size="18"
                aria-hidden="true"
              />
              {{
                accountSubmitting
                  ? 'Please wait…'
                  : accountMode === 'login'
                    ? 'Sign in'
                    : 'Create account'
              }}
            </button>
          </form>

          <BackControl
            class="account-guest"
            :disabled="accountSubmitting || studySettings.busy.value"
            @click="closeAccount"
          >
            Continue as guest
          </BackControl>
          <p class="account-privacy">
            Sign in to sync progress across devices.
          </p>
        </template>
        <section class="experience-setting" aria-label="Your experience">
          <SoundToggle />
          <div>
            <strong>Interface sounds</strong>
            <p>Lesson audio stays on.</p>
          </div>
        </section>
        <p class="account-legal">
          <a href="#/privacy">Privacy policy</a> · {{ appVersionLabel }}
        </p>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="Mobile navigation">
      <a
        v-for="item in navigation"
        :key="item.id"
        :class="{ active: primaryPage === item.id }"
        :href="`#/${item.id}`"
        :aria-current="primaryPage === item.id ? 'page' : undefined"
        ><component :is="item.icon" :size="21" aria-hidden="true" /><span>{{
          item.label
        }}</span></a
      >
    </nav>
  </div>

  <div
    v-if="lessonOpen"
    class="lesson-overlay"
    :class="{ 'preview-overlay': previewMode }"
    role="presentation"
    @click.self="closeLesson"
  >
    <section
      class="lesson-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-title"
      @keydown.esc="closeLesson"
      @keydown="trapLessonFocus"
    >
      <header class="lesson-sheet-header">
        <div>
          <h2 id="lesson-title">{{ lesson?.title ?? 'Your lesson' }}</h2>
        </div>
        <div class="lesson-header-controls">
          <SoundToggle /><button
            ref="lessonCloseButton"
            class="close-button"
            type="button"
            aria-label="Close lesson"
            @click="closeLesson"
          >
            ×
          </button>
        </div>
      </header>

      <PublicationNotice :notice="lesson?.publicationNotice" compact />
      <div class="lesson-workspace">
        <div
          v-if="lessonLoading || lessonError || lessonFinished"
          class="lesson-state-frame"
        >
          <LessonStages v-if="lessonFinished" stage="use" />
          <LessonScroll>
            <div v-if="lessonLoading" class="lesson-state" role="status">
              <span class="lesson-state-mark" aria-hidden="true">ا</span>
              <strong>Opening your downloaded lesson…</strong>
            </div>

            <div
              v-else-if="lessonError"
              class="lesson-state lesson-error"
              role="alert"
            >
              <WifiOff :size="28" aria-hidden="true" />
              <strong>Lesson unavailable</strong>
              <p>{{ lessonError }}</p>
            </div>

            <div
              v-else-if="lessonFinished"
              class="lesson-state lesson-success"
              role="status"
            >
              <span class="completion-mark"
                ><Check :size="32" aria-hidden="true"
              /></span>
              <strong ref="completionHeading" tabindex="-1">{{
                previewMode ? 'Preview complete' : 'Conversation complete'
              }}</strong>
              <div v-if="completionSummary.total" class="completion-recap">
                <details v-if="completionSummary.phrases.length" class="practiced-responses">
                  <summary>Practiced responses</summary>
                  <ul><li v-for="(answer, index) in completionSummary.phrases" :key="index"><bdi v-bind="textAttributes(lesson?.trackId)">{{ answer?.arabic }}</bdi><span>{{ answer?.meaning }}</span></li></ul>
                </details>
                <p>{{ completionSummary.firstCorrect }} of {{ completionSummary.total }} responses correct on the first attempt</p>
                <p>Help used in {{ completionSummary.helped }} of {{ completionSummary.total }} turns</p>
              </div>
              <div v-if="lesson?.characters?.characterIds?.length" class="completion-encouragement">
                <CharacterPortrait :character-id="lesson.characters.characterIds[0]!" :registry-version="lesson.characters.registryVersion" expression="encouraging" />
              </div>
              <CharacterCast v-else compact />
              <p v-if="dailyGoalReached" class="goal-milestone"><Check :size="18" aria-hidden="true" /> Daily goal complete · {{ dailyGoal }} minutes</p>
              <p v-if="previewMode">
                No learner progress was saved. Preview does not approve or
                publish content.
              </p>
              <p v-if="completionWasQueued" class="queued-note">
                Saved on this device. Ismi will sync it when you reconnect.
              </p>
            </div>
          </LessonScroll>
          <footer
            v-if="lessonError || lessonFinished"
            class="lesson-actions"
            aria-label="Lesson navigation"
          >
            <button
              v-if="lessonError"
              class="secondary-action"
              type="button"
              @click="startLesson()"
            >
              Try again
            </button>
            <BackControl
              v-else
              @click="closeLesson"
            >
              {{
                previewMode
                  ? 'Back to curriculum'
                  : page === 'courses'
                    ? 'Back to courses'
                    : page === 'words'
                      ? 'Back to learned words'
                      : page.startsWith('practice')
                        ? 'Back to practice'
                        : 'Back to today'
              }}
            </BackControl>
          </footer>
        </div>
        <template v-else-if="lesson && currentStep">
          <p v-if="previewMode" class="preview-notice" role="status">
            Owner preview · {{ lesson.version }} · no progress saved
          </p>
          <LessonTeaching
            :checkpoint="teachingCheckpoint" @checkpoint="teachingCheckpoint = $event"
            v-if="introductionOpen"
            :key="lesson.version"
            :lesson="lesson"
            :review="practiceMode || teachingWasCompleted"
            :start-card-index="glossaryCardIndex"
            @done="beginPractice"
          />
          <section
            v-if="teachingWasCompleted"
            v-show="!introductionOpen"
            class="practice-journey"
            aria-label="Practice the conversation"
          >
            <LessonStages stage="use" />
            <div class="practice-topline">
              <span class="section-kicker"
                >Practice · {{ currentStepIndex + 1 }} of
                {{ lesson.steps.length }}</span
              ><button
                class="text-button"
                type="button"
                @click="
                  teachingCheckpoint = undefined;
                  introductionOpen = true;
                  stopPromptAudio();
                "
              >
                Review teaching
              </button>
            </div>
            <div class="lesson-step-progress" aria-hidden="true">
              <span
                :style="{
                  width: `${((currentStepIndex + 1) / lesson.steps.length) * 100}%`,
                }"
              ></span>
            </div>
            <LessonScroll>
              <LessonTransition @after-enter="activatePractice">
                <div
                  :key="currentStep.id"
                  :data-step-id="currentStep.id"
                  class="practice-page"
                >
                  <CharacterCue
                    :roles="currentStep.characters"
                    :registry-version="lesson.characters?.registryVersion"
                  />
                  <div class="scenario-panel">
                    <button
                      type="button"
                      class="audio-button"
                      data-ui-sound="silent"
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
                      <p class="arabic-prompt" v-bind="textAttributes(lesson?.trackId)">
                        {{ currentStep.prompt.arabic }}
                      </p>
                      <p class="arabizi-prompt">
                        {{ currentStep.prompt.arabizi }}
                      </p>
                      <p
                        v-if="showEnglishHelp || attemptFeedback"
                        class="prompt-meaning"
                      >
                        {{ currentStep.prompt.meaning }}
                      </p>
                      <button
                        v-if="!attemptFeedback"
                        class="text-button prompt-help"
                        type="button"
                        :aria-expanded="showEnglishHelp"
                        @click="showEnglishHelp = !showEnglishHelp; practiceHelpUsed = true"
                      >
                        {{
                          showEnglishHelp
                            ? 'Hide prompt translation'
                            : 'Translate prompt'
                        }}
                      </button>
                      <template v-if="currentStep.prompt.recording">
                        <p class="audio-source-note">
                          Recorded ·
                          {{ currentStep.prompt.recording.speaker }} ·
                          {{
                            currentStep.prompt.recording.dialect === 'jordanian'
                              ? 'Jordanian variant'
                              : lesson?.trackId === 'levantine' ? 'Urban Palestinian' : currentStep.prompt.recording.dialect
                          }}
                        </p>
                        <details class="recording-details">
                          <summary>Recording transcript and source</summary>
                          <p v-bind="textAttributes(lesson?.trackId)">
                            {{ currentStep.prompt.recording.transcript }}
                          </p>
                          <p>
                            Source:
                            {{ currentStep.prompt.recording.sourceLocator }}
                          </p>
                        </details>
                      </template>
                      <p v-if="audioError" role="alert">{{ audioError }}</p>
                      <p
                        v-if="!currentStep.prompt.audioUrl"
                        class="audio-source-note"
                      >
                        {{ deviceVoiceDescription }}
                      </p>
                    </div>
                  </div>

                  <h3
                    ref="practiceHeading"
                    tabindex="-1"
                    class="practice-instruction"
                  >
                    {{ currentStep.instruction }}
                  </h3>
                  <div v-if="responseMode === 'recall'" class="recall-panel">
                    <span class="recall-symbol" aria-hidden="true">…</span>
                    <h4>Try a response before looking</h4>
                    <p>
                      Say it aloud, or form it in your head. When you’re ready,
                      compare it with the choices.
                    </p>
                  </div>
                  <template v-else-if="responseMode === 'build'">
                    <PhraseBuilder
                      :key="`${currentStep.id}-${retryCount}`"
                      :step="currentStep" :course-id="lesson?.trackId" :initial-pieces="savedPieces" @progress="savedPieces = $event"
                      :disabled="Boolean(attemptFeedback) || checkingAnswer"
                      @select="
                        (id, complete) => {
                          selectedAnswer = id;
                          buildComplete = complete;
                        }
                      "
                    />
                    <button
                      v-if="!attemptFeedback"
                      class="text-button"
                      type="button"
                      @click="showChoices"
                    >
                      Use response choices instead
                    </button>
                  </template>
                  <fieldset
                    v-if="responseMode === 'choose'"
                    class="answer-group"
                    :disabled="Boolean(attemptFeedback) || checkingAnswer"
                  >
                    <legend class="sr-only">Response choices</legend>
                    <button
                      v-for="answer in currentStep.answers"
                      :key="answer.id"
                      type="button"
                      class="answer-option"
                      :class="{
                        selected: selectedAnswer === answer.id,
                        correct:
                          Boolean(attemptFeedback) &&
                          answer.id === attemptFeedback?.correctAnswerId,
                        incorrect:
                          Boolean(attemptFeedback) &&
                          selectedAnswer === answer.id &&
                          !isCorrect,
                      }"
                      :aria-pressed="selectedAnswer === answer.id"
                      @click="chooseAnswer(answer.id)"
                    >
                      <span class="answer-marker">{{
                        answer.id.toUpperCase()
                      }}</span>
                      <span class="answer-copy">
                        <span class="answer-arabic" v-bind="textAttributes(lesson?.trackId)">{{
                          answer.arabic
                        }}</span>
                        <span class="answer-arabizi">{{ answer.arabizi }}</span>
                        <span
                          v-if="showAnswerMeanings || attemptFeedback"
                          class="answer-meaning"
                          >{{ answer.meaning }}</span
                        >
                      </span>
                      <Check
                        v-if="
                          attemptFeedback &&
                          answer.id === attemptFeedback.correctAnswerId
                        "
                        :size="21"
                        aria-label="Correct answer"
                      />
                    </button>
                  </fieldset>

                  <button
                    v-if="responseMode === 'choose' && !attemptFeedback"
                    class="text-button response-help"
                    type="button"
                    :aria-expanded="showAnswerMeanings"
                    @click="showAnswerMeanings = !showAnswerMeanings; practiceHelpUsed = true"
                  >
                    {{
                      showAnswerMeanings
                        ? 'Hide response translations'
                        : 'Translate response choices'
                    }}
                  </button>
                  <div
                    v-if="attemptFeedback"
                    ref="feedbackPanel"
                    tabindex="-1"
                    class="feedback-panel"
                    :class="isCorrect ? 'positive' : 'try-again'"
                    aria-live="polite"
                  >
                    <CharacterCue
                      :roles="currentStep.characters"
                      :registry-version="lesson.characters?.registryVersion"
                      feedback
                    />
                    <strong
                      ><Check v-if="isCorrect" :size="18" aria-hidden="true" />
                      {{ attemptFeedback.feedbackTitle }}</strong
                    >
                    <div class="feedback-model" v-if="responseMode === 'build'">
                      <p v-bind="textAttributes(lesson?.trackId)">
                        {{
                          currentStep.answers.find(
                            (a) => a.id === attemptFeedback?.correctAnswerId,
                          )?.arabic
                        }}
                      </p>
                      <p>
                        {{
                          currentStep.answers.find(
                            (a) => a.id === attemptFeedback?.correctAnswerId,
                          )?.arabizi
                        }}
                      </p>
                    </div>
                    <p>{{ attemptFeedback.explanation }}</p>
                    <p v-if="!isCorrect && attemptFeedback.retryHint">
                      <em>{{ attemptFeedback.retryHint }}</em>
                    </p>
                  </div>
                </div>
              </LessonTransition>
            </LessonScroll>
            <footer class="lesson-actions" aria-label="Lesson navigation">
              <button
                v-if="responseMode === 'recall'"
                type="button"
                class="primary-action"
                data-ui-sound="reveal"
                @click="showChoices"
              >
                Show response choices
                <ChevronRight :size="18" aria-hidden="true" />
              </button>
              <button
                v-else-if="attemptFeedback && !isCorrect"
                type="button"
                class="secondary-action"
                @click="retryAnswer"
              >
                <RotateCcw :size="18" aria-hidden="true" /> Try again
              </button>
              <button
                v-else-if="attemptFeedback"
                type="button"
                class="primary-action lesson-check"
                :data-ui-sound="currentStepIndex === (lesson?.steps.length ?? 0) - 1 ? 'silent' : 'advance'"
                @click="continueLesson"
              >
                {{
                  currentStepIndex === lesson.steps.length - 1
                    ? 'Complete lesson'
                    : 'Next step'
                }}
                <ChevronRight :size="20" aria-hidden="true" />
              </button>
              <button
                v-else
                type="button"
                class="primary-action lesson-check"
                data-ui-sound="feedback"
                :disabled="
                  (!selectedAnswer && !buildComplete) || checkingAnswer
                "
                @click="checkAnswer"
              >
                {{ checkingAnswer ? 'Checking…' : 'Check answer' }}
                <ChevronRight :size="20" aria-hidden="true" />
              </button>
            </footer>
          </section>
        </template>
      </div>
    </section>
  </div>

  <CurriculumConsole
    v-if="consoleOpen"
    :inert="lessonOpen"
    @close="closeCurriculumConsole"
    @preview="previewLesson"
  />
</template>
