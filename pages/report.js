import { useState } from 'react'

export default function ReportPage() {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

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
        category
      })
    })

    const data = await response.json()

    console.log(data)

    alert('Issue Submitted!')

    setTitle('')
    setDescription('')
    setCategory('')
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Report Issue</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Submit
        </button>

      </form>
    </div>
  )
}