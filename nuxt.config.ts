export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {
    public: {
      apiBase: "http://127.0.0.1:8000/api"
    }
  },
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            utils: ['axios']
          }
        }
      }
    }
  },
  css: [
    '~/assets/css/shared/index.css'
  ],
  // Отключаем SSR для ускорения dev режима
  ssr: true,
  // Оптимизируем сборку
  experimental: {
    payloadExtraction: false
  }
})
