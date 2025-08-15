import { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { title, content } = req.body || {};
    if (!content) return res.status(400).json({ error: 'missing content' });

    const id = uuidv4();
    const key = `file:${id}`;
    const value = JSON.stringify({ id, title, content, createdAt: new Date().toISOString() });

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      // If Upstash not configured, return id but don't persist
      return res.status(201).json({ id });
    }

    // Upstash REST set: POST {UPSTASH_URL}/set/<key>/<value>
    const setUrl = `${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`;
    const r = await fetch(setUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('Upstash set failed', r.status, text);
      return res.status(500).json({ error: 'failed to persist' });
    }

    return res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal error' });
  }
}
