import { useState, useEffect } from 'react'
import { tasksAPI } from '../../api/tasks'
import { clientsAPI } from '../../api/clients'
import { taskSchema, taskUpdateSchema, type TaskInput, type TaskUpdateInput } from '../../schemas'
import type { Task, Client } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError } from '../../utils/toast'

interface TaskFormProps {
  task?: Task
  onSuccess: () => void
  onCancel: () => void
}

export default function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [clientId, setClientId] = useState(task?.clientId || '')
  const [status, setStatus] = useState<'pending' | 'completed'>(task?.status || 'pending')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingClients, setLoadingClients] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true)
        const data = await clientsAPI.getClients()
        setClients(data)
      } catch (err) {
        console.error('Failed to fetch clients:', err)
      } finally {
        setLoadingClients(false)
      }
    }

    fetchClients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (task) {
        // Update mode
        const updateData: TaskUpdateInput = {}
        if (title !== task.title) updateData.title = title
        if (description !== task.description) updateData.description = description
        if (status !== task.status) updateData.status = status

        if (Object.keys(updateData).length === 0) {
          setError('No changes to save')
          return
        }

        const parsed = taskUpdateSchema.parse(updateData)
        setLoading(true)
        await tasksAPI.updateTask(task.id, parsed)
      } else {
        // Create mode
        const data: TaskInput = { title, description: description || undefined, clientId, status }
        const parsed = taskSchema.parse(data)
        setLoading(true)
        await tasksAPI.createTask(parsed)
      }

      onSuccess()
    } catch (err) {
      showError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
          Client
        </label>
        <select
          id="clientId"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loadingClients}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : task ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
