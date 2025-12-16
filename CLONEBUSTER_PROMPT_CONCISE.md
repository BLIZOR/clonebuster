# Website Cloning Prompt for Claude Code

## Task
Create a perfect, pixel-accurate clone of [TARGET_URL] ensuring **zero elements are missed**.

## Critical Requirements

### 1. Text Content (MANDATORY - Often Missed)
- Capture **ALL visible text**, including:
  - Hero headlines and subheadings (e.g., "Just say 'Siri'" text)
  - Text styled with CSS gradients/animations
  - Text in `::before`/`::after` pseudo-elements (extract from CSS)
  - JavaScript-rendered text (wait for JS execution)
  - Text in SVG elements
  - Text in `aria-label`, `alt`, `title` attributes
  - All headings, paragraphs, button text, link text

### 2. Dynamic Content (CRITICAL)
- **Bento box layouts**: Capture ALL nested content within each grid cell
- **Dashboard/interactive elements**: Capture all UI components, icons, text, images (e.g., car dashboard in bento boxes)
- Lazy-loaded content: Wait for `data-lazy` and `loading="lazy"` elements
- Scroll-triggered content: Scroll through entire page before capture
- JavaScript-rendered content: Wait for framework hydration (React/Vue/Angular)
- Hover/focus states: Capture content that appears on interaction

### 3. Images & Media
- All `<img>` tags (including `srcset` variants)
- All `<picture>` elements with all `<source>` variants
- Background images (extract from CSS `background-image`)
- All SVG graphics (inline and external)
- Canvas elements (capture as images)
- All icon fonts and SVG icons
- Retina/2x images (capture all density variants)

### 4. CSS & Animations
- All external stylesheets and inline `<style>` blocks
- CSS custom properties/variables
- All `@keyframes` animations
- CSS transitions
- Media queries (responsive styles)
- Pseudo-element content (extract `content` property values)
- All font files (WOFF, WOFF2, TTF, EOT)

### 5. JavaScript Execution
- **WAIT for all JavaScript to execute** before capturing
- Wait for `networkidle` (no requests for 500ms)
- Wait for lazy-loaded images to load
- Scroll through page to trigger scroll animations
- Hover over interactive elements
- Open modals/dropdowns to capture their content

## Capture Process

1. **Pre-Capture Setup**:
   - Use headless browser (Puppeteer/Playwright)
   - Set viewport to 1920x1080
   - Wait for page load + network idle
   - Execute all JavaScript
   - Scroll through entire page
   - Hover over interactive elements

2. **Capture**:
   - Full HTML (including dynamically inserted content)
   - All CSS files (external + inline)
   - All JavaScript files
   - All images (all density variants)
   - All fonts
   - All SVG files

3. **Text Extraction**:
   - Use `element.textContent` for all text nodes
   - Parse CSS for `::before`/`::after` content
   - Check `aria-label`, `alt`, `title` attributes
   - Extract text from SVG `<text>` elements

4. **Verification**:
   - Compare visual output with original (screenshot)
   - Verify hero text is present
   - Verify bento box content is complete
   - Verify dashboard elements are captured
   - Verify all images downloaded
   - Verify CSS animations preserved

## Common Pitfalls to Avoid

❌ Skipping text that's CSS-styled (it's still text!)
❌ Skipping content in bento boxes/nested layouts
❌ Skipping lazy-loaded content
❌ Skipping JavaScript-rendered content
❌ Capturing before JavaScript executes
❌ Skipping pseudo-element content
❌ Skipping background images

## Success Criteria

✅ 100% of visible text in HTML
✅ 100% of images downloaded
✅ 100% of CSS captured (including animations)
✅ All JavaScript files downloaded
✅ All fonts downloaded
✅ Visual match with original (pixel-perfect)

## Example: Apple Siri Page

**Must capture:**
- Hero text: "Just say 'Siri'" headline
- "Siri" logo/text element (even if CSS-styled)
- Car dashboard section: All CarPlay UI elements, images, text
- Bento boxes: All nested content in each grid cell
- All scroll-triggered animations
- All lazy-loaded images

**Remember:** If it's visible on the original, it MUST be in the clone. No exceptions.

