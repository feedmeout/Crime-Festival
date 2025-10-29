const tekInfo = {
    '1': { name: 'Μπουκάλι Ουίσκι', icon: '🍾', page: '../evidence/TEK1_AR.html' },
    '2': { name: 'Κρυστάλλινα Ποτήρια', icon: '🥃', page: '../evidence/TEK2_AR.html' },
    '3': { name: 'Κινητό Θύματος', icon: '📱', page: '../evidence/TEK3_AR.html' },
    '4': { name: 'Email Αυτοκτονίας', icon: '💻', page: '../evidence/TEK4_AR.html' },
    '5': { name: 'Ιατρική Γνωμάτευση', icon: '🥼', page: '../evidence/TEK5_AR.html' },
    '6': { name: 'Γάντια Λάτεξ', icon: '🧤', page: '../evidence/TEK6_AR.html' },
    '7': { name: 'Χειρόγραφο Σημείωμα', icon: '✍️', page: '../evidence/TEK7_AR.html' },
    '8': { name: 'Φάκελος Εμπιστευτικό', icon: '📂', page: '../evidence/TEK8_AR.html' },
    '9': { name: 'Απόδειξη Χημικών', icon: '🧪', page: '../evidence/TEK9_AR.html' },
    '10': { name: 'Κλειδί Χρηματοκιβωτίου', icon: '🔑', page: '../evidence/TEK10_AR.html' },
    '11': { name: 'Κάμερες Ασφαλείας', icon: '📹', page: '../evidence/TEK11_AR.html' }
};

const urlParams = new URLSearchParams(window.location.search);
const tekNumber = urlParams.get('tek');
const simulationMode = urlParams.get('simulate');
let simulatedUnlockCount = 1;

if (simulationMode === 'complete') {
    simulatedUnlockCount = 11;
}

function getTeamCode() {
    return sessionStorage.getItem('teamCode') || localStorage.getItem('teamCode');
}

function isAuthenticated() {
    const teamCode = getTeamCode();
    const memberAuth = sessionStorage.getItem('memberAuth') || localStorage.getItem('memberAuth');
    return teamCode && memberAuth === 'true';
}

function withTimeout(promise, ms, errorMsg) {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error(errorMsg)), ms)
        )
    ]);
}

function isFirebaseReady() {
    return typeof window.firebaseReady !== 'undefined' && window.firebaseReady === true;
}

async function saveToFirebase(teamName, data) {
    if (!isFirebaseReady()) {
        console.warn('⚠️ Firebase not ready');
        return false;
    }
    
    try {
        console.log(`💾 Saving to Firebase for team: ${teamName}`);
        console.log('Data to save:', data);
        
        await withTimeout(
            window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, 'teams', teamName),
                data,
                { merge: true }
            ),
            5000,
            'Firebase save timeout'
        );
        
        console.log('✅ Saved to Firebase successfully');
        return true;
    } catch (error) {
        console.error('❌ Firebase save error:', error);
        return false;
    }
}

async function loadFromFirebase(teamName) {
    if (!isFirebaseReady()) {
        console.warn('⚠️ Firebase not ready');
        return null;
    }
    
    try {
        console.log(`🔥 Loading from Firebase for team: ${teamName}`);
        
        const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamName);
        const docSnap = await withTimeout(
            window.firebaseGetDoc(docRef),
            5000,
            'Firebase load timeout'
        );
        
        if (docSnap.exists()) {
            console.log('✅ Loaded from Firebase');
            console.log('Firebase data:', docSnap.data());
            return docSnap.data();
        } else {
            console.log('ℹ️ No Firebase data found for this team');
            return null;
        }
    } catch (error) {
        console.error('❌ Firebase load error:', error);
        return null;
    }
}

function getStorageKey(teamCode) {
    return `unlocked_teks_${teamCode}`;
}

