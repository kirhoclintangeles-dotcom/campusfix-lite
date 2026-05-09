import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {

  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')

  async function fetchIssues() {
    const response = await fetch('/api/issues')
    const data = await response.json()

    setIssues(data)
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  async function deleteIssue(id) {
    await fetch(`/api/issues/${id}`, {
      method: 'DELETE'
    })

    fetchIssues()
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-5xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              CampusFix
            </h1>

            <p className="text-gray-500 mt-2">
              Campus Issue Reporting System
            </p>
          </div>

          <Link href="/report">
            <button className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition">
              Report Issue
            </button>
          </Link>
        </div>

<input
  type="text"
  placeholder="Search issues..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full mb-6 p-4 rounded-2xl border border-gray-300"
/>

        <div className="grid gap-5">

          {issues.length === 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center text-gray-500">
              No issues reported yet.
            </div>
          )}

          {issues
  .filter(issue =>
    issue.title.toLowerCase().includes(search.toLowerCase())
  )
  .map(issue => (
            <div
              key={issue.id}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
            >

              <div className="flex justify-between items-start mb-4">

                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {issue.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {issue.category}
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  {issue.status}
                </span>

              </div>

              <p className="text-gray-700 mb-5 leading-relaxed">
                {issue.description}
              </p>

            <div className="flex gap-3 flex-wrap">

  <button
    onClick={async () => {
      await fetch(`/api/issues/${issue.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'Pending'
        })
      })

      fetchIssues()
    }}
    className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
  >
    Pending
  </button>

  <button
    onClick={async () => {
      await fetch(`/api/issues/${issue.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'In Progress'
        })
      })

      fetchIssues()
    }}
    className="bg-blue-500 text-white px-4 py-2 rounded-xl"
  >
    In Progress
  </button>

  <button
    onClick={async () => {
      await fetch(`/api/issues/${issue.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'Resolved'
        })
      })

      fetchIssues()
    }}
    className="bg-green-500 text-white px-4 py-2 rounded-xl"
  >
    Resolved
  </button>

  <button
    onClick={() => deleteIssue(issue.id)}
    className="bg-red-500 text-white px-4 py-2 rounded-xl"
  >
    Delete
  </button>

</div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}