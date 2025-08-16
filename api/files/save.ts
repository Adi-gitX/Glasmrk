import { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // prevent caching at CDN/proxy layers
  try { res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); } catch { /* ignore in non-Node env */ }

  try {
    const { title, content } = req.body || {};
    if (!content) return res.status(400).json({ error: 'missing content' });

    const id = uuidv4();
    const key = `file:${id}`;
    const value = JSON.stringify({ id, title, content, createdAt: new Date().toISOString() });

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      console.error('Upstash credentials missing in environment');
      return res.status(500).json({ error: 'upstash_not_configured' });
    }

    // Upstash REST set: POST {UPSTASH_URL}/set/<key>/<value>
    const setUrl = `${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`;
    const r = await fetch(setUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('Upstash set failed', { status: r.status, body: text, setUrl });
      // return 502 to indicate upstream service error
      return res.status(502).json({ error: 'failed to persist', upstreamStatus: r.status, upstreamBody: text });
    }

  return res.status(201).json({ id, persisted: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal error' });
  }
}
