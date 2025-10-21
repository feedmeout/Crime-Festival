#!/usr/bin/env node

/**
 * update-css-links.js
 * Automatically updates HTML files to use the new 3-CSS structure:
 * 1. base.css
 * 2. evidence-shared.css
 * 3. tek#.css (specific to each evidence type)
 * 
 * For Crime Festival structure
 */

const fs = require('fs');
const path = require('path');

// Configuration for Crime Festival structure
const HTML_DIR = './pages/evidence';  // Your evidence HTML files
const CSS_PATH_FROM_HTML = '../../css/evidence'; // Relative path from HTML to CSS

// Mapping of HTML files to their TEK CSS files
const tekMapping = {
    'TEK1_AR.html': 'tek1.css',
    'TEK2_AR.html': 'tek2.css',
    'TEK3_AR.html': 'tek3.css',
    'TEK4_AR.html': 'tek4.css',
    'TEK5_AR.html': 'tek5.css',
    'TEK6_AR.html': 'tek6.css',
    'TEK7_AR.html': 'tek7.css',
    'TEK8_AR.html': 'tek8.css',
    'TEK9_AR.html': 'tek9.css',
    'TEK10_AR.html': 'tek10.css',
    'TEK11_AR.html': 'tek11.css'
};

/**
 * Generate the new CSS link tags
 */
function generateCSSLinks(tekFile, cssPath) {
    return `    <link rel="stylesheet" href="${cssPath}/base.css">
    <link rel="stylesheet" href="${cssPath}/evidence-shared.css">
    <link rel="stylesheet" href="${cssPath}/${tekFile}">`;
}

/**
 * Update a single HTML file
 */
function updateHTMLFile(htmlFilePath, tekCssFile) {
    console.log(`\n📄 Processing: ${path.basename(htmlFilePath)}`);
    
    try {
        // Read the HTML file
        let content = fs.readFileSync(htmlFilePath, 'utf8');
        
        // Find the <head> section
        const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
        if (!headMatch) {
            console.log(`   ⚠️  Warning: No <head> tag found`);
            return false;
        }
        
        const oldHead = headMatch[0];
        let newHead = oldHead;
        
        // Remove all existing CSS links to evidence styles
        // Keep other links (like model-viewer script)
        newHead = newHead.replace(/<link[^>]*href=["'][^"']*\/evidence\/[^"']*\.css["'][^>]*>/gi, '');
        
        // Find where to insert (after last <script> tag in head, or before </head>)
        const scriptMatches = [...newHead.matchAll(/<script[^>]*>[\s\S]*?<\/script>/gi)];
        let insertPosition;
        
        if (scriptMatches.length > 0) {
            // Insert after last script tag
            const lastScript = scriptMatches[scriptMatches.length - 1];
            insertPosition = lastScript.index + lastScript[0].length;
        } else {
            // Insert before </head>
            insertPosition = newHead.lastIndexOf('</head>');
        }
        
        if (insertPosition === -1) {
            console.log(`   ⚠️  Warning: Could not find insertion point`);
            return false;
        }
        
        // Insert the new CSS links
        const newLinks = '\n    \n' + generateCSSLinks(tekCssFile, CSS_PATH_FROM_HTML) + '\n';
        newHead = newHead.slice(0, insertPosition) + newLinks + newHead.slice(insertPosition);
        
        // Replace the old head with the new head
        content = content.replace(oldHead, newHead);
        
        // Write the updated content back
        fs.writeFileSync(htmlFilePath, content, 'utf8');
        
        console.log(`   ✅ Successfully updated!`);
        console.log(`   📎 Added: base.css → evidence-shared.css → ${tekCssFile}`);
        return true;
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Main function
 */
function main() {
    console.log('🎮 Crime Festival - CSS Link Update\n');
    console.log('='.repeat(50));
    console.log(`📁 HTML Directory: ${path.resolve(HTML_DIR)}`);
    console.log(`📁 CSS Path: ${CSS_PATH_FROM_HTML}`);
    console.log('='.repeat(50));
    
    let successCount = 0;
    let failCount = 0;
    let notFoundCount = 0;
    
    // Process each HTML file
    for (const [htmlFile, tekCss] of Object.entries(tekMapping)) {
        const htmlPath = path.join(HTML_DIR, htmlFile);
        
        // Check if file exists
        if (!fs.existsSync(htmlPath)) {
            console.log(`\n📄 ${htmlFile}`);
            console.log(`   ⚠️  File not found, skipping...`);
            notFoundCount++;
            continue;
        }
        
        const success = updateHTMLFile(htmlPath, tekCss);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully updated: ${successCount} files`);
    console.log(`   ❌ Failed: ${failCount} files`);
    console.log(`   ⚠️  Not found: ${notFoundCount} files`);
    console.log('='.repeat(50) + '\n');
    
    if (successCount > 0) {
        console.log('🎉 Done! Your HTML files now use the new CSS structure.');
        console.log('📝 Next steps:');
        console.log('   1. Test TEK1_AR.html in browser');
        console.log('   2. Clear browser cache (Ctrl+F5)');
        console.log('   3. Check console for any CSS loading errors\n');
    }
}

// Run the script
main();