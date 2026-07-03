import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { getErrorMessage } from '../../utils/errors'
import { showError, showSuccess } from '../../utils/toast'
import { formClass, labelClass, inputClass } from '../../utils/formStyles'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      showError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register(email, password)
      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Registration failed')
      }
      const { token, refreshToken } = response.data.data
      setTokens(token, refreshToken)
      const user = await authAPI.getMe()
      setUser(user)
      showSuccess('Account created successfully!')
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
      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  )
}
