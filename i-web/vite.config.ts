import { readFileSync } from 'node:fs'
import vue from '@vitejs/plugin-vue'
import { createServer, defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const apiProxyTarget = process.env.ISMI_API_PROXY_TARGET ?? 'http://127.0.0.1:5062'

// https://vite.dev/config/
export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version) },
  plugins: [
    vue(),
    {
      name: 'ismi-prerender-landing',
      apply: 'build',
      enforce: 'post',
      async generateBundle(_options, bundle) {
        const html = bundle['index.html']
        if (!html || html.type !== 'asset') throw new Error('Missing root HTML.')
        const renderer = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
        try {
          const { renderLanding } = await renderer.ssrLoadModule('/src/landing/prerender.ts')
          html.source = String(html.source).replace('<div id="app"></div>', `<div id="app" data-prerendered>${await renderLanding()}</div>`)
        } finally { await renderer.close() }
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['ismi-mark.svg', 'icons/*.png', 'characters/v1/*.webp', 'characters/v2/*.webp', 'fonts/*.ttf', 'fonts/*-OFL.txt'],
      workbox: { globIgnores: ['landing/**', 'og.png'] },
      manifest: {
        name: 'Ismi — Speak with the people you love',
        short_name: 'Ismi',
        description: 'Learn through everyday conversations. Start with Palestinian Arabic and explore course availability. Download core lessons for offline study.',
        theme_color: '#fafbf9',
        background_color: '#fafbf9',
        display: 'standalone',
        start_url: '/#/today',
        icons: [
          { src: '/ismi-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': apiProxyTarget,
    },
  },
  preview: {
    proxy: {
      '/api': apiProxyTarget,
    },
  },
})
