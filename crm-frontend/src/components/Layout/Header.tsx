import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { showSuccess } from '../../utils/toast'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    showSuccess('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">Mini CRM</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm text-gray-600">
              {user.email} ({user.role})
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
