export type User = {
  id: string
  email: string
  role: 'admin' | 'user'
}

export type Client = {
  id: string
  name: string
  email: string
  phone?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type Task = {
  id: string
  title: string
  description?: string
  status: 'pending' | 'completed'
  clientId: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  client?: { id: string; name: string }
}
