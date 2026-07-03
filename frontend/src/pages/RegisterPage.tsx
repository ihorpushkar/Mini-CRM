import { Link } from 'react-router-dom'
import RegisterForm from '../components/Auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Mini CRM</h1>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
