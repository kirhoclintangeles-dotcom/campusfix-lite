import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {

  const [issues, setIssues] = useState([])

  async function fetchIssues() {
    const response = await fetch('/api/issues')
    const data = await response.json()

    setIssues(data)
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  return (
    <div style={{ padding: '40px' }}>

      <h1>CampusFix Dashboard</h1>

      <Link href="/report">
        <button>Report Issue</button>
      </Link>

      <hr />

      {issues.map(issue => (
        <div
          key={issue.id}
          style={{
            border: '1px solid gray',
            padding: '15px',
            marginBottom: '20px'
          }}
        >
          <h3>{issue.title}</h3>

          <p>{issue.description}</p>

          <p>
            <strong>Category:</strong> {issue.category}
          </p>

          <p>
            <strong>Status:</strong> {issue.status}
          </p>
          
          <button
  onClick={async () => {

    await fetch(`/api/issues/${issue.id}`, {
      method: 'DELETE'
    })

    fetchIssues()
  }}
>
  Delete
</button>

        </div>
      ))}

    </div>
  )
}