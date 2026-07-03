import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'
import UserList from '../components/Users/UserList'
import ClientList from '../components/Clients/ClientList'
import TaskList from '../components/Tasks/TaskList'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

          <div className={`grid grid-cols-1 gap-6 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {isAdmin && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Users</h3>
                <UserList />
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Clients</h3>
              <ClientList />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Tasks</h3>
              <TaskList />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
