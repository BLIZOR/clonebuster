# Comprehensive Website Cloning Prompt for siri-clonebuster

## Objective
Create a **perfect, pixel-accurate copy** of the target website, ensuring **zero elements are missed**, including text content, dynamic/animated elements, lazy-loaded content, and all visual states.

---

## Critical Capture Requirements

### 1. **Text Content - MANDATORY**
- ✅ Capture **ALL visible text** on the page, including:
  - Hero section text (headlines, subheadings, body copy)
  - Headings (h1, h2, h3, h4, h5, h6) - even if styled with CSS
  - Paragraph text, captions, labels
  - Button text, link text
  - Text in modals, tooltips, dropdowns
  - Text rendered via JavaScript/React/Vue
  - Text in SVG elements
  - Text with special styling (gradients, animations)
  - Text that appears on hover/focus states
  - Text in `aria-label`, `alt`, `title` attributes
  - Text in `::before` and `::after` pseudo-elements (extract from CSS)

### 2. **Hero Section - CRITICAL**
- ✅ **Hero text content** (e.g., "Just say 'Siri'" or main headline)
- ✅ All hero images and media
- ✅ Hero background elements
- ✅ Hero animations and transitions
- ✅ Hero interactive elements
- ✅ Hero text that may be rendered via JavaScript after page load

### 3. **Dynamic & Interactive Content**
- ✅ **Bento box layouts** - capture all nested content within bento grid sections
- ✅ **Dashboard elements** (e.g., car dashboard in bento boxes) - capture all UI elements, icons, text, images
- ✅ Content that appears on scroll (scroll-triggered animations)
- ✅ Content that appears on hover/focus
- ✅ Content in modals, dropdowns, tooltips
- ✅ Content loaded via lazy loading (`data-lazy`, `loading="lazy"`)
- ✅ Content rendered via JavaScript frameworks (React, Vue, Angular)
- ✅ Content in iframes (if accessible)
- ✅ Content in shadow DOM (if accessible)

### 4. **Images & Media**
- ✅ All `<img>` tags (including those with `srcset` and `sizes`)
- ✅ All `<picture>` elements with all `<source>` variants
- ✅ All background images (extract from CSS `background-image`)
- ✅ All SVG graphics (inline and external)
- ✅ All video elements (`<video>`, `<iframe>` for YouTube/Vimeo)
- ✅ All canvas elements (capture as images)
- ✅ All icons (SVG icons, icon fonts, image sprites)
- ✅ Retina/2x images (capture all density variants)

### 5. **CSS & Styling**
- ✅ **All CSS files** (external stylesheets, inline `<style>` blocks)
- ✅ CSS custom properties/variables
- ✅ CSS animations and keyframes
- ✅ CSS transitions
- ✅ Media queries (capture responsive styles)
- ✅ Pseudo-element content (`::before`, `::after` text content)
- ✅ CSS Grid and Flexbox layouts (preserve structure)
- ✅ All font files (WOFF, WOFF2, TTF, EOT)
- ✅ CSS that creates visual text (text rendered via `content` property)

### 6. **JavaScript & Dynamic Rendering**
- ✅ Wait for **all JavaScript to execute** before capturing
- ✅ Wait for lazy-loaded content to load
- ✅ Wait for scroll-triggered content to appear
- ✅ Wait for API calls to complete (if content is fetched dynamically)
- ✅ Capture content rendered by JavaScript frameworks
- ✅ Capture content that appears after user interactions (hover, click, scroll)
- ✅ All JavaScript files (for functionality preservation)
- ✅ Execute JavaScript and wait for DOM updates before final capture

