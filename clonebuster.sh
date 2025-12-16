#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# CLONEBUSTER - Comprehensive Website Cloning Tool
# Based on CLONEBUSTER_PROMPT.md specifications
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default configuration
OUTPUT_DIR="./clone_output"
TARGET_URL=""
OUTPUT_FILE="index.html"
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080
WAIT_TIME=5000
USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

print_banner() {
    echo -e "${PURPLE}"
    echo "╔═══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                       ║"
    echo "║     ██████╗██╗      ██████╗ ███╗   ██╗███████╗██████╗ ██╗   ██╗      ║"
    echo "║    ██╔════╝██║     ██╔═══██╗████╗  ██║██╔════╝██╔══██╗██║   ██║      ║"
    echo "║    ██║     ██║     ██║   ██║██╔██╗ ██║█████╗  ██████╔╝██║   ██║      ║"
    echo "║    ██║     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║      ║"
    echo "║    ╚██████╗███████╗╚██████╔╝██║ ╚████║███████╗██████╔╝╚██████╔╝      ║"
    echo "║     ╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝       ║"
    echo "║                                                                       ║"
    echo "║              Comprehensive Website Cloning Tool v2.0                  ║"
    echo "║                                                                       ║"
    echo "╚═══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_section() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════${NC}\n"
}

print_step() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

check_dependencies() {
    print_section "Checking Dependencies"

    local missing_deps=()

    # Check for Node.js
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    else
        print_step "Node.js $(node -v) found"
    fi

    # Check for npm
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    else
        print_step "npm $(npm -v) found"
    fi

    # Check for curl
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    else
        print_step "curl found"
    fi

    # Check for wget (optional)
    if command -v wget &> /dev/null; then
        print_step "wget found (optional)"
    else
        print_warning "wget not found (optional, will use curl)"
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi

    print_step "All required dependencies are installed"
}

setup_puppeteer() {
    print_section "Setting Up Puppeteer"

    # Check if package.json exists, if not create it
    if [ ! -f "package.json" ]; then
        print_info "Creating package.json..."
        cat > package.json << 'PACKAGEJSON'
{
  "name": "clonebuster",
  "version": "2.0.0",
  "description": "Comprehensive Website Cloning Tool",
  "main": "clonebuster.js",
  "scripts": {
    "clone": "node clonebuster.js"
  },
  "dependencies": {
    "puppeteer": "^21.6.0",
    "axios": "^1.6.2",
    "cheerio": "^1.0.0-rc.12",
    "css": "^3.0.0",
    "mime-types": "^2.1.35"
  }
}
PACKAGEJSON
        print_step "package.json created"
    fi

    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_info "Installing npm dependencies..."
        npm install
        print_step "Dependencies installed"
    else
        print_step "Dependencies already installed"
    fi
}

