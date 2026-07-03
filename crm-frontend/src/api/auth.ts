import client from './client'
import type { User } from '../types'

export const authAPI = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    client.post('/auth/register', { email, password }),
  getMe: async (): Promise<User> => {
    const response = await client.get('/auth/me')
    return response.data.data.user
  },
}
