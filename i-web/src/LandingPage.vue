<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  ArrowRight,
  ArrowDown,
  Check,
  Menu,
  X,
  MessageCircle,
  CalendarDays,
  Coffee,
} from '@lucide/vue';
import CharacterPortrait from './CharacterPortrait.vue';
import { benefits, faqs } from './landing/content';
import './landing/landing.css';
import { courseGroups } from './courses';
import { appVersionLabel } from './version';
const availableCourses = ref<string[]>([]);
const previewCourses = ref<string[]>([]);
onMounted(async () => {
  try {
    const response = await fetch('/api/courses');
    if (response.ok) {
      const catalog = await response.json() as Array<{ course: { id: string }; publishedLessonCount: number; unreviewedPreviewLessonCount?: number }>;
      availableCourses.value = catalog.filter(c => c.publishedLessonCount > 0).map(c => c.course.id);
      previewCourses.value = catalog.filter(c => c.unreviewedPreviewLessonCount).map(c => c.course.id);
    }
  } catch { /* Planned/unknown availability never enables a false course claim. */ }
});
async function enterCourse(id: string) {
  try {
    const { getDeviceSnapshot, saveDeviceSnapshot } = await import('./offline');
    const scope = await getDeviceSnapshot<string>('review-scope') ?? 'guest';
    await saveDeviceSnapshot(`viewed-course-v1:${scope}`, id);
  } catch { /* The selector remains available inside the app. */ }
  window.location.hash = '/courses';
}
const menuOpen = ref(false);
const returning = ref(false);
onMounted(() => {
  try {
    returning.value = localStorage.getItem('ismi-learner-visited') === 'yes';
  } catch {
    /* Storage is optional. */
  }
});
</script>
<template>
  <div class="landing-page">
    <div>
      <a class="skip-link" href="#landing-main">Skip to content</a>
      <header class="landing-header">
        <a class="landing-brand" href="#" aria-label="Ismi landing page"
          ><img src="/ismi-mark.svg" width="36" height="36" alt="" />ismi<span
            class="brand-arabic"
            lang="ar"
            dir="rtl"
            >اسمي</span
          ></a
        >
        <button
          class="landing-menu"
          :aria-expanded="menuOpen"
          aria-controls="landing-nav"
          :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" /><Menu v-else :size="22" />
        </button>
        <nav
          id="landing-nav"
          class="landing-nav"
          :class="{ 'is-open': menuOpen }"
          aria-label="Landing navigation"
          @keydown.esc="menuOpen = false"
        >
          <a href="#how-it-works" @click="menuOpen = false">How it works</a
          ><a href="#languages" @click="menuOpen = false">Languages</a
          ><a href="#/about" @click="menuOpen = false">About & FAQ</a>
          <a
            :href="returning ? '#/today' : '#/account'"
            class="landing-signin"
            >{{ returning ? 'Continue learning' : 'Sign in' }}</a
          >
          <a
            class="landing-button compact"
            href="#/today"
            @click="menuOpen = false"
          >
            Try out the app <ArrowRight :size="17" />
          </a>
        </nav>
      </header>
      <main id="landing-main" tabindex="-1">
        <section class="landing-hero landing-wrap" aria-labelledby="hero-title">
          <div class="hero-copy">
            <h1 id="hero-title">
              Speak with the<br class="desktop-break" />
              people you <em>love.</em>
            </h1>
            <p class="hero-description">
              Learn through everyday conversations. Build useful phrases and
              understand how they work, with help whenever you need it.
              Rooted in Palestinian Arabic, with room for more languages.
            </p>
            <div class="landing-actions">
              <a
                class="landing-button"
                href="#/today"
                @click="menuOpen = false"
              >
                Try out the app <ArrowRight :size="19" /></a
              ><a class="landing-text-link" href="#how-it-works"
                >See how it works <ArrowDown :size="17"
              /></a>
            </div>
            <p class="landing-status">
              Development preview <span aria-hidden="true">·</span> Recommended
              for adults 18+
            </p>
          </div>
          <div class="hero-scene">
            <img
              class="hero-art"
              src="/characters/v2/lesson-coffee.webp"
              srcset="/characters/v2/lesson-coffee-mobile.webp 640w, /characters/v2/lesson-coffee.webp 1200w"
              sizes="(max-width: 760px) 100vw, 52vw"
              width="1200"
              height="800"
              fetchpriority="high"
              alt=""
            />
            <div class="hero-exchange">
              <div class="hero-exchange-top">
                <span class="landing-tag">Everyday conversations</span
                ><span>01 / Check in</span>
              </div>
              <div class="hero-phrase">
                <CharacterPortrait
                  character-id="fattoush"
                  expression="attentive"
                />
                <div>
                  <strong>Fattoush → Knafeh</strong>
                  <p class="landing-arabic" lang="ar" dir="rtl">شو عامل؟</p>
                  <p class="landing-transliteration" dir="ltr">Shū ʿāmel?</p>
                  <p class="hero-translation">How are you doing?</p>
                </div>
              </div>
              <a
                class="hero-card-action"
                href="#/today"
                @click="menuOpen = false"
              >
                Your turn to respond <ArrowRight :size="18" />
              </a>
            </div>
          </div>
        </section>
        <section
          class="landing-relevance landing-wrap"
          aria-labelledby="relevance-title"
        >
          <div class="section-intro">
            <h2 id="relevance-title">
              For the conversations<br />that bring you closer.
            </h2>
          </div>
          <div class="relevance-list">
            <article>
              <MessageCircle :size="26" />
              <div>
                <h3>Check in on their day</h3>
                <p>
                  Ask how they are. Share how you feel. Keep the exchange going.
                </p>
              </div>
            </article>
            <article>
              <CalendarDays :size="26" />
              <div>
                <h3>Make plans together</h3>
                <p>Talk about what comes next, one useful phrase at a time.</p>
              </div>
            </article>
            <article>
              <Coffee :size="26" />
              <div>
                <h3>Cherish the small moments</h3>
                <p>
                  How was work? Want some tea? Do they want to go for a walk?
                </p>
              </div>
            </article>
          </div>
        </section>
        <section
          id="how-it-works"
          class="landing-method"
          aria-labelledby="method-title"
        >
          <div class="landing-wrap">
            <div class="landing-section-heading">
              <h2 id="method-title">
                One conversation.<br />Three small steps.
              </h2>
              <p>
                Meet Fattoush and Knafeh. Learn the exchange, then take your
                turn. Together, you'll learn alongside them.
              </p>
            </div>
            <div class="method-grid">
              <article class="method-card">
                <span class="method-number">01</span>
                <h3>Meet the conversation</h3>
                <p>A real situation gives the words real weight.</p>
                <div class="method-example">
                  <span>Fattoush → Knafeh</span>
                  <p class="landing-arabic" lang="ar" dir="rtl">شو عامل؟</p>
                  <p dir="ltr">Shū ʿāmel?</p>
                  <details>
                    <summary>Show meaning</summary>
                    <p>How are you doing?</p>
                  </details>
                </div>
              </article>
              <article class="method-card">
                <span class="method-number">02</span>
                <h3>Understand the pieces</h3>
                <p>A short explanation helps the phrase click.</p>
                <div class="method-example">
                  <span>Knafeh’s response</span>
                  <p class="landing-arabic" lang="ar" dir="rtl">أنا منيح.</p>
                  <p dir="ltr">Ana mnīḥ.</p>
                  <p>
                    <strong>Ana</strong> = I (am) · <strong>mnīḥ</strong> = well
                  </p>
                  <small>Here, Knafeh describes himself.</small>
                </div>
              </article>
              <article class="method-card">
                <span class="method-number">03</span>
                <h3>Try your response</h3>
                <p>Try from memory. Reveal it when you need help.</p>
                <div class="method-example method-recall">
                  <span>Your turn as Knafeh</span>
                  <p>Fattoush checks in.<br />How would you say you’re well?</p>
                  <a
                    class="landing-outline-button"
                    href="#/today"
                    @click="menuOpen = false"
                  >
                    Give it a try <ArrowRight :size="17" />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section
          id="try-app"
          class="landing-app-invite landing-wrap"
          aria-labelledby="app-invite-title"
        >
          <div class="app-portraits" aria-hidden="true">
            <CharacterPortrait
              character-id="fattoush"
              expression="attentive"
            /><CharacterPortrait
              character-id="knafeh"
              expression="encouraging"
            />
          </div>
          <div>
            <h2 id="app-invite-title">Your first exchange starts here.</h2>
            <p>Read it. Try it from memory. Then try it yourself.</p>
          </div>
          <a class="landing-button" href="#/today" @click="menuOpen = false">
            Try out the app <ArrowRight :size="19" />
          </a>
        </section>
        <section
          class="landing-benefits landing-wrap"
          aria-labelledby="benefits-title"
        >
          <div class="landing-section-heading">
            <h2 id="benefits-title">
              Help when you need it.<br />Practice on your terms.
            </h2>
          </div>
          <div class="benefits-grid">
            <article v-for="benefit in benefits" :key="benefit.title">
              <span class="benefit-mark"><Check :size="20" /></span>
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.text }}</p>
              <div class="benefit-detail">{{ benefit.detail }}</div>
            </article>
          </div>
        </section>
        <section
          id="languages"
          class="landing-tracks"
          aria-labelledby="tracks-title"
        >
          <div class="landing-wrap">
            <span id="arabic-tracks" aria-hidden="true"></span>
            <div class="landing-section-heading"><h2 id="tracks-title">Languages</h2><p>Arabic is our flagship, rooted in Palestinian everyday life. Understand Arabic from conversation to Quran as its courses grow.</p></div>
            <div class="tracks-grid">
              <article v-for="course in courseGroups" :key="course.id" :data-course="course.id" :class="`track-${course.id}`">
                <span class="track-planned">{{ course.paths.some(path => previewCourses.includes(path.id)) ? 'Unreviewed · text-only preview' : course.paths.some(path => availableCourses.includes(path.id)) ? 'Published lessons available' : 'Planned' }}</span>
                <h3>{{ course.name }}</h3>
                <p v-if="course.id === 'levantine'">Urban Palestinian Arabic for everyday conversations. Jordanian variants are labeled.</p>
                <p v-else-if="course.id === 'msa'">General MSA for reading and listening, plus a Quranic Arabic path for vocabulary and direct meaning.</p>
                <p v-else-if="course.paths.some(path => previewCourses.includes(path.id))">Five AI-assisted text lessons. Linguistic and source-rights review remain pending; no human audio.</p>
                <p v-else>Everyday conversations and relationships. Course scope, sources and review are being prepared.</p>
                <a class="landing-outline-button" href="#/courses" @click.prevent="enterCourse(course.id)">{{ course.paths.some(path => availableCourses.includes(path.id)) ? 'View course' : 'View course status' }}<ArrowRight :size="17" /></a>
              </article>
            </div>
          </div>
        </section>
        <section
          id="beta"
          class="landing-trust landing-wrap"
          aria-labelledby="trust-title"
        >
          <div>
            <h2 id="trust-title">A small beginning.<br />A clear standard.</h2>
          </div>
          <div>
            <p>
              This is a development preview. The learning app has a small set of
              published Levantine lessons; the wider curriculum and reviewed
              human audio are still being built.
            </p>
            <p>
              Published lessons link to their sources, pass validation and
              require owner approval. Further language review is planned. This
              is not a claim of native-expert or scholarly review.
            </p>
            <a class="landing-text-link" href="#/courses"
              >Explore the development preview <ArrowRight :size="18"
            /></a>
            <p class="trust-caption">
              The free, invite-only beta is planned. Enrollment is not open yet.
            </p>
          </div>
        </section>
        <section
          id="faq"
          class="landing-faq landing-wrap"
          aria-labelledby="faq-title"
        >
          <div>
            <h2 id="faq-title">Before you begin.</h2>
          </div>
          <div class="faq-list">
            <details v-for="faq in faqs" :key="faq.question">
              <summary>
                {{ faq.question }}<span aria-hidden="true">+</span>
              </summary>
              <p>{{ faq.answer }}</p>
            </details>
          </div>
        </section>
        <section class="landing-final" aria-labelledby="final-title">
          <div class="landing-wrap">
            <h2 id="final-title">Start with one conversation.</h2>
            <p>A small step toward the people you love.</p>
            <a class="landing-button" href="#/today" @click="menuOpen = false">
              Try out the app <ArrowRight :size="19" /></a
            ><a class="landing-text-link" href="#beta"
              >About the planned beta <ArrowRight :size="17"
            /></a>
          </div>
        </section>
      </main>
      <footer class="landing-footer landing-wrap">
        <a class="landing-brand" href="#" aria-label="Ismi landing page"
          ><img src="/ismi-mark.svg" width="30" height="30" alt="" />ismi</a
        >
        <p>Arabic for the conversations that matter.</p>
        <a href="#/account">Sign in</a
        ><a href="#beta">Development preview · 18+</a
        ><a href="#/about">About & FAQ</a><a href="#/privacy">Privacy</a><span>{{ appVersionLabel }}</span
        ><span>© 2026 Ismi</span>
      </footer>
    </div>
  </div>
</template>
