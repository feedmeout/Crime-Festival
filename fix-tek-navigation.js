const fs = require('fs');
const path = require('path');

console.log('🔧 Starting TEK Navigation Fix...\n');

// Configuration
const jsFolder = './js';
const tekFiles = [];

// Find all tek*.js files (tek1.js through tek11.js)
for (let i = 1; i <= 11; i++) {
    tekFiles.push(`tek${i}.js`);
}

let fixedCount = 0;
let errorCount = 0;

// Process each file
tekFiles.forEach(filename => {
    const filePath = path.join(jsFolder, filename);
    
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  ${filename} - NOT FOUND (skipping)`);
            return;
        }
        
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if fix is needed
        if (content.includes('index.html?team=') && !content.includes('../index.html?team=')) {
            // Replace the two problematic lines
            const before = content;
            
            content = content.replace(
                /window\.location\.href = `index\.html\?team=\$\{teamCode\}&tab=evidence`/g,
                'window.location.href = `../index.html?team=${teamCode}&tab=evidence`'
            );
            
            content = content.replace(
                /window\.location\.href = 'index\.html\?tab=evidence'/g,
                "window.location.href = '../index.html?tab=evidence'"
            );
            
            // Check if anything changed
            if (content !== before) {
                // Write back to file
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ ${filename} - FIXED`);
                fixedCount++;
            } else {
                console.log(`⚠️  ${filename} - NO CHANGES NEEDED`);
            }
        } else if (content.includes('../index.html?team=')) {
            console.log(`✅ ${filename} - ALREADY FIXED`);
        } else {
            console.log(`⚠️  ${filename} - NO NAVIGATION CODE FOUND`);
        }
        
    } catch (error) {
        console.log(`❌ ${filename} - ERROR: ${error.message}`);
        errorCount++;
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY:');
console.log(`   Files Fixed: ${fixedCount}`);
console.log(`   Errors: ${errorCount}`);
console.log('='.repeat(50));

if (fixedCount > 0) {
    console.log('\n✅ SUCCESS! Now commit and push:');
    console.log('   git add js/');
    console.log('   git commit -m "Fix TEK navigation paths"');
    console.log('   git push');
}