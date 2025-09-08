// Role utility functions
export const getRoleLabel = (role: string | undefined | null) => {
  if (!role) return ''
  const labels = {
    admin: 'Администратор',
    marketing: 'Маркетинг',
    viewer: 'Просмотр'
  }
  return labels[role as keyof typeof labels] || role
}

export const getRoleColor = (role: string) => {
  const colors = {
    admin: 'user-role--admin',
    marketing: 'user-role--marketing',
    viewer: 'user-role--viewer'
  }
  return colors[role as keyof typeof colors] || 'user-role--viewer'
}