import { useEffect } from 'react'
import { authAPI } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/errors'

export const useAuth = () => {
  const { token, user, setUser, logout } = useAuthStore()

  useEffect(() => {
    if (token && !user) {
      authAPI.getMe()
        .then(setUser)
        .catch(() => logout())
    }
  }, [token, user, setUser, logout])

  return {
    token,
    user,
    isAuthenticated: !!token,
    logout,
  }
}

export { getErrorMessage }
