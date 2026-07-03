import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { getErrorMessage } from '../../utils/errors'
import { showError, showSuccess } from '../../utils/toast'
import { formClass, labelClass, inputClass } from '../../utils/formStyles'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      showError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.login(email, password)
      if (response.status !== 200) {
        throw new Error('Login failed')
      }
      const { token, refreshToken } = response.data.data
      setTokens(token, refreshToken)
      const user = await authAPI.getMe()
      setUser(user)
      showSuccess('Welcome back!')
      navigate('/')
    } catch (err) {
      showError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
