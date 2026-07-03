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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header onMenuToggle={() => setMobileMenuOpen((open) => !open)} />
      <div className="flex flex-1 w-full md:gap-6">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAdmin={isAdmin}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gray-100">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{TAB_LABELS[activeTab]}</h2>

          <div className="mb-4 flex gap-2 border-b border-gray-200 md:hidden overflow-x-auto">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
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
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
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
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tasks
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 md:p-6 rounded-lg shadow-md">
              {activeTab === 'users' && isAdmin && <UserList />}
              {activeTab === 'clients' && <ClientList />}
              {activeTab === 'tasks' && <TaskList />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
