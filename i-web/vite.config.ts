import vue from '@vitejs/plugin-vue'
import { createServer, defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const apiProxyTarget = process.env.ISMI_API_PROXY_TARGET ?? 'http://127.0.0.1:5062'

// https://vite.dev/config/
export default defineConfig({
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
      includeAssets: ['ismi-mark.svg', 'characters/v1/*.webp'],
      workbox: { globIgnores: ['landing/**', 'og.png'] },
      manifest: {
        name: 'Ismi — Arabic for the conversations that matter',
        short_name: 'Ismi',
        description: 'Practice Palestinian Levantine Arabic with downloaded lessons and optional accounts.',
        theme_color: '#fafbf9',
        background_color: '#fafbf9',
        display: 'standalone',
        start_url: '/#/today',
        icons: [
          {
            src: '/ismi-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
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
