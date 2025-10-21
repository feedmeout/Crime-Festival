const fs = require('fs');
const path = require('path');

const BASE_DIR = 'D:\\CRIME_FEST\\EXPERIENCE';

console.log('🔧 Fixing ALL JavaScript Navigation Paths');
console.log('━'.repeat(60));

const fixes = [
    // Fix index.js (pages folder references)
    {
        file: 'js/pages/index.js',
        replacements: [
            {
                old: 'window.location.href = \'team_entry.html\'',
                new: 'window.location.href = \'pages/team_entry.html\''
            },
            {
                old: 'const surveyUrl = `survey.html?team=',
                new: 'const surveyUrl = `pages/survey.html?team='
            },
            {
                old: 'window.open(surveyUrl, \'_blank\')',
                new: 'window.location.href = surveyUrl'
            },
            {
                old: 'href="survey.html?team=',
                new: 'href="pages/survey.html?team='
            }
        ]
    },
    
    // Fix tek1.js (and all other TEK files should have same pattern)
    {
        file: 'js/evidence/tek1.js',
        replacements: [
            {
                old: 'window.location.href = `../index.html?team=',
                new: 'window.location.href = `../../index.html?team='
            },
            {
                old: 'window.location.href = \'../../index.html?tab=evidence\';',
                new: 'window.location.href = \'../../index.html?tab=evidence\';'
            }
        ]
    }
];

// TEK files 2-11 have the same structure as tek1
for (let i = 2; i <= 11; i++) {
    fixes.push({
        file: `js/evidence/tek${i}.js`,
        replacements: [
            {
                old: 'window.location.href = `../index.html?team=',
                new: 'window.location.href = `../../index.html?team='
            }
        ]
    });
}

let totalFixed = 0;
let filesModified = 0;

fixes.forEach(({ file, replacements }) => {
    const fullPath = path.join(BASE_DIR, file);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let fileChanged = false;
    
    console.log(`\n📄 Processing: ${file}`);
    
    replacements.forEach(({ old, new: newPath }) => {
        if (content.includes(old)) {
            content = content.replaceAll(old, newPath);
            console.log(`  ✅ ${old}`);
            console.log(`     → ${newPath}`);
            fileChanged = true;
            totalFixed++;
        }
    });
    
    if (fileChanged) {
        fs.writeFileSync(fullPath, content, 'utf8');
        filesModified++;
        console.log(`  💾 Saved changes`);
    } else {
        console.log(`  ✓ No changes needed`);
    }
});

console.log('\n' + '━'.repeat(60));
console.log(`\n✨ Complete!`);
console.log(`   📝 ${totalFixed} fixes applied`);
console.log(`   📁 ${filesModified} files modified`);

console.log('\n📋 Summary of fixes:');
console.log('   ✅ Survey navigation now points to pages/survey.html');
console.log('   ✅ Team entry redirect now points to pages/team_entry.html');
console.log('   ✅ Evidence pages now correctly navigate back (../../index.html)');

console.log('\n🎯 Next steps:');
console.log('   1. Test: https://feedmeout.github.io/Crime-Festival/');
console.log('   2. Test survey button from main page');
console.log('   3. Test evidence page "back" buttons');
console.log('   4. Commit and push changes');