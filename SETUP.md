# Claude API Proxy for Lovable - Setup Guide

## Overview
This sets up a **free** Vercel serverless function that securely proxies Claude API calls from your Lovable frontend.

**Why this setup?**
- ✅ Free (Vercel free tier: 100 calls/day for hobby projects, plenty for testing)
- ✅ Secure (API key never exposed to frontend)
- ✅ Easy to connect from Lovable

---

## Step 1: Set Up Your GitHub Repo

1. Create a new GitHub account (if you don't have one): https://github.com/signup
2. Create a new repository:
   - Name: `claude-api-proxy` (or whatever you like)
   - Make it **Public** (required for free Vercel tier)
   - Initialize with a README

3. Clone the repo to your computer:
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-api-proxy.git
   cd claude-api-proxy
   ```

4. Add the files from this setup:
   - Copy `api/claude-proxy.js` into your repo
   - Copy `package.json` into your repo
   - Copy `.gitignore` into your repo

5. Commit and push:
   ```bash
   git add .
   git commit -m "Initial commit: Claude API proxy setup"
   git push origin main
   ```

---

## Step 2: Deploy to Vercel (Free)

1. Go to **https://vercel.com/signup**
2. Sign up with your GitHub account
3. Click **"New Project"**
4. Select your `claude-api-proxy` repository
5. Click **"Import"**
6. Leave all settings as default
7. Click **"Deploy"**

Vercel will deploy your function. You'll get a URL like:
```
https://claude-api-proxy-abc123.vercel.app
```

---

## Step 3: Add Your Claude API Key to Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** at the top
3. Go to **"Environment Variables"** in the left sidebar
4. Click **"Add New"**
5. Fill in:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Paste your Claude API key from console.anthropic.com
6. Click **"Add**
7. Your deployment will automatically redeploy with the new environment variable

---

## Step 4: Test Your Function

Open this URL in your browser (replace with your actual URL):
```
https://claude-api-proxy-abc123.vercel.app/api/claude-proxy
```

You should see a 405 error (expected - it only accepts POST requests). This means the function is working!

To test with a real request, use **Postman**, **Thunder Client**, or **curl**:

```bash
curl -X POST https://claude-api-proxy-abc123.vercel.app/api/claude-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Say hello!"}
    ],
    "model": "claude-opus-4-20250805",
    "max_tokens": 100
  }'
```

You should get a JSON response with Claude's reply.

---

## Step 5: Connect to Your Lovable Project

In your Lovable frontend code, replace direct API calls with calls to your Vercel function:

### Example: React/JavaScript in Lovable

**OLD (Don't do this - exposed key):**
```javascript
// ❌ BAD - Never do this!
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': 'sk-ant-...' } // EXPOSED!
});
```

**NEW (Secure - use your proxy):**
```javascript
// ✅ GOOD - Secure
const response = await fetch('https://claude-api-proxy-abc123.vercel.app/api/claude-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Your prompt here' }
    ],
    model: 'claude-opus-4-20250805',
    max_tokens: 1024
  })
});

const data = await response.json();
console.log(data.content); // Claude's response
```

---

## Step 6: Enable CORS (If Needed)

If you get CORS errors from your Lovable frontend, update your `api/claude-proxy.js` to add CORS headers:

Add this before the response:
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://your-lovable-domain.com');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
  return res.status(200).end();
}
```

---

## Important Notes

### Free Tier Limits:
- **100 calls per day** for hobby projects
- If you exceed, upgrade to Pro ($20/month) or set strict rate limiting

### Your API Credits:
- Your $100 Claude credits will be used by this function
- They expire March 9, 2026 - use them soon!
- Monitor usage at https://console.anthropic.com/account/usage

### Best Practices:
- ✅ Keep API key only in Vercel environment variables
- ✅ Never commit secrets to GitHub
- ✅ Use environment variables for any sensitive data
- ✅ Add rate limiting if you scale up

---

## Troubleshooting

**Error: "API key not configured"**
- Make sure you added `ANTHROPIC_API_KEY` to Vercel Environment Variables
- Redeploy after adding it

**CORS errors?**
- Add the CORS headers shown in Step 6
- Make sure your Lovable domain is added to allowed origins

**Function timeout?**
- Claude responses might take a few seconds
- The default timeout on Vercel free tier is fine for typical Claude calls

---

## Next Steps

Once this is working:
1. Build your Lovable app calling this proxy
2. Monitor usage at console.anthropic.com
3. Use your $100 credits before March 9, 2026
4. If you need more calls, upgrade to Vercel Pro or set up a billing alert

Good luck! 🚀
