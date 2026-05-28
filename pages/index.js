import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import {
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle,
  PlusCircle,
  Moon,
  Sun,
  Trash2,
  LogOut
} from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchFocused, setSearchFocused] = useState(false)
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [role, setRole] = useState('student')

  const categories = [
    'All',
    'Facility Issue',
    'Safety Concern',
    'Internet & Technology',
    'Classroom Equipment',
    'Student Services',
    'Accessibility',
    'Campus Environment',
    'Suggestion',
    'Other'
  ]

  const statuses = [
    'All',
    'Pending',
    'In Progress',
    'Resolved'
  ]

  async function fetchIssues() {
    const response = await fetch('/api/issues')
    const data = await response.json()

    if (Array.isArray(data)) {
      setIssues(data)
    } else if (Array.isArray(data.data)) {
      setIssues(data.data)
    } else {
      setIssues([])
    }
  }

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
        return
      }

      setUser(data.user)
      setRole(data.user.user_metadata?.role || 'student')
      setCheckingAuth(false)
      fetchIssues()
    }

    checkUser()

    const savedMode = localStorage.getItem('darkMode')

    if (savedMode === 'true') {
      setDarkMode(true)
    }
  }, [])

  function toggleDarkMode() {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function getStatusBadgeClass(status) {
    if (status === 'Pending') {
      return 'bg-yellow-100 text-yellow-700'
    }

    if (status === 'In Progress') {
      return 'bg-blue-100 text-blue-700'
    }

    if (status === 'Resolved') {
      return 'bg-green-100 text-green-700'
    }

    return 'bg-gray-100 text-gray-700'
  }

async function updateStatus(id, status) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const response = await fetch(`/api/issues/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      status: status
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    alert(errorData.error || 'Failed to update status.')
    return
  }

  fetchIssues()
}

  async function deleteIssue(id) {
  const confirmDelete = confirm('Are you sure you want to delete this issue?')

  if (!confirmDelete) return

  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const response = await fetch(`/api/issues/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    alert(errorData.error || 'Failed to delete issue.')
    return
  }

  fetchIssues()
}

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-lg">Checking account...</p>
      </div>
    )
  }

  const isAdmin = role === 'admin'
  const safeIssues = Array.isArray(issues) ? issues : []

  const totalReports = safeIssues.length
  const pendingReports = safeIssues.filter(issue => issue.status === 'Pending').length
  const inProgressReports = safeIssues.filter(issue => issue.status === 'In Progress').length
  const resolvedReports = safeIssues.filter(issue => issue.status === 'Resolved').length

  const filteredIssues = safeIssues.filter(issue => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.description.toLowerCase().includes(search.toLowerCase()) ||
      issue.category.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' || issue.category === selectedCategory

    const matchesStatus =
      selectedStatus === 'All' || issue.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-100'}>

      <div className="max-w-5xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              CF
            </div>

            <div>
              <h1 className={darkMode ? 'text-4xl font-bold text-white' : 'text-4xl font-bold text-gray-800'}>
                CampusFix
              </h1>

              <p className={darkMode ? 'text-gray-300 mt-2' : 'text-gray-500 mt-2'}>
                Campus Issue Reporting System
              </p>

              {user && (
                <p className={darkMode ? 'text-gray-400 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>
                  Logged in as {user.email} • Role: {role}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleDarkMode}
              className={
                darkMode
                  ? 'bg-gray-700 text-white px-5 py-3 rounded-xl hover:bg-gray-600 transition flex items-center gap-2'
                  : 'bg-white text-gray-800 px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition flex items-center gap-2'
              }
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <Link href="/report">
              <button className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition flex items-center gap-2">
                <PlusCircle size={18} />
                Report Issue
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className={darkMode ? 'bg-gray-800 border border-gray-700 rounded-2xl p-5' : 'bg-white border border-gray-200 rounded-2xl p-5'}>
            <div className="flex items-center justify-between">
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
                Total Reports
              </p>
              <ClipboardList className="text-gray-400" size={24} />
            </div>

            <h2 className={darkMode ? 'text-3xl font-bold text-white mt-2' : 'text-3xl font-bold text-gray-800 mt-2'}>
              {totalReports}
            </h2>
          </div>

          <div className={darkMode ? 'bg-gray-800 border border-gray-700 rounded-2xl p-5' : 'bg-white border border-gray-200 rounded-2xl p-5'}>
            <div className="flex items-center justify-between">
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
                Pending
              </p>
              <Clock className="text-yellow-500" size={24} />
            </div>

            <h2 className="text-3xl font-bold text-yellow-500 mt-2">
              {pendingReports}
            </h2>
          </div>

          <div className={darkMode ? 'bg-gray-800 border border-gray-700 rounded-2xl p-5' : 'bg-white border border-gray-200 rounded-2xl p-5'}>
            <div className="flex items-center justify-between">
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
                In Progress
              </p>
              <Wrench className="text-blue-500" size={24} />
            </div>

            <h2 className="text-3xl font-bold text-blue-500 mt-2">
              {inProgressReports}
            </h2>
          </div>

          <div className={darkMode ? 'bg-gray-800 border border-gray-700 rounded-2xl p-5' : 'bg-white border border-gray-200 rounded-2xl p-5'}>
            <div className="flex items-center justify-between">
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
                Resolved
              </p>
              <CheckCircle className="text-green-500" size={24} />
            </div>

            <h2 className="text-3xl font-bold text-green-500 mt-2">
              {resolvedReports}
            </h2>
          </div>

        </div>

        <div
          className={
            darkMode
              ? 'flex flex-col md:flex-row mb-6 rounded-2xl border border-gray-700 bg-gray-800 overflow-hidden'
              : 'flex flex-col md:flex-row mb-6 rounded-2xl border border-gray-300 bg-white overflow-hidden'
          }
        >
          <input
            type="text"
            placeholder={searchFocused ? 'Search by title, description, or category...' : 'Search'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={
              darkMode
                ? 'flex-1 p-4 bg-gray-800 text-white placeholder-gray-400 outline-none'
                : 'flex-1 p-4 bg-white text-gray-800 placeholder-gray-400 outline-none'
            }
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={
              darkMode
                ? 'md:w-56 p-4 border-t md:border-t-0 md:border-l border-gray-700 bg-gray-800 text-white outline-none'
                : 'md:w-56 p-4 border-t md:border-t-0 md:border-l border-gray-300 bg-white text-gray-800 outline-none'
            }
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'All' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={
              darkMode
                ? 'md:w-44 p-4 border-t md:border-t-0 md:border-l border-gray-700 bg-gray-800 text-white outline-none'
                : 'md:w-44 p-4 border-t md:border-t-0 md:border-l border-gray-300 bg-white text-gray-800 outline-none'
            }
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : status}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5">

          {safeIssues.length === 0 && (
            <div
              className={
                darkMode
                  ? 'bg-gray-800 rounded-2xl p-8 shadow-sm text-center text-gray-300 border border-gray-700'
                  : 'bg-white rounded-2xl p-8 shadow-sm text-center text-gray-500'
              }
            >
              No issues reported yet.
            </div>
          )}

          {safeIssues.length > 0 && filteredIssues.length === 0 && (
            <div
              className={
                darkMode
                  ? 'bg-gray-800 rounded-2xl p-8 shadow-sm text-center text-gray-300 border border-gray-700'
                  : 'bg-white rounded-2xl p-8 shadow-sm text-center text-gray-500'
              }
            >
              No matching issues found.
            </div>
          )}

          {filteredIssues.map(issue => (
            <div
              key={issue.id}
              className={
                darkMode
                  ? 'bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-700'
                  : 'bg-white rounded-2xl shadow-sm p-6 border border-gray-200'
              }
            >

              <div className="flex justify-between items-start mb-4">

                <div>
                  <h2 className={darkMode ? 'text-2xl font-semibold text-white' : 'text-2xl font-semibold text-gray-800'}>
                    {issue.title}
                  </h2>

                  <p className={darkMode ? 'text-gray-400 mt-1' : 'text-gray-500 mt-1'}>
                    {issue.category}
                  </p>
                </div>

                <span className={`${getStatusBadgeClass(issue.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                  {issue.status}
                </span>

              </div>

              <p className={darkMode ? 'text-gray-300 mb-5 leading-relaxed' : 'text-gray-700 mb-5 leading-relaxed'}>
                {issue.description}
              </p>

{isAdmin ? (
  <div className="flex gap-3 flex-wrap">

    <button
      onClick={() => updateStatus(issue.id, 'Pending')}
      className="bg-yellow-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
    >
      <Clock size={16} />
      Pending
    </button>

    <button
      onClick={() => updateStatus(issue.id, 'In Progress')}
      className="bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
    >
      <Wrench size={16} />
      In Progress
    </button>

    <button
      onClick={() => updateStatus(issue.id, 'Resolved')}
      className="bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
    >
      <CheckCircle size={16} />
      Resolved
    </button>

    <button
      onClick={() => deleteIssue(issue.id)}
      className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
    >
      <Trash2 size={16} />
      Delete
    </button>

  </div>
) : (
  <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
    Only admins can update status or delete reports.
  </p>
)}

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}