show_usage() {
    echo "Usage: $0 [OPTIONS] <URL>"
    echo ""
    echo "Options:"
    echo "  -o, --output <file>     Output HTML file name (default: index.html)"
    echo "  -d, --dir <directory>   Output directory (default: ./clone_output)"
    echo "  -w, --width <pixels>    Viewport width (default: 1920)"
    echo "  -h, --height <pixels>   Viewport height (default: 1080)"
    echo "  -t, --timeout <ms>      Wait time for page load (default: 5000)"
    echo "  --help                  Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 https://www.apple.com/siri/ -o siri.html"
    echo ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE THE NODE.JS CLONEBUSTER SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════

create_clonebuster_js() {
    print_section "Creating Clonebuster Engine"

    cat > clonebuster.js << 'CLONEBUSTERJS'
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CLONEBUSTER - Comprehensive Website Cloning Engine
 * Based on CLONEBUSTER_PROMPT.md specifications
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const css = require('css');
const mimeTypes = require('mime-types');
const { URL } = require('url');

// Configuration
const config = {
    targetUrl: process.argv[2] || 'https://www.apple.com/siri/',
    outputFile: process.argv[3] || 'siri.html',
    outputDir: process.argv[4] || './clone_output',
    viewportWidth: parseInt(process.argv[5]) || 1920,
    viewportHeight: parseInt(process.argv[6]) || 1080,
    waitTime: parseInt(process.argv[7]) || 8000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Statistics tracking
const stats = {
    images: { total: 0, downloaded: 0, failed: 0 },
    css: { total: 0, downloaded: 0, failed: 0 },
    js: { total: 0, downloaded: 0, failed: 0 },
    fonts: { total: 0, downloaded: 0, failed: 0 },
    textElements: 0,
    animations: 0,
    mediaQueries: 0
};

// Asset tracking
const downloadedAssets = new Map();
const failedAssets = new Set();

/**
 * Console output helpers
 */
const log = {
    section: (msg) => console.log(`\n\x1b[36m${'═'.repeat(70)}\n  ${msg}\n${'═'.repeat(70)}\x1b[0m\n`),
    step: (msg) => console.log(`\x1b[32m[✓]\x1b[0m ${msg}`),
    info: (msg) => console.log(`\x1b[34m[i]\x1b[0m ${msg}`),
    warn: (msg) => console.log(`\x1b[33m[!]\x1b[0m ${msg}`),
    error: (msg) => console.log(`\x1b[31m[✗]\x1b[0m ${msg}`),
    progress: (current, total, msg) => {
        const percent = Math.round((current / total) * 100);
        process.stdout.write(`\r\x1b[34m[i]\x1b[0m ${msg}: ${current}/${total} (${percent}%)   `);
    }
};

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

/**
 * Download a file with retry logic
 */
async function downloadFile(url, outputPath, retries = 3) {
    if (downloadedAssets.has(url)) {
        return downloadedAssets.get(url);
    }

    if (failedAssets.has(url)) {
        return null;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': config.userAgent,
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br'
                }
            });

            await ensureDir(path.dirname(outputPath));
            await fs.writeFile(outputPath, response.data);
            downloadedAssets.set(url, outputPath);
            return outputPath;
        } catch (err) {
            if (attempt === retries) {
                failedAssets.add(url);
                return null;
            }
            await new Promise(r => setTimeout(r, 1000 * attempt));
        }
    }
    return null;
}

/**
 * Convert absolute URL to local path
 */
function urlToLocalPath(url, baseUrl, assetType) {
    try {
        const parsedUrl = new URL(url, baseUrl);
        let pathname = parsedUrl.pathname;

        // Clean up pathname
        pathname = pathname.replace(/^\/+/, '');

        // Determine folder based on asset type
        let folder = 'assets';
        if (assetType === 'css') folder = 'css';
        else if (assetType === 'js') folder = 'js';
        else if (assetType === 'font') folder = 'fonts';

        // Generate filename
        let filename = path.basename(pathname) || 'file';
        if (!path.extname(filename)) {
            const ext = mimeTypes.extension(assetType) || 'bin';
            filename += `.${ext}`;
        }

        // Create unique filename if needed
        const localPath = path.join(config.outputDir, folder, filename);
        return localPath;
    } catch (err) {
        return null;
    }
}

/**
 * Extract and process all CSS
 */
async function extractCSS(page, baseUrl) {
    log.section('Extracting CSS');

    const cssData = await page.evaluate(() => {
        const results = {
            external: [],
            inline: [],
            computed: []
        };

        // Get external stylesheets
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            results.external.push(link.href);
        });

        // Get inline styles
        document.querySelectorAll('style').forEach(style => {
            results.inline.push(style.textContent);
        });

        return results;
    });

    stats.css.total = cssData.external.length + cssData.inline.length;
    log.info(`Found ${cssData.external.length} external stylesheets and ${cssData.inline.length} inline styles`);

    const processedCSS = [];

    // Download external CSS
    for (let i = 0; i < cssData.external.length; i++) {
        const cssUrl = cssData.external[i];
        log.progress(i + 1, cssData.external.length, 'Downloading CSS');

        const localPath = urlToLocalPath(cssUrl, baseUrl, 'css');
        if (localPath) {
            const result = await downloadFile(cssUrl, localPath);
            if (result) {
                stats.css.downloaded++;
                processedCSS.push({
                    type: 'external',
                    original: cssUrl,
                    local: path.relative(config.outputDir, localPath)
                });

                // Extract assets from CSS (background images, fonts)
                try {
                    const cssContent = await fs.readFile(localPath, 'utf-8');
                    await extractCSSAssets(cssContent, cssUrl, baseUrl);
                } catch (e) {}
            } else {
                stats.css.failed++;
            }
        }
    }
    console.log(''); // New line after progress

    // Save inline CSS
    for (let i = 0; i < cssData.inline.length; i++) {
        const inlineCSS = cssData.inline[i];
        const filename = `inline-style-${i + 1}.css`;
        const localPath = path.join(config.outputDir, 'css', filename);

        await ensureDir(path.dirname(localPath));
        await fs.writeFile(localPath, inlineCSS);

        processedCSS.push({
            type: 'inline',
            content: inlineCSS,
            local: `css/${filename}`
        });

        // Extract assets from inline CSS
        await extractCSSAssets(inlineCSS, baseUrl, baseUrl);
    }

    log.step(`CSS extracted: ${stats.css.downloaded}/${stats.css.total} external, ${cssData.inline.length} inline`);

    return processedCSS;
}

