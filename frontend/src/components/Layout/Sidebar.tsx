export type DashboardTab = 'users' | 'clients' | 'tasks'

interface SidebarProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  isAdmin: boolean
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ activeTab, onTabChange, isAdmin, isOpen, onClose }: SidebarProps) {
  const tabClass = (tab: DashboardTab) =>
    `block w-full text-left px-4 py-2 rounded-md transition-colors ${
      activeTab === tab
        ? 'bg-blue-600 text-white'
        : 'text-white hover:bg-gray-700'
    }`

  const handleTabChange = (tab: DashboardTab) => {
    onTabChange(tab)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`w-64 shrink-0 bg-gray-800 z-50 transition-transform duration-200 ease-in-out
          fixed top-0 left-0 h-full
          md:static md:h-auto md:min-h-full md:translate-x-0 md:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isOpen ? 'block' : 'hidden md:block'}`}
      >
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-700">
          <span className="text-white font-semibold text-sm">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {isAdmin && (
              <li>
                <button
                  type="button"
                  onClick={() => handleTabChange('users')}
                  className={tabClass('users')}
                >
                  Users
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                onClick={() => handleTabChange('clients')}
                className={tabClass('clients')}
              >
                Clients
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleTabChange('tasks')}
                className={tabClass('tasks')}
              >
                Tasks
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  )
}
