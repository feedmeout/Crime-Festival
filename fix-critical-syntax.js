const fs = require('fs');
const path = require('path');

const BASE_DIR = 'D:\\CRIME_FEST\\EXPERIENCE';
const indexJsPath = path.join(BASE_DIR, 'js', 'pages', 'index.js');

console.log('🔧 CRITICAL FIX: Fixing nested template literals\n');

if (!fs.existsSync(indexJsPath)) {
    console.log('❌ index.js not found!');
    process.exit(1);
}

let content = fs.readFileSync(indexJsPath, 'utf8');

// The displaySolutionResult function has broken nested template literals
// We need to find and comment it out, then provide a working version

const functionStart = 'function displaySolutionResult(solution) {';
const functionEnd = 'window.revealSolution = async function()';

const startIndex = content.indexOf(functionStart);
const endIndex = content.indexOf(functionEnd);

if (startIndex === -1 || endIndex === -1) {
    console.log('❌ Could not find displaySolutionResult function boundaries');
    process.exit(1);
}

console.log('✅ Found displaySolutionResult function');
console.log(`   Start: ${startIndex}, End: ${endIndex}`);

// Extract the broken function
const brokenFunction = content.substring(startIndex, endIndex);

console.log('\n🔧 Replacing with fixed version...\n');