/**
 * Extract assets referenced in CSS (background images, fonts)
 */
async function extractCSSAssets(cssContent, cssUrl, baseUrl) {
    // Extract background images
    const bgImageRegex = /url\(['"]?([^'")\s]+)['"]?\)/g;
    let match;

    while ((match = bgImageRegex.exec(cssContent)) !== null) {
        let assetUrl = match[1];

        // Skip data URIs
        if (assetUrl.startsWith('data:')) continue;

        // Resolve relative URLs
        try {
            assetUrl = new URL(assetUrl, cssUrl).href;
        } catch (e) {
            continue;
        }

        // Determine asset type
        const ext = path.extname(assetUrl).toLowerCase();
        let assetType = 'assets';
        if (['.woff', '.woff2', '.ttf', '.eot', '.otf'].includes(ext)) {
            assetType = 'font';
            stats.fonts.total++;
        } else {
            stats.images.total++;
        }

        const localPath = urlToLocalPath(assetUrl, baseUrl, assetType);
        if (localPath) {
            const result = await downloadFile(assetUrl, localPath);
            if (result) {
                if (assetType === 'font') stats.fonts.downloaded++;
                else stats.images.downloaded++;
            }
        }
    }
}

/**
 * Extract and download all images
 */
async function extractImages(page, baseUrl) {
    log.section('Extracting Images');

    const imageData = await page.evaluate(() => {
        const images = [];

        // Get all img elements
        document.querySelectorAll('img').forEach(img => {
            if (img.src) images.push(img.src);
            if (img.srcset) {
                img.srcset.split(',').forEach(src => {
                    const url = src.trim().split(' ')[0];
                    if (url) images.push(url);
                });
            }
        });

        // Get picture source elements
        document.querySelectorAll('picture source').forEach(source => {
            if (source.srcset) {
                source.srcset.split(',').forEach(src => {
                    const url = src.trim().split(' ')[0];
                    if (url) images.push(url);
                });
            }
        });

        // Get background images from inline styles
        document.querySelectorAll('[style*="background"]').forEach(el => {
            const style = el.getAttribute('style');
            const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
            if (match && match[1]) images.push(match[1]);
        });

        // Get SVG images
        document.querySelectorAll('svg image').forEach(img => {
            if (img.href && img.href.baseVal) images.push(img.href.baseVal);
        });

        return [...new Set(images)]; // Remove duplicates
    });

    stats.images.total += imageData.length;
    log.info(`Found ${imageData.length} images to download`);

    for (let i = 0; i < imageData.length; i++) {
        let imgUrl = imageData[i];
        log.progress(i + 1, imageData.length, 'Downloading images');

        // Skip data URIs
        if (imgUrl.startsWith('data:')) {
            stats.images.downloaded++;
            continue;
        }

        // Resolve relative URLs
        try {
            imgUrl = new URL(imgUrl, baseUrl).href;
        } catch (e) {
            continue;
        }

        const localPath = urlToLocalPath(imgUrl, baseUrl, 'image');
        if (localPath) {
            const result = await downloadFile(imgUrl, localPath);
            if (result) {
                stats.images.downloaded++;
            } else {
                stats.images.failed++;
            }
        }
    }
    console.log(''); // New line after progress

    log.step(`Images downloaded: ${stats.images.downloaded}/${stats.images.total}`);
}

