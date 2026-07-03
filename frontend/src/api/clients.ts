import client from './client'
import type { Client } from '../types'
import type { ClientInput, ClientUpdateInput } from '../schemas'

export const clientsAPI = {
  getClients: async (): Promise<Client[]> => {
    const response = await client.get('/clients')
    return response.data.data
  },
  createClient: async (data: ClientInput): Promise<Client> => {
    const response = await client.post('/clients', data)
    return response.data.data
  },
  updateClient: async (id: string, data: ClientUpdateInput): Promise<Client> => {
    const response = await client.put(`/clients/${id}`, data)
    return response.data.data
  },
  deleteClient: async (id: string): Promise<void> => {
    await client.delete(`/clients/${id}`)
  },
}
