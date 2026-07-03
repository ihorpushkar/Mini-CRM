import { useState } from 'react'
import { tasksAPI } from '../../api/tasks'
import { taskUpdateSchema, type TaskUpdateInput } from '../../schemas'
import type { Task } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError } from '../../utils/toast'

interface TaskEditFormProps {
  task: Task
  onSuccess: () => void
  onCancel: () => void
}

export default function TaskEditForm({ task, onSuccess, onCancel }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState<'pending' | 'completed'>(task.status)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updateData: TaskUpdateInput = {}
      if (title !== task.title) updateData.title = title
      if (description !== (task.description || '')) updateData.description = description || undefined
      if (status !== task.status) updateData.status = status

      if (Object.keys(updateData).length === 0) {
        showError('No changes to save')
        return
      }

      const parsed = taskUpdateSchema.parse(updateData)
      setLoading(true)
      await tasksAPI.updateTask(task.id, parsed)
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={loading} />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex space-x-3">
        <button type="button" onClick={onCancel} disabled={loading} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400">{loading ? 'Saving...' : 'Update'}</button>
      </div>
    </form>
  )
}
