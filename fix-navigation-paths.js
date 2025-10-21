const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  rootDir: 'D:\\CRIME_FEST\\EXPERIENCE',
  backupDir: 'D:\\CRIME_FEST\\EXPERIENCE\\_backups',
  dryRun: false, // Set to true to see changes without applying them
};

// Files to check and their correct relative path to index.html
const filesToFix = [
  {
    path: 'js/pages/team-entry.js',
    relativeToRoot: '../', // From pages/ to root
  },
  {
    path: 'js/pages/index.js',
    relativeToRoot: '', // Already at root level (index.js is for index.html)
  },
  {
    path: 'js/pages/survey.js',
    relativeToRoot: '../',
  },
  {
    path: 'js/pages/unlock-system.js',
    relativeToRoot: '../',
  },
  {
    path: 'js/admin/admin.js',
    relativeToRoot: '../../',
  },
  {
    path: 'js/admin/leaderboard.js',
    relativeToRoot: '../../',
  },
];

// Problematic patterns to find and fix
const patterns = [
  {
    name: 'Direct pages/index.html reference',
    regex: /(['"`])pages\/index\.html(\?[^'"`]*)?(['"`])/g,
    getReplacement: (match, quote1, params, quote2, relativePath) => {
      return `${quote1}${relativePath}index.html${params || ''}${quote2}`;
    }
  },
  {
    name: 'index.html without relative path (from pages folder)',
    regex: /(?<!\/|\.\.\/|https?:\/\/)(['"`])index\.html(\?[^'"`]*)?(['"`])/g,
    getReplacement: (match, quote1, params, quote2, relativePath) => {
      // Only fix if relativePath is not empty (i.e., not in root)
      if (relativePath === '') return match;
      return `${quote1}${relativePath}index.html${params || ''}${quote2}`;
    }
  },
  {
    name: 'pages/index.html in template literals',
    regex: /`pages\/index\.html(\?[^`]*)?`/g,
    getReplacement: (match, params, quote2, relativePath) => {
      return `\`${relativePath}index.html${params || ''}\``;
    }
  },
];

// Create backup directory
function ensureBackupDir() {
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
    console.log(`✅ Created backup directory: ${config.backupDir}`);
  }
}

// Backup file
function backupFile(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = path.basename(filePath);
  const backupPath = path.join(config.backupDir, `${fileName}.${timestamp}.bak`);
  
  fs.copyFileSync(filePath, backupPath);
  console.log(`📦 Backed up: ${fileName} -> ${path.basename(backupPath)}`);
  return backupPath;
}

// Fix a single file
function fixFile(fileConfig) {
  const filePath = path.join(config.rootDir, fileConfig.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileConfig.path}`);
    return { fixed: false, reason: 'File not found' };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let changesCount = 0;
  const changes = [];

  // Apply each pattern
  patterns.forEach(pattern => {
    const matches = [...content.matchAll(pattern.regex)];
    
    if (matches.length > 0) {
      content = content.replace(pattern.regex, (...args) => {
        const replacement = pattern.getReplacement(...args, fileConfig.relativeToRoot);
        if (args[0] !== replacement) {
          changesCount++;
          changes.push({
            pattern: pattern.name,
            from: args[0],
            to: replacement
          });
        }
        return replacement;
      });
    }
  });

  if (changesCount === 0) {
    console.log(`✓ No changes needed: ${fileConfig.path}`);
    return { fixed: false, reason: 'No issues found' };
  }

  // Show changes
  console.log(`\n🔧 Fixing: ${fileConfig.path}`);
  console.log(`   Found ${changesCount} issue(s):`);
  changes.forEach((change, i) => {
    console.log(`   ${i + 1}. ${change.pattern}`);
    console.log(`      FROM: ${change.from}`);
    console.log(`      TO:   ${change.to}`);
  });

  if (config.dryRun) {
    console.log(`   [DRY RUN] Would fix ${changesCount} issue(s)`);
    return { fixed: false, reason: 'Dry run mode', changesCount };
  }

  // Backup and write
  backupFile(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ Fixed and saved!`);

  return { fixed: true, changesCount };
}

// Main function
function main() {
  console.log('🚀 Crime Festival Path Fixer');
  console.log('================================\n');
  
  if (config.dryRun) {
    console.log('⚠️  DRY RUN MODE - No files will be modified\n');
  }

  ensureBackupDir();

  const results = {
    fixed: 0,
    skipped: 0,
    notFound: 0,
    totalChanges: 0,
  };

  console.log('\n📝 Scanning files...\n');

  filesToFix.forEach(fileConfig => {
    const result = fixFile(fileConfig);
    
    if (result.fixed) {
      results.fixed++;
      results.totalChanges += result.changesCount;
    } else if (result.reason === 'File not found') {
      results.notFound++;
    } else {
      results.skipped++;
    }
  });

  // Summary
  console.log('\n================================');
  console.log('📊 Summary:');
  console.log(`   ✅ Files fixed: ${results.fixed}`);
  console.log(`   ✓  Files OK: ${results.skipped}`);
  console.log(`   ⚠️  Files not found: ${results.notFound}`);
  console.log(`   🔧 Total changes: ${results.totalChanges}`);
  
  if (!config.dryRun && results.fixed > 0) {
    console.log(`\n📦 Backups saved to: ${config.backupDir}`);
  }

  console.log('\n================================');
  
  if (config.dryRun) {
    console.log('\n💡 To apply changes, set dryRun: false in the script');
  } else if (results.fixed > 0) {
    console.log('\n✨ All done! Test your site now.');
    console.log('   If something breaks, restore from backups.');
  }
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}