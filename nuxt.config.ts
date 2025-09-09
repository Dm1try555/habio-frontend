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
    }
  },
  css: [
    '~/assets/css/shared/index.css'
  ]
})
