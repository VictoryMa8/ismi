import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import AppShell from '../AppShell.vue'
export function renderLanding() { return renderToString(createSSRApp(AppShell)) }
