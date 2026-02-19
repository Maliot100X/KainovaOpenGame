# Image Assets Required

Place all images in the `/public/images/` folder.

## Required Images

### Essential
- **icon.png** (512x512) - App icon
- **splash-icon.png** (200x200) - Splash screen icon
- **og-image.png** (1200x630) - Open Graph image for sharing
- **hero.png** (1200x800) - Hero image for manifest

### Screenshots for App Store
- **screenshot-1.png** (1200x800) - Tasks page screenshot
- **screenshot-2.png** (1200x800) - Leaderboard screenshot

## Design Guidelines

### Color Scheme
- Primary: `#00d4ff` (Cyan)
- Background: `#0a0a0f` (Dark)
- Accent: `#ffd700` (Gold)

### Style
- Dark theme with neon accents
- Grid patterns in background
- Futuristic/agent theme
- High contrast for readability

### Tools
Use Canva, Figma, or Midjourney to create:
1. Logo/icon with "K" lettermark
2. Abstract grid/agent visuals
3. Token/coin imagery
4. Achievement badges

## Quick SVG Placeholders

If you need quick placeholders, create these SVG files:

### icon.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4ff"/>
      <stop offset="100%" style="stop-color:#00f0ff"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="#0a0a0f"/>
  <rect x="56" y="56" width="400" height="400" rx="100" fill="url(#g)"/>
  <text x="256" y="320" font-size="200" font-weight="bold" text-anchor="middle" fill="#0a0a0f">K</text>
</svg>
```

Convert SVG to PNG using:
- Online: CloudConvert, Convertio
- Local: Inkscape, Adobe Illustrator
- Command line: `npx svg-to-png`
