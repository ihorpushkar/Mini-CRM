import { useEffect, useState, useCallback } from 'react'
import { usersAPI } from '../../api/users'
import type { User } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError, showSuccess } from '../../utils/toast'
import Skeleton from '../Skeleton'
import EmptyState from '../EmptyState'
import Modal from '../Modal'
import UserEditForm from './UserEditForm'

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
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
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
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          disabled={deletingId === user.id}
                        >
                          {deletingId === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      ) : (
                        <span
                          title="Admin cannot be deleted"
                          className="text-gray-400 cursor-not-allowed"
                        >
                          Delete
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex md:hidden flex-col gap-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs uppercase">Email</span>
                    <p className="text-gray-900 font-medium break-all">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase">Role</span>
                    <p>
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => { setEditingUser(user); setIsModalOpen(true) }}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                    disabled={deletingId === user.id}
                  >
                    Edit
                  </button>
                  {user.role !== 'admin' ? (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                      disabled={deletingId === user.id}
                    >
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  ) : (
                    <span title="Admin cannot be deleted" className="text-gray-400 text-sm cursor-not-allowed">
                      Delete
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit User"
      >
        {editingUser && (
          <UserEditForm
            user={editingUser}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </>
  )
}
