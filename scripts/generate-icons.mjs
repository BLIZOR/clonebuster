#!/usr/bin/env node
/**
 * CLONEBUSTER - COMPREHENSIVE FIX v2
 *
 * This script completely fixes the clone by:
 * 1. Removing ALL data-lazy attributes (they hide images)
 * 2. Removing ALL data-empty placeholder sources
 * 3. Removing onload="__lp(event)" handlers (function doesn't exist)
 * 4. Fixing ALL CSS paths to use local assets
 * 5. Adding inline styles for SVG masks
 * 6. Creating siri.html as a clean, working copy
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, '..');

console.log('\n🔧 CLONEBUSTER COMPREHENSIVE FIX v2\n');
console.log('='.repeat(60) + '\n');

// ============================================================
// FIX 1: CSS FILES - Replace ALL Apple CDN paths
// ============================================================

console.log('📁 Fixing CSS files...\n');

const cssDir = path.join(projectDir, 'css');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && f !== 'clonebuster-overrides.css');

let totalCssReplacements = 0;

cssFiles.forEach(file => {
    const filePath = path.join(cssDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalLength = content.length;

    // Replace ALL Apple CDN URL patterns
    content = content.replace(/url\(\/v\/siri\/i\/images\/overview\//g, 'url(../assets/');
    content = content.replace(/url\(\/v\/siri\/i\/images\/shared\//g, 'url(../assets/');
    content = content.replace(/url\(\/v\/siri\/i\/images\//g, 'url(../assets/');
    content = content.replace(/url\(https:\/\/www\.apple\.com\/v\/siri\/i\/images\/overview\//g, 'url(../assets/');
    content = content.replace(/url\(https:\/\/www\.apple\.com\/v\/siri\/i\/images\//g, 'url(../assets/');
    content = content.replace(/url\(['"]\/v\/siri\/i\/images\/overview\//g, "url('../assets/");
    content = content.replace(/url\(['"]\/v\/siri\/i\/images\//g, "url('../assets/");

    if (content.length !== originalLength || content.includes('../assets/')) {
        fs.writeFileSync(filePath, content);
        const replacements = (content.match(/\.\.\/assets\//g) || []).length;
        console.log(`  ✓ ${file}: processed (${replacements} local asset refs)`);
        totalCssReplacements += replacements;
    } else {
        console.log(`    ${file}: no changes needed`);
    }
});

console.log(`\n  Total CSS asset references: ${totalCssReplacements}\n`);

// ============================================================
// FIX 2: HTML FILE - COMPREHENSIVE CLEANUP
// ============================================================

console.log('📄 Fixing HTML file and creating siri.html...\n');

const htmlPath = path.join(projectDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Count initial issues
const initialDataLazy = (html.match(/data-lazy/g) || []).length;
const initialDataEmpty = (html.match(/data-empty/g) || []).length;
const initialOnload = (html.match(/onload="__lp\(event\)"/g) || []).length;
console.log(`  Initial issues found:`);
console.log(`    - data-lazy attributes: ${initialDataLazy}`);
console.log(`    - data-empty sources: ${initialDataEmpty}`);
console.log(`    - __lp onload handlers: ${initialOnload}\n`);

// FIX 2.1: Remove ALL data-lazy attributes (they hide elements via CSS)
html = html.replace(/ data-lazy/g, '');
console.log('  ✓ Removed all data-lazy attributes');

// FIX 2.2: Remove ALL data-empty sources (placeholder images)
html = html.replace(/<source data-empty srcset="[^"]*"[^>]*\/>\s*/g, '');
console.log('  ✓ Removed all data-empty placeholder sources');

// FIX 2.3: Remove onload="__lp(event)" handlers (function doesn't exist locally)
html = html.replace(/ onload="__lp\(event\)"/g, '');
console.log('  ✓ Removed all __lp onload handlers');