/**
 * Extract and download all JavaScript
 */
async function extractJS(page, baseUrl) {
    log.section('Extracting JavaScript');

    const jsData = await page.evaluate(() => {
        const scripts = [];

        document.querySelectorAll('script[src]').forEach(script => {
            scripts.push(script.src);
        });

        return scripts;
    });

    stats.js.total = jsData.length;
    log.info(`Found ${jsData.length} JavaScript files`);

    for (let i = 0; i < jsData.length; i++) {
        const jsUrl = jsData[i];
        log.progress(i + 1, jsData.length, 'Downloading JS');

        const localPath = urlToLocalPath(jsUrl, baseUrl, 'js');
        if (localPath) {
            const result = await downloadFile(jsUrl, localPath);
            if (result) {
                stats.js.downloaded++;
            } else {
                stats.js.failed++;
            }
        }
    }
    console.log(''); // New line after progress

    log.step(`JavaScript downloaded: ${stats.js.downloaded}/${stats.js.total}`);
}

/**
 * Extract all text content
 */
async function extractTextContent(page) {
    log.section('Extracting Text Content');

    const textData = await page.evaluate(() => {
        const textElements = [];

        // Get all text-containing elements
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'a', 'button', 'label',
            'li', 'td', 'th', 'caption', 'figcaption',
            'blockquote', 'cite', 'q'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const text = el.textContent?.trim();
                if (text && text.length > 0) {
                    textElements.push({
                        tag: selector,
                        text: text.substring(0, 100),
                        hasAriaLabel: !!el.getAttribute('aria-label')
                    });
                }
            });
        });

        // Get aria-labels
        document.querySelectorAll('[aria-label]').forEach(el => {
            textElements.push({
                tag: 'aria-label',
                text: el.getAttribute('aria-label')
            });
        });

        // Get alt texts
        document.querySelectorAll('[alt]').forEach(el => {
            if (el.alt) {
                textElements.push({
                    tag: 'alt',
                    text: el.alt
                });
            }
        });

        // Get title attributes
        document.querySelectorAll('[title]').forEach(el => {
            if (el.title) {
                textElements.push({
                    tag: 'title',
                    text: el.title
                });
            }
        });

        return textElements;
    });

    stats.textElements = textData.length;
    log.step(`Found ${textData.length} text elements`);

    // Log sample of text content
    const samples = textData.slice(0, 10);
    samples.forEach(item => {
        log.info(`  ${item.tag}: "${item.text.substring(0, 50)}..."`);
    });

    return textData;
}

/**
 * Scroll through the page to trigger lazy loading
 */
async function scrollPage(page) {
    log.section('Scrolling Page (Triggering Lazy Load)');

    await page.evaluate(async () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        const scrollHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        let currentPosition = 0;

        while (currentPosition < scrollHeight) {
            window.scrollTo(0, currentPosition);
            currentPosition += viewportHeight / 2;
            await delay(200);
        }

        // Scroll back to top
        window.scrollTo(0, 0);
        await delay(500);
    });

    log.step('Page scrolled to trigger lazy-loaded content');
}

/**
 * Wait for all network requests to complete
 */
async function waitForNetworkIdle(page, timeout = 5000) {
    log.info('Waiting for network idle...');

    try {
        await page.waitForNetworkIdle({ timeout: timeout });
        log.step('Network idle reached');
    } catch (e) {
        log.warn('Network idle timeout - continuing anyway');
    }
}

/**
 * Process and update HTML with local paths
 */
