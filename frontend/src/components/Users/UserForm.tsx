import { useState } from 'react'
import { usersAPI } from '../../api/users'
import { userUpdateSchema, type UserUpdateInput } from '../../schemas'
import type { User } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError } from '../../utils/toast'
import { formClass, labelClass, inputClass } from '../../utils/formStyles'

interface UserFormProps {
  user?: User
  onSuccess: () => void
  onCancel: () => void
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>(user?.role || 'user')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

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
    <form onSubmit={handleSubmit} className={formClass}>
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password (leave blank to keep current)
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="role" className={labelClass}>Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
          className={inputClass}
          disabled={loading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Update'}
        </button>
      </div>
    </form>
  )
}
