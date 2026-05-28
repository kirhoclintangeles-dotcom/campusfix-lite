import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function ReportPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
        return
      }

      setCheckingAuth(false)
    }

    checkUser()

    const savedMode = localStorage.getItem('darkMode')

    if (savedMode === 'true') {
      setDarkMode(true)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    const response = await fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        category,
        status: 'Pending'
      })
    })

    const data = await response.json()
    console.log('Submit response:', data)

    if (!response.ok) {
      alert('Failed to submit issue. Please check the console.')
      return
    }

    router.push('/')
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-lg">Checking account...</p>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-900 flex items-center justify-center p-6' : 'min-h-screen bg-gray-100 flex items-center justify-center p-6'}>

      <div className={darkMode ? 'bg-gray-800 w-full max-w-xl rounded-3xl shadow-sm p-8 border border-gray-700' : 'bg-white w-full max-w-xl rounded-3xl shadow-sm p-8'}>

        <h1 className={darkMode ? 'text-3xl font-bold mb-2 text-white' : 'text-3xl font-bold mb-2 text-gray-800'}>
          Report an Issue
        </h1>

        <p className={darkMode ? 'text-gray-300 mb-8' : 'text-gray-500 mb-8'}>
          Submit campus concerns for quick action.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className={darkMode ? 'block mb-2 font-medium text-gray-200' : 'block mb-2 font-medium text-gray-700'}>
              Issue Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={
                darkMode
                  ? 'w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-gray-500'
                  : 'w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black'
              }
              required
            />
          </div>

          <div>
            <label className={darkMode ? 'block mb-2 font-medium text-gray-200' : 'block mb-2 font-medium text-gray-700'}>
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className={
                darkMode
                  ? 'w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-gray-500'
                  : 'w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black'
              }
              required
            />
          </div>

          <div>
            <label className={darkMode ? 'block mb-2 font-medium text-gray-200' : 'block mb-2 font-medium text-gray-700'}>
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={
                darkMode
                  ? 'w-full border border-gray-700 bg-gray-900 text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-gray-500'
                  : 'w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black'
              }
              required
            >
              <option value="">Select Category</option>
              <option value="Facility Issue">Facility Issue</option>
              <option value="Safety Concern">Safety Concern</option>
              <option value="Internet & Technology">Internet & Technology</option>
              <option value="Classroom Equipment">Classroom Equipment</option>
              <option value="Student Services">Student Services</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Campus Environment">Campus Environment</option>
              <option value="Suggestion">Suggestion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className={darkMode ? 'w-full bg-white text-black py-4 rounded-xl font-semibold hover:opacity-90 transition' : 'w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 transition'}
          >
            Submit Report
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className={darkMode ? 'w-full border border-gray-600 text-gray-200 py-4 rounded-xl font-semibold hover:bg-gray-700 transition' : 'w-full border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-100 transition'}
          >
            Back to Dashboard
          </button>

        </form>

      </div>

    </div>
  )
}