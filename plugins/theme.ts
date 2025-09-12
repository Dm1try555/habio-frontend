export default defineNuxtPlugin((nuxtApp) => {
  const applyTheme = (path: string) => {
    if (typeof document === 'undefined') return
    document.body.classList.remove('admin-theme', 'client-theme')
    if (path.startsWith('/admin')) {
      document.body.classList.add('admin-theme')
    } else {
      document.body.classList.add('client-theme')
    }
  }

  // initial
  applyTheme(useRoute().path)

  // on route change
  nuxtApp.hook('page:finish', () => {
    applyTheme(useRoute().path)
  })
})
