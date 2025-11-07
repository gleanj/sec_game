# 9:16 Vertical Terminal for TikTok/YouTube Shorts

A beautiful, interactive terminal emulator optimized for 9:16 vertical video recording. Perfect for creating engaging cybersecurity, coding, and tech content for TikTok and YouTube Shorts.

## Features

- **9:16 Aspect Ratio** - Perfect 607x1080px dimensions for vertical video
- **Cybersecurity Themed** - Hacking simulations, port scans, exploit demos
- **Interactive Commands** - 15+ built-in commands with animations
- **Beautiful UI** - Matrix green terminal aesthetic with smooth animations
- **Easy Recording** - Just resize your browser and start recording

## Getting Started

1. Open `index.html` in your browser
2. Type `help` to see available commands
3. Resize browser window to your recording dimensions
4. Press F11 for fullscreen recording

## Available Commands

- `help` - Show all available commands
- `about` - About this terminal
- `clear` - Clear the screen
- `hack` - Run a hacking simulation
- `scan` - Port scan simulation
- `exploit` - Exploit framework demo
- `decrypt` - Decryption animation
- `breach` - Data breach simulation
- `matrix` - Display matrix effect
- `tree` - Show directory tree
- `sysinfo` - System information
- `date` - Current date/time
- `echo [text]` - Echo text back
- `whoami` - Display current user

## Recording Tips

1. **OBS Studio** (Recommended)
   - Create a Browser Source
   - Set dimensions to 607x1080
   - Point to your local `index.html` file
   - Record at 1080x1920 (rotated)

2. **Windows Game Bar** (Win + G)
   - Resize browser to 607x1080
   - Use F11 for fullscreen
   - Start recording

3. **Screen Recording Software**
   - Set capture area to 607x1080
   - Focus on the phone frame

## Content Ideas

### Cybersecurity
- "Watch me hack into a system in 60 seconds"
- "Port scanning explained"
- "How hackers decrypt passwords"
- "Data breach simulation"

### Coding
- "Writing Python in the terminal"
- "Git commands you need to know"
- "Terminal tricks that save time"
- "One-liner challenges"

### Entertainment
- "Terminal Easter eggs"
- "Recreating movie hacking scenes"
- "Terminal art and effects"
- "Code ASMR"

## Customization

### Change Colors
Edit `styles.css`:
- Green theme: `#00ff41` (current)
- Blue theme: `#58a6ff`
- Red theme: `#ff0000`
- Purple theme: `#a855f7`

### Add New Commands
Edit `script.js` in the `commands` object:

```javascript
commandname: {
    description: 'What it does',
    execute: (args) => {
        return `<div class="result-line">Output here</div>`;
    }
}
```

### Adjust Size
For different aspect ratios, edit `.phone-frame` in `styles.css`:
- Current: 607x1080 (9:16)
- Square: 1080x1080 (1:1)
- Wide: 1920x1080 (16:9)

## Advanced Features

### Command History
- Press ↑/↓ arrows to navigate command history

### Tab Completion
- Type partial command and press Tab

### Easter Egg
- Try the Konami code: ↑↑↓↓←→←→BA

## Tips for Viral Content

1. **Keep it under 60 seconds** - Most engaging
2. **Add text overlays** - Explain what's happening
3. **Use trending sounds** - But keep terminal authentic
4. **Show the process** - Not just the result
5. **Add your face** - Picture-in-picture builds connection
6. **Hook in first 3 seconds** - "Watch me break into..."

## Tech Stack

- Pure HTML/CSS/JavaScript
- No dependencies required
- Works offline
- Cross-browser compatible

## License

Free to use for content creation. Credit appreciated but not required.

## Contributing

Want to add commands or features? The code is simple and well-commented. Just edit the files and test in your browser.

---

**Happy Recording!** 🎬

For questions or showcase your content: Built for creators by creators.
