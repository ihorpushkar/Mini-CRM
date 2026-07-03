import { useEffect, useState, useCallback } from 'react'
import { tasksAPI } from '../../api/tasks'
import type { Task } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError, showSuccess } from '../../utils/toast'
import Skeleton from '../Skeleton'
import EmptyState from '../EmptyState'
import Modal from '../Modal'
import TaskForm from './TaskForm'
import TaskEditForm from './TaskEditForm'

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await tasksAPI.getTasks()
      setTasks(data)
    } catch (err) {
      showError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      setDeletingId(id)
      await tasksAPI.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      showSuccess('Task deleted successfully')
    } catch (err) {
      showError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) =>
    status === 'completed' ? (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Completed</span>
    ) : (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
    )

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    showSuccess(editingTask ? 'Task updated successfully' : 'Task created successfully')
    fetchTasks()
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => { setEditingTask(undefined); setIsModalOpen(true) }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          Add Task
        </button>
      </div>
      {tasks.length === 0 ? (
        <EmptyState
          message="No tasks yet. Create a task to track your work."
          actionLabel="Add Task"
          onAction={() => { setEditingTask(undefined); setIsModalOpen(true) }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.title}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(task.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {task.client?.name ?? task.clientId}
                  </td>
                  <td className="px-4 py-3 text-right text-sm space-x-2">
                    <button
                      onClick={() => { setEditingTask(task); setIsModalOpen(true) }}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={deletingId === task.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={deletingId === task.id}
                    >
                      {deletingId === task.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        {editingTask ? (
          <TaskEditForm
            task={editingTask}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <TaskForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </>
  )
}
