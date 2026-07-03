import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="block px-4 py-2 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              className="block px-4 py-2 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/clients"
              className="block px-4 py-2 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Clients
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className="block px-4 py-2 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Tasks
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
