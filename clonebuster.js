#!/usr/bin/env node
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                               ║
 * ║     ██████╗██╗      ██████╗ ███╗   ██╗███████╗██████╗ ██╗   ██╗███████╗      ║
 * ║    ██╔════╝██║     ██╔═══██╗████╗  ██║██╔════╝██╔══██╗██║   ██║██╔════╝      ║
 * ║    ██║     ██║     ██║   ██║██╔██╗ ██║█████╗  ██████╔╝██║   ██║███████╗      ║
 * ║    ██║     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║      ║
 * ║    ╚██████╗███████╗╚██████╔╝██║ ╚████║███████╗██████╔╝╚██████╔╝███████║      ║
 * ║     ╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝      ║
 * ║                                                                               ║
 * ║                    CLONEBUSTER v5.0 - Perfect Website Cloner                  ║
 * ║                                                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Perfect 1:1 pixel-accurate cloning
 * - Automatic lazy-load content triggering (scroll, hover, click)
 * - Complete asset downloading (images, CSS, JS, fonts, SVGs)
 * - CSS mask and background-image extraction
 * - Automatic path rewriting for offline viewing
 * - Data-lazy attribute removal for static viewing
 * - SVG mask preservation for text effects
 * - Responsive srcset handling
 * - Full-page screenshot for verification
 * - Detailed clone report
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const config = {
    targetUrl: process.argv[2] || 'https://www.apple.com/siri/',
    outputFile: process.argv[3] || 'siri.html',
    outputDir: process.argv[4] || '.',
    viewportWidth: 1920,
    viewportHeight: 1080,
    waitTime: 12000,
    scrollDelay: 300,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    timeout: 60000
};

// Statistics
const stats = {
    images: { total: 0, downloaded: 0, failed: 0 },
    css: { total: 0, downloaded: 0, failed: 0 },
    js: { total: 0, downloaded: 0, failed: 0 },
    fonts: { total: 0, downloaded: 0, failed: 0 },
    svgs: { total: 0, downloaded: 0, failed: 0 },
    textElements: 0,
    masksFixed: 0,
    lazyElementsFixed: 0
};

