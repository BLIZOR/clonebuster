/**
 * Fix CSS paths to use local assets instead of Apple CDN
 */

const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'css');
const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

console.log('Fixing CSS paths...\n');

files.forEach(file => {
    const filePath = path.join(cssDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    let replacements = 0;

    // Replace Apple CDN paths with local paths
    const patterns = [
        // /v/siri/i/images/overview/ -> ../assets/
        { from: /url\(\/v\/siri\/i\/images\/overview\//g, to: 'url(../assets/' },
        // /v/siri/i/images/ -> ../assets/
        { from: /url\(\/v\/siri\/i\/images\//g, to: 'url(../assets/' },
        // https://www.apple.com/v/siri/i/images/ -> ../assets/
        { from: /url\(https:\/\/www\.apple\.com\/v\/siri\/i\/images\/overview\//g, to: 'url(../assets/' },
        { from: /url\(https:\/\/www\.apple\.com\/v\/siri\/i\/images\//g, to: 'url(../assets/' },
        // Quoted versions
        { from: /url\(['"]\/v\/siri\/i\/images\/overview\//g, to: "url('../assets/" },
        { from: /url\(['"]\/v\/siri\/i\/images\//g, to: "url('../assets/" },
    ];

    patterns.forEach(({ from, to }) => {
        const matches = content.match(from);
        if (matches) {
            replacements += matches.length;
            content = content.replace(from, to);
        }
    });

    if (replacements > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✓ ${file}: ${replacements} paths fixed`);
    } else {
        console.log(`  ${file}: no changes needed`);
    }
});

console.log('\nDone!');
