import { useEffect, useState, useCallback } from 'react'
import { clientsAPI } from '../../api/clients'
import type { Client } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { showError, showSuccess } from '../../utils/toast'
import Skeleton from '../Skeleton'
import EmptyState from '../EmptyState'
import Modal from '../Modal'
import ClientForm from './ClientForm'

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>()

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      const data = await clientsAPI.getClients()
      setClients(data)
    } catch (err) {
      showError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      setDeletingId(id)
      await clientsAPI.deleteClient(id)
      setClients((prev) => prev.filter((client) => client.id !== id))
      showSuccess('Client deleted successfully')
    } catch (err) {
      showError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    showSuccess(editingClient ? 'Client updated successfully' : 'Client created successfully')
    fetchClients()
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
          onClick={() => { setEditingClient(undefined); setIsModalOpen(true) }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          Add Client
        </button>
      </div>
      {clients.length === 0 ? (
        <EmptyState
          message="No clients yet. Create your first client to get started."
          actionLabel="Add Client"
          onAction={() => { setEditingClient(undefined); setIsModalOpen(true) }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{client.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{client.phone || '—'}</td>
                  <td className="px-4 py-3 text-right text-sm space-x-2">
                    <button
                      onClick={() => { setEditingClient(client); setIsModalOpen(true) }}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={deletingId === client.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={deletingId === client.id}
                    >
                      {deletingId === client.id ? 'Deleting...' : 'Delete'}
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
        title={editingClient ? 'Edit Client' : 'Create Client'}
      >
        <ClientForm
          client={editingClient}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}
