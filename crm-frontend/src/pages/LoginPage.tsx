import { Link } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Mini CRM</h1>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
