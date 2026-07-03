import client from './client'
import type { User } from '../types'
import type { UserUpdateInput } from '../schemas'

export const usersAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await client.get('/users')
    return response.data.data.users
  },
  updateUser: async (id: string, data: UserUpdateInput): Promise<User> => {
    const response = await client.put(`/users/${id}`, data)
    return response.data.data.user
  },
  deleteUser: async (id: string): Promise<void> => {
    await client.delete(`/users/${id}`)
  },
}
