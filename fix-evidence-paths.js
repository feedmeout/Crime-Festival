#!/usr/bin/env node
/**
 * fix-evidence-paths.js (v2 - IMPROVED)
 * Automatically fixes evidence page paths in the Crime Festival project
 * 
 * Usage: node fix-evidence-paths.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for pretty output
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

function createBackup(filePath) {
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    log(`   📦 Backup created: ${backupPath}`, 'cyan');
    return backupPath;
}

function fixIndexJs() {
    const filePath = 'js/pages/index.js';
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📝 Fixing: ${filePath}`, 'bright');
    log('='.repeat(60), 'blue');
    
    if (!fs.existsSync(filePath)) {
        log(`   ❌ ERROR: File not found!`, 'red');
        log(`   Make sure you're running this from: D:\\CRIME_FEST\\EXPERIENCE\\`, 'yellow');
        return false;
    }

    // Create backup
    createBackup(filePath);

    // Read file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix paths: evidence/TEK -> pages/evidence/TEK
    let fixCount = 0;
    const fixes = [];
    
    content = content.replace(
        /page:\s*'evidence\/(TEK\d+_AR\.html)'/g,
        (match, filename) => {
            fixCount++;
            fixes.push(filename);
            return `page: 'pages/evidence/${filename}'`;
        }
    );

    // Write fixed content
    fs.writeFileSync(filePath, content, 'utf8');
    
    if (fixCount > 0) {
        log(`   ✅ Fixed ${fixCount} paths:`, 'green');
        fixes.forEach(file => {
            log(`      • evidence/${file} → pages/evidence/${file}`, 'green');
        });
    } else {
        log(`   ℹ️  No paths needed fixing (already correct)`, 'cyan');
    }

    return fixCount > 0;
}

function fixUnlockSystemJs() {
    const filePath = 'js/pages/unlock-system.js';
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📝 Fixing: ${filePath}`, 'bright');
    log('='.repeat(60), 'blue');
    
    if (!fs.existsSync(filePath)) {
        log(`   ❌ ERROR: File not found!`, 'red');
        return false;
    }

    // Create backup
    createBackup(filePath);

    // Read file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // MORE AGGRESSIVE FIX: Replace ALL instances of page: 'TEK -> page: 'evidence/TEK
    // This will catch them even if they're spread across multiple lines
    let fixCount = 0;
    const fixes = [];
    
    // Match: page: 'TEK*.html' or page:'TEK*.html' (with or without space)
    content = content.replace(
        /page:\s*'(TEK\d+_AR\.html)'/g,
        (match, filename) => {
            fixCount++;
            fixes.push(filename);
            return `page: 'evidence/${filename}'`;
        }
    );

    // Write fixed content
    fs.writeFileSync(filePath, content, 'utf8');
    
    if (fixCount > 0) {
        log(`   ✅ Fixed ${fixCount} paths:`, 'green');
        fixes.forEach(file => {
            log(`      • ${file} → evidence/${file}`, 'green');
        });
    } else {
        log(`   ℹ️  No paths needed fixing (already correct)`, 'cyan');
    }

    return fixCount > 0;
}

function verifyFixes() {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`🔍 Verifying Fixes...`, 'bright');
    log('='.repeat(60), 'blue');

    let allGood = true;

    // Check index.js
    const indexContent = fs.readFileSync('js/pages/index.js', 'utf8');
    const badIndexPaths = indexContent.match(/page:\s*'evidence\/TEK\d+_AR\.html'/g);
    
    if (badIndexPaths) {
        log(`   ❌ index.js still has ${badIndexPaths.length} incorrect paths!`, 'red');
        badIndexPaths.forEach(path => log(`      ${path}`, 'red'));
        allGood = false;
    } else {
        log(`   ✅ index.js: All paths correct (pages/evidence/TEK*.html)`, 'green');
    }

    // Check unlock-system.js
    const unlockContent = fs.readFileSync('js/pages/unlock-system.js', 'utf8');
    const badUnlockPaths = unlockContent.match(/page:\s*'TEK\d+_AR\.html'/g);
    
    if (badUnlockPaths) {
        log(`   ❌ unlock-system.js still has ${badUnlockPaths.length} incorrect paths!`, 'red');
        badUnlockPaths.forEach(path => log(`      ${path}`, 'red'));
        allGood = false;
    } else {
        log(`   ✅ unlock-system.js: All paths correct (evidence/TEK*.html)`, 'green');
    }

    return allGood;
}

function printGitInstructions() {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📤 Next Steps: Commit & Push`, 'bright');
    log('='.repeat(60), 'blue');
    log(`\nRun these commands:\n`, 'cyan');
    log(`   git add js/pages/index.js js/pages/unlock-system.js`, 'yellow');
    log(`   git commit -m "Fix: Corrected evidence page paths"`, 'yellow');
    log(`   git push origin main`, 'yellow');
    log(`\nThen wait 1-2 minutes for GitHub Pages to rebuild.`, 'cyan');
    log(`Test at: https://feedmeout.github.io/Crime-Festival/\n`, 'green');
}

// Main execution
function main() {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║       CRIME FESTIVAL - PATH FIX TOOL v2 (IMPROVED)      ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');
    
    // Check if we're in the right directory
    if (!fs.existsSync('js/pages/index.js') || !fs.existsSync('js/pages/unlock-system.js')) {
        log(`\n❌ ERROR: Required files not found!`, 'red');
        log(`\nMake sure you're running this from the project root:`, 'yellow');
        log(`   D:\\CRIME_FEST\\EXPERIENCE\\`, 'yellow');
        log(`\nCurrent directory: ${process.cwd()}\n`, 'yellow');
        process.exit(1);
    }

    let changesNeeded = false;

    // Fix both files
    const indexFixed = fixIndexJs();
    const unlockFixed = fixUnlockSystemJs();
    
    changesNeeded = indexFixed || unlockFixed;

    // Verify fixes
    const verified = verifyFixes();

    // Summary
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📊 Summary`, 'bright');
    log('='.repeat(60), 'blue');

    if (!changesNeeded) {
        log(`\n✨ No changes needed - paths are already correct!`, 'green');
        log(`\nIf you're still getting 404 errors, try:`, 'yellow');
        log(`   1. Clear your browser cache (Ctrl+Shift+Delete)`, 'yellow');
        log(`   2. Check if changes are pushed to GitHub`, 'yellow');
        log(`   3. Wait for GitHub Pages to rebuild (1-2 min)\n`, 'yellow');
    } else if (verified) {
        log(`\n✅ SUCCESS! All paths have been fixed.`, 'green');
        log(`\n📦 Backup files created (*.backup) - you can delete these later.`, 'cyan');
        printGitInstructions();
    } else {
        log(`\n⚠️  WARNING: Fixes applied but verification failed.`, 'yellow');
        log(`\nPlease check the files manually.`, 'yellow');
        log(`Restore from backups if needed (*.backup files)\n`, 'yellow');
    }

    log(''); // Empty line at end
}

// Run the script
try {
    main();
} catch (error) {
    log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
    log(`\nStack trace:`, 'red');
    console.error(error);
    process.exit(1);
}