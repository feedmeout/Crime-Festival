const fs = require('fs');
const path = require('path');

const config = {
  rootDir: 'D:\\CRIME_FEST\\EXPERIENCE',
  backupDir: 'D:\\CRIME_FEST\\EXPERIENCE\\_backups',
};

// Fix these files
const filesToFix = [
  { path: 'js/pages/team-entry.js', relativeToRoot: '../' },
  { path: 'js/pages/survey.js', relativeToRoot: '../' },
  { path: 'js/pages/unlock-system.js', relativeToRoot: '../../' },
];

function ensureBackupDir() {
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
}

function backupFile(filePath) {
  const timestamp = Date.now();
  const fileName = path.basename(filePath);
  const backupPath = path.join(config.backupDir, `${fileName}.${timestamp}.bak`);
  fs.copyFileSync(filePath, backupPath);
  console.log(`📦 Backed up: ${fileName}`);
}

function fixFile(fileConfig) {
  const filePath = path.join(config.rootDir, fileConfig.path);
  console.log(`\n🔧 Fixing: ${fileConfig.path}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all numbered patterns
  const fixedContent = content.replace(
    /(\d{5,})index\.html/g, 
    `${fileConfig.relativeToRoot}index.html`
  );
  
  if (fixedContent !== content) {
    backupFile(filePath);
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`✅ Fixed!`);
  } else {
    console.log(`✓ No changes needed`);
  }
}

console.log('🚀 Fixing All Navigation Paths\n');
ensureBackupDir();
filesToFix.forEach(fixFile);
console.log('\n✨ Done! All files fixed.\n');