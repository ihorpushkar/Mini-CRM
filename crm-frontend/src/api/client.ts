import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { parseAxiosError } from '../utils/errors'

const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`

const client = axios.create({
  baseURL,
  timeout: 15000,
})

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(parseAxiosError(err))
  },
)

export default client
