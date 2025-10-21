const fs = require('fs');
const path = require('path');

const BASE_DIR = 'D:\\CRIME_FEST\\EXPERIENCE';
const indexJsPath = path.join(BASE_DIR, 'js', 'pages', 'index.js');

console.log('🔧 Fixing mismatched quotes on line 2175...\n');

let content = fs.readFileSync(indexJsPath, 'utf8');

// Fix the mismatched quote
const wrongQuote = 'window.location.href = "pages/team_entry.html\';';
const correctQuote = 'window.location.href = \'pages/team_entry.html\';';

if (content.includes(wrongQuote)) {
    content = content.replace(wrongQuote, correctQuote);
    fs.writeFileSync(indexJsPath, content, 'utf8');
    console.log('✅ FIXED! Mismatched quotes corrected');
    console.log('   Before: window.location.href = "pages/team_entry.html\';');
    console.log('   After:  window.location.href = \'pages/team_entry.html\';');
    console.log('\n🚀 Commit and push now!');
} else {
    console.log('⚠️  Pattern not found, trying alternative fix...');
    
    // Alternative fix - replace any variation
    content = content.replace(
        /window\.location\.href\s*=\s*"pages\/team_entry\.html';/g,
        'window.location.href = \'pages/team_entry.html\';'
    );
    
    fs.writeFileSync(indexJsPath, content, 'utf8');
    console.log('✅ Applied alternative fix');
}

console.log('\n📝 Next steps:');
console.log('   git add .');
console.log('   git commit -m "Fix mismatched quotes syntax error"');
console.log('   git push');