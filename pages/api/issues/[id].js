import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'DELETE' && req.method !== 'PUT') {
    res.setHeader('Allow', ['DELETE', 'PUT'])
    return res.status(405).end()
  }

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized. No token provided.'
    })
  }

  const token = authHeader.replace('Bearer ', '')

  const { data, error: authError } = await supabase.auth.getUser(token)

  if (authError || !data.user) {
    return res.status(401).json({
      error: 'Unauthorized. Invalid user.'
    })
  }

  const role = data.user.user_metadata?.role || 'student'

  if (role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden. Admin access only.'
    })
  }

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
}