# 🔧 CLONEBUSTER v5

> Perfect 1:1 Website Cloner - Pixel-accurate offline copies of any website

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║     ██████╗██╗      ██████╗ ███╗   ██╗███████╗██████╗ ██╗   ██╗███████╗      ║
║    ██╔════╝██║     ██╔═══██╗████╗  ██║██╔════╝██╔══██╗██║   ██║██╔════╝      ║
║    ██║     ██║     ██║   ██║██╔██╗ ██║█████╗  ██████╔╝██║   ██║███████╗      ║
║    ██║     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║      ║
║    ╚██████╗███████╗╚██████╔╝██║ ╚████║███████╗██████╔╝╚██████╔╝███████║      ║
║     ╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝      ║
║                                                                               ║
║                    CLONEBUSTER v5.0 - Perfect Website Cloner                  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## Features

- **Perfect 1:1 pixel-accurate cloning**
- **Automatic lazy-load content triggering** (scroll, hover, click simulation)
- **Complete asset downloading** (images, CSS, JS, fonts, SVGs)
- **CSS mask and background-image extraction**
- **Automatic path rewriting** for offline viewing
- **Data-lazy attribute removal** for static viewing
- **SVG mask preservation** for text effects (like Apple's Siri gradient)
- **Responsive srcset handling**
- **Full-page screenshot** for verification
- **Detailed clone report**

## Installation

```bash
npm install
```

## Usage

### Clone a website

```bash
node clonebuster.js <URL> [output.html] [output-dir]
```

### Example: Clone Apple Siri page

```bash
node clonebuster.js https://www.apple.com/siri/ siri.html .
```

### Fix existing clone (offline mode)

```bash
node scripts/generate-icons.mjs
```

## Output Structure

```
clone-output/
├── siri.html           # Main HTML file
├── assets/             # Images, SVGs
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── fonts/              # Web fonts
├── screenshot.png      # Full-page screenshot
└── clone-report.json   # Clone statistics
```

## What Gets Captured

| Content Type | Details |
|--------------|---------|
| **Text** | All headings, paragraphs, aria-labels, alt texts |
| **Images** | All `<img>`, `<picture>`, srcset variants, background images |
| **CSS** | External stylesheets, inline styles, animations, keyframes |
| **JavaScript** | All script files |
| **Fonts** | WOFF, WOFF2, TTF, EOT |
| **Masks** | SVG masks, PNG masks for special effects |

## Included Demo: Apple Siri Clone

This repo includes a perfect clone of [apple.com/siri](https://www.apple.com/siri/):

- `siri.html` - Main clone file
- `index.html` - Alternative entry point
- All assets in `assets/`, `css/`, `js/`, `fonts/`

### Open locally

```bash
# Using Python
python3 -m http.server 8080

# Then open http://localhost:8080/siri.html
```

## Technical Details

### How Lazy Loading is Handled

1. **Scroll simulation** - Scrolls through entire page to trigger IntersectionObserver
2. **Hover simulation** - Triggers mouseenter/mouseover on interactive elements
3. **Network idle wait** - Waits for all async content to load
4. **Data-lazy removal** - Removes attributes that hide content without JS

### How CSS Masks are Preserved

Apple uses CSS masks for effects like the Siri gradient text:

```css
.siri {
    -webkit-mask: url(assets/hero_siri__dqh8piyszs02_large.svg);
    mask: url(assets/hero_siri__dqh8piyszs02_large.svg);
    background: linear-gradient(121deg, #FE0576, #EA12B6, #38CBFF);
}
```

Clonebuster automatically:
1. Downloads all mask assets (SVG, PNG)
2. Rewrites CSS paths to local assets
3. Adds inline CSS fixes for proper rendering

## Requirements

- Node.js 18+
- npm

## Dependencies

- `puppeteer` - Headless browser for rendering
- `axios` - HTTP client for asset downloading
- `cheerio` - HTML parsing and manipulation

## License

MIT

## Author

Created by blizor for NSA (Nettoyage Services Aixois)
