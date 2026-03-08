module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, model = 'claude-opus-4-20250805', max_tokens = 1024 } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages format' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model, max_tokens, messages })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error.message });
    }

    const data = await response.json();
    return res.status(200).json({
      content: data.content[0].text,
      stop_reason: data.stop_reason,
      usage: data.usage
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
```

4. **Commit:** Click "Commit changes" → Write message "Fix: CommonJS export" → Commit
5. **Wait 30 seconds** → Vercel auto-redeploys
6. **Test:** Open your URL in browser → Should see **405 error** (good!) instead of 404

---

## ✅ Then You're Done

Your endpoint will be ready:
```
https://your-vercel-url.vercel.app/api/claude-proxy