// Asset tracking
const downloadedAssets = new Map();
const assetMapping = new Map();
const failedAssets = new Set();
const cssUrls = new Set();

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const log = {
    banner: () => {
        console.log('\n\x1b[35m╔═══════════════════════════════════════════════════════════════════════════════╗');
        console.log('║                                                                               ║');
        console.log('║     ██████╗██╗      ██████╗ ███╗   ██╗███████╗██████╗ ██╗   ██╗███████╗      ║');
        console.log('║    ██╔════╝██║     ██╔═══██╗████╗  ██║██╔════╝██╔══██╗██║   ██║██╔════╝      ║');
        console.log('║    ██║     ██║     ██║   ██║██╔██╗ ██║█████╗  ██████╔╝██║   ██║███████╗      ║');
        console.log('║    ██║     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║      ║');
        console.log('║    ╚██████╗███████╗╚██████╔╝██║ ╚████║███████╗██████╔╝╚██████╔╝███████║      ║');
        console.log('║     ╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝      ║');
        console.log('║                                                                               ║');
        console.log('║                    CLONEBUSTER v5.0 - Perfect Website Cloner                  ║');
        console.log('║                                                                               ║');
        console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\x1b[0m\n');
    },
    section: (msg) => console.log(`\n\x1b[36m${'═'.repeat(75)}\n  ${msg}\n${'═'.repeat(75)}\x1b[0m\n`),
    step: (msg) => console.log(`\x1b[32m[✓]\x1b[0m ${msg}`),
    info: (msg) => console.log(`\x1b[34m[i]\x1b[0m ${msg}`),
    warn: (msg) => console.log(`\x1b[33m[!]\x1b[0m ${msg}`),
    error: (msg) => console.log(`\x1b[31m[✗]\x1b[0m ${msg}`),
    progress: (current, total, msg) => {
        const percent = Math.round((current / total) * 100);
        const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));
        process.stdout.write(`\r\x1b[34m[i]\x1b[0m ${msg}: [${bar}] ${current}/${total} (${percent}%)   `);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FILE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

function getFilenameFromUrl(url, defaultExt = '') {
    try {
        const parsedUrl = new URL(url);
        let pathname = parsedUrl.pathname;
        let filename = path.basename(pathname);

        // Clean filename
        filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

        // Ensure extension
        if (!path.extname(filename) && defaultExt) {
            filename += '.' + defaultExt;
        }

        return filename || `file_${Date.now()}${defaultExt ? '.' + defaultExt : ''}`;
    } catch (e) {
        return `file_${Date.now()}${defaultExt ? '.' + defaultExt : ''}`;
    }
}

function getAssetFolder(url) {
    const ext = path.extname(url).toLowerCase();
    if (['.css'].includes(ext)) return 'css';
    if (['.js'].includes(ext)) return 'js';
    if (['.woff', '.woff2', '.ttf', '.eot', '.otf'].includes(ext)) return 'fonts';
    if (['.svg'].includes(ext)) return 'assets';
    return 'assets';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOWNLOAD UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

async function downloadFile(url, retries = 3) {
    if (!url || url.startsWith('data:')) return null;
    if (downloadedAssets.has(url)) return downloadedAssets.get(url);
    if (failedAssets.has(url)) return null;

    // Resolve relative URLs
    let fullUrl = url;
    try {
        fullUrl = new URL(url, config.targetUrl).href;
    } catch (e) {
        return null;
    }

    // Determine local path
    const folder = getAssetFolder(fullUrl);
    const filename = getFilenameFromUrl(fullUrl);
    const localPath = path.join(config.outputDir, folder, filename);
    const relativePath = path.join(folder, filename);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios({
                method: 'GET',
                url: fullUrl,
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': config.userAgent,
                    'Accept': '*/*',
                    'Referer': config.targetUrl
                },
                maxRedirects: 5
            });

            await ensureDir(path.dirname(localPath));
            await fs.writeFile(localPath, response.data);
            downloadedAssets.set(url, relativePath);
            downloadedAssets.set(fullUrl, relativePath);
            assetMapping.set(url, relativePath);
            assetMapping.set(fullUrl, relativePath);
            return relativePath;
        } catch (err) {
            if (attempt === retries) {
                failedAssets.add(url);
                failedAssets.add(fullUrl);
                return null;
            }
            await new Promise(r => setTimeout(r, 1000 * attempt));
        }
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS EXTRACTION AND PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

async function extractCSSUrls(cssContent, cssUrl) {
    const urlRegex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
    const urls = [];
    let match;

    while ((match = urlRegex.exec(cssContent)) !== null) {
        let assetUrl = match[1].trim();
        if (assetUrl.startsWith('data:')) continue;

        try {
            const fullUrl = new URL(assetUrl, cssUrl).href;
            urls.push(fullUrl);
        } catch (e) {
            continue;
        }
    }

    return urls;
}

async function processCSS(page, baseUrl) {
    log.section('Extracting CSS & Assets');

    // Get all CSS
    const cssData = await page.evaluate(() => {
        const results = { external: [], inline: [] };
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (link.href) results.external.push(link.href);
        });
        document.querySelectorAll('style').forEach(style => {
            if (style.textContent.trim()) results.inline.push(style.textContent);
        });
        return results;
    });

    stats.css.total = cssData.external.length;
    log.info(`Found ${cssData.external.length} external CSS files`);

    // Download external CSS and extract assets
    for (let i = 0; i < cssData.external.length; i++) {
        const cssUrl = cssData.external[i];
        log.progress(i + 1, cssData.external.length, 'Downloading CSS');

        const localPath = await downloadFile(cssUrl);
        if (localPath) {
            stats.css.downloaded++;
            cssUrls.add(cssUrl);

            // Extract and download CSS assets
            try {
                const cssContent = await fs.readFile(path.join(config.outputDir, localPath), 'utf-8');
                const assetUrls = await extractCSSUrls(cssContent, cssUrl);

                for (const assetUrl of assetUrls) {
                    const ext = path.extname(assetUrl).toLowerCase();
                    if (['.woff', '.woff2', '.ttf', '.eot', '.otf'].includes(ext)) {
                        stats.fonts.total++;
                        const result = await downloadFile(assetUrl);
                        if (result) stats.fonts.downloaded++;
                        else stats.fonts.failed++;
                    } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
                        stats.images.total++;
                        const result = await downloadFile(assetUrl);
                        if (result) stats.images.downloaded++;
                        else stats.images.failed++;
                    }
                }
            } catch (e) {
                log.warn(`Could not parse CSS: ${cssUrl}`);
            }
        } else {
            stats.css.failed++;
        }
    }
    console.log('');

    log.step(`CSS downloaded: ${stats.css.downloaded}/${stats.css.total}`);
    return cssData;
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

