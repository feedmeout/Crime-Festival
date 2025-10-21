#!/usr/bin/env node
/**
 * fix-admin-paths.js
 * Fixes BASE_URL path calculation in admin.js
 * 
 * Usage: node fix-admin-paths.js
 */

const fs = require('fs');
const path = require('path');

// Colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function fixAdminJs() {
    const filePath = 'js/admin/admin.js';
    
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║          CRIME FESTIVAL - ADMIN PATH FIX TOOL            ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');
    
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📝 Fixing: ${filePath}`, 'bright');
    log('='.repeat(60), 'blue');

    if (!fs.existsSync(filePath)) {
        log(`   ❌ ERROR: ${filePath} not found!`, 'red');
        log(`   Make sure you're in: D:\\CRIME_FEST\\EXPERIENCE\\`, 'yellow');
        return false;
    }

    // Create backup
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    log(`   📦 Backup created: ${backupPath}`, 'cyan');

    // Read file
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix 1: BASE_URL calculation (slice(0, -2) → slice(0, -3))
    const oldPattern = /const BASE_URL = window\.location\.origin \+ window\.location\.pathname\.split\('\/'\)\.slice\(0, -2\)\.join\('\/'\) \+ '\/';/;
    const newReplacement = "const BASE_URL = window.location.origin + window.location.pathname.split('/').slice(0, -3).join('/') + '/';";

    if (oldPattern.test(content)) {
        content = content.replace(oldPattern, newReplacement);
        log(`   ✅ Fixed BASE_URL: slice(0, -2) → slice(0, -3)`, 'green');
        modified = true;
    } else {
        log(`   ℹ️  BASE_URL already correct or different format`, 'cyan');
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        log(`   💾 File saved with fixes`, 'green');
    }

    return modified;
}

function verifyFix() {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`🔍 Verifying Fix...`, 'bright');
    log('='.repeat(60), 'blue');

    const filePath = 'js/admin/admin.js';
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if it has the correct version
    if (content.includes('.slice(0, -3)') && content.includes('BASE_URL')) {
        log(`   ✅ admin.js: BASE_URL calculation is correct`, 'green');
        return true;
    } else if (content.includes('.slice(0, -2)') && content.includes('BASE_URL')) {
        log(`   ❌ admin.js: Still has old BASE_URL calculation!`, 'red');
        return false;
    } else {
        log(`   ⚠️  admin.js: Could not find BASE_URL pattern`, 'yellow');
        return false;
    }
}

function explainFix() {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📚 Explanation`, 'bright');
    log('='.repeat(60), 'blue');
    log(`\n   admin.html location: /Crime-Festival/pages/admin/admin.html`, 'cyan');
    log(`   index.html location: /Crime-Festival/index.html`, 'cyan');
    log(`\n   OLD: .slice(0, -2) → /Crime-Festival/pages/ ❌`, 'red');
    log(`   NEW: .slice(0, -3) → /Crime-Festival/ ✅`, 'green');
    log(`\n   Now "ΠΡΟΒΟΛΗ" will correctly open: /Crime-Festival/index.html`, 'green');
}

// Main execution
try {
    // Check directory
    if (!fs.existsSync('js/admin/admin.js')) {
        log(`\n❌ ERROR: js/admin/admin.js not found!`, 'red');
        log(`\nMake sure you're in: D:\\CRIME_FEST\\EXPERIENCE\\`, 'yellow');
        log(`Current directory: ${process.cwd()}\n`, 'yellow');
        process.exit(1);
    }

    const fixed = fixAdminJs();
    const verified = verifyFix();

    // Summary
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📊 Summary`, 'bright');
    log('='.repeat(60), 'blue');

    if (fixed && verified) {
        log(`\n✅ SUCCESS! Admin panel path has been fixed.`, 'green');
        explainFix();
        
        log(`\n${'='.repeat(60)}`, 'blue');
        log(`📤 Next Steps: Commit & Push`, 'bright');
        log('='.repeat(60), 'blue');
        log(`\nRun these commands:\n`, 'cyan');
        log(`   git add js/admin/admin.js`, 'yellow');
        log(`   git commit -m "Fix: Corrected admin panel BASE_URL path"`, 'yellow');
        log(`   git push origin main`, 'yellow');
        log(`\nWait 1-2 minutes for GitHub Pages to rebuild.`, 'cyan');
        log(`Then test ΠΡΟΒΟΛΗ button in admin panel!\n`, 'green');
    } else if (!fixed) {
        log(`\n✨ No changes needed - path is already correct!`, 'green');
        explainFix();
    } else {
        log(`\n⚠️  WARNING: Fixes applied but verification failed.`, 'yellow');
        log(`Check the file manually. Backup available (*.backup)\n`, 'yellow');
    }

    log('');

} catch (error) {
    log(`\n❌ ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
}