import { createApp, createSSRApp } from 'vue'
import './style.css'
import AppShell from './AppShell.vue'
import { isLearnerRoute } from './routes'
// Hash navigation owns scroll positions. Browser restoration must not race it.
history.scrollRestoration = 'manual'
const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
if (navigation?.type === 'reload') {
  // Reload starts at the top; explicit section links still work on other visits.
  if (!isLearnerRoute(window.location.hash) && window.location.hash) {
    history.replaceState(history.state, '', window.location.pathname + window.location.search)
  }
  const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  resetScroll()
  window.addEventListener('pageshow', resetScroll, { once: true })
}
const root = document.getElementById('app')!
if (root.hasAttribute('data-prerendered') && !isLearnerRoute(window.location.hash)) {
  createSSRApp(AppShell).mount(root)
} else {
  root.replaceChildren()
  createApp(AppShell).mount(root)
}
