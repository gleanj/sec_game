# Deployment Guide - Incident Response: The Game

## Quick Start (Local Testing)

1. **Open the game locally:**
   ```bash
   # Option 1: Direct file access
   # Just open game.html in your browser

   # Option 2: Using Python server (recommended)
   python serve.py
   # Then visit http://localhost:8000/game.html
   ```

## Free Hosting Options

### Option 1: GitHub Pages (Recommended - Easiest)

**Steps:**
1. Push your game files to a GitHub repository
2. Go to repository Settings → Pages
3. Select branch (main) and folder (root)
4. Your game will be live at: `https://yourusername.github.io/repo-name/game.html`

**Files to include:**
- `game.html`
- `game-engine.js`
- `game-styles.css`

**Setup commands:**
```bash
git add game.html game-engine.js game-styles.css DEPLOYMENT_GUIDE.md
git commit -m "Add browser-based incident response game"
git push origin main
```

Then enable GitHub Pages in your repo settings!

### Option 2: Netlify (Best for Custom Domains)

**Steps:**
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your folder OR connect to GitHub
3. Deploy automatically
4. Get free subdomain: `yourapp.netlify.app`

**Build settings:** None needed (static site)

### Option 3: Vercel (Fast Global CDN)

**Steps:**
1. Create account at [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Deploy with one click
4. Get domain: `yourapp.vercel.app`

### Option 4: Cloudflare Pages (Best Performance)

**Steps:**
1. Create account at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub
3. Configure build (none needed)
4. Deploy to global edge network

## Production Optimizations

### 1. Minify JavaScript
```bash
# Install terser
npm install -g terser

# Minify game engine
terser game-engine.js -o game-engine.min.js -c -m

# Update HTML to use minified version
# Change: <script src="game-engine.js"></script>
# To: <script src="game-engine.min.js"></script>
```

### 2. Minify CSS
```bash
# Install clean-css-cli
npm install -g clean-css-cli

# Minify styles
cleancss game-styles.css -o game-styles.min.css

# Update HTML reference
```

### 3. Enable Caching
Add a `_headers` file (for Netlify) or `vercel.json` (for Vercel):

**For Netlify (_headers):**
```
/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/game.html
  Cache-Control: public, max-age=3600
```

**For Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 4. Add PWA Support (Install as App)

Create `manifest.json`:
```json
{
  "name": "Incident Response: The Game",
  "short_name": "IR Game",
  "description": "Interactive incident response training simulation",
  "start_url": "/game.html",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#00ff88",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to `game.html` `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#00ff88">
```

### 5. Add Analytics (Optional)

**Google Analytics:**
```html
<!-- Add before </head> in game.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Plausible Analytics (Privacy-focused):**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Custom Domain Setup

### For GitHub Pages:
1. Buy domain (Namecheap, Google Domains, etc.)
2. Add CNAME record pointing to: `yourusername.github.io`
3. In GitHub repo settings, add custom domain
4. Enable HTTPS

### For Netlify/Vercel:
1. Go to domain settings in dashboard
2. Add custom domain
3. Update DNS records as instructed
4. SSL automatically configured

## File Structure for Deployment

```
your-repo/
├── game.html              # Main game file
├── game-engine.js         # Game logic
├── game-styles.css        # Styles
├── manifest.json          # PWA manifest (optional)
├── _headers              # Netlify headers (optional)
├── vercel.json           # Vercel config (optional)
├── README.md             # Project documentation
└── DEPLOYMENT_GUIDE.md   # This file
```

## SEO Optimization

Add to `<head>` in `game.html`:

```html
<!-- Primary Meta Tags -->
<meta name="title" content="Incident Response: The Game - Cybersecurity Training Simulation">
<meta name="description" content="Interactive browser-based incident response training. Make critical decisions during a ransomware attack. Test your cybersecurity skills!">
<meta name="keywords" content="incident response, cybersecurity, training, game, ransomware, simulation">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://yourdomain.com/">
<meta property="og:title" content="Incident Response: The Game">
<meta property="og:description" content="Interactive cybersecurity training simulation. Can you save the company from a ransomware attack?">
<meta property="og:image" content="https://yourdomain.com/preview.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://yourdomain.com/">
<meta property="twitter:title" content="Incident Response: The Game">
<meta property="twitter:description" content="Interactive cybersecurity training simulation. Can you save the company from a ransomware attack?">
<meta property="twitter:image" content="https://yourdomain.com/preview.png">
```

## Performance Checklist

- [ ] Minify JavaScript and CSS
- [ ] Enable caching headers
- [ ] Use CDN for static assets
- [ ] Compress images (if any)
- [ ] Enable gzip/brotli compression
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Add loading states
- [ ] Implement error handling

## Testing Before Deployment

```bash
# Test locally first
python serve.py

# Visit http://localhost:8000/game.html

# Test on mobile (same WiFi network)
# Visit http://YOUR_LOCAL_IP:8000/game.html
```

## Quick Deploy Commands

```bash
# GitHub Pages deployment
git add game.html game-engine.js game-styles.css
git commit -m "Deploy incident response game"
git push origin main

# Then enable GitHub Pages in repo settings
```

## Troubleshooting

**Issue: Game not loading**
- Check browser console for errors (F12)
- Ensure all file paths are correct
- Verify JavaScript is not blocked

**Issue: Styles not applying**
- Clear browser cache
- Check CSS file path
- Verify CSS syntax

**Issue: GitHub Pages 404**
- Wait 2-3 minutes after enabling Pages
- Ensure files are in correct branch
- Check repository is public

## Support & Updates

To update the live game:
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Changes deploy automatically (or redeploy on Netlify/Vercel)

---

**Ready to deploy?** Follow one of the hosting options above!
