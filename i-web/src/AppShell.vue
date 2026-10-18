<script setup lang="ts">
import {
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import LandingPage from './LandingPage.vue';
import AppWelcome from './AppWelcome.vue';
import { isLearnerRoute, isPrivacyRoute, isAboutRoute } from './routes';
const AboutPage = defineAsyncComponent(() => import('./AboutPage.vue'));
const about = ref(typeof window !== 'undefined' && isAboutRoute(window.location.hash));
const PrivacyPolicy = defineAsyncComponent(() => import('./PrivacyPolicy.vue'));
const LearnerApp = defineAsyncComponent(() => import('./App.vue'));
const learner = ref(
  typeof window !== 'undefined' && isLearnerRoute(window.location.hash),
);
const privacy = ref(
  typeof window !== 'undefined' && isPrivacyRoute(window.location.hash),
);
const welcomeOpen = ref(false);
let welcomeHandled = false;
let focusAfterWelcome = false;
function focusLearner() {
  const main = document.getElementById('main-content');
  if (focusAfterWelcome && main) {
    main.focus({ preventScroll: true });
    focusAfterWelcome = false;
  }
}
function showWelcome() {
  if (!learner.value || welcomeHandled) return;
  welcomeHandled = true;
  try {
    welcomeOpen.value = localStorage.getItem('ismi-welcome-v1') !== 'done';
  } catch {
    welcomeOpen.value = true;
  }
}
async function closeWelcome() {
  welcomeOpen.value = false;
  focusAfterWelcome = true;
  try {
    localStorage.setItem('ismi-welcome-v1', 'done');
  } catch {
    /* Storage is optional. */
  }
  await nextTick();
  focusLearner();
}
async function routeChanged() {
  const changed =
    learner.value !== isLearnerRoute(window.location.hash) ||
    privacy.value !== isPrivacyRoute(window.location.hash) ||
    about.value !== isAboutRoute(window.location.hash);
  about.value = isAboutRoute(window.location.hash);
  learner.value = isLearnerRoute(window.location.hash);
  privacy.value = isPrivacyRoute(window.location.hash);
  if (changed) window.scrollTo(0, 0);
  if (learner.value) showWelcome();
  else welcomeOpen.value = false;
  if (about.value) {
    document.title = 'About — Ismi';
    return;
  }
  if (privacy.value) {
    document.title = 'Privacy policy — Ismi';
    return;
  }
  if (!learner.value) {
    document.title = 'Ismi — Speak with the people you love';
    await nextTick();
    const section = document.getElementById(window.location.hash.slice(1));
    section?.scrollIntoView();
    if (changed)
      document.getElementById('landing-main')?.focus({ preventScroll: true });
  }
}
onMounted(() => {
  window.addEventListener('hashchange', routeChanged);
  void routeChanged();
  showWelcome();
});
onBeforeUnmount(() => window.removeEventListener('hashchange', routeChanged));
</script>
<template>
  <div v-if="learner" :inert="welcomeOpen">
    <Suspense @resolve="focusLearner"
      ><LearnerApp /><template #fallback
        ><p class="app-entry-loading" role="status">
          Opening your learning space…
        </p></template
      ></Suspense
    >
  </div>
  <AboutPage v-else-if="about" />
  <PrivacyPolicy v-else-if="privacy" />
  <LandingPage v-else />
  <AppWelcome v-if="welcomeOpen" @close="closeWelcome" />
</template>