async function processHTML(page, baseUrl, processedCSS) {
    log.section('Processing HTML');

    const html = await page.content();
    const $ = cheerio.load(html, { decodeEntities: false });

    // Update CSS links
    $('link[rel="stylesheet"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href) {
            const cssItem = processedCSS.find(c => c.original === href || c.original === new URL(href, baseUrl).href);
            if (cssItem && cssItem.local) {
                $(el).attr('href', cssItem.local);
            }
        }
    });

    // Update image sources
    $('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src && !src.startsWith('data:')) {
            try {
                const fullUrl = new URL(src, baseUrl).href;
                const localPath = downloadedAssets.get(fullUrl);
                if (localPath) {
                    $(el).attr('src', path.relative(config.outputDir, localPath));
                }
            } catch (e) {}
        }

        // Update srcset
        const srcset = $(el).attr('srcset');
        if (srcset) {
            const newSrcset = srcset.split(',').map(src => {
                const parts = src.trim().split(' ');
                const url = parts[0];
                if (!url.startsWith('data:')) {
                    try {
                        const fullUrl = new URL(url, baseUrl).href;
                        const localPath = downloadedAssets.get(fullUrl);
                        if (localPath) {
                            parts[0] = path.relative(config.outputDir, localPath);
                        }
                    } catch (e) {}
                }
                return parts.join(' ');
            }).join(', ');
            $(el).attr('srcset', newSrcset);
        }
    });

    // Update picture source elements
    $('picture source').each((i, el) => {
        const srcset = $(el).attr('srcset');
        if (srcset) {
            const newSrcset = srcset.split(',').map(src => {
                const parts = src.trim().split(' ');
                const url = parts[0];
                if (!url.startsWith('data:')) {
                    try {
                        const fullUrl = new URL(url, baseUrl).href;
                        const localPath = downloadedAssets.get(fullUrl);
                        if (localPath) {
                            parts[0] = path.relative(config.outputDir, localPath);
                        }
                    } catch (e) {}
                }
                return parts.join(' ');
            }).join(', ');
            $(el).attr('srcset', newSrcset);
        }
    });

    // Update script sources
    $('script[src]').each((i, el) => {
        const src = $(el).attr('src');
        if (src) {
            try {
                const fullUrl = new URL(src, baseUrl).href;
                const localPath = downloadedAssets.get(fullUrl);
                if (localPath) {
                    $(el).attr('src', path.relative(config.outputDir, localPath));
                }
            } catch (e) {}
        }
    });

    log.step('HTML processed with local paths');

    return $.html();
}

/**
 * Generate clone report
 */
async function generateReport() {
    log.section('Clone Report');

    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│                     CLONEBUSTER REPORT                      │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│  Images:      ${stats.images.downloaded}/${stats.images.total} downloaded (${stats.images.failed} failed)`.padEnd(62) + '│');
    console.log(`│  CSS:         ${stats.css.downloaded}/${stats.css.total} downloaded`.padEnd(62) + '│');
    console.log(`│  JavaScript:  ${stats.js.downloaded}/${stats.js.total} downloaded`.padEnd(62) + '│');
    console.log(`│  Fonts:       ${stats.fonts.downloaded}/${stats.fonts.total} downloaded`.padEnd(62) + '│');
    console.log(`│  Text:        ${stats.textElements} elements captured`.padEnd(62) + '│');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│  Output:      ${config.outputDir}/${config.outputFile}`.padEnd(62) + '│');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    // Save report to file
    const report = {
        timestamp: new Date().toISOString(),
        targetUrl: config.targetUrl,
        outputFile: config.outputFile,
        stats: stats,
        downloadedAssets: Array.from(downloadedAssets.entries()),
        failedAssets: Array.from(failedAssets)
    };

    await fs.writeFile(
        path.join(config.outputDir, 'clone-report.json'),
        JSON.stringify(report, null, 2)
    );

    log.step('Report saved to clone-report.json');
}

/**
 * Main cloning function
 */
