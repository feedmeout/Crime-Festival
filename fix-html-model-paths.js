#!/usr/bin/env node
/**
 * fix-html-model-paths.js
 * Fixes 3D model paths in TEK HTML files
 * 
 * Usage: node fix-html-model-paths.js
 */

const fs = require('fs');
const path = require('path');

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

const tekHtmlFiles = [
    { file: 'TEK1_AR.html', model: 'whiskey_bottle.glb' },
    { file: 'TEK2_AR.html', model: 'whiskey_glass.glb' },
    { file: 'TEK3_AR.html', model: 'mobile_phone.glb' },
    { file: 'TEK6_AR.html', model: 'latex_glove.glb' },
    { file: 'TEK10_AR.html', model: 'safe_key.glb' },
    { file: 'TEK11_AR.html', model: 'security_camera.glb' }
];

function fixHtmlModelPath(filePath, modelName) {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📝 Checking: ${filePath}`, 'bright');
    log('='.repeat(60), 'blue');

    if (!fs.existsSync(filePath)) {
        log(`   ⚠️  File not found, skipping...`, 'yellow');
        return { fixed: 0, skipped: true };
    }

    // Create backup
    const backupPath = `${filePath}.backup`;
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        log(`   📦 Backup created: ${backupPath}`, 'cyan');
    }

    // Read file
    let content = fs.readFileSync(filePath, 'utf8');
    let fixCount = 0;
    const fixes = [];

    // ALL possible wrong patterns for this model
    const wrongPatterns = [
        // Most common issue: ../assets instead of ../../assets
        `"../assets/models/${modelName}"`,
        `'../assets/models/${modelName}'`,
        
        // Absolute paths
        `"/pages/assets/models/${modelName}"`,
        `'/pages/assets/models/${modelName}'`,
        
        // Other wrong relative paths
        `"pages/assets/models/${modelName}"`,
        `'pages/assets/models/${modelName}'`,
        `"assets/models/${modelName}"`,
        `'assets/models/${modelName}'`,
        `"./assets/models/${modelName}"`,
        `'./assets/models/${modelName}'`
    ];

    const correctPath = `"../../assets/models/${modelName}"`;

    wrongPatterns.forEach(wrongPath => {
        if (content.includes(wrongPath)) {
            const oldContent = content;
            content = content.replace(new RegExp(wrongPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correctPath);
            if (content !== oldContent) {
                fixCount++;
                fixes.push(`${wrongPath} → ${correctPath}`);
            }
        }
    });

    if (fixCount > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        log(`   ✅ Fixed ${fixCount} path(s):`, 'green');
        fixes.forEach(fix => log(`      • ${fix}`, 'green'));
        return { fixed: fixCount, skipped: false };
    } else {
        // Check if it already has correct path
        if (content.includes(correctPath)) {
            log(`   ℹ️  Path already correct`, 'cyan');
        } else {
            log(`   ⚠️  No model path found for ${modelName}`, 'yellow');
        }
        return { fixed: 0, skipped: false };
    }
}

function verifyHtmlPaths() {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`🔍 Verifying HTML Model Paths...`, 'bright');
    log('='.repeat(60), 'blue');

    let allGood = true;

    tekHtmlFiles.forEach(({ file, model }) => {
        const filePath = path.join('pages', 'evidence', file);
        
        if (!fs.existsSync(filePath)) {
            log(`   ⚠️  ${file}: Not found`, 'yellow');
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const correctPath = `"../../assets/models/${model}"`;

        // Check for wrong patterns
        const wrongPatterns = [
            `"../assets/models/${model}"`,
            `/pages/assets/models/${model}`,
            `pages/assets/models/${model}`,
            `"assets/models/${model}`,
            `'assets/models/${model}`
        ];

        let foundWrong = false;
        wrongPatterns.forEach(pattern => {
            if (content.includes(pattern)) {
                if (!foundWrong) {
                    log(`   ❌ ${file}: Still has incorrect path!`, 'red');
                    foundWrong = true;
                    allGood = false;
                }
            }
        });

        if (!foundWrong && content.includes(correctPath)) {
            log(`   ✅ ${file}: Path correct`, 'green');
        } else if (!foundWrong && !content.includes(model)) {
            log(`   ℹ️  ${file}: No model reference found`, 'cyan');
        }
    });

    return allGood;
}

// Main execution
try {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║      CRIME FESTIVAL - HTML MODEL PATH FIX TOOL           ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');

    // Check directory
    if (!fs.existsSync('pages/evidence')) {
        log(`\n❌ ERROR: pages/evidence/ folder not found!`, 'red');
        log(`\nMake sure you're in: D:\\CRIME_FEST\\EXPERIENCE\\`, 'yellow');
        log(`Current directory: ${process.cwd()}\n`, 'yellow');
        process.exit(1);
    }

    let totalFixed = 0;
    let filesModified = 0;

    // Fix all TEK HTML files
    tekHtmlFiles.forEach(({ file, model }) => {
        const filePath = path.join('pages', 'evidence', file);
        const result = fixHtmlModelPath(filePath, model);
        
        if (!result.skipped) {
            totalFixed += result.fixed;
            if (result.fixed > 0) filesModified++;
        }
    });

    // Verify fixes
    const verified = verifyHtmlPaths();

    // Summary
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`📊 Summary`, 'bright');
    log('='.repeat(60), 'blue');

    if (totalFixed > 0) {
        log(`\n✅ SUCCESS!`, 'green');
        log(`   Fixed ${totalFixed} model paths in ${filesModified} HTML file(s)`, 'green');
        log(`\n📦 Backup files created (*.backup)`, 'cyan');
        
        if (verified) {
            log(`\n✅ All paths verified correct!`, 'green');
        } else {
            log(`\n⚠️  Some paths may still need attention`, 'yellow');
        }
        
        log(`\n${'='.repeat(60)}`, 'blue');
        log(`📤 Next Steps: Commit & Push`, 'bright');
        log('='.repeat(60), 'blue');
        log(`\nRun these commands:\n`, 'cyan');
        log(`   git add pages/evidence/*.html`, 'yellow');
        log(`   git commit -m "Fix: Corrected 3D model paths (../ to ../../)"`, 'yellow');
        log(`   git push origin main`, 'yellow');
        log(`\nWait 1-2 minutes for GitHub Pages to rebuild.`, 'cyan');
        log(`Then test: https://feedmeout.github.io/Crime-Festival/pages/evidence/TEK1_AR.html\n`, 'green');
    } else {
        log(`\n✨ All HTML model paths are already correct!`, 'green');
        
        if (!verified) {
            log(`\n⚠️  But verification found some issues. Check manually.`, 'yellow');
        }
    }

    log('');

} catch (error) {
    log(`\n❌ ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
}