// FIX 2.4: Fix ALL remaining Apple CDN paths in srcset and src
html = html.replace(/\/v\/siri\/i\/images\/overview\//g, 'assets/');
html = html.replace(/\/v\/siri\/i\/images\//g, 'assets/');
html = html.replace(/https:\/\/www\.apple\.com\/v\/siri\/i\/images\/overview\//g, 'assets/');
html = html.replace(/https:\/\/www\.apple\.com\/v\/siri\/i\/images\//g, 'assets/');
console.log('  ✓ Fixed all Apple CDN paths to local assets');

// FIX 2.5: Add clonebuster-overrides.css if not present
if (!html.includes('clonebuster-overrides.css')) {
    html = html.replace(
        '<link rel="stylesheet" href="css/overview.built.css" type="text/css" />',
        '<link rel="stylesheet" href="css/overview.built.css" type="text/css" />\n\t<link rel="stylesheet" href="css/clonebuster-overrides.css" type="text/css" />'
    );
    console.log('  ✓ Added clonebuster-overrides.css link');
}

// FIX 2.6: Fix Siri hero text - add inline style with SVG mask
html = html.replace(
    /<div class="siri" role="heading" aria-level="1" aria-label="Siri"([^>]*)>/g,
    '<div class="siri" role="heading" aria-level="1" aria-label="Siri"$1 style="-webkit-mask:url(assets/hero_siri__dqh8piyszs02_large.svg);mask:url(assets/hero_siri__dqh8piyszs02_large.svg);-webkit-mask-size:100%;mask-size:100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;background:linear-gradient(121deg,#FE0576 24%,#EA12B6 40%,#38CBFF 60%);background-size:300% 100%;animation:siri-gradient 3s ease forwards;">'
);
console.log('  ✓ Fixed Siri hero text with inline SVG mask');

// FIX 2.7: Add CSS keyframes animation for Siri gradient if not present
if (!html.includes('@keyframes siri-gradient')) {
    html = html.replace(
        '</head>',
        `<style>
@keyframes siri-gradient {
    0% { background-position: 100% 100%; }
    100% { background-position: 38% 100%; }
}
/* Force all images to be visible */
[data-component-list] picture,
[data-component-list] picture img,
.section-hero-images picture,
.section-hero-images picture img,
.scenario-tile picture,
.scenario-tile picture img,
.main-tile picture,
.main-tile picture img {
    opacity: 1 !important;
    visibility: visible !important;
}
/* Fix CarPlay dashboard mask */
.overview-car-carplay img {
    -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_xlarge.png);
    mask: url(assets/car_carplay_mask__gdalbb16ucq6_xlarge.png);
    -webkit-mask-size: 100%;
    mask-size: 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}
@media (max-width: 1440px) {
    .overview-car-carplay img {
        -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_large.png);
        mask: url(assets/car_carplay_mask__gdalbb16ucq6_large.png);
    }
}
@media (max-width: 1068px) {
    .overview-car-carplay img {
        -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_medium.png);
        mask: url(assets/car_carplay_mask__gdalbb16ucq6_medium.png);
    }
    .siri {
        width: 254px !important;
        height: 144px !important;
    }
}
@media (max-width: 734px) {
    .overview-car-carplay img {
        -webkit-mask: url(assets/car_carplay_mask__gdalbb16ucq6_small.png);
        mask: url(assets/car_carplay_mask__gdalbb16ucq6_small.png);
    }
    .siri {
        width: 154px !important;
        height: 88px !important;
    }
}
</style>
</head>`
    );
    console.log('  ✓ Added inline CSS for animations and masks');
}

// FIX 2.8: Remove empty alt attributes and fix them
html = html.replace(/ alt>/g, ' alt="">');
console.log('  ✓ Fixed empty alt attributes');

// Verify fixes
const finalDataLazy = (html.match(/data-lazy/g) || []).length;
const finalDataEmpty = (html.match(/data-empty/g) || []).length;
const finalOnload = (html.match(/onload="__lp\(event\)"/g) || []).length;

console.log(`\n  Final verification:`);
console.log(`    - data-lazy remaining: ${finalDataLazy}`);
console.log(`    - data-empty remaining: ${finalDataEmpty}`);
console.log(`    - __lp handlers remaining: ${finalOnload}`);

// Save both index.html and siri.html
fs.writeFileSync(htmlPath, html);
console.log('\n  ✓ Updated index.html');

const siriPath = path.join(projectDir, 'siri.html');
fs.writeFileSync(siriPath, html);
console.log('  ✓ Created siri.html (clean copy)');

// ============================================================
// FIX 3: UPDATE OVERRIDE CSS
// ============================================================

console.log('\n📝 Updating clonebuster-overrides.css...\n');

const overrideCSS = `/* CLONEBUSTER - CSS Overrides v2 */
/* Fixes all broken paths and forces visibility */

/* ============================================================ */
/* SIRI HERO TEXT - SVG MASK WITH GRADIENT */
/* ============================================================ */
.siri {
    -webkit-mask: url(../assets/hero_siri__dqh8piyszs02_large.svg) !important;
    mask: url(../assets/hero_siri__dqh8piyszs02_large.svg) !important;
    -webkit-mask-size: 100% !important;
    mask-size: 100% !important;
    -webkit-mask-repeat: no-repeat !important;
    mask-repeat: no-repeat !important;
    background: linear-gradient(121deg, #FE0576 24%, #EA12B6 40%, #38CBFF 60%) !important;
    background-size: 300% 100% !important;
    width: 384px;
    height: 218px;
    position: relative;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* ============================================================ */
/* CARPLAY DASHBOARD MASK */
/* ============================================================ */
.overview-car-carplay img,
.overview-car-carplay.sticky-hw img,
picture.overview-car-carplay img {
    -webkit-mask: url(../assets/car_carplay_mask__gdalbb16ucq6_xlarge.png) !important;
    mask: url(../assets/car_carplay_mask__gdalbb16ucq6_xlarge.png) !important;
    -webkit-mask-size: 100% !important;
    mask-size: 100% !important;
    -webkit-mask-repeat: no-repeat !important;
    mask-repeat: no-repeat !important;
    opacity: 1 !important;
    visibility: visible !important;
}

/* ============================================================ */
/* HOMEPOD MINI MASK */
/* ============================================================ */
.overview-hero-homepod-mini img {
    -webkit-mask: url(../assets/hero_homepod_mini_mask__ey7dvp5lrtw2_large.png) !important;
    mask: url(../assets/hero_homepod_mini_mask__ey7dvp5lrtw2_large.png) !important;
    -webkit-mask-size: 100% !important;
    mask-size: 100% !important;
}

/* ============================================================ */
/* FORCE ALL IMAGES VISIBLE */
/* ============================================================ */
picture,
picture img,
.section-hero-images picture,
.section-hero-images picture img,
.overview-hero-airpods,
.overview-hero-airpods img,
.overview-hero-iphone,
.overview-hero-iphone img,
.overview-hero-watch,
.overview-hero-watch img,
.overview-hero-ipad,
.overview-hero-ipad img,
.overview-hero-apple-tv,
.overview-hero-apple-tv img,
.overview-hero-homepod-mini,
.overview-hero-homepod-mini img {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* ============================================================ */
/* BENTO BOX / TILE IMAGES */
/* ============================================================ */
.scenario-tile picture,
.scenario-tile picture img,
.scenario-tile .tile-image,
.scenario-tile .tile-image img,
.main-tile picture,
.main-tile picture img,
.main-tile .image-wrapper picture,
.main-tile .image-wrapper picture img,
.quote-icon,
.quote-icon img {
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
}

/* ============================================================ */
/* GO SECTION IMAGES */
/* ============================================================ */
.overview-go-airpods img,
.overview-go-iphone img {
    opacity: 1 !important;
    visibility: visible !important;
}

/* ============================================================ */
/* RESPONSIVE MASK FIXES */
/* ============================================================ */
@media only screen and (max-width: 1440px) {
    .overview-car-carplay img,
    .overview-car-carplay.sticky-hw img {
        -webkit-mask: url(../assets/car_carplay_mask__gdalbb16ucq6_large.png) !important;
        mask: url(../assets/car_carplay_mask__gdalbb16ucq6_large.png) !important;
    }
}

@media only screen and (max-width: 1068px) {
    .siri {
        width: 254px !important;
        height: 144px !important;
    }
    .overview-car-carplay img,
    .overview-car-carplay.sticky-hw img {
        -webkit-mask: url(../assets/car_carplay_mask__gdalbb16ucq6_medium.png) !important;
        mask: url(../assets/car_carplay_mask__gdalbb16ucq6_medium.png) !important;
    }
    .overview-hero-homepod-mini img {
        -webkit-mask: url(../assets/hero_homepod_mini_mask__ey7dvp5lrtw2_medium.png) !important;
        mask: url(../assets/hero_homepod_mini_mask__ey7dvp5lrtw2_medium.png) !important;
    }
}

@media only screen and (max-width: 734px) {
    .siri {
        width: 154px !important;
        height: 88px !important;
    }
    .overview-car-carplay img,
    .overview-car-carplay.sticky-hw img {
        -webkit-mask: url(../assets/car_carplay_mask__gdalbb16ucq6_small.png) !important;
        mask: url(../assets/car_carplay_mask__gdalbb16ucq6_small.png) !important;
    }
    .overview-hero-homepod-mini img {
        -webkit-mask: url(../assets/hero_homepod_mini_mask__ey7dvp5lrtw2_small.png) !important;
        mask: url(../assets/hero_homepod_mini_mask__ey7dvp5lrtw2_small.png) !important;
    }
}

/* ============================================================ */
/* ANIMATION KEYFRAMES */
/* ============================================================ */
@keyframes siri-gradient {
    0% { background-position: 100% 100%; }
    100% { background-position: 38% 100%; }
}

.siri {
    animation: siri-gradient 3s cubic-bezier(0.33, 1, 0.68, 1) forwards !important;
}
`;

const overridePath = path.join(projectDir, 'css', 'clonebuster-overrides.css');
fs.writeFileSync(overridePath, overrideCSS);
console.log('  ✓ Updated css/clonebuster-overrides.css');

// ============================================================
// SUMMARY
// ============================================================

console.log('\n' + '='.repeat(60));
console.log('\n✅ ALL FIXES APPLIED!\n');
console.log('Changes made:');
console.log(`  • Removed ${initialDataLazy} data-lazy attributes`);
console.log(`  • Removed ${initialDataEmpty} data-empty placeholder sources`);
console.log(`  • Removed ${initialOnload} __lp onload handlers`);
console.log('  • Fixed all Apple CDN paths → local assets');
console.log('  • Added Siri gradient animation');
console.log('  • Added CarPlay dashboard mask');
console.log('  • Added HomePod mini mask');
console.log('  • Force visibility on all images');
console.log('\n📂 Files updated:');
console.log('  • index.html');
console.log('  • siri.html (clean copy)');
console.log('  • css/clonebuster-overrides.css');
console.log('  • css/overview.built.css');
console.log('\n🌐 Open siri.html in your browser to verify!\n');
