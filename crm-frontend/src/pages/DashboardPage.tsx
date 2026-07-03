import { useState } from 'react'
import Header from '../components/Layout/Header'
import Sidebar, { type DashboardTab } from '../components/Layout/Sidebar'
import UserList from '../components/Users/UserList'
import ClientList from '../components/Clients/ClientList'
import TaskList from '../components/Tasks/TaskList'
import { useAuth } from '../hooks/useAuth'

const TAB_LABELS: Record<DashboardTab, string> = {
  users: 'Users',
  clients: 'Clients',
  tasks: 'Tasks',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [activeTab, setActiveTab] = useState<DashboardTab>(isAdmin ? 'users' : 'clients')

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin} />
        <main className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">{TAB_LABELS[activeTab]}</h2>

          <div className="mb-4 flex gap-2 border-b border-gray-200">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Clients
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tasks
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === 'users' && isAdmin && <UserList />}
            {activeTab === 'clients' && <ClientList />}
            {activeTab === 'tasks' && <TaskList />}
          </div>
        </main>
      </div>
    </div>
  )
}
