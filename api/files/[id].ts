import { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id?: string };
  if (!id) return res.status(400).json({ error: 'missing id' });

  try {
    const key = `file:${id}`;
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return res.status(404).json({ error: 'not found' });
    }

    const getUrl = `${UPSTASH_URL}/get/${encodeURIComponent(key)}`;
    const r = await fetch(getUrl, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
    if (!r.ok) return res.status(404).json({ error: 'not found' });
    const json = await r.json();
    if (!json.result) return res.status(404).json({ error: 'not found' });
    const parsed = JSON.parse(json.result);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
}
