import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {

  const { id } = req.query

  if (req.method === 'DELETE') {

    const { error } = await supabase
      .from('issues')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
      message: 'Issue deleted'
    })
  }

  if (req.method === 'PUT') {

    const { status } = req.body

    const { data, error } = await supabase
      .from('issues')
      .update({ status })
      .eq('id', id)
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  res.setHeader('Allow', ['DELETE', 'PUT'])

  res.status(405).end()
}