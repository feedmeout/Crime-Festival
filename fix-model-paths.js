#!/usr/bin/env node
/**
 * fix-model-paths.js
 * Fixes 3D model paths in TEK evidence JS files
 * 
 * Models are at: /assets/models/
 * TEK pages are at: /pages/evidence/
 * So relative path should be: ../../assets/models/
 * 
 * Usage: node fix-model-paths.js
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
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

// Map of TEK files and their models
const tekModels = {
    'tek1.js': ['whiskey_bottle.glb'],
    'tek2.js': ['whiskey_glass.glb'],
    'tek3.js': ['mobile_phone.glb'],
    'tek6.js': ['latex_glove.glb'],
    'tek10.js': ['safe_key.glb'],
    'tek11.js': ['security_camera.glb']
};

function fixModelPaths() {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║          CRIME FESTIVAL - 3D MODEL PATH FIX TOOL         ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');

    let totalFixed = 0;
    let totalFiles = 0;

    Object.keys(tekModels).forEach(filename => {
        const filePath = path.join('js', 'evidence', filename);
        
        log(`\n${'='.repeat(60)}`, 'blue');
        log(`📝 Checking: ${filePath}`, 'bright');
        log('='.repeat(60), 'blue');

        if (!fs.existsSync(filePath)) {
            log(`   ⚠️  File not found, skipping...`, 'yellow');
            return;
        }

        // Create backup
        const backupPath = `${filePath}.backup`;
        fs.copyFileSync(filePath, backupPath);
        log(`   📦 Backup created: ${backupPath}`, 'cyan');

        // Read file
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        let fixCount = 0;

        // Fix various incorrect path patterns
        const incorrectPatterns = [
            // Pattern 1: ../assets/models/
            { 
                find: /(['"`])\.\.\/assets\/models\/(.*?)\.glb\1/g,
                replace: (match, quote, model) => {
                    fixCount++;
                    return `${quote}../../assets/models/${model}.glb${quote}`;
                },
                desc: '../assets/models/ → ../../assets/models/'
            },
            // Pattern 2: assets/models/
            { 
                find: /(['"`])assets\/models\/(.*?)\.glb\1/g,
                replace: (match, quote, model) => {
                    fixCount++;
                    return `${quote}../../assets/models/${model}.glb${quote}`;
                },
                desc: 'assets/models/ → ../../assets/models/'
            },
            // Pattern 3: /pages/assets/models/
            { 
                find: /(['"`])\/pages\/assets\/models\/(.*?)\.glb\1/g,
                replace: (match, quote, model) => {
                    fixCount++;
                    return `${quote}../../assets/models/${model}.glb${quote}`;
                },
                desc: '/pages/assets/models/ → ../../assets/models/'
            },
            // Pattern 4: ./pages/assets/models/
            { 
                find: /(['"`])\.\/pages\/assets\/models\/(.*?)\.glb\1/g,
                replace: (match, quote, model) => {
                    fixCount++;
                    return `${quote}../../assets/models/${model}.glb${quote}`;
                },
                desc: './pages/assets/models/ → ../../assets/models/'
            }
        ];

        incorrectPatterns.forEach(pattern => {
            const beforeCount = fixCount;
            content = content.replace(pattern.find, pattern.replace);
            if (fixCount > beforeCount) {
                log(`   ✅ Fixed: ${pattern.desc}`, 'green');
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            log(`   💾 Saved ${fixCount} fixes`, 'green');
            totalFixed += fixCount;
            totalFiles++;
        } else {
            log(`   ℹ️  No changes needed`, 'cyan');
        }
    });

    // Summary
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📊 Summary`, 'bright');
    log('='.repeat(60), 'blue');

    if (totalFixed > 0) {
        log(`\n✅ SUCCESS!`, 'green');
        log(`   Fixed ${totalFixed} model paths in ${totalFiles} files`, 'green');
        log(`\n📦 Backup files created (*.backup)`, 'cyan');
        
        // Show git instructions
        log(`\n${'='.repeat(60)}`, 'blue');
        log(`📤 Next Steps: Commit & Push`, 'bright');
        log('='.repeat(60), 'blue');
        log(`\nRun these commands:\n`, 'cyan');
        log(`   git add js/evidence/*.js`, 'yellow');
        log(`   git commit -m "Fix: Corrected 3D model paths"`, 'yellow');
        log(`   git push origin main`, 'yellow');
        log(`\nWait 1-2 minutes for GitHub Pages to rebuild.`, 'cyan');
    } else {
        log(`\n✨ All model paths are already correct!`, 'green');
    }

    log('');
}

// Verify that models are accessible from the correct path
function verifyModelPaths() {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`🔍 Verifying Model Paths...`, 'bright');
    log('='.repeat(60), 'blue');

    const modelFiles = [
        'whiskey_bottle.glb',
        'whiskey_glass.glb',
        'mobile_phone.glb',
        'latex_glove.glb',
        'safe_key.glb',
        'security_camera.glb'
    ];

    let allExist = true;
    modelFiles.forEach(model => {
        const modelPath = path.join('assets', 'models', model);
        if (fs.existsSync(modelPath)) {
            log(`   ✅ ${model}`, 'green');
        } else {
            log(`   ❌ ${model} NOT FOUND!`, 'red');
            allExist = false;
        }
    });

    if (!allExist) {
        log(`\n⚠️  WARNING: Some model files are missing!`, 'yellow');
        log(`   Check the assets/models/ folder`, 'yellow');
    }

    return allExist;
}

// Check all TEK JS files for remaining incorrect paths
function checkForBadPaths() {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`🔍 Checking for Incorrect Paths...`, 'bright');
    log('='.repeat(60), 'blue');

    let foundBad = false;
    const badPatterns = [
        /['"`]\.\.\/assets\/models\//g,
        /['"`]assets\/models\//g,
        /['"`]\/pages\/assets\/models\//g,
        /['"`]\.\/pages\/assets\/models\//g
    ];

    Object.keys(tekModels).forEach(filename => {
        const filePath = path.join('js', 'evidence', filename);
        
        if (!fs.existsSync(filePath)) return;

        const content = fs.readFileSync(filePath, 'utf8');
        
        badPatterns.forEach((pattern, idx) => {
            const matches = content.match(pattern);
            if (matches) {
                if (!foundBad) {
                    log(`\n   ⚠️  Found incorrect paths:`, 'yellow');
                    foundBad = true;
                }
                log(`      ${filename}: ${matches[0]}`, 'yellow');
            }
        });
    });

    if (!foundBad) {
        log(`   ✅ All paths look correct!`, 'green');
    }

    return !foundBad;
}

// Main
try {
    // Check directory
    if (!fs.existsSync('js/evidence')) {
        log(`\n❌ ERROR: js/evidence/ folder not found!`, 'red');
        log(`\nMake sure you're in: D:\\CRIME_FEST\\EXPERIENCE\\`, 'yellow');
        log(`Current directory: ${process.cwd()}\n`, 'yellow');
        process.exit(1);
    }

    // Run fixes
    fixModelPaths();
    
    // Verify
    verifyModelPaths();
    checkForBadPaths();

} catch (error) {
    log(`\n❌ ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
}