async function getTeamData(teamCode) {
    console.log('🔍 Getting team data for:', teamCode);
    
    if (simulationMode) {
        const mockUnlocked = [];
        for (let i = 1; i <= simulatedUnlockCount - 1; i++) {
            mockUnlocked.push(i.toString());
        }
        return {
            unlocked: mockUnlocked,
            timestamps: {},
            evidenceTimestamps: {},
            startTime: new Date(Date.now() - 3600000).toISOString(),
            completedAt: null,
            totalTimeMs: null,
            testingMode: false
        };
    }
    
    const firebaseData = await loadFromFirebase(teamCode);
    if (firebaseData && firebaseData.unlocked) {
        console.log('✅ Using Firebase data');
        return firebaseData;
    }
    
    const localData = localStorage.getItem(getStorageKey(teamCode));
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            console.log('✅ Using localStorage data');

            if (Array.isArray(parsed)) {
                return {
                    unlocked: parsed,
                    timestamps: {},
                    evidenceTimestamps: {},
                    startTime: null,
                    completedAt: null,
                    totalTimeMs: null,
                    testingMode: false
                };
            } else {
                return {
                    password: parsed.password || null,
                    teamSize: parsed.teamSize || null,
                    testingMode: parsed.testingMode !== undefined ? parsed.testingMode : false,
                    unlocked: parsed.unlocked || [],
                    timestamps: parsed.timestamps || {},
                    evidenceTimestamps: parsed.evidenceTimestamps || {},
                    startTime: parsed.startTime || null,
                    completedAt: parsed.completedAt || null,
                    totalTimeMs: parsed.totalTimeMs || null,
                    solution: parsed.solution || null
                };
            }
        } catch (e) {
            console.error('Error parsing localStorage:', e);
        }
    }

    console.log('✅ Creating new team data');
    return {
        unlocked: [],
        timestamps: {},
        evidenceTimestamps: {},
        startTime: null,
        completedAt: null,
        totalTimeMs: null,
        testingMode: false
    };
}

async function saveTeamData(teamCode, data) {
    if (simulationMode) {
        return true;
    }

    const dataToSave = {
        password: data.password || null,
        teamSize: data.teamSize || null,
        testingMode: data.testingMode !== undefined ? data.testingMode : false,
        unlocked: data.unlocked || [],
        timestamps: data.timestamps || {},
        evidenceTimestamps: data.evidenceTimestamps || {},
        startTime: data.startTime || null,
        completedAt: data.completedAt || null,
        totalTimeMs: data.totalTimeMs || null,
        solution: data.solution || null,
        lastUpdate: new Date().toISOString()
    };
    
    console.log('💾 Saving team data with testingMode:', dataToSave.testingMode);
    console.log('Full data to save:', dataToSave);
    localStorage.setItem(getStorageKey(teamCode), JSON.stringify(dataToSave));
    console.log('✅ Saved to localStorage');
    
    const saved = await saveToFirebase(teamCode, dataToSave);
    
    if (!saved) {
        console.warn('⚠️ Firebase save failed, but localStorage is updated');
    }
    
    return saved;
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const h = hours;
    const m = minutes % 60;
    const s = seconds % 60;
    
    if (h > 0) {
        return `${h}ω ${m}λ ${s}δ`;
    } else if (m > 0) {
        return `${m}λ ${s}δ`;
    } else {
        return `${s}δ`;
    }
}

async function processUnlock() {
    console.log('🚀 Starting processUnlock...');
    
    const container = document.getElementById('unlockContainer');
    const teamCode = simulationMode ? 'DEMO-TEAM' : getTeamCode();

    if (!simulationMode && !isAuthenticated()) {
        console.log('⚠️ Not logged in, redirecting...');
        const redirectUrl = encodeURIComponent(window.location.href);
        window.location.href = `team_entry.html?redirect=${redirectUrl}`;
        return;
    }

    console.log(`✅ Authenticated as team: ${teamCode}`);

    if (!tekNumber || !tekInfo[tekNumber]) {
        console.error('❌ Invalid TEK number:', tekNumber);
        container.innerHTML = `
            <div class="error">
                <h2>❌ Σφάλμα</h2>
                <p>Μη έγκυρος κωδικός τεκμηρίου!</p>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">TEK: ${tekNumber || 'undefined'}</p>
            </div>
            <a href="../index.html?team=${teamCode}" class="btn">Επιστροφή στον Φάκελο</a>
        `;
        return;
    }

    const tek = tekInfo[tekNumber];
    console.log('📦 Processing TEK:', tekNumber, tek.name);
    
    try {
        const teamData = await getTeamData(teamCode);
        console.log('✅ Got team data:', teamData);
        console.log('Currently unlocked TEKs:', teamData.unlocked);

        if (teamData.unlocked.includes(tekNumber)) {
            console.log('ℹ️ TEK already unlocked');
            showAlreadyUnlocked(tek, tekNumber, teamData, teamCode);
        } else {
            console.log('🔓 Unlocking new TEK...');
            await unlockNew(tek, tekNumber, teamData, teamCode);
        }
    } catch (error) {
        console.error('❌ Process error:', error);
        container.innerHTML = `
            <div class="error">
                <h2>⚠️ Σφάλμα</h2>
                <p>${error.message}</p>
                <button class="btn" onclick="location.reload()">Δοκιμάστε Ξανά</button>
            </div>
        `;
    }
}

