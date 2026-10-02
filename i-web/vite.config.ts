import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const apiProxyTarget = process.env.ISMI_API_PROXY_TARGET ?? 'http://127.0.0.1:5062'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['ismi-mark.svg', 'characters/v1/*.webp'],
      manifest: {
        name: 'Ismi — Arabic for the conversations that matter',
        short_name: 'Ismi',
        description: 'Learn Palestinian Levantine, MSA, and Quranic Arabic in one focused daily plan.',
        theme_color: '#fafbf9',
        background_color: '#fafbf9',
        display: 'standalone',
        start_url: '/',
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
