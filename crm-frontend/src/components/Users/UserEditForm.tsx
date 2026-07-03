import { useState } from 'react'
import { usersAPI } from '../../api/users'
import { userUpdateSchema, type UserUpdateInput } from '../../schemas'
import type { User } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError } from '../../utils/toast'

interface UserEditFormProps {
  user: User
  onSuccess: () => void
  onCancel: () => void
}

export default function UserEditForm({ user, onSuccess, onCancel }: UserEditFormProps) {
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>(user.role)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updateData: UserUpdateInput = {}
      if (email !== user.email) updateData.email = email
      if (password) updateData.password = password
      if (role !== user.role) updateData.role = role

      if (Object.keys(updateData).length === 0) {
        showError('No changes to save')
        return
      }

      const parsed = userUpdateSchema.parse(updateData)
      setLoading(true)
      await usersAPI.updateUser(user.id, parsed)
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password (leave blank to keep current)
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex space-x-3">
        <button type="button" onClick={onCancel} disabled={loading} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Saving...' : 'Update'}
        </button>
      </div>
    </form>
  )
}
