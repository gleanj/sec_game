# Incident Response: The Game - Browser Edition

An immersive, browser-based incident response training simulation where your decisions determine the fate of a company under cyberattack.

![Version](https://img.shields.io/badge/version-2.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-web-orange)

## 🎮 Play Now

**Local:** Open `game.html` in your browser
**Online:** [Deploy for free](#deployment) on GitHub Pages, Netlify, or Vercel

## ✨ Features

### Enhanced Gameplay
- **6 Critical Scenarios** (expanded from 4!)
  - Initial Detection & Response
  - Communication Crisis
  - Ransom Dilemma
  - Root Cause Analysis
  - Threat Intelligence & APT Hunting (NEW!)
  - Regulatory Compliance Response (NEW!)

- **3 Difficulty Levels**
  - Training Mode: Extra time, helpful hints
  - Professional: Standard incident response
  - Crisis Mode: High pressure, no hints, higher scores

- **Dynamic Scoring System**
  - Points based on decision quality
  - Reputation tracking (0-100%+)
  - Time pressure mechanics
  - Difficulty multipliers

### Multiple Endings
Your performance determines the outcome:
- **Exemplary Response** (300+ points, 80%+ rep): Security Hero
- **Success** (200+ points, 60%+ rep): Crisis Averted
- **Survival** (100+ points, 40%+ rep): Barely Made It
- **Failure** (<100 points or <40% rep): Catastrophic Breach

### Achievement System
Unlock achievements for exceptional performance:
- ⚡ **Quick Thinker** - Optimal initial detection
- 🤝 **Team Player** - Effective stakeholder coordination
- ⚖️ **Ethical Responder** - Refused criminal demands
- 🎓 **Expert Consulted** - Brought in specialists
- 🛡️ **Defense in Depth** - Comprehensive security controls
- 🎯 **Threat Hunter** - Identified APT activity
- 🔍 **APT Hunter** - Eliminated advanced threats
- 💎 **Transparent Leader** - Honest communication
- 🏆 **Compliance Champion** - Exceeded requirements
- ⭐ **Perfect Response** - Maximum score
- ⏱️ **Speed Runner** - Minimal time to resolution
- 👑 **Reputation Master** - 100%+ reputation maintained

### Modern UI/UX
- **Cyberpunk Aesthetic** - Neon green/blue color scheme
- **Smooth Animations** - Typewriter effects, glowing elements
- **Real-time HUD** - Score, reputation, time, containment level
- **Decision Timeline** - Visual history of your choices
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Easy on the eyes during long sessions

### Technical Features
- **Save System** - LocalStorage for progress persistence
- **Share Results** - Social sharing capabilities
- **No Dependencies** - Pure vanilla JavaScript
- **Offline Support** - Works without internet
- **Fast Loading** - Optimized performance
- **PWA Ready** - Can be installed as an app

## 🚀 Quick Start

### Option 1: Direct Play
```bash
# Just open the file
open game.html  # Mac
start game.html # Windows
xdg-open game.html # Linux
```

### Option 2: Local Server
```bash
python serve.py
# Visit http://localhost:8000/game.html
```

### Option 3: Deploy Online
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for hosting on:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Cloudflare Pages (free)

## 🎯 How to Play

1. **Choose Difficulty** - Select training, professional, or crisis mode
2. **Read Scenarios** - Realistic incident response situations
3. **Make Decisions** - Choose from 4 options per scenario
4. **See Consequences** - Immediate feedback on your choices
5. **Track Progress** - Monitor score, reputation, and timeline
6. **Achieve Ending** - Multiple endings based on performance

## 📊 Scoring Guide

### Points
- **Excellent choices**: 50-70 points
- **Good choices**: 30-40 points
- **Moderate choices**: 10-25 points
- **Poor choices**: -20 to -50 points

### Reputation
- **+25%**: Outstanding stakeholder management
- **+10-20%**: Good decisions
- **0%**: Neutral impact
- **-10 to -40%**: Poor decisions, business impact

### Time
- Actions take 5-240 minutes (game time)
- Faster isn't always better
- Balance speed with effectiveness

## 🎓 Learning Objectives

This game teaches critical IR concepts:

1. **Initial Detection & Triage**
   - SIEM alert analysis
   - Rapid threat assessment
   - Containment strategies

2. **Crisis Communication**
   - Stakeholder management
   - Legal compliance
   - Media relations

3. **Decision Making Under Pressure**
   - Ransom payment ethics
   - Risk vs. business impact
   - Expert consultation

4. **Root Cause Analysis**
   - Attack vector identification
   - Defense in depth
   - Long-term prevention

5. **Advanced Threat Hunting** (NEW!)
   - APT detection
   - Live forensics
   - Persistence elimination

6. **Regulatory Compliance** (NEW!)
   - GDPR/CCPA requirements
   - Breach notification
   - Customer trust management

## 🆚 Comparison: Terminal vs Browser

| Feature | Terminal (Python) | Browser (This Version) |
|---------|------------------|------------------------|
| Scenarios | 4 | 6 |
| Difficulty Levels | 1 | 3 |
| Achievements | 0 | 12 |
| Visual Design | ANSI colors | Modern cyberpunk UI |
| Animations | Typewriter text | Full CSS animations |
| Progress Saving | No | Yes (LocalStorage) |
| Share Results | No | Yes |
| Mobile Support | No | Yes |
| Deployment | CLI only | Web hosting |
| Installation | Python required | None |

## 🛠️ Customization

### Add New Scenarios
Edit `game-engine.js` and add to `initializeScenarios()`:

```javascript
{
    id: 7,
    title: 'YOUR SCENARIO',
    subtitle: 'Short description',
    text: 'Full scenario text...',
    alert: '🚨 Alert message',
    question: 'What do you do?',
    choices: [
        {
            text: 'Option 1',
            outcome: {
                score: 50,
                reputation: 10,
                time: 30,
                containment: 80,
                feedback: {
                    type: 'success',
                    title: 'Great!',
                    text: 'You made a good choice.',
                    details: '+50 points'
                },
                achievement: 'optional_achievement_id'
            }
        },
        // ... more choices
    ]
}
```

### Modify Difficulty Settings
In `game-engine.js`, edit `difficultySettings`:

```javascript
this.difficultySettings = {
    easy: { timeMultiplier: 0.7, hintLevel: 2, scoreMultiplier: 0.8 },
    normal: { timeMultiplier: 1.0, hintLevel: 1, scoreMultiplier: 1.0 },
    hard: { timeMultiplier: 1.3, hintLevel: 0, scoreMultiplier: 1.2 }
};
```

### Change Color Scheme
Edit CSS variables in `game-styles.css`:

```css
:root {
    --neon-green: #00ff88;  /* Change to your color */
    --neon-blue: #00d4ff;
    --neon-purple: #a855f7;
    /* ... more colors */
}
```

## 📱 Mobile Support

The game is fully responsive and works great on:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Tablets (iPad, Android tablets)
- ✅ Mobile phones (iOS, Android)

Recommended minimum screen size: 360px width

## 🔒 Privacy

- **No tracking** - No analytics by default
- **Local storage only** - Game saves stored in browser
- **No server required** - Runs entirely client-side
- **No data collection** - Your choices stay on your device

## 🤝 Contributing

Want to improve the game? Ideas:

1. **More Scenarios**
   - DDoS attacks
   - Insider threats
   - Supply chain compromises
   - Zero-day exploits

2. **Features**
   - Multiplayer mode
   - Leaderboards
   - Custom scenario editor
   - Sound effects
   - Background music

3. **Educational Content**
   - Detailed explanations
   - Real-world case studies
   - IR framework references (NIST, SANS)
   - Training mode with hints

## 📄 License

MIT License - Free to use for personal and educational purposes.

## 🙏 Credits

Based on the original terminal game, enhanced with:
- Modern web technologies
- Expanded content
- Improved UX/UI
- Additional scenarios

Perfect for:
- Security awareness training
- IR team exercises
- Cybersecurity education
- Job interview prep
- Team building activities

## 📧 Support

Found a bug? Have suggestions?
- Open an issue on GitHub
- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for hosting help

---

**Ready to test your incident response skills? Open `game.html` and start playing!**

*Can you achieve the perfect score and become a Security Hero?* 🏆
