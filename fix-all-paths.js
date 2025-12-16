#!/usr/bin/env node
/**
 * CLONEBUSTER - Fix All Broken Paths
 *
 * This script fixes:
 * 1. CSS paths referencing Apple CDN (/v/siri/i/images/...)
 * 2. HTML srcset paths with Apple CDN URLs
 * 3. data-lazy images that need proper sources
 * 4. Adds the clonebuster-overrides.css link
 */

const fs = require('fs');
const path = require('path');

const projectDir = __dirname;

console.log('\n🔧 CLONEBUSTER PATH FIXER\n');
console.log('='.repeat(60) + '\n');

// ============================================================
// FIX 1: CSS FILES - Replace Apple CDN paths with local paths
// ============================================================

console.log('📁 Fixing CSS files...\n');

const cssDir = path.join(projectDir, 'css');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && f !== 'clonebuster-overrides.css');

let totalCssReplacements = 0;

cssFiles.forEach(file => {
    const filePath = path.join(cssDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let replacements = 0;

    // Replace all Apple CDN URL patterns
    const patterns = [
        [/url\(\/v\/siri\/i\/images\/overview\//g, 'url(../assets/'],
        [/url\(\/v\/siri\/i\/images\/shared\//g, 'url(../assets/'],
        [/url\(\/v\/siri\/i\/images\//g, 'url(../assets/'],
        [/url\(https:\/\/www\.apple\.com\/v\/siri\/i\/images\/overview\//g, 'url(../assets/'],
        [/url\(https:\/\/www\.apple\.com\/v\/siri\/i\/images\//g, 'url(../assets/'],
        [/url\(['"]\/v\/siri\/i\/images\/overview\//g, "url('../assets/"],
        [/url\(['"]\/v\/siri\/i\/images\//g, "url('../assets/"],
    ];

    patterns.forEach(([from, to]) => {
        const matches = content.match(from);
        if (matches) {
            replacements += matches.length;
            content = content.replace(from, to);
        }
    });

    if (replacements > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ ${file}: ${replacements} paths fixed`);
        totalCssReplacements += replacements;
    } else {
        console.log(`    ${file}: no changes needed`);
    }
});

console.log(`\n  Total CSS replacements: ${totalCssReplacements}\n`);

// ============================================================
// FIX 2: HTML FILE - Fix srcset, data-lazy, and add override CSS
// ============================================================

console.log('📄 Fixing HTML file...\n');

const htmlPath = path.join(projectDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');
let htmlFixes = 0;

// Fix all srcset paths that reference Apple CDN
html = html.replace(/\/v\/siri\/i\/images\/overview\//g, 'assets/');
html = html.replace(/\/v\/siri\/i\/images\//g, 'assets/');
console.log('  ✓ Fixed srcset Apple CDN paths');
htmlFixes++;

// Add the clonebuster-overrides.css link if not present
if (!html.includes('clonebuster-overrides.css')) {
    html = html.replace(
        '<link rel="stylesheet" href="css/overview.built.css" type="text/css" />',
        '<link rel="stylesheet" href="css/overview.built.css" type="text/css" />\n\t<link rel="stylesheet" href="css/clonebuster-overrides.css" type="text/css" />'
    );
    console.log('  ✓ Added clonebuster-overrides.css link');
    htmlFixes++;
}

// Fix the Siri hero div - add inline style for SVG mask
html = html.replace(
    /<div class="siri" role="heading" aria-level="1" aria-label="Siri">/g,
    '<div class="siri" role="heading" aria-level="1" aria-label="Siri" style="-webkit-mask:url(assets/hero_siri__dqh8piyszs02_large.svg);mask:url(assets/hero_siri__dqh8piyszs02_large.svg);-webkit-mask-size:100%;mask-size:100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;background:linear-gradient(121deg,#FE0576 24%,#EA12B6 40%,#38CBFF 60%);background-size:300% 100%;width:384px;height:218px;position:relative;">'
);
console.log('  ✓ Fixed Siri hero text inline style');
htmlFixes++;

// Fix car carplay - replace empty data source with actual srcset
html = html.replace(
    /(<picture id="overview-car-carplay-1"[^>]*>)\s*<source data-empty srcset="data:image\/gif;base64,[^"]*" media="\(min-width:0px\)" \/>/g,
    '$1\n\t\t\t\t\t\t\t\t<source srcset="assets/car_carplay__dpiz4n915vki_small.jpg, assets/car_carplay__dpiz4n915vki_small_2x.jpg 2x" media="(max-width:734px)" />\n\t\t\t\t\t\t\t\t<source srcset="assets/car_carplay__dpiz4n915vki_medium.jpg, assets/car_carplay__dpiz4n915vki_medium_2x.jpg 2x" media="(max-width:1068px)" />\n\t\t\t\t\t\t\t\t<source srcset="assets/car_carplay__dpiz4n915vki_large.jpg, assets/car_carplay__dpiz4n915vki_large_2x.jpg 2x" media="(max-width:1440px)" />\n\t\t\t\t\t\t\t\t<source srcset="assets/car_carplay__dpiz4n915vki_xlarge.jpg, assets/car_carplay__dpiz4n915vki_xlarge_2x.jpg 2x" media="(min-width:0px)" />'
);
console.log('  ✓ Fixed car CarPlay dashboard sources');
htmlFixes++;

// Fix Go airpods
html = html.replace(
    /(<picture id="overview-go-airpods-1"[^>]*>)\s*<source data-empty srcset="data:image\/gif;base64,[^"]*" media="\(min-width:0px\)" \/>/g,
    '$1\n\t\t\t\t\t\t\t\t<source srcset="assets/go_airpods__ed69m4vdask2_small.png, assets/go_airpods__ed69m4vdask2_small_2x.png 2x" media="(max-width:734px)" />\n\t\t\t\t\t\t\t\t<source srcset="assets/go_airpods__ed69m4vdask2_medium.png, assets/go_airpods__ed69m4vdask2_medium_2x.png 2x" media="(max-width:1068px)" />\n\t\t\t\t\t\t\t\t<source srcset="assets/go_airpods__ed69m4vdask2_large.png, assets/go_airpods__ed69m4vdask2_large_2x.png 2x" media="(min-width:0px)" />'
);
console.log('  ✓ Fixed Go AirPods sources');
htmlFixes++;

// Fix Go iPhone
html = html.replace(
    /(<picture id="overview-go-iphone-1"[^>]*>)\s*<source data-empty srcset="data:image\/gif;base64,[^"]*" media="\(min-width:0px\)" \/>/g,
    '$1\n\t\t\t\t\t\t\t\t<source srcset="assets/go_iphone__rgcqxe88k6y6_small.png, assets/go_iphone__rgcqxe88k6y6_small_2x.png 2x" media="(max-width:734px)" />\n\t\t\t\t\t\t\t\t<source srcset="assets/go_iphone__rgcqxe88k6y6_medium.png, assets/go_iphone__rgcqxe88k6y6_medium_2x.png 2x" media="(max-width:1068px)" />\n\t\t\t\t\t\t\t\t<source srcset="assets/go_iphone__rgcqxe88k6y6_large.png, assets/go_iphone__rgcqxe88k6y6_large_2x.png 2x" media="(min-width:0px)" />'
);
console.log('  ✓ Fixed Go iPhone sources');
htmlFixes++;

// Fix car mic
html = html.replace(
    /(<picture id="overview-car-mic-1"[^>]*>)\s*<source data-empty srcset="data:image\/gif;base64,[^"]*" media="\(min-width:0px\)" \/>/g,
    '$1\n\t\t\t\t\t\t\t\t<source srcset="assets/car_mic__d0q57ng0shiu_large.png, assets/car_mic__d0q57ng0shiu_large_2x.png 2x" media="(min-width:0px)" />'
);
console.log('  ✓ Fixed car mic icon sources');
htmlFixes++;

// Fix all other data-lazy sources - replace with actual sources based on img src
// Pattern: find picture with data-lazy, extract the img src, generate proper sources
const lazyPictureRegex = /<picture[^>]*data-lazy[^>]*>\s*<source data-empty srcset="data:image\/gif;base64,[^"]*"[^>]*\/>\s*<img src="assets\/([^"]+)"/g;

html = html.replace(lazyPictureRegex, (match, imgFile) => {
    // Extract base name and extension
    const baseName = imgFile.replace(/_(large|xlarge|medium|small)(_2x)?\.(jpg|png|svg)$/i, '');
    const ext = imgFile.match(/\.(jpg|png|svg)$/i)?.[1] || 'jpg';

    // Generate proper sources
    const sources = `<source srcset="assets/${baseName}_small.${ext}, assets/${baseName}_small_2x.${ext} 2x" media="(max-width:734px)" />
\t\t\t\t\t\t\t\t<source srcset="assets/${baseName}_medium.${ext}, assets/${baseName}_medium_2x.${ext} 2x" media="(max-width:1068px)" />
\t\t\t\t\t\t\t\t<source srcset="assets/${baseName}_large.${ext}, assets/${baseName}_large_2x.${ext} 2x" media="(min-width:0px)" />
\t\t\t\t\t\t\t\t<img src="assets/${imgFile}"`;

    return match.replace(/<source data-empty srcset="data:image\/gif;base64,[^"]*"[^>]*\/>\s*<img src="assets\/[^"]+"/g, sources);
});

// Remove any remaining empty data sources
html = html.replace(/<source data-empty srcset="data:image\/gif;base64,R0lGODlhAQABAHAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" media="\(min-width:0px\)" \/>\s*/g, '');
console.log('  ✓ Cleaned up remaining empty data sources');
htmlFixes++;

// Save the fixed HTML
fs.writeFileSync(htmlPath, html);
console.log(`\n  Total HTML fixes: ${htmlFixes}\n`);

// ============================================================
// SUMMARY
// ============================================================

console.log('='.repeat(60));
console.log('\n✅ ALL FIXES APPLIED!\n');
console.log('Fixed issues:');
console.log('  • Siri hero text (SVG mask with gradient)');
console.log('  • All srcset paths now use local assets');
console.log('  • Car CarPlay dashboard image');
console.log('  • Go section AirPods and iPhone');
console.log('  • Car mic icon');
console.log('  • Added clonebuster-overrides.css link');
console.log('  • CSS paths now use local assets');
console.log('\n📂 Open index.html in a browser to verify the fixes.\n');
