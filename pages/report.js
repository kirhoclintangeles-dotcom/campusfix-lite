import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ReportPage() {

  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    await fetch('/api/issues', {
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

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-xl rounded-3xl shadow-sm p-8">

        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Report an Issue
        </h1>

        <p className="text-gray-500 mb-8">
          Submit campus concerns for quick action.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Issue Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select Category</option>
              <option value="Electrical">Electrical</option>
              <option value="Furniture">Furniture</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Safety">Safety</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Submit Report
          </button>

        </form>

      </div>

    </div>
  )
}