function showAlreadyUnlocked(tek, tekNumber, teamData, teamCode) {
    const container = document.getElementById('unlockContainer');
    const unlockTime = teamData.timestamps[tekNumber];
    const timeInfo = unlockTime ? 
        `<p style="font-size: 14px; color: #666; margin-top: 10px;">Ξεκλειδώθηκε: ${new Date(unlockTime).toLocaleString('el-GR')}</p>` : '';
    
    container.innerHTML = `
        <div class="unlock-icon">⚠️</div>
        <div class="team-badge">Ομάδα: ${teamCode}</div>
        <h1>Τεκμήριο Ήδη Ξεκλειδωμένο</h1>
        <div class="tek-badge">ΤΕΚ #${tekNumber.padStart(3, '0')}</div>
        <div class="already-unlocked">
            <h2>Έχετε ήδη συλλέξει αυτό το τεκμήριο!</h2>
            <p style="font-size: 40px; margin: 15px 0;">${tek.icon}</p>
            <p><strong>${tek.name}</strong></p>
            ${timeInfo}
        </div>
        <a href="${tek.page}?team=${teamCode}" class="btn">Προβολή Τεκμηρίου</a>
        <a href="../index.html?team=${teamCode}" class="btn btn-secondary">Επιστροφή στον Φάκελο</a>
    `;
}

async function unlockNew(tek, tekNumber, teamData, teamCode) {
    console.log('🔓 Starting unlock process for TEK', tekNumber);
    
    const now = new Date().toISOString();
    
    teamData.unlocked.push(tekNumber);
    teamData.timestamps[tekNumber] = now;
    
    if (!teamData.evidenceTimestamps) {
        teamData.evidenceTimestamps = {};
    }
    teamData.evidenceTimestamps[tekNumber] = now;
    
    if (teamData.unlocked.length === 1) {
        teamData.startTime = now;
        console.log('🎬 Set start time:', now);
    }
        
    const isCompleted = teamData.unlocked.length === 11;
    if (isCompleted && !teamData.completedAt) {
        teamData.completedAt = now;
        const startMs = new Date(teamData.startTime).getTime();
        const endMs = new Date(now).getTime();
        teamData.totalTimeMs = endMs - startMs;
        console.log('🏆 All evidence collected! Total time:', formatTime(teamData.totalTimeMs));
    }
    
    console.log('💾 Saving updated team data...');
    const saved = await saveTeamData(teamCode, teamData);
    
    if (!saved && !simulationMode) {
        console.warn('⚠️ Warning: Firebase save may have failed, but localStorage is updated');
    }
    
    const container = document.getElementById('unlockContainer');
    
    let completionMessage = '';
    if (isCompleted) {
        const totalTime = formatTime(teamData.totalTimeMs);
        completionMessage = `
            <div class="completion-badge">
                🏆 ΟΛΟΚΛΗΡΩΣΗ! 🏆<br>
                Συνολικός Χρόνος: ${totalTime}
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="unlock-icon">✅</div>
        <div class="team-badge">Ομάδα: ${teamCode}</div>
        <h1>Νέο Τεκμήριο Ξεκλειδώθηκε!</h1>
        <div class="tek-badge">ΤΕΚ #${tekNumber.padStart(3, '0')}</div>
        <div style="font-size: 60px; margin: 20px 0; animation: pulse 1s ease-in-out infinite;">
            ${tek.icon}
        </div>
        <p class="message">
            <strong>${tek.name}</strong><br>
            προστέθηκε στον φάκελο υπόθεσης!
        </p>
        ${completionMessage}
        <p class="progress-info">
            📊 Έχετε ξεκλειδώσει ${teamData.unlocked.length} από 11 τεκμήρια
        </p>
        <a href="${tek.page}?team=${teamCode}" class="btn">Προβολή Τεκμηρίου</a>
        <a href="../index.html?team=${teamCode}" class="btn btn-secondary">Επιστροφή στον Φάκελο</a>
    `;
    
    console.log('✅ Unlock complete!');
}

window.addEventListener('DOMContentLoaded', () => {
    console.log('📱 unlock_system.html loaded');
    console.log('URL:', window.location.href);
    console.log('TEK parameter:', tekNumber);
    
    setTimeout(() => {
        if (!simulationMode && !isFirebaseReady()) {
            console.error('⚠️ Firebase connection failed');
            document.getElementById('unlockContainer').innerHTML = `
                <div class="error">
                    <h2>⚠️ Σφάλμα Σύνδεσης</h2>
                    <p>Αδυναμία σύνδεσης με τη βάση δεδομένων.</p>
                    <p style="font-size: 12px; color: #666;">Παρακαλώ ελέγξτε τη σύνδεσή σας στο διαδίκτυο.</p>
                    <button class="btn" onclick="location.reload()">Επανάληψη</button>
                </div>
            `;
            return;
        }
        
        console.log('✅ Firebase ready, starting unlock process...');
        processUnlock();
    }, 1500);
});