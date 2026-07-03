export type DashboardTab = 'users' | 'clients' | 'tasks'

interface SidebarProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  isAdmin: boolean
}

export default function Sidebar({ activeTab, onTabChange, isAdmin }: SidebarProps) {
  const tabClass = (tab: DashboardTab) =>
    `block w-full text-left px-4 py-2 rounded-md transition-colors ${
      activeTab === tab
        ? 'bg-blue-600 text-white'
        : 'text-white hover:bg-gray-700'
    }`

  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {isAdmin && (
            <li>
              <button
                type="button"
                onClick={() => onTabChange('users')}
                className={tabClass('users')}
              >
                Users
              </button>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={() => onTabChange('clients')}
              className={tabClass('clients')}
            >
              Clients
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onTabChange('tasks')}
              className={tabClass('tasks')}
            >
              Tasks
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
