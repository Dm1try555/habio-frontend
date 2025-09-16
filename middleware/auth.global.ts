export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const isAdminRoute = to.path.startsWith('/admin')
  const isClientRoute = to.path.startsWith('/client')

  const adminToken = useCookie('admin_access_token').value || localStorage.getItem('admin_token')
  const clientToken = useCookie('client_access_token').value || localStorage.getItem('client_token')
  const clientUserRaw = typeof window !== 'undefined' ? localStorage.getItem('client_user') : null
  const clientUser = clientUserRaw ? JSON.parse(clientUserRaw) : null

  if (isAdminRoute && !adminToken) {
    return navigateTo('/admin/login')
  }

  if (isClientRoute && !clientToken) {
    // allow public client routes like register/login
    const publicClientRoutes = ['/client/auth/login', '/client/auth/register']
    if (!publicClientRoutes.includes(to.path)) {
      return navigateTo('/client/auth/login')
    }
  }

  // role-based access for admin sub-areas
  if (isAdminRoute && adminToken) {
    const role = useCookie('admin_user_role').value || 'viewer'
    if (to.path.startsWith('/admin/admin') && role !== 'admin') {
      return navigateTo(`/admin/${role}`)
    }
  }

  // simple plan-based gating example for client languages/settings
  if (isClientRoute && clientUser) {
    if (to.path.startsWith('/client/settings/languages') && clientUser.plan === 'free') {
      return navigateTo('/client/pricing')
    }
  }
})

