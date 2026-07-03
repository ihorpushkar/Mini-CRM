import { useState } from 'react'
import { clientsAPI } from '../../api/clients'
import { clientUpdateSchema, type ClientUpdateInput } from '../../schemas'
import type { Client } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError } from '../../utils/toast'
import { formClass, labelClass, inputClass } from '../../utils/formStyles'

interface ClientEditFormProps {
  client: Client
  onSuccess: () => void
  onCancel: () => void
}

export default function ClientEditForm({ client, onSuccess, onCancel }: ClientEditFormProps) {
  const [name, setName] = useState(client.name)
  const [email, setEmail] = useState(client.email)
  const [phone, setPhone] = useState(client.phone || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updateData: ClientUpdateInput = {}
      if (name !== client.name) updateData.name = name
      if (email !== client.email) updateData.email = email
      if (phone !== (client.phone || '')) updateData.phone = phone || undefined

      if (Object.keys(updateData).length === 0) {
        showError('No changes to save')
        return
      }

      const parsed = clientUpdateSchema.parse(updateData)
      setLoading(true)
      await clientsAPI.updateClient(client.id, parsed)
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
        <label htmlFor="name" className={labelClass}>Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required disabled={loading} />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required disabled={loading} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>Phone (optional)</label>
        <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} disabled={loading} />
      </div>
      <div className="flex space-x-3">
        <button type="button" onClick={onCancel} disabled={loading} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400">{loading ? 'Saving...' : 'Update'}</button>
      </div>
    </form>
  )
}