### 7. **Layout & Structure**
- ✅ **Bento box layouts** - preserve exact grid structure, spacing, alignment
- ✅ All section containers and wrappers
- ✅ All nested elements (don't skip deeply nested content)
- ✅ All semantic HTML structure
- ✅ All data attributes (for functionality)
- ✅ All ARIA attributes (for accessibility)

### 8. **Animations & Transitions**
- ✅ CSS animations (keyframes)
- ✅ CSS transitions
- ✅ JavaScript animations
- ✅ Scroll-triggered animations
- ✅ Parallax effects
- ✅ Fade-in, slide-in animations
- ✅ Capture animation states (initial, final, keyframes)

### 9. **Special Elements**
- ✅ Forms (all inputs, labels, placeholders)
- ✅ Navigation menus (including dropdowns)
- ✅ Footers (all links, text, images)
- ✅ Headers/navbars (all elements)
- ✅ Buttons (all states: default, hover, active, focus)
- ✅ Cards and tiles (all content within)
- ✅ Testimonials and quotes
- ✅ Logos and branding elements

### 10. **Responsive States**
- ✅ Capture at multiple viewport sizes:
  - Mobile (375px, 414px)
  - Tablet (768px, 1024px)
  - Desktop (1280px, 1920px)
- ✅ Capture mobile menu states
- ✅ Capture responsive image variants

---

## Capture Process Checklist

### Pre-Capture
- [ ] Set viewport to desktop size (1920x1080 minimum)
- [ ] Disable ad blockers that might hide content
- [ ] Allow all JavaScript to execute
- [ ] Wait for page to be fully loaded (network idle)
- [ ] Wait for lazy-loaded images to load
- [ ] Scroll through entire page to trigger scroll animations
- [ ] Hover over interactive elements to reveal hidden content
- [ ] Open any modals/dropdowns to capture their content

### During Capture
- [ ] Capture full HTML (including dynamically inserted content)
- [ ] Capture all CSS (external and inline)
- [ ] Capture all JavaScript files
- [ ] Capture all images (all density variants)
- [ ] Capture all fonts
- [ ] Capture all SVG files
- [ ] Capture video files (or embed codes)
- [ ] Extract text from CSS pseudo-elements
- [ ] Extract background images from CSS
- [ ] Capture all data attributes
- [ ] Preserve exact class names and IDs

### Post-Capture Verification
- [ ] Verify hero text is present in HTML
- [ ] Verify all bento box content is captured
- [ ] Verify dashboard/interactive elements are present
- [ ] Verify all images are downloaded
- [ ] Verify all fonts are downloaded
- [ ] Verify CSS animations are preserved
- [ ] Verify responsive breakpoints are captured
- [ ] Compare visual output with original (screenshot comparison)

---

## Specific Element Types to Never Miss

### Text Elements
- `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`
- `<p>`, `<span>`, `<div>` with text content
- `<a>` link text
- `<button>` text
- `<label>` text
- Text in `<svg><text>` elements
- Text in `::before` and `::after` (check CSS)
- Text in `aria-label`, `alt`, `title` attributes
- Text rendered via JavaScript (check after JS execution)

### Visual Elements
- All `<img>` tags
- All `<picture>` elements
- All `<svg>` graphics
- All `<canvas>` elements (screenshot)
- Background images in CSS
- Icon fonts and SVG icons
- Decorative elements

### Interactive Elements
- All `<button>` elements
- All `<a>` links
- All form inputs (`<input>`, `<select>`, `<textarea>`)
- All dropdown menus
- All modals and overlays
- All tooltips
- All carousels/sliders

### Layout Elements
- Bento box containers and all nested content
- Grid layouts (CSS Grid)
- Flexbox layouts
- Section containers
- Card/tile components
- Dashboard UI elements

---

## Technical Implementation Notes

1. **Use headless browser** (Puppeteer, Playwright, Selenium) to:
   - Execute all JavaScript
   - Wait for lazy-loaded content
   - Scroll through page to trigger animations
   - Capture final rendered HTML

2. **Wait strategies**:
   - Wait for `networkidle` (no network requests for 500ms)
   - Wait for specific selectors to appear
   - Wait for lazy-loaded images (`img[loading="lazy"]`)
   - Wait for scroll-triggered content
   - Wait for JavaScript framework hydration

3. **Text extraction**:
   - Use `element.textContent` or `element.innerText`
   - Check computed styles for `::before`/`::after` content
   - Parse CSS to extract `content` property values
   - Check `aria-label`, `alt`, `title` attributes

4. **Image capture**:
   - Download all `src` and `srcset` images
   - Extract background images from computed styles
   - Capture canvas elements as images
   - Preserve all density variants (1x, 2x, 3x)

5. **CSS capture**:
   - Download all external stylesheets
   - Extract inline `<style>` blocks
   - Extract styles from `<style>` attributes
   - Parse and extract `@keyframes` animations
   - Extract CSS custom properties

---

## Common Pitfalls to Avoid

❌ **DON'T** skip text that's styled with CSS (it's still text!)
❌ **DON'T** skip content in bento boxes or nested layouts
❌ **DON'T** skip lazy-loaded content
❌ **DON'T** skip JavaScript-rendered content
❌ **DON'T** skip content that appears on scroll
❌ **DON'T** skip content in modals/dropdowns
❌ **DON'T** skip background images
❌ **DON'T** skip SVG graphics
❌ **DON'T** skip pseudo-element content
❌ **DON'T** capture before JavaScript executes
❌ **DON'T** skip responsive variants

---

## Success Criteria

A successful clone should have:
- ✅ **100% of visible text** present in HTML
- ✅ **100% of images** downloaded and linked correctly
- ✅ **100% of CSS** captured (including animations)
- ✅ **100% of JavaScript** files downloaded
- ✅ **100% of fonts** downloaded
- ✅ **All interactive elements** functional
- ✅ **All animations** preserved
- ✅ **All responsive breakpoints** captured
- ✅ **Visual match** with original (pixel-perfect comparison)

---

## Example: What to Capture from Apple Siri Page

### Hero Section
- ✅ "Just say 'Siri'" headline text
- ✅ "Siri" logo/text element (even if CSS-styled)
- ✅ All hero images (iPhone, iPad, Watch, AirPods, etc.)
- ✅ Hero background elements
- ✅ Hero animations

### Car Dashboard Section
- ✅ "In the car." headline
- ✅ Car dashboard image (CarPlay interface)
- ✅ All text in the car section
- ✅ All images in bento tiles
- ✅ All quote icons and text
- ✅ All interactive elements

### Bento Boxes
- ✅ All grid containers
- ✅ All nested content within each bento cell
- ✅ All images in bento cells
- ✅ All text in bento cells
- ✅ All spacing and alignment
- ✅ All background colors/gradients

---

## Final Instructions

**Before finalizing the clone, perform a visual comparison:**
1. Take a screenshot of the original website
2. Take a screenshot of the cloned website
3. Compare side-by-side
4. Identify any missing elements
5. Re-capture missing elements
6. Repeat until 100% match

**Remember:** If it's visible on the original page, it MUST be in the clone. No exceptions.

