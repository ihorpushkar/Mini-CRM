import { useEffect, useState, useCallback } from 'react'
import { usersAPI } from '../../api/users'
import type { User } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError, showSuccess } from '../../utils/toast'
import Skeleton from '../Skeleton'
import EmptyState from '../EmptyState'
import Modal from '../Modal'
import UserForm from './UserForm'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setForbidden(false)
      const data = await usersAPI.getUsers()
      setUsers(data)
    } catch (err) {
      const message = getErrorMessage(err)
      if (message.toLowerCase().includes('forbidden') || message.toLowerCase().includes('permission')) {
        setForbidden(true)
      } else {
        showError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      setDeletingId(id)
      await usersAPI.deleteUser(id)
      setUsers((prev) => prev.filter((user) => user.id !== id))
      showSuccess('User deleted successfully')
    } catch (err) {
      showError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    showSuccess('User updated successfully')
    fetchUsers()
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

  if (forbidden) {
    return <p className="text-gray-500 text-sm">Admin access required to view users.</p>
  }

  return (
    <>
      {users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm space-x-2">
                    <button
                      onClick={() => { setEditingUser(user); setIsModalOpen(true) }}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={deletingId === user.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={deletingId === user.id}
                    >
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
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
        title="Edit User"
      >
        <UserForm
          user={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}
