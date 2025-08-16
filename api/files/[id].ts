import { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id?: string };
  if (!id) return res.status(400).json({ error: 'missing id' });
  try {
    // prevent caching at CDN/proxy layers
  try { res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); } catch { /* ignore in non-Node env */ }

    // add a timestamp to Upstash GET to avoid intermediate caches returning 304 Not Modified
    const key = `file:${id}`;
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return res.status(404).json({ error: 'not found' });
    }
    const getUrl = `${UPSTASH_URL}/get/${encodeURIComponent(key)}?t=${Date.now()}`;
    const r = await fetch(getUrl, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
    const text = await r.text();
    if (!r.ok) {
      console.error('Upstash get failed', { status: r.status, body: text, getUrl });
      return res.status(502).json({ error: 'upstream error', upstreamStatus: r.status, upstreamBody: text });
    }
    const json = JSON.parse(text);
    if (!json.result) return res.status(404).json({ error: 'not found' });
    const parsed = JSON.parse(json.result);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
}
