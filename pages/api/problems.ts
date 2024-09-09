import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM problems ORDER BY created_at DESC LIMIT 1`;
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch problem' });
    }
  } else if (req.method === 'POST') {
    const { editableProblem } = req.body;
    try {
      await sql`UPDATE problems SET editable_problem = ${editableProblem} WHERE id = (SELECT id FROM problems ORDER BY created_at DESC LIMIT 1)`;
      res.status(200).json({ message: 'Problem updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update problem' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}