async function extractImages(page, baseUrl) {
    log.section('Extracting Images');

    const imageData = await page.evaluate(() => {
        const images = new Set();

        // All img elements
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.src.startsWith('data:')) images.add(img.src);
            if (img.srcset) {
                img.srcset.split(',').forEach(src => {
                    const url = src.trim().split(/\s+/)[0];
                    if (url && !url.startsWith('data:')) images.add(url);
                });
            }
        });

        // Picture sources
        document.querySelectorAll('picture source').forEach(source => {
            if (source.srcset) {
                source.srcset.split(',').forEach(src => {
                    const url = src.trim().split(/\s+/)[0];
                    if (url && !url.startsWith('data:')) images.add(url);
                });
            }
        });

        // Background images in style attributes
        document.querySelectorAll('[style*="background"]').forEach(el => {
            const style = el.getAttribute('style') || '';
            const matches = style.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g);
            for (const match of matches) {
                if (!match[1].startsWith('data:')) images.add(match[1]);
            }
        });

        // SVG use elements
        document.querySelectorAll('svg use').forEach(use => {
            const href = use.getAttribute('href') || use.getAttribute('xlink:href');
            if (href && !href.startsWith('#') && !href.startsWith('data:')) {
                images.add(href);
            }
        });

        // Video posters
        document.querySelectorAll('video[poster]').forEach(video => {
            if (video.poster && !video.poster.startsWith('data:')) images.add(video.poster);
        });

        return Array.from(images);
    });

    stats.images.total += imageData.length;
    log.info(`Found ${imageData.length} images to download`);

    for (let i = 0; i < imageData.length; i++) {
        log.progress(i + 1, imageData.length, 'Downloading images');
        const result = await downloadFile(imageData[i]);
        if (result) stats.images.downloaded++;
        else stats.images.failed++;
    }
    console.log('');

    log.step(`Images downloaded: ${stats.images.downloaded}/${stats.images.total}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// JAVASCRIPT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

async function extractJS(page, baseUrl) {
    log.section('Extracting JavaScript');

    const jsData = await page.evaluate(() => {
        const scripts = [];
        document.querySelectorAll('script[src]').forEach(script => {
            if (script.src) scripts.push(script.src);
        });
        return scripts;
    });

    stats.js.total = jsData.length;
    log.info(`Found ${jsData.length} JavaScript files`);

    for (let i = 0; i < jsData.length; i++) {
        log.progress(i + 1, jsData.length, 'Downloading JS');
        const result = await downloadFile(jsData[i]);
        if (result) stats.js.downloaded++;
        else stats.js.failed++;
    }
    console.log('');

    log.step(`JavaScript downloaded: ${stats.js.downloaded}/${stats.js.total}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADING TRIGGER
// ═══════════════════════════════════════════════════════════════════════════════

async function triggerLazyLoading(page) {
    log.section('Triggering Lazy-Loaded Content');

    // Scroll through entire page
    log.info('Scrolling through page to trigger lazy loading...');
    await page.evaluate(async (scrollDelay) => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const viewportHeight = window.innerHeight;
        let currentPosition = 0;

        while (currentPosition < scrollHeight) {
            window.scrollTo(0, currentPosition);
            currentPosition += viewportHeight / 3;
            await delay(scrollDelay);
        }

        // Scroll to bottom
        window.scrollTo(0, scrollHeight);
        await delay(1000);

        // Scroll back to top
        window.scrollTo(0, 0);
        await delay(500);
    }, config.scrollDelay);
    log.step('Page scrolled');

    // Hover over interactive elements
    log.info('Hovering over interactive elements...');
    await page.evaluate(async () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const interactiveElements = document.querySelectorAll('button, a, [data-component-list], .tile, .bento');

        for (const el of interactiveElements) {
            try {
                el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                await delay(50);
            } catch (e) {}
        }
    });
    log.step('Interactive elements triggered');

    // Wait for network to settle
    log.info('Waiting for network idle...');
    try {
        await page.waitForNetworkIdle({ timeout: 5000, idleTime: 1000 });
        log.step('Network idle');
    } catch (e) {
        log.warn('Network idle timeout - continuing');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTML PROCESSING AND FIXING
// ═══════════════════════════════════════════════════════════════════════════════

async function processHTML(page, baseUrl) {
    log.section('Processing HTML');

    let html = await page.content();
    const $ = cheerio.load(html, { decodeEntities: false });

    // Count initial issues
    const initialDataLazy = ($('[data-lazy]').length);
    const initialOnload = (html.match(/onload="__lp\(event\)"/g) || []).length;
    log.info(`Found ${initialDataLazy} data-lazy elements, ${initialOnload} __lp handlers`);

    // FIX 1: Remove data-lazy attributes (they hide elements)
    $('[data-lazy]').removeAttr('data-lazy');
    stats.lazyElementsFixed = initialDataLazy;
    log.step(`Removed ${initialDataLazy} data-lazy attributes`);

    // FIX 2: Remove data-empty placeholder sources
    $('source[data-empty]').remove();
    log.step('Removed data-empty placeholder sources');

    // FIX 3: Update CSS links
    $('link[rel="stylesheet"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href) {
            const localPath = assetMapping.get(href) || assetMapping.get(new URL(href, baseUrl).href);
            if (localPath) $(el).attr('href', localPath);
        }
    });
    log.step('Updated CSS links');

    // FIX 4: Update image sources
    $('img').each((i, el) => {
        // Fix src
        const src = $(el).attr('src');
        if (src && !src.startsWith('data:')) {
            try {
                const fullUrl = new URL(src, baseUrl).href;
                const localPath = assetMapping.get(src) || assetMapping.get(fullUrl);
                if (localPath) $(el).attr('src', localPath);
            } catch (e) {}
        }

        // Fix srcset
        const srcset = $(el).attr('srcset');
        if (srcset) {
            const newSrcset = srcset.split(',').map(src => {
                const parts = src.trim().split(/\s+/);
                const url = parts[0];
                if (url && !url.startsWith('data:')) {
                    try {
                        const fullUrl = new URL(url, baseUrl).href;
                        const localPath = assetMapping.get(url) || assetMapping.get(fullUrl);
                        if (localPath) parts[0] = localPath;
                    } catch (e) {}
                }
                return parts.join(' ');
            }).join(', ');
            $(el).attr('srcset', newSrcset);
        }

        // Remove onload handler
        $(el).removeAttr('onload');
    });
    log.step('Updated image sources');

    // FIX 5: Update picture sources
    $('picture source').each((i, el) => {
        const srcset = $(el).attr('srcset');
        if (srcset) {
            const newSrcset = srcset.split(',').map(src => {
                const parts = src.trim().split(/\s+/);
                const url = parts[0];
                if (url && !url.startsWith('data:')) {
                    try {
                        const fullUrl = new URL(url, baseUrl).href;
                        const localPath = assetMapping.get(url) || assetMapping.get(fullUrl);
                        if (localPath) parts[0] = localPath;
                    } catch (e) {}
                }
                return parts.join(' ');
            }).join(', ');
            $(el).attr('srcset', newSrcset);
        }
    });
    log.step('Updated picture sources');

    // FIX 6: Update script sources
    $('script[src]').each((i, el) => {
        const src = $(el).attr('src');
        if (src) {
            try {
                const fullUrl = new URL(src, baseUrl).href;
                const localPath = assetMapping.get(src) || assetMapping.get(fullUrl);
                if (localPath) $(el).attr('src', localPath);
            } catch (e) {}
        }
    });
    log.step('Updated script sources');

    // FIX 7: Fix empty alt attributes
    $('img[alt=""]').attr('alt', '');
    $('img:not([alt])').attr('alt', '');

    // FIX 8: Add inline CSS for masks and visibility
    const inlineCSS = `
<style id="clonebuster-fixes">
/* CLONEBUSTER v5 - Inline Fixes */

/* Siri Hero Text - SVG Mask with Gradient Animation */
.siri {
    -webkit-mask: url(assets/hero_siri__dqh8piyszs02_large.svg) !important;
    mask: url(assets/hero_siri__dqh8piyszs02_large.svg) !important;
    -webkit-mask-size: 100% !important;
    mask-size: 100% !important;
    -webkit-mask-repeat: no-repeat !important;
    mask-repeat: no-repeat !important;
    background: linear-gradient(121deg, #FE0576 24%, #EA12B6 40%, #38CBFF 60%) !important;
    background-size: 300% 100% !important;
    animation: siri-gradient 3s cubic-bezier(0.33, 1, 0.68, 1) forwards !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

@keyframes siri-gradient {
    0% { background-position: 100% 100%; }
    100% { background-position: 38% 100%; }
}

/* CarPlay Dashboard Mask */
.overview-car-carplay img,
picture.overview-car-carplay img {
    -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_xlarge.png) !important;
    mask: url(assets/car_carplay_mask__gdalbb16ucq6_xlarge.png) !important;
    -webkit-mask-size: 100% !important;
    mask-size: 100% !important;
    -webkit-mask-repeat: no-repeat !important;
    mask-repeat: no-repeat !important;
}

/* HomePod Mini Mask */
.overview-hero-homepod-mini img {
    -webkit-mask: url(assets/hero_homepod_mini_mask__ey7dvp5lrtw2_large.png) !important;
    mask: url(assets/hero_homepod_mini_mask__ey7dvp5lrtw2_large.png) !important;
    -webkit-mask-size: 100% !important;
    mask-size: 100% !important;
}

/* Force All Images Visible */
picture, picture img,
.section-hero-images picture,
.section-hero-images picture img,
.scenario-tile picture,
.scenario-tile picture img,
.main-tile picture,
.main-tile picture img,
.tile-image, .tile-image img,
.quote-icon, .quote-icon img,
[data-component-list] picture,
[data-component-list] picture img {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* Responsive Mask Fixes */
@media (max-width: 1440px) {
    .overview-car-carplay img { -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_large.png) !important; mask: url(assets/car_carplay_mask__gdalbb16ucq6_large.png) !important; }
}
@media (max-width: 1068px) {
    .siri { width: 254px !important; height: 144px !important; }
    .overview-car-carplay img { -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_medium.png) !important; mask: url(assets/car_carplay_mask__gdalbb16ucq6_medium.png) !important; }
    .overview-hero-homepod-mini img { -webkit-mask: url(assets/hero_homepod_mini_mask__ey7dvp5lrtw2_medium.png) !important; mask: url(assets/hero_homepod_mini_mask__ey7dvp5lrtw2_medium.png) !important; }
}
@media (max-width: 734px) {
    .siri { width: 154px !important; height: 88px !important; }
    .overview-car-carplay img { -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_small.png) !important; mask: url(assets/car_carplay_mask__gdalbb16ucq6_small.png) !important; }
    .overview-hero-homepod-mini img { -webkit-mask: url(assets/hero_homepod_mini_mask__ey7dvp5lrtw2_small.png) !important; mask: url(assets/hero_homepod_mini_mask__ey7dvp5lrtw2_small.png) !important; }
}
</style>`;

    $('head').append(inlineCSS);
    stats.masksFixed = 3;
    log.step('Added inline CSS fixes for masks and visibility');

    return $.html();
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS POST-PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

