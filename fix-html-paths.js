const fs = require('fs');
const path = require('path');

const BASE_DIR = 'D:\\CRIME_FEST\\EXPERIENCE';

// Define exact replacements for each file
const fileReplacements = {
    'pages/team_entry.html': [
        { old: 'href="css/team-entry.css"', new: 'href="../css/pages/team-entry.css"' },
        { old: 'src="js/team-entry.js"', new: 'src="../js/pages/team-entry.js"' }
    ],
    'pages/survey.html': [
        { old: 'href="css/survey.css"', new: 'href="../css/pages/survey.css"' },
        { old: 'src="js/survey.js"', new: 'src="../js/pages/survey.js"' }
    ],
    'pages/unlock_system.html': [
        { old: 'href="css/unlock-system.css"', new: 'href="../css/pages/unlock-system.css"' },
        { old: 'src="js/unlock-system.js"', new: 'src="../js/pages/unlock-system.js"' }
    ]
};

function fixFile(filePath, replacements) {
    const fullPath = path.join(BASE_DIR, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`❌ File not found: ${filePath}`);
        return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let changesMade = false;
    
    console.log(`\n📄 Processing: ${filePath}`);
    
    replacements.forEach(({ old, new: newPath }) => {
        if (content.includes(old)) {
            content = content.replace(old, newPath);
            console.log(`  ✓ ${old} → ${newPath}`);
            changesMade = true;
        }
    });
    
    if (changesMade) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Saved changes to ${filePath}`);
        return true;
    } else {
        console.log(`✓ No changes needed for ${filePath}`);
        return false;
    }
}

function main() {
    console.log('🔧 HTML Path Fixer');
    console.log('━'.repeat(50));
    console.log(`📁 Base directory: ${BASE_DIR}\n`);
    
    let totalFixed = 0;
    
    Object.entries(fileReplacements).forEach(([file, replacements]) => {
        if (fixFile(file, replacements)) {
            totalFixed++;
        }
    });
    
    console.log('\n' + '━'.repeat(50));
    console.log(`\n✨ Done! Fixed ${totalFixed} file(s).`);
    console.log('\n📝 Expected file paths after fix:');
    console.log('   pages/team_entry.html → ../css/pages/team-entry.css');
    console.log('   pages/team_entry.html → ../js/pages/team-entry.js');
    console.log('   pages/survey.html → ../css/pages/survey.css');
    console.log('   pages/survey.html → ../js/pages/survey.js');
    console.log('   pages/unlock_system.html → ../css/pages/unlock-system.css');
    console.log('   pages/unlock_system.html → ../js/pages/unlock-system.js');
    console.log('\n🌐 Test URLs after pushing:');
    console.log('   https://feedmeout.github.io/Crime-Festival/pages/team_entry.html');
    console.log('   https://feedmeout.github.io/Crime-Festival/pages/survey.html');
    console.log('   https://feedmeout.github.io/Crime-Festival/pages/unlock_system.html');
}

try {
    main();
} catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
}