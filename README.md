# 🛡️ ShieldAI Landing Page

Modern, dark-mode landing page for the ShieldAI Content Moderation API.

## Overview

- **Pure static site** — HTML, CSS, and vanilla JS. No build step required.
- **Dark mode** with electric cyan accent (#00D4FF)
- **Responsive** — works on mobile, tablet, and desktop
- **Interactive demo** — mock moderation engine + live API mode
- **Smooth scroll** animations powered by Intersection Observer

## Local Development

Just open `index.html` in a browser, or use any static server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (or use Vercel CLI directly)
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework preset: **Other** (no framework)
4. Root directory: `./` (or the subfolder path)
5. Click Deploy

Or via CLI:

```bash
npm i -g vercel
cd shieldai-landing
vercel
```

## Deploy to GitHub Pages

1. Push to a GitHub repo
2. Go to Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Save — your site will be at `https://<user>.github.io/<repo>/`

## Deploy to Netlify

1. Drag and drop this folder at [app.netlify.com/drop](https://app.netlify.com/drop)
2. Done.

Or connect to a Git repo for automatic deploys.

## Deploy to Cloudflare Pages

1. Push to GitHub/GitLab
2. Cloudflare Dashboard → Pages → Create a project
3. Connect repo, build command: (leave empty), output directory: `.`
4. Deploy

## Files

| File | Description |
|---|---|
| `index.html` | Main page — all sections |
| `style.css` | Complete styles — dark theme, responsive |
| `script.js` | Scroll animations, code tabs, live demo |
| `README.md` | This file |

## API Reference

- **API Base URL:** `https://shieldai-api-production.up.railway.app`
- **API Docs:** `https://shieldai-api-production.up.railway.app/docs`
- **RapidAPI:** *(coming soon)*

### Quick Test

```bash
curl -X POST https://shieldai-api-production.up.railway.app/v1/moderate/text \
  -H "X-API-Key: shld_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}'
```

## License

© 2026 ShieldAI. All rights reserved.
