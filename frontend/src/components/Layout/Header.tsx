import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { showSuccess } from '../../utils/toast'

interface HeaderProps {
  onMenuToggle?: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    showSuccess('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex w-full items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Mini CRM</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {user && (
            <span className="hidden sm:inline text-xs md:text-sm text-gray-600 truncate max-w-[120px] md:max-w-none">
              {user.email} ({user.role})
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md hover:bg-red-600 transition-colors text-xs md:text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
