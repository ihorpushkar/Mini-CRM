import client from './client'
import type { Task } from '../types'
import type { TaskInput, TaskUpdateInput } from '../schemas'

export const tasksAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await client.get('/tasks')
    return response.data.data
  },
  createTask: async (data: TaskInput): Promise<Task> => {
    const response = await client.post('/tasks', data)
    return response.data.data
  },
  updateTask: async (id: string, data: TaskUpdateInput): Promise<Task> => {
    const response = await client.put(`/tasks/${id}`, data)
    return response.data.data
  },
  deleteTask: async (id: string): Promise<void> => {
    await client.delete(`/tasks/${id}`)
  },
}