// Create a simplified working version
const fixedFunction = `function displaySolutionResult(solution) {
    const resultDiv = document.getElementById('solutionResult');
    const solutionIntroBox = document.getElementById('solutionIntroBox');
    if (solutionIntroBox) {
        solutionIntroBox.style.display = 'none';
    }
    
    const percentage = Math.round((solution.score / solution.maxScore) * 100);
    let grade = '';
    let gradeColor = '';
    let gradeEmoji = '';
    
    if (percentage >= 90) {
        grade = 'ΑΡΧΙ-ΝΤΕΤΕΚΤΙΒ';
        gradeEmoji = '🕵️';
        gradeColor = '#00d4ff';
    } else if (percentage >= 80) {
        grade = 'ΑΝΩΤΕΡΟΣ ΑΝΑΚΡΙΤΗΣ';
        gradeEmoji = '🎖️';
        gradeColor = '#ffd700';
    } else if (percentage >= 70) {
        grade = 'ΝΤΕΤΕΚΤΙΒ';
        gradeEmoji = '🔎';
        gradeColor = '#c0c0c0';
    } else if (percentage >= 60) {
        grade = 'ΑΣΤΥΝΟΜΟΣ';
        gradeEmoji = '👮';
        gradeColor = '#cd7f32';
    } else if (percentage >= 50) {
        grade = 'ΕΡΕΥΝΗΤΗΣ';
        gradeEmoji = '🔍';
        gradeColor = '#ffcc00';
    } else if (percentage >= 40) {
        grade = 'ΑΣΚΟΥΜΕΝΟΣ';
        gradeEmoji = '🎓';
        gradeColor = '#28a745';
    } else {
        grade = 'ΝΕΟΣΥΛΛΕΚΤΟΣ';
        gradeEmoji = '🎯';
        gradeColor = '#6c757d';
    }

    const isPerfect = solution.correctCount === 3 && solution.suspects.length === 3;
    
    let statusMessage = '';
    let caseStatus = '';
    if (isPerfect) {
        statusMessage = 'ΤΕΛΕΙΑ ΕΚΤΕΛΕΣΗ!';
        caseStatus = 'CASE SOLVED';
    } else if (solution.score === 0) {
        statusMessage = 'ΑΤΕΛΗΣ ΑΝΑΛΥΣΗ';
        caseStatus = 'CASE INCOMPLETE';
    } else if (percentage >= 70) {
        statusMessage = 'ΕΞΑΙΡΕΤΙΚΗ ΔΟΥΛΕΙΑ!';
        caseStatus = 'CASE CLOSED';
    } else if (percentage >= 50) {
        statusMessage = 'ΚΑΛΗ ΠΡΟΣΠΑΘΕΙΑ';
        caseStatus = 'CASE CLOSED';
    } else {
        statusMessage = 'ΥΠΟΘΕΣΗ ΟΛΟΚΛΗΡΩΘΗΚΕ';
        caseStatus = 'CASE ARCHIVED';
    }

    // Build HTML using DOM manipulation instead of template literals
    resultDiv.innerHTML = '';
    
    // Create score display
    const scoreCard = document.createElement('div');
    scoreCard.style.cssText = 'background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%); border-radius: 15px; padding: 30px; margin-bottom: 25px; border: 3px solid #ff6b00; box-shadow: 0 10px 40px rgba(0,0,0,0.4);';
    scoreCard.innerHTML = \`
        <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 20px;">\${gradeEmoji}</div>
            <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">\${caseStatus}</div>
            <div style="color: \${gradeColor}; font-size: 20px; font-weight: bold; margin-bottom: 20px;">\${grade}</div>
            <div style="color: white; font-size: 64px; font-weight: 900; margin-bottom: 10px;">\${solution.score} / \${solution.maxScore}</div>
            <div style="color: rgba(255,255,255,0.7); font-size: 16px;">\${statusMessage}</div>
            <div style="background: rgba(255,255,255,0.1); height: 12px; border-radius: 20px; overflow: hidden; margin: 20px 0;">
                <div style="background: \${gradeColor}; height: 100%; width: \${percentage}%; transition: width 2s ease-out;"></div>
            </div>
            <div style="color: rgba(255,255,255,0.5); font-size: 12px;">ΕΠΙΔΟΣΗ: \${percentage}%</div>
        </div>
    \`;
    resultDiv.appendChild(scoreCard);
    
    // Create stats display
    const statsCard = document.createElement('div');
    statsCard.style.cssText = 'background: white; border-radius: 15px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);';
    let statsHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">';
    
    if (solution.completionTimeMs) {
        statsHTML += \`
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-size: 32px; margin-bottom: 10px;">⏱️</div>
                <div style="font-size: 24px; font-weight: bold; color: #1a1a2e;">\${formatElapsedTime(solution.completionTimeMs)}</div>
                <div style="font-size: 12px; color: #666;">Χρόνος</div>
            </div>
        \`;
    }
    
    statsHTML += \`
        <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
            <div style="font-size: 32px; margin-bottom: 10px;">🎯</div>
            <div style="font-size: 24px; font-weight: bold; color: #1a1a2e;">\${solution.promptCount}</div>
            <div style="font-size: 12px; color: #666;">Prompts</div>
        </div>
        <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
            <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
            <div style="font-size: 24px; font-weight: bold; color: #1a1a2e;">\${solution.correctCount}/3</div>
            <div style="font-size: 12px; color: #666;">Σωστοί Δράστες</div>
        </div>
    \`;
    statsHTML += '</div>';
    statsCard.innerHTML = statsHTML;
    resultDiv.appendChild(statsCard);
    
    // Create breakdown display
    const breakdownCard = document.createElement('div');
    breakdownCard.style.cssText = 'background: white; border-radius: 15px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);';
    
    let breakdownHTML = '<h3 style="color: #1a1a2e; margin-bottom: 20px; font-size: 20px;">📊 ΑΝΑΛΥΤΙΚΗ ΑΞΙΟΛΟΓΗΣΗ</h3>';
    
    solution.breakdown.forEach(line => {
        if (!line || line.trim() === '') return;
        if (line.includes('ΤΕΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ')) return;
        
        let style = 'padding: 12px; margin-bottom: 8px; border-radius: 8px; font-size: 14px; line-height: 1.6;';
        let content = line;
        
        if (line.startsWith('HEADER:')) {
            content = line.replace('HEADER:', '');
            style += 'background: #e3f2fd; color: #0d47a1; font-weight: bold; border-left: 4px solid #2196f3;';
        } else if (line.startsWith('SUCCESS:')) {
            content = '✅ ' + line.replace('SUCCESS:', '');
            style += 'background: #e8f5e9; color: #1b5e20; border-left: 4px solid #4caf50;';
        } else if (line.startsWith('PENALTY:') || line.startsWith('ERROR:')) {
            content = '❌ ' + line.replace(/^(PENALTY:|ERROR:)/, '');
            style += 'background: #ffebee; color: #b71c1c; border-left: 4px solid #f44336;';
        } else if (line.startsWith('ITEM:')) {
            content = '• ' + line.replace('ITEM:', '');
            style += 'background: #f5f5f5; color: #666; margin-left: 20px;';
        } else {
            style += 'background: #fafafa; color: #333;';
        }
        
        breakdownHTML += \`<div style="\${style}">\${content}</div>\`;
    });
    
    breakdownCard.innerHTML = breakdownHTML;
    resultDiv.appendChild(breakdownCard);
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    const solutionForm = document.getElementById('solutionForm');
    if (solutionForm) {
        solutionForm.style.display = 'none';
    }
    
    stopTimer();
    
    if (isPerfect && percentage >= 90) {
        setTimeout(() => {
            createConfetti();
        }, 500);
    }
}

`;

// Replace the broken function with the fixed one
const beforeFunction = content.substring(0, startIndex);
const afterFunction = content.substring(endIndex);

const newContent = beforeFunction + fixedFunction + '\n\n' + afterFunction;

// Write the fixed file
fs.writeFileSync(indexJsPath, newContent, 'utf8');

console.log('✅ FIXED! The displaySolutionResult function has been replaced');
console.log('\n📋 Changes made:');
console.log('   ✅ Removed nested template literals');
console.log('   ✅ Simplified HTML generation');
console.log('   ✅ Fixed syntax errors');
console.log('\n🚀 Next steps:');
console.log('   1. git add .');
console.log('   2. git commit -m "Fix JavaScript syntax errors in index.js"');
console.log('   3. git push');
console.log('   4. Test: https://feedmeout.github.io/Crime-Festival/');