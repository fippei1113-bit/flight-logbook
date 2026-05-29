// Vercel Serverless Function — proxies requests to the Anthropic API.
// Keeps your ANTHROPIC_API_KEY off the browser.
//
// Setup:
// 1. In Vercel dashboard → Project → Settings → Environment Variables,
//    add ANTHROPIC_API_KEY = sk-ant-...
// 2. Redeploy.

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: String(err?.message || err) });
  }
}

// Vercel: allow larger payloads (PDFs/images can be up to ~30MB base64)
export const config = {
  api: {
    bodyParser: { sizeLimit: '50mb' },
  },
};
