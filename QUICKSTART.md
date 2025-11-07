# Quick Start Guide - 5 Minutes to Playing! ⚡

## Option 1: Play Immediately (Fastest)

### Windows
```bash
start game.html
```

### Mac
```bash
open game.html
```

### Linux
```bash
xdg-open game.html
```

That's it! The game opens in your default browser.

---

## Option 2: Play with Local Server (Recommended)

```bash
python serve.py
```

Then open your browser to: **http://localhost:8000/game.html**

Why use a server?
- ✅ Simulates real hosting environment
- ✅ Better for testing
- ✅ Can access from other devices on same network

---

## Option 3: Deploy Online (Share with Others)

### GitHub Pages (Easiest - 2 minutes)

```bash
# Add files to git
git add game.html game-engine.js game-styles.css

# Commit
git commit -m "Add browser-based IR game"

# Push
git push origin main
```

Then:
1. Go to your GitHub repo
2. Click **Settings** → **Pages**
3. Select **main branch** → **Save**
4. Wait 2 minutes
5. Your game is live at: `https://yourusername.github.io/repo-name/game.html`

### Netlify (Drag & Drop - 1 minute)

1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Drag your `sec_game` folder into the browser
4. Done! Your game is live at: `yourname.netlify.app`

---

## First Time Playing

1. **Select Difficulty**
   - Training Mode: Extra time, hints
   - Professional: Standard mode
   - Crisis Mode: Hard mode, higher scores

2. **Click "BEGIN INCIDENT RESPONSE"**

3. **Read the Scenario**
   - Take your time
   - Understand the situation

4. **Make Your Choice**
   - Click one of the 4 options
   - See immediate consequences

5. **Continue Through 6 Scenarios**
   - Each choice affects your score
   - Track your progress in the HUD

6. **See Your Ending**
   - Based on total score and reputation
   - Unlock achievements
   - Share your results!

---

## Understanding the HUD

### Score
- Starts at 0
- Ranges from -200 to 400+
- Higher is better

### Reputation
- Starts at 100%
- Can go above 100% or below 0%
- Affects ending

### Time Elapsed
- Game time in minutes
- Speed matters!
- Balance speed with quality

### Containment
- Threat containment percentage
- 0% = widespread
- 100% = fully contained

---

## Tips for Best Score

1. **Think Like an IR Professional**
   - Quick response is important
   - But not at the expense of quality

2. **Balance Stakeholders**
   - Technical teams
   - Business leaders
   - Legal/compliance
   - Customers

3. **Never Pay Ransoms**
   - There's always a better way
   - Criminal funding = bad outcome

4. **Comprehensive Solutions**
   - Address all attack vectors
   - Don't just fix symptoms

5. **Communication is Key**
   - Keep stakeholders informed
   - Transparency builds trust

6. **Bring in Experts**
   - Don't try to do everything alone
   - Specialists can help

---

## Keyboard Shortcuts

- Click choices with mouse
- Numbers 1-4 don't work (intentional - prevents rushing)
- Arrow keys don't navigate (forces reading)

---

## Troubleshooting

### Game won't load?
- **Check browser console** (F12) for errors
- **Try different browser** (Chrome, Firefox, Safari)
- **Disable ad blockers** temporarily

### Styles look broken?
- **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
- **Clear browser cache**
- **Check file paths** - all 3 files in same folder?

### Can't click buttons?
- **Wait for text animation** to finish
- **JavaScript might be disabled** - check browser settings

### Save not working?
- **LocalStorage might be disabled** - check browser privacy settings
- **Private/Incognito mode** - saves don't persist

---

## File Structure

Make sure these 3 files are in the same folder:

```
sec_game/
├── game.html          ← Open this file!
├── game-engine.js     ← Game logic
└── game-styles.css    ← Styling
```

---

## Mobile Play

The game works great on phones and tablets!

1. Transfer files to your device, OR
2. Deploy online (GitHub Pages/Netlify)
3. Open in mobile browser
4. Play anywhere!

**Recommended**: Landscape orientation for best experience on phones

---

## Share Your Score

After completing the game:

1. Click **"SHARE RESULTS"** button
2. On mobile: Native share menu opens
3. On desktop: Results copied to clipboard
4. Share on social media!

Challenge your friends to beat your score!

---

## Multiple Playthroughs

Try different approaches:

- **Speedrun** - Minimize time (Achievement: Speed Runner)
- **Perfect Score** - Maximize points (Achievement: Perfect Response)
- **Ethical Run** - Best moral choices
- **Chaos Run** - Worst possible decisions (see bad ending)

Each playthrough takes ~10-15 minutes.

---

## Next Steps

1. **Play the game** - Start with Professional difficulty
2. **Read [GAME_README.md](GAME_README.md)** - Full documentation
3. **Deploy online** - See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. **Customize** - Add your own scenarios!

---

## Support

- **Questions?** Check GAME_README.md
- **Deployment help?** Check DEPLOYMENT_GUIDE.md
- **Want to customize?** Edit game-engine.js

---

**Ready? Open game.html and start playing!** 🎮

Can you achieve the EXEMPLARY ending and become a Security Hero? 🏆