async function clone() {
    console.log('\n\x1b[35m╔═══════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                       ║');
    console.log('║     ██████╗██╗      ██████╗ ███╗   ██╗███████╗██████╗ ██╗   ██╗      ║');
    console.log('║    ██╔════╝██║     ██╔═══██╗████╗  ██║██╔════╝██╔══██╗██║   ██║      ║');
    console.log('║    ██║     ██║     ██║   ██║██╔██╗ ██║█████╗  ██████╔╝██║   ██║      ║');
    console.log('║    ██║     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║      ║');
    console.log('║    ╚██████╗███████╗╚██████╔╝██║ ╚████║███████╗██████╔╝╚██████╔╝      ║');
    console.log('║     ╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝       ║');
    console.log('║                                                                       ║');
    console.log('║              Comprehensive Website Cloning Engine v2.0               ║');
    console.log('║                                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════╝\x1b[0m\n');

    log.info(`Target URL: ${config.targetUrl}`);
    log.info(`Output: ${config.outputDir}/${config.outputFile}`);
    log.info(`Viewport: ${config.viewportWidth}x${config.viewportHeight}`);

    // Create output directories
    await ensureDir(config.outputDir);
    await ensureDir(path.join(config.outputDir, 'assets'));
    await ensureDir(path.join(config.outputDir, 'css'));
    await ensureDir(path.join(config.outputDir, 'js'));
    await ensureDir(path.join(config.outputDir, 'fonts'));

    log.step('Output directories created');

    // Launch browser
    log.section('Launching Browser');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({
        width: config.viewportWidth,
        height: config.viewportHeight
    });

    // Set user agent
    await page.setUserAgent(config.userAgent);

    log.step('Browser launched');

    try {
        // Navigate to page
        log.section('Loading Page');
        log.info(`Navigating to ${config.targetUrl}...`);

        await page.goto(config.targetUrl, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        log.step('Page loaded');

        // Wait for JavaScript execution
        log.info(`Waiting ${config.waitTime}ms for JavaScript execution...`);
        await new Promise(r => setTimeout(r, config.waitTime));
        log.step('JavaScript execution complete');

        // Scroll to trigger lazy loading
        await scrollPage(page);

        // Wait for network idle
        await waitForNetworkIdle(page);

        // Extract content
        const processedCSS = await extractCSS(page, config.targetUrl);
        await extractImages(page, config.targetUrl);
        await extractJS(page, config.targetUrl);
        await extractTextContent(page);

        // Process and save HTML
        const processedHTML = await processHTML(page, config.targetUrl, processedCSS);
        const outputPath = path.join(config.outputDir, config.outputFile);
        await fs.writeFile(outputPath, processedHTML);

        log.step(`HTML saved to ${outputPath}`);

        // Take screenshot for comparison
        const screenshotPath = path.join(config.outputDir, 'screenshot.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        log.step(`Screenshot saved to ${screenshotPath}`);

        // Generate report
        await generateReport();

    } catch (error) {
        log.error(`Clone failed: ${error.message}`);
        console.error(error);
    } finally {
        await browser.close();
        log.step('Browser closed');
    }

    log.section('Clone Complete!');
    console.log(`\n\x1b[32m✓ Website cloned successfully to ${config.outputDir}/${config.outputFile}\x1b[0m\n`);
}

// Run the clone
clone().catch(console.error);
CLONEBUSTERJS

    print_step "clonebuster.js engine created"
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    print_banner

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -o|--output)
                OUTPUT_FILE="$2"
                shift 2
                ;;
            -d|--dir)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            -w|--width)
                VIEWPORT_WIDTH="$2"
                shift 2
                ;;
            -h|--height)
                VIEWPORT_HEIGHT="$2"
                shift 2
                ;;
            -t|--timeout)
                WAIT_TIME="$2"
                shift 2
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                if [[ -z "$TARGET_URL" ]]; then
                    TARGET_URL="$1"
                fi
                shift
                ;;
        esac
    done

    # Default to Apple Siri page if no URL provided
    if [[ -z "$TARGET_URL" ]]; then
        TARGET_URL="https://www.apple.com/siri/"
        print_info "No URL provided, using default: $TARGET_URL"
    fi

    print_info "Target URL: $TARGET_URL"
    print_info "Output: $OUTPUT_DIR/$OUTPUT_FILE"

    # Check dependencies
    check_dependencies

    # Setup Puppeteer
    setup_puppeteer

    # Create the JS cloning engine
    create_clonebuster_js

    # Run the clone
    print_section "Starting Clone Process"
    node clonebuster.js "$TARGET_URL" "$OUTPUT_FILE" "$OUTPUT_DIR" "$VIEWPORT_WIDTH" "$VIEWPORT_HEIGHT" "$WAIT_TIME"

    print_section "Done!"
    echo -e "${GREEN}Clone saved to: $OUTPUT_DIR/$OUTPUT_FILE${NC}"
}

# Run main function
main "$@"
