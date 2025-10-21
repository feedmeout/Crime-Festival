// fix-html-model-paths.js
const fs = require('fs');
const path = require('path');

const evidenceDir = './pages/evidence';
const files = fs.readdirSync(evidenceDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(evidenceDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace relative paths with absolute paths
    content = content.replace(
        /src="\.\.\/\.\.\/assets\/models\//g,
        'src="/Crime-Festival/assets/models/'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${file}`);
});

console.log('\n✅ All model paths updated!');