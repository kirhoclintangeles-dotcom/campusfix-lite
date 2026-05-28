import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        }
      }
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Account created successfully. You can now log in.')

    setTimeout(() => {
      router.push('/login')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-sm p-8 border border-gray-200">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-8">
          Register to access CampusFix.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Account Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {message && (
            <p className="text-sm text-gray-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-semibold">
            Login
          </Link>
        </p>

      </div>

    </div>
  )
}