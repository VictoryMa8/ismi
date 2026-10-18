<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BackControl from './BackControl.vue';
import { faqs } from './landing/content';
import { appVersionLabel } from './version';

const heading = ref<HTMLElement>();
onMounted(() => heading.value?.focus({ preventScroll: true }));
</script>

<template>
  <div class="about-page">
    <header class="about-header">
      <a class="about-brand" href="#" aria-label="Ismi landing page">
        <img src="/ismi-mark.svg" width="30" height="30" alt="" />ismi<span lang="ar" dir="rtl">اسمي</span>
      </a>
      <span>{{ appVersionLabel }}</span>
    </header>
    <main id="main-content" class="about-main">
      <nav class="about-back" aria-label="Return navigation">
        <BackControl href="#">Landing page</BackControl>
        <BackControl href="#/account">Account</BackControl>
      </nav>
      <h1 ref="heading" tabindex="-1">About Ismi</h1>
      <p class="about-promise">Speak with the people you love.</p>
      <p>Ismi is a language learning app built around human connection, without predatory engagement algorithms. No hearts that stop you learning, no ads, and no pressure to protect a streak. Practice at your own pace, revisit mistakes and keep going.</p>
      <p>Understanding a language means understanding the culture and significance of each word, phrase and conversation: who says it, when it fits and what it means to the people you care about. Rooted in Palestinian Arabic, Ismi is growing to welcome more languages while keeping that everyday context at the heart of learning.</p>
      <p>Real native speakers are central to the learning experience we want to build. Native-speaker review and human recordings are still being arranged; this development preview includes unreviewed material and clearly labeled synthetic or device audio where available. Each course shows its current availability and review status.</p>
      <section aria-labelledby="about-faq">
        <h2 id="about-faq">Frequently asked questions</h2>
        <div class="about-faq-list">
          <details v-for="faq in faqs" :key="faq.question">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </section>
      <footer><a href="#/today">Open the app</a><a href="#/privacy">Privacy policy</a></footer>
    </main>
  </div>
</template>

<style scoped>
.about-page { min-height: 100vh; background: #fafbf9; color: #233630; border-top: 4px solid #087456; }
.about-header, .about-main { max-width: 760px; margin: 0 auto; padding: 18px 22px; }
.about-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.about-header > span { color: #596861; font-size: .8125rem; }
.about-brand { display: inline-flex; align-items: center; gap: 8px; color: inherit; font-size: 1.6rem; font-weight: 700; text-decoration: none; }
.about-brand span { font-size: 1.25rem; }
.about-main { padding-top: 8px; padding-bottom: 64px; line-height: 1.7; }
.about-back { display: flex; flex-wrap: wrap; gap: 12px; }
h1 { margin: 28px 0 4px; font-size: clamp(2rem, 6vw, 2.6rem); }
.about-promise { color: #087456; font-size: 1.2rem; font-weight: 700; margin-top: 0; }
section { margin-top: 36px; }
h2 { color: #17684e; font-size: 1.4rem; line-height: 1.3; }
details { border-bottom: 1px solid #c8d4cc; padding: 4px 0; }
summary { padding: 14px 0; cursor: pointer; font-weight: 600; }
details p { margin: 0 0 16px; }
footer { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 32px; }
footer a { display: inline-flex; align-items: center; min-height: 44px; color: #17684e; }
:focus-visible { outline: 3px solid #b73f4f; outline-offset: 4px; }
</style>
