// api/claude-proxy.js
// This function securely calls the Claude API and returns results to your Lovable frontend

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model = 'claude-opus-4-20250805', max_tokens = 1024 } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Get API key from environment variable (set in Vercel dashboard)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: max_tokens,
        messages: messages
      })
    });

    // Check for API errors
    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error.message });
    }

    const data = await response.json();
    
    // Return only the text content
    return res.status(200).json({
      content: data.content[0].text,
      stop_reason: data.stop_reason,
      usage: data.usage
    });

  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}