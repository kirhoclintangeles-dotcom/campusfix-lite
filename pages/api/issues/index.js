import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { title, description, category } = req.body

    const { data, error } = await supabase
      .from('issues')
      .insert([
        {
          title,
          description,
          category,
          status: 'Pending'
        }
      ])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json(data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}