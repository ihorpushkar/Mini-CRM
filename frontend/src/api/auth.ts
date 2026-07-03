import client from './client'
import type { User } from '../types'

type AuthTokens = {
  token: string
  refreshToken: string
}

type AuthResponse = {
  user: User
  token: string
  refreshToken: string
}

export const authAPI = {
  login: (email: string, password: string) =>
    client.post<{ success: boolean; data: AuthResponse }>('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    client.post<{ success: boolean; data: AuthResponse }>('/auth/register', { email, password }),
  refresh: (refreshToken: string) =>
    client.post<{ success: boolean; data: AuthTokens }>('/auth/refresh', { refreshToken }),
  getMe: async (): Promise<User> => {
    const response = await client.get('/auth/me')
    if (response.status !== 200 || !response.data?.data?.user) {
      throw new Error('Failed to load user profile')
    }
    return response.data.data.user
  },
}
