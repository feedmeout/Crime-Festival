const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = 'D:\\CRIME_FEST\\EXPERIENCE';

// Path fixes mapping based on file location
const pathFixes = {
    // For files in pages/ (one level deep)
    'pages': {
        'css/pages/': '../css/pages/',
        'css/common.css': '../css/common.css',
        'js/pages/': '../js/pages/',
        'js/suspects.js': '../js/suspects.js'
    },
    // For files in pages/admin/ (two levels deep)
    'pages/admin': {
        'css/admin/': '../../css/admin/',
        'css/common.css': '../../css/common.css',
        'js/admin/': '../../js/admin/',
        'js/suspects.js': '../../js/suspects.js'
    },
    // For files in pages/evidence/ (two levels deep)
    'pages/evidence': {
        'css/evidence/': '../../css/evidence/',
        'css/common.css': '../../css/common.css',
        'js/evidence/': '../../js/evidence/',
        'js/suspects.js': '../../js/suspects.js',
        'assets/models/': '../../assets/models/'
    }
};

// Files to process with their expected locations
const filesToFix = [
    // Root level pages (one level deep)
    { file: 'pages/survey.html', level: 'pages' },
    { file: 'pages/team_entry.html', level: 'pages' },
    { file: 'pages/unlock_system.html', level: 'pages' },
    
    // Admin pages (two levels deep) - already correct but check anyway
    { file: 'pages/admin/admin.html', level: 'pages/admin' },
    { file: 'pages/admin/leaderboard.html', level: 'pages/admin' },
    { file: 'pages/admin/qr_codes_generator.html', level: 'pages/admin' },
    
    // Evidence pages (two levels deep)
    { file: 'pages/evidence/TEK1_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK2_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK3_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK4_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK5_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK6_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK7_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK8_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK9_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK10_AR.html', level: 'pages/evidence' },
    { file: 'pages/evidence/TEK11_AR.html', level: 'pages/evidence' }
];

function fixHTMLPaths(filePath, level) {
    const fullPath = path.join(BASE_DIR, filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    // Read file content
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Get the appropriate path fixes for this file's depth
    const fixes = pathFixes[level];
    
    // Apply path fixes
    // Fix CSS link tags
    content = content.replace(
        /<link\s+rel="stylesheet"\s+href="([^"]+)"/g,
        (match, href) => {
            // Skip if already has ../ or ../../
            if (href.startsWith('../') || href.startsWith('http')) {
                return match;
            }
            
            // Apply fixes
            for (const [oldPath, newPath] of Object.entries(fixes)) {
                if (href.startsWith(oldPath)) {
                    const fixedHref = href.replace(oldPath, newPath);
                    console.log(`  📝 CSS: ${href} → ${fixedHref}`);
                    return `<link rel="stylesheet" href="${fixedHref}"`;
                }
            }
            return match;
        }
    );
    
    // Fix script src tags
    content = content.replace(
        /<script\s+src="([^"]+)"/g,
        (match, src) => {
            // Skip if already has ../ or ../../ or is a CDN link
            if (src.startsWith('../') || src.startsWith('http')) {
                return match;
            }
            
            // Apply fixes
            for (const [oldPath, newPath] of Object.entries(fixes)) {
                if (src.startsWith(oldPath)) {
                    const fixedSrc = src.replace(oldPath, newPath);
                    console.log(`  📝 JS: ${src} → ${fixedSrc}`);
                    return `<script src="${fixedSrc}"`;
                }
            }
            return match;
        }
    );
    
    // Only write if content changed
    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
    } else {
        console.log(`✓  Already correct: ${filePath}`);
    }
}

function main() {
    console.log('🔧 Starting HTML Path Fixer...\n');
    console.log(`📁 Base directory: ${BASE_DIR}\n`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    filesToFix.forEach(({ file, level }) => {
        console.log(`\n🔍 Processing: ${file}`);
        fixHTMLPaths(file, level);
    });
    
    console.log('\n\n✨ Done! All HTML files have been processed.');
    console.log('\n💡 Test your pages:');
    console.log('   - https://feedmeout.github.io/Crime-Festival/pages/team_entry.html');
    console.log('   - https://feedmeout.github.io/Crime-Festival/pages/survey.html');
    console.log('   - https://feedmeout.github.io/Crime-Festival/pages/admin/admin.html');
}

// Run the script
try {
    main();
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}