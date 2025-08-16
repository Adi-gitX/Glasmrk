#!/usr/bin/env node
// Simple backend server to handle saving/getting markdown files using Upstash REST API.
// Usage: node server/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/api/files/save', async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!content) return res.status(400).json({ error: 'missing content' });

    const id = uuidv4();
    const key = `file:${id}`;
    const value = JSON.stringify({ id, title, content, createdAt: new Date().toISOString() });

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      // If Upstash not configured, return id but don't persist
      console.warn('Upstash not configured - returning id without persisting');
      return res.status(201).json({ id });
    }

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
});

app.get('/api/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'missing id' });

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
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