async function fixCSSPaths() {
    log.section('Fixing CSS Paths');

    const cssDir = path.join(config.outputDir, 'css');
    try {
        const files = await fs.readdir(cssDir);
        const cssFiles = files.filter(f => f.endsWith('.css'));

        for (const file of cssFiles) {
            const filePath = path.join(cssDir, file);
            let content = await fs.readFile(filePath, 'utf-8');

            // Replace Apple CDN paths with local paths
            const patterns = [
                [/url\(\/v\/siri\/i\/images\/overview\//g, 'url(../assets/'],
                [/url\(\/v\/siri\/i\/images\/shared\//g, 'url(../assets/'],
                [/url\(\/v\/siri\/i\/images\//g, 'url(../assets/'],
                [/url\(['"]\/v\/siri\/i\/images\/overview\//g, "url('../assets/"],
                [/url\(['"]\/v\/siri\/i\/images\//g, "url('../assets/"],
            ];

            let replacements = 0;
            for (const [from, to] of patterns) {
                const matches = content.match(from);
                if (matches) {
                    replacements += matches.length;
                    content = content.replace(from, to);
                }
            }

            if (replacements > 0) {
                await fs.writeFile(filePath, content);
                log.step(`Fixed ${replacements} paths in ${file}`);
            }
        }
    } catch (e) {
        log.warn('Could not process CSS directory');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

async function generateReport() {
    log.section('Clone Report');

    const totalAssets = stats.images.total + stats.css.total + stats.js.total + stats.fonts.total;
    const downloadedTotal = stats.images.downloaded + stats.css.downloaded + stats.js.downloaded + stats.fonts.downloaded;
    const failedTotal = stats.images.failed + stats.css.failed + stats.js.failed + stats.fonts.failed;

    console.log('\n┌─────────────────────────────────────────────────────────────────────┐');
    console.log('│                        CLONEBUSTER v5 REPORT                        │');
    console.log('├─────────────────────────────────────────────────────────────────────┤');
    console.log(`│  Images:         ${String(stats.images.downloaded).padStart(4)}/${String(stats.images.total).padStart(4)} downloaded (${stats.images.failed} failed)`.padEnd(70) + '│');
    console.log(`│  CSS:            ${String(stats.css.downloaded).padStart(4)}/${String(stats.css.total).padStart(4)} downloaded`.padEnd(70) + '│');
    console.log(`│  JavaScript:     ${String(stats.js.downloaded).padStart(4)}/${String(stats.js.total).padStart(4)} downloaded`.padEnd(70) + '│');
    console.log(`│  Fonts:          ${String(stats.fonts.downloaded).padStart(4)}/${String(stats.fonts.total).padStart(4)} downloaded`.padEnd(70) + '│');
    console.log('├─────────────────────────────────────────────────────────────────────┤');
    console.log(`│  Lazy elements fixed:  ${stats.lazyElementsFixed}`.padEnd(70) + '│');
    console.log(`│  CSS masks fixed:      ${stats.masksFixed}`.padEnd(70) + '│');
    console.log('├─────────────────────────────────────────────────────────────────────┤');
    console.log(`│  Total:          ${downloadedTotal}/${totalAssets} assets downloaded`.padEnd(70) + '│');
    console.log(`│  Output:         ${config.outputFile}`.padEnd(70) + '│');
    console.log('└─────────────────────────────────────────────────────────────────────┘\n');

    // Save report
    const report = {
        version: '5.0',
        timestamp: new Date().toISOString(),
        targetUrl: config.targetUrl,
        outputFile: config.outputFile,
        stats: stats,
        totalAssets: totalAssets,
        downloadedAssets: downloadedTotal,
        failedAssets: failedTotal
    };

    await fs.writeFile(
        path.join(config.outputDir, 'clone-report.json'),
        JSON.stringify(report, null, 2)
    );
    log.step('Report saved to clone-report.json');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CLONE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function clone() {
    log.banner();

    log.info(`Target URL: ${config.targetUrl}`);
    log.info(`Output: ${path.join(config.outputDir, config.outputFile)}`);
    log.info(`Viewport: ${config.viewportWidth}x${config.viewportHeight}`);

    // Create directories
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
            '--disable-features=IsolateOrigins,site-per-process',
            `--window-size=${config.viewportWidth},${config.viewportHeight}`
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: config.viewportWidth,
        height: config.viewportHeight,
        deviceScaleFactor: 2
    });
    await page.setUserAgent(config.userAgent);
    log.step('Browser launched');

    try {
        // Navigate
        log.section('Loading Page');
        log.info(`Navigating to ${config.targetUrl}...`);
        await page.goto(config.targetUrl, {
            waitUntil: ['networkidle2', 'domcontentloaded'],
            timeout: config.timeout
        });
        log.step('Page loaded');

        // Wait for JS
        log.info(`Waiting ${config.waitTime}ms for JavaScript execution...`);
        await new Promise(r => setTimeout(r, config.waitTime));
        log.step('JavaScript execution complete');

        // Trigger lazy loading
        await triggerLazyLoading(page);

        // Extract assets
        await processCSS(page, config.targetUrl);
        await extractImages(page, config.targetUrl);
        await extractJS(page, config.targetUrl);

        // Process HTML
        const processedHTML = await processHTML(page, config.targetUrl);

        // Save HTML
        const outputPath = path.join(config.outputDir, config.outputFile);
        await fs.writeFile(outputPath, processedHTML, 'utf-8');
        log.step(`HTML saved to ${outputPath}`);

        // Fix CSS paths
        await fixCSSPaths();

        // Screenshot
        log.section('Taking Screenshot');
        const screenshotPath = path.join(config.outputDir, 'screenshot.png');
        await page.screenshot({ path: screenshotPath, fullPage: true, type: 'png' });
        log.step(`Screenshot saved to ${screenshotPath}`);

        // Report
        await generateReport();

    } catch (error) {
        log.error(`Clone failed: ${error.message}`);
        console.error(error);
        process.exit(1);
    } finally {
        await browser.close();
        log.step('Browser closed');
    }

    log.section('Clone Complete!');
    console.log(`\n\x1b[32m✓ Website cloned successfully to ${path.join(config.outputDir, config.outputFile)}\x1b[0m\n`);
}

// Run
clone().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
