import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { UserRole } from '@/lib/types'

interface RequireAuthProps {
  allowedRoles?: UserRole[]
}

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { isAuthenticated, currentUser } = useAuthStore()

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // User is authenticated but doesn't have permission
    // Redirect to home or show unauthorized page
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
