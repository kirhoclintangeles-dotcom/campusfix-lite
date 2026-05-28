import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('GET issues error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { title, description, category } = req.body

    if (!title || !description || !category) {
      return res.status(400).json({
        error: 'Title, description, and category are required.'
      })
    }

    const { data, error } = await supabase
      .from('issues')
      .insert([
        {
          title: title,
          description: description,
          category: category,
          status: 'Pending'
        }
      ])
      .select()

    if (error) {
      console.error('POST issue error:', error)

      return res.status(500).json({
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    }

    return res.status(201).json(data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}