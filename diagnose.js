const fs = require('fs');
const path = require('path');

const BASE_DIR = 'D:\\CRIME_FEST\\EXPERIENCE';

console.log('🔍 Crime Festival Path Diagnostic Tool');
console.log('━'.repeat(60));

// Check what exists
const filesToCheck = [
    'index.html',
    'pages/index.html',
    'pages/team_entry.html',
    'pages/survey.html',
    'pages/unlock_system.html',
    'css/pages/team-entry.css',
    'css/pages/survey.css',
    'css/pages/unlock-system.css',
    'js/pages/team-entry.js',
    'js/pages/survey.js',
    'js/pages/unlock-system.js'
];

console.log('\n📋 FILE EXISTENCE CHECK:');
filesToCheck.forEach(file => {
    const fullPath = path.join(BASE_DIR, file);
    const exists = fs.existsSync(fullPath);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check root index.html for navigation
console.log('\n🔍 CHECKING ROOT INDEX.HTML:');
const rootIndexPath = path.join(BASE_DIR, 'index.html');
if (fs.existsSync(rootIndexPath)) {
    const content = fs.readFileSync(rootIndexPath, 'utf8');
    
    // Look for navigation links
    const linkPatterns = [
        /href="([^"]*team[^"]*)"/gi,
        /href="([^"]*survey[^"]*)"/gi,
        /href="([^"]*admin[^"]*)"/gi
    ];
    
    console.log('  Found navigation links:');
    linkPatterns.forEach(pattern => {
        const matches = [...content.matchAll(pattern)];
        matches.forEach(match => {
            console.log(`    - ${match[1]}`);
        });
    });
} else {
    console.log('  ❌ Root index.html not found!');
}

// Check if pages/index.html exists
console.log('\n🔍 CHECKING pages/index.html:');
const pagesIndexPath = path.join(BASE_DIR, 'pages', 'index.html');
if (fs.existsSync(pagesIndexPath)) {
    console.log('  ⚠️  pages/index.html EXISTS - this might cause confusion!');
    console.log('  💡 Consider removing it or ensuring proper redirects');
} else {
    console.log('  ✅ No pages/index.html (as expected)');
}

console.log('\n━'.repeat(60));
console.log('\n📝 CORRECT URLs:\n');
console.log('   🏠 Main: https://feedmeout.github.io/Crime-Festival/');
console.log('   👥 Entry: https://feedmeout.github.io/Crime-Festival/pages/team_entry.html');
console.log('   👨‍💼 Admin: https://feedmeout.github.io/Crime-Festival/pages/admin/admin.html');

console.log('\n⚠️  SURVEY ERROR EXPLAINED:');
console.log('   Survey needs: ?team=TEAMNAME&member=MEMBERNAME');
console.log('   Users should access survey from team_entry.html, not directly');