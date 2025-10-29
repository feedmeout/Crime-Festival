const StorageManager = {
    saveAuth(teamCode, memberName) {
        localStorage.setItem('teamCode', teamCode);
        localStorage.setItem('memberName', memberName);
        localStorage.setItem('memberAuth', 'true');
        localStorage.setItem('lastLogin', new Date().toISOString());
        sessionStorage.setItem('teamCode', teamCode);
        sessionStorage.setItem('memberName', memberName);
        sessionStorage.setItem('sessionActive', 'true');
        sessionStorage.setItem('sessionStart', new Date().toISOString());
        
        console.log('✅ Auth saved to both storages');
    },

    getAuth() {
        let teamCode = sessionStorage.getItem('teamCode') || localStorage.getItem('teamCode');
        let memberName = sessionStorage.getItem('memberName') || localStorage.getItem('memberName');
        if (!sessionStorage.getItem('teamCode') && localStorage.getItem('teamCode')) {
            console.log('🔄 Restoring session from localStorage');
            this.restoreSession();
            teamCode = sessionStorage.getItem('teamCode');
            memberName = sessionStorage.getItem('memberName');
        }
        
        return { teamCode, memberName };
    },
    
    restoreSession() {
        const teamCode = localStorage.getItem('teamCode');
        const memberName = localStorage.getItem('memberName');
        
        if (teamCode && memberName) {
            sessionStorage.setItem('teamCode', teamCode);
            sessionStorage.setItem('memberName', memberName);
            sessionStorage.setItem('sessionActive', 'true');
            sessionStorage.setItem('sessionStart', new Date().toISOString());
            return true;
        }
        return false;
    },
    
    isAuthenticated() {
        const hasLocalAuth = localStorage.getItem('memberAuth') === 'true';
        const hasTeamCode = localStorage.getItem('teamCode') !== null;
        return hasLocalAuth && hasTeamCode;
    },
    
    isSessionActive() {
        return sessionStorage.getItem('sessionActive') === 'true';
    },
    
    clearAuth() {
        localStorage.removeItem('teamCode');
        localStorage.removeItem('memberName');
        localStorage.removeItem('memberAuth');
        localStorage.removeItem('lastLogin');
        
        sessionStorage.removeItem('teamCode');
        sessionStorage.removeItem('memberName');
        sessionStorage.removeItem('sessionActive');
        sessionStorage.removeItem('sessionStart');
        
        console.log('🔴 Auth cleared from both storages');
    },
    
    async syncSessionToFirebase() {
        if (!window.firebaseDB || !this.isSessionActive()) return;
        
        const { teamCode, memberName } = this.getAuth();
        if (!teamCode || !memberName) return;
        
        try {
            const sessionDocRef = window.firebaseDoc(
                window.firebaseDB, 
                'activeSessions', 
                `${teamCode}_${memberName}`
            );
            
            await window.firebaseSetDoc(sessionDocRef, {
                teamCode,
                memberName,
                lastActive: new Date().toISOString(),
                userAgent: navigator.userAgent,
                sessionStart: sessionStorage.getItem('sessionStart')
            });
            
            console.log('✅ Session synced to Firebase');
        } catch (error) {
            console.error('Error syncing session:', error);
        }
    }
};

const teks = [
	{
		id: '1',
		name: 'Μπουκάλι Ουίσκι',
		subtitle: 'Μπουκάλι Jack Daniels',
		icon: '🍾',
		description: '<strong>Τοποθεσία:</strong> Γραφείο Δημητρίου (70% κενό)<br><strong>Χημική ανάλυση:</strong> Κυανιούχο κάλιο στον πάτο, συνολική ποσότητα 150mg (ο Δημητρίου κατάπιε ~75mg)<br><strong>Αποτυπώματα:</strong> Δημητρίου (πολλαπλά), Παπαδοπούλου (λαβή - παλαιό), Αναγνώστου (λαιμός - πρόσφατο), Πετρόπουλου (βάση - μερικό, αχνό)<br><strong>Σημείωση:</strong> Καπάκι χωρίς ίχνη κυανίου - προστέθηκε ΜΕΤΑ το άνοιγμα',
		page: 'pages/evidence/TEK1_AR.html',
		critical: true
	},
	{
		id: '2',
		name: 'Κρυστάλλινα Ποτήρια',
		subtitle: 'Κρυστάλλινα Ποτήρια',
		icon: '🥃',
		description: '<strong>Τοποθεσία:</strong> Γραφείο Δημητρίου<br><strong>Περιεχόμενα:</strong> Ίχνη ουίσκι και κυανίου σε ΕΝΑ ποτήρι μόνο<br><strong>Αποτυπώματα:</strong> Δημητρίου (και τα δύο), Αναγνώστου (το ένα χωρίς κυάνιο)<br>',
		page: 'pages/evidence/TEK2_AR.html',
		critical: true
	},
	{
		id: '3',
		name: 'Κινητό Δημητρίου',
		subtitle: 'Κινητό Δημητρίου',
		icon: '📱',
		description: '<strong>SMS 20:45:</strong> «Θα τελειώσει απόψε»<br><strong>Προπληρωμένη κάρτα</strong> - Αγορά: Περίπτερο Σταδίου, 19/09, 14:30<br><strong>Τοποθεσία:</strong> Cell tower σε ακτίνα 250m από κτίριο<br><strong>CCTV περιπτέρου:</strong> Άτομο με κουκούλα, ύψος ~165-175cm, δεν φαίνεται πρόσωπο',
		page: 'pages/evidence/TEK3_AR.html',
		critical: false,
		threat: true
	},
	{
		id: '4',
		name: 'Email Αυτοκτονίας',
		subtitle: 'Email «Αυτοκτονίας»',
		icon: '📧',
		description: '<strong>IP:</strong> 192.168.1.23 - 7ος όροφος (κοινόχρηστος υπολογιστής αίθουσας συσκέψεων)<br><strong>Πρόσβαση:</strong> Χωρίς κωδικό - ανοιχτή συνεδρία<br><strong>Browser History:</strong><br>• 18:15 - Σύνδεση Αναγνώστου (email check)<br>• 21:15 - Άγνωστος χρήστης (10 λεπτά σύνδεση)<br>• 21:25 - Αποστολή email «αυτοκτονίας»',
		page: 'pages/evidence/TEK4_AR.html',
		critical: false,
		forgery: true
	},
    {
        id: '5',
        name: 'Ιατρική Γνωμάτευση',
        subtitle: 'Ιατρική Γνωμάτευση (Κρυφή)',
        icon: '🥼',
        description: '<strong>Διάγνωση:</strong> Καρκίνος παγκρέατος σταδίου IV<br><strong>Ημερομηνία:</strong> 28/08/2025<br><strong>Πρόγνωση:</strong> 2-3 μήνες ζωής<br><strong>Γιατρός:</strong> Δρ. Σταυρίδης',
        page: 'pages/evidence/TEK5_AR.html',
        critical: false,
        secret: true
    },
    {
        id: '6',
        name: 'Γάντια Λάτεξ',
        subtitle: 'Ίχνη Γαντιών Λάτεξ',
        icon: '🧤',
        description: '<strong>Τοποθεσία:</strong> Πόμολο πόρτας (εσωτερικά)<br><strong>Τύπος:</strong> Γάντια ιατρικού τύπου<br><strong>Πρόσβαση:</strong> Όλο το προσωπικό',
        page: 'pages/evidence/TEK6_AR.html',
        critical: false,
        clue: true
    },
	{
		id: '7',
		name: 'Χειρόγραφο Σημείωμα',
		subtitle: 'Χειρόγραφο Σημείωμα',
		icon: '✍️',
		description: '<strong>Κείμενο:</strong> «Συγχώρεσέ με Μ.»<br><strong>Ανάλυση:</strong> Προσπάθεια μίμησης γραφικού χαρακτήρα Δημητρίου (68% ταύτιση, πίεση γραφής ασυνεπής με αυθεντικά δείγματα)',
		page: 'pages/evidence/TEK7_AR.html',
		critical: false,
		forgery: true
	},
    {
        id: '8',
        name: 'Φάκελος Εμπιστευτικό',
        subtitle: 'Φάκελος «ΕΜΠΙΣΤΕΥΤΙΚΟ»',
        icon: '📂',
        description: '<strong>Περιεχόμενα:</strong><br>• Υποψίες υπεξαίρεσης (Αναγνώστου)<br>• Ερωτικές φωτογραφίες (Μαυρίδη)<br>• Κλοπή χειρογράφων (Νικολάου)<br>• Απλήρωτοι μισθοί (Παπαδοπούλου)<br>• Χρέη (Πετρόπουλος)',
        page: 'pages/evidence/TEK8_AR.html',
        critical: false,
        blackmail: true
    },
	{
		id: '9',
		name: 'Απόδειξη Χημικών',
		subtitle: 'Απόδειξη Αγοράς Χημικών',
		icon: '🧪',
		description: '<strong>Ημερομηνία:</strong> 19/09, 14:30<br><strong>Αγορά:</strong> Κυανιούχο κάλιο 500g από «ΧημικάPlus»<br><strong>Άδεια:</strong> Επαγγελματική άδεια απεντόμωσης εταιρείας<br><strong>Υπογραφή:</strong> Γ. Πετρόπουλος (υπό γραφολογική εξέταση)<br><strong>Προμηθευτής:</strong> «Άνδρας 40-55 ετών»',
		page: 'pages/evidence/TEK9_AR.html',
		critical: true
	},
    {
        id: '10',
        name: 'Κλειδί Χρηματοκιβωτίου',
        subtitle: 'Κλειδί Χρηματοκιβωτίου',
        icon: '🔑',
        description: '<strong>Αποτυπώματα:</strong> Δημητρίου, Αναγνώστου<br><strong>Ίχνη:</strong> Σκόνη ταλκ (από latex γάντια)',
        page: 'pages/evidence/TEK10_AR.html',
        critical: false,
        financial: true
    },
	{
		id: '11',
		name: 'Κάμερες Ασφαλείας',
		subtitle: 'Κάμερες Ασφαλείας',
		icon: '🎥',
		description: '<strong>Απενεργοποίηση:</strong> 20:55-21:42 (διάρκεια: 47 λεπτά)<br><strong>Τετράδιο Συμβάντων:</strong> «20:58 - Τεχνική βλάβη CCTV» - Αναφορά από βάρδια<br><strong>Χειρόγραφο:</strong> ΔΕΝ ταιριάζει απόλυτα με γραφικό χαρακτήρα Πετρόπουλου (υπό ανάλυση)<br><strong>Τεχνικός έλεγχος:</strong> Μη εξουσιοδοτημένη πρόσβαση στο σύστημα 20:53',
		page: 'pages/evidence/TEK11_AR.html',
		critical: false,
		sabotage: true
	},
];

const CORRECT_SUSPECTS = ['konstantinos', 'georgios', 'eleni'];
const SUSPECT_NAMES = {
    'maria': 'Παπαδοπούλου Μαρία',
    'konstantinos': 'Αναγνώστου Κωνσταντίνος',
    'eleni': 'Μαυρίδη Ελένη',
    'georgios': 'Πετρόπουλος Γεώργιος',
    'alexandra': 'Νικολάου Αλεξάνδρα',
    'suicide': 'Αυτοκτονία'
};

const SCORING = {
    murder_diagnosis: 25,
    cooperation: 18,
    perpetrator: 15,
    perfect_solution_bonus: 22,
    perfect_investigation_bonus: 6,
    precision_bonus: 10,
    evidence_use: 5,
    wrong_accusation: 20,
    missed_suspect: 10,
    reckless_investigation: 40,
    prompts_1_5: 12,
    prompts_6_10: 8,
    prompts_11_15: 4,
    time_under_30: 12,
    time_30_45: 8,
    time_45_60: 4
};

const urlParams = new URLSearchParams(window.location.search);
let teamCode = sessionStorage.getItem('teamName') || urlParams.get('team') || 'default';

if (teamCode !== 'default') {
    const teamInfoDiv = document.getElementById('teamInfo');
    const teamNameSpan = document.getElementById('teamName');
    if (teamInfoDiv && teamNameSpan) {
        teamInfoDiv.style.display = 'block';
        teamNameSpan.textContent = `ΟΜΑΔΑ: ${teamCode.toUpperCase()}`;
    }
}

let timerInterval = null;
let firestoreUnsubscribe = null;
let resultsUnsubscribe = null;
let alertsUnsubscribe = null;
let pollingInterval = null;

function getStorageKey() {
    return `unlocked_teks_${teamCode}`;
}

function openSurvey() {
    const teamCode = sessionStorage.getItem('teamCode');
    const memberName = sessionStorage.getItem('memberName');
    
    if (!teamCode || !memberName) {
        alert('❌ Σφάλμα: Δεν βρέθηκαν στοιχεία σύνδεσης. Παρακαλώ συνδεθείτε ξανά.');
        window.location.href = 'pages/team_entry.html';
        return;
    }

    const surveyUrl = `pages/survey.html?team=${encodeURIComponent(teamCode)}&member=${encodeURIComponent(memberName)}`;
    window.location.href = surveyUrl;
}

function getUnlockedTeks() {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return [];
    
    try {
        const data = JSON.parse(stored);
        if (data && typeof data === 'object' && !Array.isArray(data) && data.unlocked) {
            return Array.isArray(data.unlocked) ? data.unlocked : [];
        }
        
        if (Array.isArray(data)) {
            return data;
        }
        
        return [];
    } catch (e) {
        console.error('Error loading unlocked TEKs:', e);
        return [];
    }
}

function formatElapsedTime(ms) {
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

function startLiveTimer(startTime) {
    if (timerInterval) clearInterval(timerInterval);
    
    const timerElement = document.getElementById('liveTimer');
    if (!timerElement) return;
    
    timerInterval = setInterval(() => {
        const now = new Date();
        const start = new Date(startTime);
        const elapsed = now - start;
        timerElement.textContent = formatElapsedTime(elapsed);
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

async function getTeamData() {
    if (window.firebaseDB) {
        try {
            const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamCode);
            const docSnap = await window.firebaseGetDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    ...data,
                    testingMode: data.testingMode !== undefined ? data.testingMode : false
                };
            }
        } catch (error) {
            console.error('Firebase load error:', error);
        }
    }

    const localData = localStorage.getItem(getStorageKey());
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return {
                    password: parsed.password || null,
                    teamSize: parsed.teamSize || null,
                    testingMode: parsed.testingMode !== undefined ? parsed.testingMode : false,
                    unlocked: parsed.unlocked || [],
                    timestamps: parsed.timestamps || {},
                    startTime: parsed.startTime || null,
                    completedAt: parsed.completedAt || null,
                    totalTimeMs: parsed.totalTimeMs || null,
                    solution: parsed.solution || null,
                    evidenceTimestamps: parsed.evidenceTimestamps || {}
                };
            }
            
            if (Array.isArray(parsed)) {
                return {
                    password: null,
                    teamSize: null,
                    testingMode: false,
                    unlocked: parsed,
                    timestamps: {},
                    startTime: null,
                    completedAt: null,
                    totalTimeMs: null,
                    solution: null,
                    evidenceTimestamps: {}
                };
            }
        } catch (e) {
            console.error('Error parsing localStorage data:', e);
        }
    }

    return {
        password: null,
        teamSize: null,
        testingMode: false,
        unlocked: [],
        timestamps: {},
        startTime: null,
        completedAt: null,
        totalTimeMs: null,
        solution: null,
        evidenceTimestamps: {}
    };
}

async function updateProgress(teamData) {
    const unlockedTeks = teamData.unlocked || [];
    const total = teks.length;
    const unlocked = unlockedTeks.length;
    const percentage = Math.round((unlocked / total) * 100);
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressFill').textContent = percentage + '%';

    const unlockedCountEl = document.getElementById('unlockedCount');
    const totalCountEl = document.getElementById('totalCount');
    const progressEmoji = document.getElementById('progressEmoji');
    
    if (unlockedCountEl) unlockedCountEl.textContent = unlocked;
    if (totalCountEl) totalCountEl.textContent = total;
    
    if (progressEmoji) {
        if (percentage === 0) progressEmoji.textContent = '🔒';
        else if (percentage < 30) progressEmoji.textContent = '🔓';
        else if (percentage < 60) progressEmoji.textContent = '🔍';
        else if (percentage < 90) progressEmoji.textContent = '📋';
        else if (percentage < 100) progressEmoji.textContent = '⭐';
        else progressEmoji.textContent = '🏆';
    }
    
    const timerSection = document.getElementById('timerSection');
    if (teamData.startTime && unlocked > 0) {
        timerSection.style.display = 'block';
        document.getElementById('startTime').textContent = 
            new Date(teamData.startTime).toLocaleString('el-GR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        if (teamData.completedAt || teamData.solution) {
            document.getElementById('liveTimerLabel').textContent = 'Συνολικός Χρόνος:';
            document.getElementById('liveTimer').textContent = formatElapsedTime(teamData.totalTimeMs || 0);
            stopTimer();
        } else {
            document.getElementById('liveTimerLabel').textContent = 'Χρόνος σε Εξέλιξη:';
            if (!timerInterval) {
                startLiveTimer(teamData.startTime);
            }
        }
    } else {
        timerSection.style.display = 'none';
        stopTimer();
    }
}

function calculateScore(selectedSuspects, totalTimeMs, promptCount) {
    const CORRECT_SUSPECTS = ['konstantinos', 'georgios', 'eleni'];
    const SCORING = {
        murder_diagnosis: 25,
        cooperation: 20,
        perpetrator: 15,
        perfect_solution_bonus: 20,
        evidence_use: 5,
        prompts_1_5: 15,
        prompts_6_10: 10,
        prompts_11_15: 5,
        time_under_30: 15,
        time_30_45: 10,
        time_45_60: 5
    };
    
    let score = 0;
    let breakdown = [];
    
    if (selectedSuspects.length === 0) {
        return {
            score: 0,
            breakdown: ['ERROR:Δεν επέλεξαν κανέναν ύποπτο'],
            maxScore: 140,
            correctCount: 0
        };
    }
    
    const hasSuicide = selectedSuspects.includes('suicide');
    const hasKiller = selectedSuspects.some(s => s !== 'suicide');
    
    if (hasSuicide && hasKiller) {
        return {
            score: 0,
            breakdown: [
                'HEADER:🚫 ΛΟΓΙΚΗ ΑΝΤΙΦΑΣΗ (+0 πόντοι)',
                'CONTRADICTION:Η υπόθεση δεν μπορεί να είναι ταυτόχρονα δολοφονία και αυτοκτονία',
            ],
            maxScore: 140,
            correctCount: 0
        };
    }

    if (hasSuicide && !hasKiller) {
        return {
            score: 0,
            breakdown: [
                'HEADER:❌ ΕΣΦΑΛΜΕΝΗ ΘΕΩΡΙΑ (+0 πόντοι)',
                'ERROR:Αυτό δεν ήταν αυτοκτονία',
                'SUBHEADER:Βασικά Στοιχεία που Αγνόησαν',
                'ITEM:Γάντια λάτεξ στην πόρτα',
                'ITEM:Πλαστό email "αυτοκτονίας"',
                'ITEM:Απενεργοποίηση κάμερων',
                'ITEM:Κυάνιο σε μπουκάλι που δεν ήταν του θύματος',
            ],
            maxScore: 140,
            correctCount: 0
        };
    }

    let basicPoints = SCORING.murder_diagnosis;
    score += basicPoints;
    breakdown.push(`HEADER:🧩 ΒΑΣΙΚΗ ΕΚΤΙΜΗΣΗ (+${basicPoints} πόντοι)`);
    breakdown.push('SUCCESS:Σωστή Διάγνωση: ΔΟΛΟΦΟΝΙΑ');
    
    let correctCount = 0;
    let wrongSuspects = [];
    let missedSuspects = [];
    
    selectedSuspects.forEach(suspect => {
        if (CORRECT_SUSPECTS.includes(suspect)) {
            correctCount++;
        } else {
            const SUSPECT_NAMES = {
                'maria': 'Παπαδοπούλου Μαρία',
                'konstantinos': 'Αναγνώστου Κωνσταντίνος',
                'eleni': 'Μαυρίδη Ελένη',
                'georgios': 'Πετρόπουλος Γεώργιος',
                'alexandra': 'Νικολάου Αλεξάνδρα',
                'suicide': 'Αυτοκτονία'
            };
            wrongSuspects.push(SUSPECT_NAMES[suspect] || suspect);
        }
    });
    
    CORRECT_SUSPECTS.forEach(suspect => {
        if (!selectedSuspects.includes(suspect)) {
            const SUSPECT_NAMES = {
                'maria': 'Παπαδοπούλου Μαρία',
                'konstantinos': 'Αναγνώστου Κωνσταντίνος',
                'eleni': 'Μαυρίδη Ελένη',
                'georgios': 'Πετρόπουλος Γεώργιος',
                'alexandra': 'Νικολάου Αλεξάνδρα',
                'suicide': 'Αυτοκτονία'
            };
            missedSuspects.push(SUSPECT_NAMES[suspect] || suspect);
        }
    });

    let perpetratorPoints = 0;
    
    if (correctCount === 3 && selectedSuspects.length === 3) {
        perpetratorPoints = SCORING.perpetrator * 3 + SCORING.perfect_solution_bonus + SCORING.cooperation;
        breakdown.push(`HEADER:🎖️ ΤΕΛΕΙΑ ΑΝΑΛΥΣΗ (+${perpetratorPoints} πόντοι)`);
        breakdown.push('SUCCESS:Εντόπισαν και τους 3 συνεργούς');
    } else {
        breakdown.push(`HEADER:👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ (+${perpetratorPoints} πόντοι - προσωρινό)`);
        
        if (correctCount > 0) {
            perpetratorPoints += correctCount * SCORING.perpetrator;
            breakdown.push(`SUCCESS:Εντόπισαν ${correctCount}/3 Δράστες`);
        }
        
        if (correctCount >= 2) {
            perpetratorPoints += SCORING.cooperation;
            breakdown.push('SUCCESS:Αναγνώριση Συνεργασίας');
        }
        
        if (correctCount >= 2 && correctCount < 3) {
            perpetratorPoints += SCORING.evidence_use;
        }
        
        const headerIndex = breakdown.findIndex(line => line.includes('👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ'));
        if (headerIndex !== -1) {
            breakdown[headerIndex] = `HEADER:👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ (+${perpetratorPoints} πόντοι)`;
        }
    }

    score += perpetratorPoints;
    
    if (correctCount >= 2) {
        let efficiencyPoints = 0;
        let efficiencyItems = [];
        
        if (totalTimeMs) {
            const minutes = totalTimeMs / 60000;
            if (minutes < 30) {
                efficiencyPoints += SCORING.time_under_30;
                efficiencyItems.push('SUCCESS:Ταχύτατη Λύση (+12 πόντοι)');
                efficiencyItems.push('ITEM:Χρόνος <30 λεπτά');
            } else if (minutes < 45) {
                efficiencyPoints += SCORING.time_30_45;
                efficiencyItems.push('SUCCESS:Γρήγορη Λύση (+10 πόντοι)');
                efficiencyItems.push('ITEM:Χρόνος 30-45 λεπτά');
            } else if (minutes < 60) {
                efficiencyPoints += SCORING.time_45_60;
                efficiencyItems.push('SUCCESS:Καλός Χρόνος (+5 πόντοι)');
                efficiencyItems.push('ITEM:Χρόνος 45-60 λεπτά');
            }
        }

        if (promptCount) {
            if (promptCount <= 5) {
                efficiencyPoints += SCORING.prompts_1_5;
                efficiencyItems.push('SUCCESS:Ελάχιστη Χρήση AI (+15 πόντοι)');
                efficiencyItems.push('ITEM:Prompts ≤5');
            } else if (promptCount <= 10) {
                efficiencyPoints += SCORING.prompts_6_10;
                efficiencyItems.push('SUCCESS:Μέτρια Χρήση AI (+10 πόντοι)');
                efficiencyItems.push('ITEM:Prompts 6-10');
            } else if (promptCount <= 15) {
                efficiencyPoints += SCORING.prompts_11_15;
                efficiencyItems.push('SUCCESS:Αποδεκτή Χρήση AI (+5 πόντοι)');
                efficiencyItems.push('ITEM:Prompts 11-15');
            } else {
                efficiencyItems.push('INFO:Υπερβολική Χρήση AI (0 πόντοι)');
                efficiencyItems.push('ITEM:Prompts >15');
            }
        }
        
        if (efficiencyPoints > 0 || efficiencyItems.length > 0) {
            breakdown.push(`HEADER:⚡ BONUS ΑΠΟΔΟΤΙΚΟΤΗΤΑΣ (+${efficiencyPoints} πόντοι)`);
            breakdown.push(...efficiencyItems);
        }
        
        score += efficiencyPoints;
    }
    
    if (wrongSuspects.length > 0) {
        const originalScore = score;
        let multiplier = 1.0;
        
        if (wrongSuspects.length === 1) {
            multiplier = 0.5;
        } else if (wrongSuspects.length === 2) {
            multiplier = 0.2;
        } else if (wrongSuspects.length >= 3) {
            multiplier = 0.05;
        }
        
        score = Math.floor(score * multiplier);
        const penalty = originalScore - score;
        
        if (wrongSuspects.length >= 4) {
            breakdown.push(`HEADER:❌ Απρόσεκτη Έρευνα (-${penalty} πόντοι)`);
            breakdown.push('PENALTY:Επιλέξατε 4+ υπόπτους - «shotgun» προσέγγιση χωρίς ανάλυση');
        } else {
            breakdown.push(`HEADER:❌ Κατηγόρησαν Αθώους (-${penalty} πόντοι)`);
        }
        
        wrongSuspects.forEach(name => {
            breakdown.push(`PENALTY:${name}`);
        });
    }
        
    if (missedSuspects.length > 0) {
        const missedPenalty = missedSuspects.length * 20;
        score = Math.max(0, score - missedPenalty);
        
        breakdown.push(`HEADER:🔍 Έχασαν Πραγματικούς Δράστες (-${missedPenalty} πόντοι)`);
        missedSuspects.forEach(name => {
            breakdown.push(`PENALTY:${name}`);
        });
    }

    score = Math.max(0, Math.min(score, 140));
    
    return { 
        score, 
        breakdown, 
        maxScore: 140, 
        correctCount, 
        wrongCount: wrongSuspects.length 
    };
}

async function submitSolution() {
    const checkboxes = document.querySelectorAll('input[name="suspect"]:checked');
    const selectedSuspects = Array.from(checkboxes).map(cb => cb.value);
    const justification = document.getElementById('justification').value.trim();
    const promptCount = parseInt(document.getElementById('promptCount').value) || 0;

    if (selectedSuspects.length === 0) {
        alert('Παρακαλώ επιλέξτε τουλάχιστον έναν ύποπτο ή αυτοκτονία!');
        return;
    }

    if (!justification || justification.length < 50) {
        alert('Παρακαλώ συμπληρώστε αναλυτική αιτιολόγηση (τουλάχιστον 50 χαρακτήρες)!');
        return;
    }

    if (promptCount === null || promptCount === undefined || promptCount < 0) {
        alert('Παρακαλώ εισάγετε έγκυρο αριθμό prompts!');
        return;
    }
    
    const teamData = await getTeamData();
    if (teamData.unlocked.length < 6) {
        alert(`Πρέπει να ξεκλειδώσετε τουλάχιστον 6 τεκμήρια πριν υποβάλετε λύση! (Έχετε: ${teamData.unlocked.length}/11)`);
        return;
    }

    if (teamData.solution) {
        alert('Έχετε ήδη υποβάλει λύση! Δεν μπορείτε να υποβάλετε ξανά.');
        return;
    }            
    
    let totalTimeMs = null;
    if (teamData.startTime) {
        const start = new Date(teamData.startTime);
        const now = new Date();
        totalTimeMs = now - start;
    }

    const scoreResult = calculateScore(selectedSuspects, totalTimeMs, promptCount);

    const solution = {
        suspects: selectedSuspects,
        justification: justification,
        justificationLength: justification.length,
        promptCount: promptCount,
        submittedAt: new Date().toISOString(),
        completionTimeMs: totalTimeMs,
        score: scoreResult.score,
        maxScore: scoreResult.maxScore,
        breakdown: scoreResult.breakdown,
        correctCount: scoreResult.correctCount,
        researchData: {
            evidenceUnlockSequence: Object.keys(teamData.evidenceTimestamps || {}).sort((a, b) => {
                return new Date(teamData.evidenceTimestamps[a]) - new Date(teamData.evidenceTimestamps[b]);
            }),
            totalEvidenceUnlocked: (teamData.unlocked || []).length,
            firstEvidenceTime: teamData.startTime || null,
            lastEvidenceTime: (teamData.evidenceTimestamps && Object.keys(teamData.evidenceTimestamps).length > 0) ? 
                Object.values(teamData.evidenceTimestamps).sort().pop() : null,
            timeSpentMinutes: totalTimeMs ? Math.round(totalTimeMs / 60000) : null,
            strategy: selectedSuspects.includes('suicide') ? 'suicide' : 
                     (selectedSuspects.length === 5 ? 'shotgun' : 
                     (selectedSuspects.length === 3 ? 'selective' : 'selective'))
        }
    };
    
    try {
		const updatedData = {
			...teamData,
			testingMode: teamData.testingMode || false,
			solution: solution,
			completedAt: solution.submittedAt,
			totalTimeMs: totalTimeMs,
			lastUpdate: new Date().toISOString()
		};
        
        localStorage.setItem(getStorageKey(), JSON.stringify(updatedData));
        
        if (window.firebaseDB) {
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, 'teams', teamCode),
                updatedData
            );
        }
        
        localStorage.setItem(`solution_${teamCode}`, JSON.stringify(solution));
        displaySubmissionConfirmation();
        
    } catch (error) {
        console.error('Error saving solution:', error);
        alert('Σφάλμα αποθήκευσης! Δοκιμάστε ξανά.');
    }
}

function displaySubmissionConfirmation() {
    const resultDiv = document.getElementById('solutionResult');
    const solutionIntroBox = document.getElementById('solutionIntroBox');
    if (solutionIntroBox) {
        solutionIntroBox.style.display = 'none';
    }
    
    resultDiv.innerHTML = `
        <div class="submission-success-banner">
            <div class="submission-success-content">
                <div class="submission-success-icon">✅</div>
                <div>
                    <div class="submission-success-title">ΛΥΣΗ ΥΠΟΒΛΗΘΗΚΕ ΕΠΙΤΥΧΩΣ!</div>
                    <div class="submission-success-date">📅 ${new Date().toLocaleString('el-GR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
            </div>
        </div>

        <div class="reveal-container">
            <div class="reveal-header">
                <div class="reveal-lock-icon">🔒</div>
                <h3 class="reveal-title">Η ΑΛΗΘΕΙΑ ΘΑ ΑΠΟΚΑΛΥΦΘΕΙ ΣΥΝΤΟΜΑ...</h3>
            </div>
            
            <div class="reveal-content">
                <div class="reveal-warning-box">
                    <div class="reveal-warning-icon">⚠️</div>
                    <div class="reveal-warning-content">
                        <div class="reveal-warning-header">
                            <span class="reveal-warning-emoji">💡</span>
                            <span class="reveal-warning-label">ΠΡΟΣΟΧΗ!</span>
                        </div>
                        <p class="reveal-warning-text">
                            ΚΡΑΤΗΣΤΕ ΤΗ ΛΥΣΗ ΣΑΣ ΜΥΣΤΙΚΗ!<br>
                            ΜΗΝ ΜΟΙΡΑΣΤΕΙΤΕ ΠΛΗΡΟΦΟΡΙΕΣ ΜΕ ΑΛΛΕΣ ΟΜΑΔΕΣ ΜΕΧΡΙ ΤΗΝ ΕΠΙΣΗΜΗ ΛΗΞΗ ΤΟΥ ΔΙΑΓΩΝΙΣΜΟΥ!
                        </p>
                    </div>
                </div>

                <div class="reveal-password-section">
                    <div class="reveal-password-header">
                        <div class="reveal-password-badge">
                            <span class="reveal-password-badge-icon">🔓</span>
                            <span class="reveal-password-badge-text">Έχετε τον κωδικό πρόσβασης;</span>
                        </div>
                    </div>
                    
                    <div class="reveal-password-form">
                        <input type="password" 
                               id="solutionPassword" 
                               class="reveal-password-input"
                               placeholder="Εισάγετε κωδικό...">
                        <button onclick="revealSolution()" class="reveal-password-button">
                            🔓 ΑΠΟΚΑΛΥΨΗ
                        </button>
                    </div>
                    
                    <p class="reveal-password-hint">
                        Ο κωδικός θα ανακοινωθεί από τους διοργανωτές
                    </p>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    const solutionForm = document.getElementById('solutionForm');
    if (solutionForm) {
        solutionForm.style.display = 'none';
    }
    
    stopTimer();
}

function calculateScore(selectedSuspects, totalTimeMs, promptCount) {
    let score = 0;
    let breakdown = [];
    
    if (selectedSuspects.length === 0) {
        return {
            score: 0,
            breakdown: [
                'ERROR:Δεν επιλέξατε κανέναν ύποπτο ή αυτοκτονία'
            ],
            maxScore: 140,
            correctCount: 0,
            wrongCount: 0,
            missedCount: 0
        };
    }
    
    const hasSuicide = selectedSuspects.includes('suicide');
    const hasKiller = selectedSuspects.some(s => s !== 'suicide');
    
    if (hasSuicide && hasKiller) {
        const killerNames = selectedSuspects
            .filter(s => s !== 'suicide')
            .map(s => SUSPECT_NAMES[s])
            .join(', ');
        
        return {
            score: 0,
            breakdown: [
                'CONTRADICTION:ΛΟΓΙΚΗ ΑΝΤΙΦΑΣΗ - Η υπόθεση δεν μπορεί να είναι ταυτόχρονα δολοφονία ΚΑΙ αυτοκτονία',
                '',
                `INFO:Επιλέξατε: ${killerNames} + Αυτοκτονία`,
                '',
                'INFO:Πρέπει να επιλέξετε ΕΙΤΕ δολοφονία ΕΙΤΕ αυτοκτονία, όχι και τα δύο.'
            ],
            maxScore: 140,
            correctCount: 0,
            wrongCount: 0,
            missedCount: 0
        };
    }

	if (hasSuicide && !hasKiller) {
		return {
			score: 0,
			breakdown: [
				'ERROR:ΕΣΦΑΛΜΕΝΗ ΘΕΩΡΙΑ - Δεν ήταν αυτοκτονία',
				'',
				'SUBHEADER:Βασικά Στοιχεία που Αγνοήσατε:',
				'ITEM:Γάντια λάτεξ στην πόρτα (ΤΕΚ #6) - κάποιος προσπάθησε να μην αφήσει αποτυπώματα',
				'ITEM:Πλαστό email αυτοκτονίας από κοινόχρηστο υπολογιστή (ΤΕΚ #4)',
				'ITEM:Απενεργοποίηση κάμερων 20:55-21:42 (ΤΕΚ #11)',
				'ITEM:Κυάνιο προστέθηκε ΜΕΤΑ το άνοιγμα του μπουκαλιού (ΤΕΚ #1)',
				'',
				'SUBHEADER:Οι Πραγματικοί Δράστες που Παραβλέψατε:',
				'',
				'ITEM:→ Αναγνώστου Κωνσταντίνος (Μαστρομυαλός)',
				'ITEM:Αποτυπώματά του στο μπουκάλι (λαιμός) και κλειδί χρηματοκιβωτίου (ΤΕΚ #1, #10)',
				'ITEM:Υπεξαίρεση €500.000 σε Ελβετία - το κίνητρο (ΤΕΚ #8)',
				'ITEM:Ο εγκέφαλος της επιχείρησης - έριξε το κυάνιο στο ποτήρι',
				'',
				'ITEM:→ Πετρόπουλος Γεώργιος (Προμηθευτής)',
				'ITEM:Αγόρασε κυάνιο 19/09 με επαγγελματική άδεια (ΤΕΚ #9)',
				'ITEM:Απενεργοποίησε κάμερες ασφαλείας 20:55 (ΤΕΚ #11)',
				'ITEM:Χρέη €60.000 - το κίνητρο (ΤΕΚ #8)',
				'',
				'ITEM:→ Μαυρίδη Ελένη (Συγκάλυψη)',
				'ITEM:Έστειλε πλαστό email «αυτοκτονίας» από κοινόχρηστο PC (ΤΕΚ #4)',
				'ITEM:Πλαστογράφησε χειρόγραφο σημείωμα (ΤΕΚ #7)',
				'ITEM:Εκβιασμός €100.000 για ερωτικές φωτογραφίες - το κίνητρο (ΤΕΚ #8)',
				'',
				'INFO:Η δολοφονία σκηνοθετήθηκε επιμελώς να μοιάζει με αυτοκτονία.',
				'INFO:Οι τρεις συνεργοί είχαν συντονισμένους ρόλους: προμήθεια δηλητηρίου, εκτέλεση, και συγκάλυψη.'
			],
			maxScore: 140,
			correctCount: 0,
			wrongCount: 0,
			missedCount: 3
		};
	}

    let correctCount = 0;
    let wrongSuspects = [];
    let missedSuspects = [];
    
    selectedSuspects.forEach(suspect => {
        if (CORRECT_SUSPECTS.includes(suspect)) {
            correctCount++;
        } else {
            wrongSuspects.push(SUSPECT_NAMES[suspect] || suspect);
        }
    });
    
    CORRECT_SUSPECTS.forEach(suspect => {
        if (!selectedSuspects.includes(suspect)) {
            missedSuspects.push(SUSPECT_NAMES[suspect] || suspect);
        }
    });
    
    score += SCORING.murder_diagnosis;
    breakdown.push(`HEADER:🧩 ΒΑΣΙΚΗ ΕΚΤΙΜΗΣΗ (+${SCORING.murder_diagnosis} πόντοι)`);
    breakdown.push('');
    breakdown.push(`SUCCESS:Σωστή Διάγνωση: ΔΟΛΟΦΟΝΙΑ`);
    breakdown.push('ITEM:Αναγνωρίσατε ότι δεν ήταν αυτοκτονία');
    breakdown.push('');
	
    breakdown.push('HEADER:👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ');
    breakdown.push('');
    
    if (correctCount > 0) {
        const suspectPoints = correctCount * SCORING.perpetrator;
        score += suspectPoints;
        
        breakdown.push(`SUCCESS:Εντοπίσατε ${correctCount}/3 Δράστες (+${suspectPoints} πόντοι)`);
        breakdown.push('');
        selectedSuspects.forEach(suspect => {
            if (CORRECT_SUSPECTS.includes(suspect)) {
                const name = SUSPECT_NAMES[suspect];
                let role = '';
                if (suspect === 'konstantinos') role = 'Μαστρομυαλός - έριξε το κυάνιο';
                else if (suspect === 'georgios') role = 'Προμήθευσε κυάνιο & έσβησε κάμερες';
                else if (suspect === 'eleni') role = 'Δημιούργησε ψευδή στοιχεία αυτοκτονίας';
                breakdown.push(`ITEM:✓ ${name} (${role})`);
            }
        });
        breakdown.push('');
    } else {
        breakdown.push(`ERROR:Δεν εντοπίσατε κανέναν από τους πραγματικούς δράστες (0 πόντοι)`);
        breakdown.push('');
    }
    
    if (correctCount >= 2) {
        score += SCORING.cooperation;
        breakdown.push(`SUCCESS:Αναγνώριση Συνεργασίας (+${SCORING.cooperation} πόντοι)`);
        breakdown.push('ITEM:Καταλάβατε ότι ήταν ομαδική προσπάθεια');
        breakdown.push('');
    }
    
	if (correctCount === 3 && wrongSuspects.length === 0) {
		score += SCORING.perfect_solution_bonus;
		breakdown.push(`SUCCESS:ΤΕΛΕΙΑ ΛΥΣΗ! (+${SCORING.perfect_solution_bonus} πόντοι)`);
		breakdown.push('ITEM:Εντοπίσατε και τους 3 συνεργούς χωρίς λανθασμένες κατηγορίες');
		breakdown.push('');
		score += SCORING.perfect_investigation_bonus;
		breakdown.push(`SUCCESS:ΑΨΟΓΗ ΕΡΕΥΝΑ! (+${SCORING.perfect_investigation_bonus} πόντοι)`);
		breakdown.push('ITEM:Τέλεια ακρίβεια χωρίς καμία λανθασμένη κατηγορία');
		breakdown.push('');
	}
    
    if (wrongSuspects.length === 0 && correctCount > 0 && correctCount < 3) {
        score += SCORING.precision_bonus;
        breakdown.push(`SUCCESS:Bonus Ακρίβειας (+${SCORING.precision_bonus} πόντοι)`);
        breakdown.push(`ITEM:Όλες οι επιλογές σας ήταν σωστές (${correctCount}/3 δράστες)`);
        breakdown.push('');
    }
    
    if (correctCount >= 2) {
        breakdown.push('HEADER:⚡ BONUS ΑΠΟΔΟΤΙΚΟΤΗΤΑΣ');
        breakdown.push('');
        
        let hasEfficiencyBonus = false;
        
        if (totalTimeMs) {
            const minutes = totalTimeMs / 60000;
            if (minutes < 30) {
                score += SCORING.time_under_30;
                breakdown.push(`SUCCESS:Ταχύτατη Λύση (+${SCORING.time_under_30} πόντοι)`);
                breakdown.push('ITEM:Χρόνος: <30 λεπτά');
                hasEfficiencyBonus = true;
            } else if (minutes < 45) {
                score += SCORING.time_30_45;
                breakdown.push(`SUCCESS:Γρήγορη Λύση (+${SCORING.time_30_45} πόντοι)`);
                breakdown.push('ITEM:Χρόνος: 30-45 λεπτά');
                hasEfficiencyBonus = true;
            } else if (minutes < 60) {
                score += SCORING.time_45_60;
                breakdown.push(`SUCCESS:Καλός Χρόνος (+${SCORING.time_45_60} πόντοι)`);
                breakdown.push('ITEM:Χρόνος: 45-60 λεπτά');
                hasEfficiencyBonus = true;
            }
        }

        if (promptCount !== null && promptCount !== undefined) {
            if (promptCount <= 5) {
                score += SCORING.prompts_1_5;
                breakdown.push(`SUCCESS:Ελάχιστη Χρήση AI (+${SCORING.prompts_1_5} πόντοι)`);
                breakdown.push('ITEM:Prompts : ≤5');
                hasEfficiencyBonus = true;
            } else if (promptCount <= 10) {
                score += SCORING.prompts_6_10;
                breakdown.push(`SUCCESS:Μέτρια Χρήση AI (+${SCORING.prompts_6_10} πόντοι)`);
                breakdown.push('ITEM:Prompts : 6-10');
                hasEfficiencyBonus = true;
            } else if (promptCount <= 15) {
                score += SCORING.prompts_11_15;
                breakdown.push(`SUCCESS:Συχνή Χρήση AI (+${SCORING.prompts_11_15} πόντοι)`);
                breakdown.push('ITEM:Prompts : 11-15');
                hasEfficiencyBonus = true;
            } else {
                breakdown.push(`INFO:Υπερβολική Χρήση AI (0 πόντοι)`);
                breakdown.push(`ITEM:Prompts : ${promptCount}`);
            }
        }
        
        if (!hasEfficiencyBonus) {
            breakdown.push('INFO:Κανένα bonus αποδοτικότητας');
        }
        breakdown.push('');
    }
    
    let totalPenalties = 0;
    
    if (wrongSuspects.length > 0 || missedSuspects.length > 0 || selectedSuspects.length >= 4) {
        breakdown.push('HEADER:⚠️ ΠΟΙΝΕΣ');
        breakdown.push('');
    }
    
    if (selectedSuspects.length >= 4) {
        totalPenalties += SCORING.reckless_investigation;
        breakdown.push(`PENALTY:Απρόσεκτη Έρευνα (-${SCORING.reckless_investigation} πόντοι)`);
        breakdown.push('ITEM:Επιλέξατε 4+ υπόπτους - «shotgun» προσέγγιση χωρίς ανάλυση');
        breakdown.push('');
    }
    
    if (wrongSuspects.length > 0) {
        const wrongPenalty = wrongSuspects.length * SCORING.wrong_accusation;
        totalPenalties += wrongPenalty;
        
        const wrongText = wrongSuspects.length === 1 ? 'έναν αθώο' : 'δύο αθώους';
        breakdown.push(`PENALTY:Κατηγορήσατε ${wrongText} (-${wrongPenalty} πόντοι)`);
        breakdown.push('');
        wrongSuspects.forEach(name => {
            breakdown.push(`ITEM:→ ${name}`);
            if (name === 'Παπαδοπούλου Μαρία') {
                breakdown.push('ITEM: Σιδηρένιο άλλοθι (γιατρός 18:30-19:30 & δείπνο 19:45-22:00)');
                breakdown.push('ITEM: Τα αποτυπώματά της στο μπουκάλι ήταν παλιά');
            } else if (name === 'Νικολάου Αλεξάνδρα') {
                breakdown.push('ITEM: Έφυγε 18:30, πριν τη δολοφονία');
                breakdown.push('ITEM: Δεν είχε πρόσβαση σε κυάνιο');
            }
        });
        breakdown.push('');
    }
    
    if (missedSuspects.length > 0) {
        const missedPenalty = missedSuspects.length * SCORING.missed_suspect;
        totalPenalties += missedPenalty;
        
        const missedText = missedSuspects.length === 1 ? 'έναν πραγματικό δράστη' : 
                          missedSuspects.length === 2 ? 'δύο πραγματικούς δράστες' : 
                          'τρεις πραγματικούς δράστες';
        
        breakdown.push(`PENALTY:Χάσατε ${missedText} (-${missedPenalty} πόντοι)`);
        breakdown.push('');
        
        missedSuspects.forEach(name => {
            breakdown.push(`ITEM:→ ${name}`);
            if (name === 'Αναγνώστου Κωνσταντίνος') {
                breakdown.push('ITEM: Αποτυπώματά του στο μπουκάλι και κλειδί χρηματοκιβωτίου');
                breakdown.push('ITEM: Υπεξαίρεση €500.000 - το κίνητρο');
                breakdown.push('ITEM: Ο μαστρομυαλός που έριξε το κυάνιο');
            } else if (name === 'Πετρόπουλος Γεώργιος') {
                breakdown.push('ITEM: Αγόρασε κυάνιο 19/09 (ΤΕΚ #9)');
                breakdown.push('ITEM: Απενεργοποίησε κάμερες 20:55 (ΤΕΚ #11)');
                breakdown.push('ITEM: Χρέη €60.000 - το κίνητρο');
            } else if (name === 'Μαυρίδη Ελένη') {
                breakdown.push('ITEM: Έστειλε πλαστό email «αυτοκτονίας» (ΤΕΚ #4)');
                breakdown.push('ITEM: Πλαστογράφησε χειρόγραφο σημείωμα (ΤΕΚ #7)');
                breakdown.push('ITEM: Εκβιασμός €100.000 για ερωτικές φωτογραφίες');
            }
        });
        breakdown.push('');
    }
    
    score -= totalPenalties;
    
    const scoreBeforeFloor = score;
    score = Math.max(score, 5);
    
    if (scoreBeforeFloor < 15 && totalPenalties > 0) {
        breakdown.push('INFO:Ελάχιστη βαθμολογία για την προσπάθεια (15 πόντοι) ');
        breakdown.push('');
    }
    
    breakdown.push('');
    breakdown.push(`INFO:🏁 ΤΕΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ: ${Math.max(0, score)}/${140}`);
    
    score = Math.max(0, Math.min(score, 140));
    
    return { 
        score, 
        breakdown, 
        maxScore: 140, 
        correctCount, 
        wrongCount: wrongSuspects.length,
        missedCount: missedSuspects.length
    };
}

function displaySolutionResult(solution) {
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

    resultDiv.innerHTML = '';

    const scoreCard = document.createElement('div');
    scoreCard.className = 'solution-score-card';
    scoreCard.innerHTML = `
        <div class="solution-grade-emoji">${gradeEmoji}</div>
        <div class="solution-case-status">${caseStatus}</div>
        <div class="solution-grade-title" style="color: ${gradeColor};">${grade}</div>
        <div class="solution-score-display">${solution.score} / ${solution.maxScore}</div>
        <div class="solution-status-message">${statusMessage}</div>
        <div style="background: rgba(255,255,255,0.1); height: 12px; border-radius: 20px; overflow: hidden; margin: 20px 0;">
            <div style="background: ${gradeColor}; height: 100%; width: ${percentage}%; transition: width 2s ease-out;"></div>
        </div>
        <div class="solution-performance-label">ΕΠΙΔΟΣΗ: ${percentage}%</div>
    `;
    resultDiv.appendChild(scoreCard);
    
    const statsCard = document.createElement('div');
    statsCard.className = 'solution-stats-card';
    let statsHTML = '<div class="solution-stats-grid">';
    
    if (solution.completionTimeMs) {
        statsHTML += `
            <div class="solution-stat-item">
                <div class="solution-stat-icon">⏱️</div>
                <div class="solution-stat-value">${formatElapsedTime(solution.completionTimeMs)}</div>
                <div class="solution-stat-label">Χρόνος</div>
            </div>
        `;
    }
    
    statsHTML += `
        <div class="solution-stat-item">
            <div class="solution-stat-icon">🎯</div>
            <div class="solution-stat-value">${solution.promptCount}</div>
            <div class="solution-stat-label">Prompts</div>
        </div>
        <div class="solution-stat-item">
            <div class="solution-stat-icon">✅</div>
            <div class="solution-stat-value">${solution.correctCount}/3</div>
            <div class="solution-stat-label">Σωστοί Δράστες</div>
        </div>
    `;
    statsHTML += '</div>';
    statsCard.innerHTML = statsHTML;
    resultDiv.appendChild(statsCard);
    
    const breakdownCard = document.createElement('div');
    breakdownCard.className = 'breakdown-card';
    
    let breakdownHTML = `
        <div class="breakdown-header">
            <div class="breakdown-header-icon">📊</div>
            <div>
                <h3 class="breakdown-header-title">ΑΝΑΛΥΤΙΚΗ ΑΞΙΟΛΟΓΗΣΗ</h3>
            </div>
        </div>
    `;

    solution.breakdown.forEach(line => {
        if (!line || line.trim() === '') return;
        if (line.includes('ΤΕΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ')) return;

        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            breakdownHTML += `<div class="breakdown-item">${line}</div>`;
            return;
        }
        
        const type = line.substring(0, colonIndex);
        const content = line.substring(colonIndex + 1);
        
        let itemClass = '';
        let icon = '';
        
        if (type === 'HEADER') {
            itemClass = 'header';
        } else if (type === 'SUCCESS') {
            itemClass = 'success';
            icon = '✓';
        } else if (type === 'PENALTY') {
            itemClass = 'penalty';
            icon = '✗';
        } else if (type === 'ERROR') {
            itemClass = 'error';
            icon = '⚠';
        } else if (type === 'INFO') {
            itemClass = 'info';
            icon = 'ℹ';
        } else if (type === 'CONTRADICTION') {
            itemClass = 'contradiction';
            icon = '⚠';
        } else if (type === 'SUBHEADER') {
            itemClass = 'subheader';
        } else if (type === 'ITEM') {
            itemClass = 'item';
            icon = '';
        }
        
        breakdownHTML += `
            <div class="breakdown-item ${itemClass}">
                ${icon ? `<div class="breakdown-item-icon">${icon}</div>` : ''}
                <div class="breakdown-item-content">${content}</div>
            </div>
        `;
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
function displaySolutionResult(solution) {
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

    resultDiv.innerHTML = '';

    const scoreCard = document.createElement('div');
    scoreCard.className = 'solution-score-card';
    scoreCard.innerHTML = `
        <div class="solution-grade-emoji">${gradeEmoji}</div>
        <div class="solution-case-status">${caseStatus}</div>
        <div class="solution-grade-title" style="color: ${gradeColor};">${grade}</div>
        <div class="solution-score-display">${solution.score} / ${solution.maxScore}</div>
        <div class="solution-status-message">${statusMessage}</div>
        <div style="background: rgba(255,255,255,0.1); height: 12px; border-radius: 20px; overflow: hidden; margin: 20px 0;">
            <div style="background: ${gradeColor}; height: 100%; width: ${percentage}%; transition: width 2s ease-out;"></div>
        </div>
        <div class="solution-performance-label">ΕΠΙΔΟΣΗ: ${percentage}%</div>
    `;
    resultDiv.appendChild(scoreCard);
    
    const statsCard = document.createElement('div');
    statsCard.className = 'solution-stats-card';
    let statsHTML = '<div class="solution-stats-grid">';
    
    if (solution.completionTimeMs) {
        statsHTML += `
            <div class="solution-stat-item">
                <div class="solution-stat-icon">⏱️</div>
                <div class="solution-stat-value">${formatElapsedTime(solution.completionTimeMs)}</div>
                <div class="solution-stat-label">Χρόνος</div>
            </div>
        `;
    }
    
    statsHTML += `
        <div class="solution-stat-item">
            <div class="solution-stat-icon">🎯</div>
            <div class="solution-stat-value">${solution.promptCount}</div>
            <div class="solution-stat-label">Prompts</div>
        </div>
        <div class="solution-stat-item">
            <div class="solution-stat-icon">✅</div>
            <div class="solution-stat-value">${solution.correctCount}/3</div>
            <div class="solution-stat-label">Σωστοί Δράστες</div>
        </div>
    `;
    statsHTML += '</div>';
    statsCard.innerHTML = statsHTML;
    resultDiv.appendChild(statsCard);
    
    const breakdownCard = document.createElement('div');
    breakdownCard.className = 'breakdown-card';
    
    let breakdownHTML = `
        <div class="breakdown-header">
            <div class="breakdown-header-icon">📊</div>
            <div>
                <h3 class="breakdown-header-title">ΑΝΑΛΥΤΙΚΗ ΑΞΙΟΛΟΓΗΣΗ</h3>
            </div>
        </div>
    `;

    solution.breakdown.forEach(line => {
        if (!line || line.trim() === '') return;
        if (line.includes('ΤΕΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ')) return;

        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            breakdownHTML += `<div class="breakdown-item">${line}</div>`;
            return;
        }
        
        const type = line.substring(0, colonIndex);
        const content = line.substring(colonIndex + 1);
        
        let itemClass = '';
        let icon = '';
        
        if (type === 'HEADER') {
            itemClass = 'header';
        } else if (type === 'SUCCESS') {
            itemClass = 'success';
            icon = '✓';
        } else if (type === 'PENALTY') {
            itemClass = 'penalty';
            icon = '✗';
        } else if (type === 'ERROR') {
            itemClass = 'error';
            icon = '⚠';
        } else if (type === 'INFO') {
            itemClass = 'info';
            icon = 'ℹ';
        } else if (type === 'CONTRADICTION') {
            itemClass = 'contradiction';
            icon = '⚠';
        } else if (type === 'SUBHEADER') {
            itemClass = 'subheader';
        } else if (type === 'ITEM') {
            itemClass = 'item';
            icon = '';
        }
        
        breakdownHTML += `
            <div class="breakdown-item ${itemClass}">
                ${icon ? `<div class="breakdown-item-icon">${icon}</div>` : ''}
                <div class="breakdown-item-content">${content}</div>
            </div>
        `;
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

window.revealSolution = async function() {
    const password = document.getElementById('solutionPassword').value.toUpperCase();
    const correctPassword = 'MURDER';
    
    if (password !== correctPassword) {
        alert('❌ Λάθος κωδικός! Ζητήστε τον σωστό κωδικό από τον οργανωτή.');
        document.getElementById('solutionPassword').value = '';
        return;
    }
    
    const teamData = await getTeamData();
    const solution = teamData.solution;
    
    if (!solution) {
        alert('Δεν βρέθηκε υποβληθείσα λύση!');
        return;
    }

    const scoreResult = calculateScore(
        solution.suspects, 
        solution.completionTimeMs, 
        solution.promptCount
    );

    const completeSolution = {
        ...solution,
        score: scoreResult.score,
        maxScore: scoreResult.maxScore,
        breakdown: scoreResult.breakdown,
        correctCount: scoreResult.correctCount,
        wrongCount: solution.suspects.length - scoreResult.correctCount
    };
    
    const submissionHeader = document.getElementById('submissionHeader');
    const passwordSection = document.getElementById('passwordSection');
    if (submissionHeader) submissionHeader.style.display = 'none';
    if (passwordSection) passwordSection.style.display = 'none';

    displaySolutionResult(completeSolution);
};

function buildUrl(page) {
    return teamCode !== 'default' ? `${page}?team=${teamCode}` : page;
}

function renderEvidence() {
    const unlockedTeks = getUnlockedTeks();
    const grid = document.getElementById('evidenceGrid');
    
    grid.innerHTML = teks.map(tek => {
        const isUnlocked = unlockedTeks.includes(tek.id);
        const cardClass = isUnlocked ? 'unlocked' : 'locked';
        
        let criticalTag = '';
        if (tek.critical) criticalTag = '<span class="critical-tag">ΚΡΙΣΙΜΟ</span>';
        else if (tek.secret) criticalTag = '<span class="critical-tag">ΑΠΟΡΡΗΤΟ</span>';
        else if (tek.blackmail) criticalTag = '<span class="critical-tag">ΕΚΒΙΑΣΜΟΣ</span>';
        else if (tek.sabotage) criticalTag = '<span class="critical-tag">ΣΑΜΠΟΤΑΖ</span>';
        else if (tek.threat) criticalTag = '<span class="critical-tag">ΑΠΕΙΛΗ</span>';
        else if (tek.forgery) criticalTag = '<span class="critical-tag">ΠΛΑΣΤΟΓΡΑΦΙΑ</span>';
        else if (tek.clue) criticalTag = '<span class="critical-tag">ΕΝΔΕΙΞΗ</span>';
        else if (tek.financial) criticalTag = '<span class="critical-tag">ΟΙΚΟΝΟΜΙΚΟ</span>';
        
        return `
            <div class="evidence-card ${cardClass}">
                ${criticalTag}
                ${!isUnlocked ? '<div class="lock-overlay">🔒</div>' : ''}
                <div class="evidence-header">
                    <div class="evidence-icon">${tek.icon}</div>
                    <div class="evidence-info">
                        <h3>ΤΕΚ #${tek.id.padStart(3, '0')}</h3>
                        <p>${tek.subtitle}</p>
                    </div>
                </div>
				<p class="evidence-description">
					${isUnlocked ? tek.description : ''}
				</p>
                <div class="evidence-actions">
					${isUnlocked ? 
						`<a href="${buildUrl(tek.page)}" class="btn btn-ar">
							👀️ Προβολή Τεκμηρίου
						</a>` :
						`<button class="btn btn-ar" disabled></button>`
					}
                </div>
                <span class="status-badge ${isUnlocked ? 'status-unlocked' : 'status-locked'}">
                    ${isUnlocked ? '✅ ΔΙΑΘΕΣΙΜΟ' : '🔒 ΚΛΕΙΔΩΜΕΝΟ'}
                </span>
            </div>
        `;
    }).join('');
}

async function initSolutionTab(teamData) {
    const solutionIntroBox = document.getElementById('solutionIntroBox');
    const solutionForm = document.getElementById('solutionForm');
    const existingSolution = teamData.solution;
    
    if (existingSolution) {
        if (solutionIntroBox) {
            solutionIntroBox.style.display = 'none';
        }
        if (solutionForm) {
            solutionForm.style.display = 'none';
        }
        
        displaySubmissionConfirmation();
    }
}

window.submitSolution = submitSolution;

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

window.submitSolution = submitSolution;
window.switchToSurveyTab = switchToSurveyTab;

function switchToSurveyTab() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    document.querySelector('[data-tab="survey"]').classList.add('active');
    document.getElementById('tab-survey').classList.add('active');
}

async function checkSurveyCompletion() {
    if (!window.firebaseDB) {
        console.warn('Firebase not ready for survey check');
        return { 
            pre: false, 
            post: false, 
            preCount: 0, 
            postCount: 0, 
            bothCount: 0,
            teamSize: 0,
            members: [],
            testingMode: false
        };
    }

    try {
        const teamDocRef = window.firebaseDoc(window.firebaseDB, 'teams', teamCode);
        const teamDoc = await window.firebaseGetDoc(teamDocRef);
        
        if (!teamDoc.exists()) {
            console.warn(`Team ${teamCode} not found`);
            return { pre: false, post: false, preCount: 0, postCount: 0, bothCount: 0, teamSize: 0, members: [], testingMode: false };
        }
        
        const teamData = teamDoc.data();
        const teamSize = teamData.teamSize || 0;
        const testingMode = teamData.testingMode;
        console.log(`🔍 Testing mode value for team ${teamCode}:`, testingMode, `(type: ${typeof testingMode})`);
		
        if (testingMode && testingMode !== false && testingMode !== 'false' && testingMode !== 0) {
            console.log(`🧪 Team ${teamCode} is in testing mode - bypassing survey checks`);
            return {
                pre: true,
                post: true,
                preCount: teamSize,
                postCount: teamSize,
                bothCount: teamSize,
                teamSize: teamSize,
                members: [],
                testingMode: true
            };
        }
        
        const surveysRef = window.firebaseCollection(window.firebaseDB, 'surveys');
        const querySnapshot = await window.firebaseGetDocs(surveysRef);
        
        const preMembers = new Set();
        const postMembers = new Set();
        const membersWithBoth = new Set();
        
        querySnapshot.forEach((doc) => {
            const docId = doc.id;
            if (docId.startsWith(`${teamCode}_pre_`)) {
                const memberName = docId.replace(`${teamCode}_pre_`, '');
                preMembers.add(memberName);
            }
            
            if (docId.startsWith(`${teamCode}_post_`)) {
                const memberName = docId.replace(`${teamCode}_post_`, '');
                postMembers.add(memberName);
            }
        });

        preMembers.forEach(member => {
            if (postMembers.has(member)) {
                membersWithBoth.add(member);
            }
        });
        
        const bothCount = membersWithBoth.size;
        const meetsRequirement = teamSize > 0 && bothCount >= teamSize;
        
        console.log(`Survey check for ${teamCode}:`);
        console.log(`  Team size: ${teamSize}`);
        console.log(`  Members completed both: ${bothCount}/${teamSize}`);
        console.log(`  Pre-survey: ${preMembers.size}, Post-survey: ${postMembers.size}`);
        console.log(`  Requirement met: ${meetsRequirement}`);
        
        return {
            pre: meetsRequirement,
            post: meetsRequirement,
            preCount: preMembers.size,
            postCount: postMembers.size,
            bothCount: bothCount,
            teamSize: teamSize,
            members: Array.from(membersWithBoth),
            testingMode: false
        };
    } catch (error) {
        console.error('Error checking surveys:', error);
        return { 
            pre: false, 
            post: false, 
            preCount: 0, 
            postCount: 0, 
            bothCount: 0,
            teamSize: 0,
            members: [],
            testingMode: false
        };
    }
}

async function checkLeaderboardUnlocked() {
    if (!window.firebaseDB) return false;
    
    try {
        const docRef = window.firebaseDoc(window.firebaseDB, 'config', 'leaderboard');
        const docSnap = await window.firebaseGetDoc(docRef);
        
        return docSnap.exists() ? (docSnap.data().unlocked || false) : false;
    } catch (error) {
        console.error('Error checking leaderboard status:', error);
        return false;
    }
}

async function updateResultsTabState() {
    const { teamCode, memberName } = StorageManager.getAuth();
    
    if (!memberName || !teamCode || teamCode === 'default') {
        console.error('Member or team info missing!');
        const surveysIncomplete = document.getElementById('surveysIncomplete');
        if (surveysIncomplete) {
            surveysIncomplete.innerHTML = `
                <div class="intro-box" style="text-align: center; padding: 60px 30px;">
                    <div style="font-size: clamp(80px, 20vw, 120px); margin-bottom: 30px;">🔐</div>
                    <h2 style="color: #1a1a2e; font-size: clamp(20px, 5vw, 28px); margin-bottom: 20px;">
                        Απαιτείται Σύνδεση
                    </h2>
                    <a href="team_member_entry.html" 
                       class="btn btn-primary" 
                       style="display: inline-block; text-decoration: none;">
                        🔐 ΣΥΝΔΕΣΗ
                    </a>
                </div>
            `;
            surveysIncomplete.style.display = 'block';
        }
        return;
    }
    
    const surveys = await checkSurveyCompletion();
    
    if (surveys.testingMode) {
        console.log('🧪 Testing mode active - bypassing all survey requirements');
        const surveysIncomplete = document.getElementById('surveysIncomplete');
        const leaderboardLocked = document.getElementById('leaderboardLocked');
        const leaderboardUnlockedDiv = document.getElementById('leaderboardUnlocked');
        
        const leaderboardUnlocked = await checkLeaderboardUnlocked();
        
        if (!leaderboardUnlocked) {
            surveysIncomplete.style.display = 'none';
            leaderboardLocked.style.display = 'block';
            leaderboardUnlockedDiv.style.display = 'none';
        } else {
            surveysIncomplete.style.display = 'none';
            leaderboardLocked.style.display = 'none';
            leaderboardUnlockedDiv.style.display = 'block';
            await loadLeaderboardData();
        }
        return;
    }
    
    const postSurveyDoc = `${teamCode}_post_${memberName}`;
    const postSurveyRef = window.firebaseDoc(window.firebaseDB, 'surveys', postSurveyDoc);
    const postSurveySnap = await window.firebaseGetDoc(postSurveyRef);
    const memberCompletedPost = postSurveySnap.exists();
    const leaderboardUnlocked = await checkLeaderboardUnlocked();
    const surveysIncomplete = document.getElementById('surveysIncomplete');
    const leaderboardLocked = document.getElementById('leaderboardLocked');
    const leaderboardUnlockedDiv = document.getElementById('leaderboardUnlocked');

    if (!memberCompletedPost) {
        surveysIncomplete.innerHTML = `
            <div class="intro-box" style="text-align: center; padding: 60px 30px;">
                <div style="font-size: clamp(80px, 20vw, 120px); margin-bottom: 30px;">🔐</div>
                <h2 style="color: #1a1a2e; font-size: clamp(20px, 5vw, 28px); margin-bottom: 20px;">
                    Ολοκληρώστε Πρώτα την Τελική Έρευνα
                </h2>
                
                <a href="pages/survey.html?team=${teamCode}&member=${encodeURIComponent(memberName)}" 
                   class="btn btn-primary" 
                   style="display: inline-block; text-decoration: none; font-size: clamp(16px, 3.5vw, 18px); padding: clamp(15px, 3vw, 18px) clamp(30px, 6vw, 40px);">
                    📊 ΜΕΤΑΒΑΣΗ ΣΤΗΝ ΤΕΛΙΚΗ ΕΡΕΥΝΑ
                </a>
            </div>
        `;
        surveysIncomplete.style.display = 'block';
        leaderboardLocked.style.display = 'none';
        leaderboardUnlockedDiv.style.display = 'none';
        return;
    }
    
    const preSurveyStatus = document.getElementById('preSurveyStatus');
    const postSurveyStatus = document.getElementById('postSurveyStatus');
    
    if (preSurveyStatus) {
        if (surveys.teamSize === 0) {
            preSurveyStatus.innerHTML = '⚠️ <strong>ΠΡΟΚΑΤΑΡΚΤΙΚΗ ΕΡΕΥΝΑ:</strong> ΜΕΓΕΘΟΣ ΟΜΑΔΑΣ ΔΕΝ ΕΧΕΙ ΟΡΙΣΤΕΙ';
        } else if (surveys.bothCount >= surveys.teamSize) {
            preSurveyStatus.innerHTML = `✅ <strong>ΠΡΟΚΑΤΑΡΚΤΙΚΗ ΕΡΕΥΝΑ:</strong> ΟΛΑ ΤΑ ΜΕΛΗ (${surveys.preCount}/${surveys.teamSize}) ΤΗΝ ΟΛΟΚΛΗΡΩΣΑΝ`;
        } else {
            preSurveyStatus.innerHTML = `⏳ <strong>ΠΡΟΚΑΤΑΡΚΤΙΚΗ ΕΡΕΥΝΑ:</strong> ${surveys.preCount}/${surveys.teamSize} ΜΕΛΗ ΤΗΝ ΟΛΟΚΛΗΡΩΣΑΝ`;
        }
    }
    
    if (postSurveyStatus) {
        if (surveys.teamSize === 0) {
            postSurveyStatus.innerHTML = '⚠️ <strong>ΤΕΛΙΚΗ ΕΡΕΥΝΑ:</strong> ΜΕΓΕΘΟΣ ΟΜΑΔΑΣ ΔΕΝ ΕΧΕΙ ΟΡΙΣΤΕΙ';
        } else if (surveys.bothCount >= surveys.teamSize) {
            postSurveyStatus.innerHTML = `✅ <strong>ΤΕΛΙΚΗ ΕΡΕΥΝΑ:</strong> ΟΛΑ ΤΑ ΜΕΛΗ (${surveys.postCount}/${surveys.teamSize}) ΤΗΝ ΟΛΟΚΛΗΡΩΣΑΝ`;
        } else {
            postSurveyStatus.innerHTML = `⏳ <strong>ΤΕΛΙΚΗ ΕΡΕΥΝΑ:</strong> ${surveys.postCount}/${surveys.teamSize} ΜΕΛΗ ΤΗΝ ΟΛΟΚΛΗΡΩΣΑΝ`;
        }
    }
    
    if (!surveys.pre || !surveys.post) {
        surveysIncomplete.style.display = 'block';
        leaderboardLocked.style.display = 'none';
        leaderboardUnlockedDiv.style.display = 'none';
    } else if (!leaderboardUnlocked) {
        surveysIncomplete.style.display = 'none';
        leaderboardLocked.style.display = 'block';
        leaderboardUnlockedDiv.style.display = 'none';
    } else {
        surveysIncomplete.style.display = 'none';
        leaderboardLocked.style.display = 'none';
        leaderboardUnlockedDiv.style.display = 'block';
        await loadLeaderboardData();
    }
}

function getResultsGrade(percentage) {
    if (percentage >= 90) return { name: 'ΑΡΧΙ-ΝΤΕΤΕΚΤΙΒΣ 🕵️', color: '#00d4ff' };
    if (percentage >= 80) return { name: 'ΑΝΩΤΕΡΟΙ ΑΝΑΚΡΙΤΕΣ 🎖️', color: '#ffd700' };
    if (percentage >= 70) return { name: 'ΝΤΕΤΕΚΤΙΒΣ 🔎', color: '#c0c0c0' };
    if (percentage >= 60) return { name: 'ΑΣΤΥΝΟΜΟΙ 👮', color: '#cd7f32' };
    if (percentage >= 50) return { name: 'ΕΡΕΥΝΗΤΕΣ 📋', color: '#ffcc00' };
    if (percentage >= 40) return { name: 'ΑΣΚΟΥΜΕΝΟΙ 🎓', color: '#28a745' };
    return { name: 'ΝΕΟΣΥΛΛΕΚΤΟΙ 🎯', color: '#6c757d' };
}

async function loadLeaderboardData() {
    try {
        console.log('📊 Loading leaderboard data...');
        
        if (!window.firebaseDB) {
            console.error('Firebase not ready!');
            displayLeaderboardError('Σύνδεση με τη βάση δεδομένων απέτυχε');
            return;
        }
        
        const querySnapshot = await window.firebaseGetDocs(
            window.firebaseCollection(window.firebaseDB, 'teams')
        );
        
        console.log(`Found ${querySnapshot.size} teams in database`);
        
        const teams = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`Team ${doc.id}:`, {
                hasSolution: !!data.solution,
                score: data.solution?.score,
                unlocked: data.unlocked?.length
            });
            
            if (data.solution) {
                teams.push({
                    name: doc.id,
                    ...data
                });
            }
        });

        console.log(`${teams.length} teams have submitted solutions`);

        if (teams.length === 0) {
            displayLeaderboardError('Δεν υπάρχουν ομάδες που έχουν υποβάλει λύση ακόμα!');
            return;
        }

        teams.sort((a, b) => b.solution.score - a.solution.score);

        displayResultsStats(teams);
        displayResultsLeaderboard(teams);

    } catch (error) {
        console.error('Error loading leaderboard:', error);
        displayLeaderboardError(`Σφάλμα φόρτωσης: ${error.message}`);
    }
}

function displayLeaderboardError(message) {
    const tableBody = document.getElementById('resultsTableBody');
    const cardsContainer = document.getElementById('resultsCards');
    
    const errorHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
            <div style="color: #dc3545; font-weight: bold; margin-bottom: 15px; white-space: pre-line;">
                ${message}
            </div>
            <button onclick="loadLeaderboardData()" style="margin-top: 20px; padding: 12px 24px; background: #ff6b00; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                🔄 Δοκιμάστε Ξανά
            </button>
        </div>
    `;
    
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5">${errorHTML}</td></tr>`;
    }
    
    if (cardsContainer) {
        cardsContainer.innerHTML = errorHTML;
    }
}

function formatTime(ms) {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const h = hours;
    const m = minutes % 60;
    const s = seconds % 60;
    
    if (h > 0) return `${h}ω ${m}λ ${s}δ`;
    else if (m > 0) return `${m}λ ${s}δ`;
    else return `${s}δ`;
}

function displayResultsStats(teams) {
    const totalTeams = teams.length;
    const perfectScores = teams.filter(t => {
        const suspects = t.solution.suspects || [];
        return suspects.length === 3 && 
               suspects.includes('konstantinos') && 
               suspects.includes('georgios') && 
               suspects.includes('eleni');
    }).length;
    
    const avgScore = totalTeams > 0 
        ? Math.round(teams.reduce((sum, t) => sum + t.solution.score, 0) / totalTeams)
        : 0;
    
    const avgTime = totalTeams > 0
        ? formatTime(teams.reduce((sum, t) => sum + (t.solution.completionTimeMs || 0), 0) / totalTeams)
        : 'N/A';

    document.getElementById('totalTeams').textContent = totalTeams;
    document.getElementById('perfectScores').textContent = perfectScores;
    document.getElementById('avgScore').textContent = avgScore;
    document.getElementById('avgTime').textContent = avgTime;
}

function displayResultsLeaderboard(teams) {
    const tableBody = document.getElementById('resultsTableBody');
    const cardsContainer = document.getElementById('resultsCards');
    const table = document.getElementById('resultsTable');
    const cards = document.getElementById('resultsCards');
    
    if (!tableBody || !cardsContainer || !table || !cards) {
        console.error('Leaderboard elements not found in DOM!');
        return;
    }
    
    if (teams.length === 0) {
        displayLeaderboardError('Δεν υπάρχουν υποβολές ακόμα');
        return;
    }

    if (window.innerWidth > 768) {
        table.style.display = 'table';
        cards.style.display = 'none';
    } else {
        table.style.display = 'none';
        cards.style.display = 'block';
    }

    tableBody.innerHTML = teams.map((team, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const solution = team.solution;
        
        const maxScore = solution.maxScore || 140;
        const percentage = Math.round((solution.score / maxScore) * 100);
        const grade = getResultsGrade(percentage);
        const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;

        const isCurrentTeam = team.name === teamCode;
        const rowClass = isCurrentTeam ? 'current-team-row' : '';

        return `
            <tr class="${rowClass}">
                <td class="leaderboard-rank ${rankClass}">${rankEmoji}</td>
                <td class="leaderboard-team-name">${team.name.toUpperCase()}</td>
                <td class="leaderboard-score">${solution.score}/${maxScore}</td>
                <td style="padding: 12px 10px;">
                    <span class="leaderboard-grade-badge" style="background: ${grade.color}; color: ${percentage >= 50 ? '#000' : '#fff'};">
                        ${grade.name}
                    </span>
                </td>
                <td class="leaderboard-time">${formatTime(solution.completionTimeMs)}</td>
            </tr>
        `;
    }).join('');

    cardsContainer.innerHTML = teams.map((team, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const solution = team.solution;
        
        const maxScore = solution.maxScore || 140;
        const percentage = Math.round((solution.score / maxScore) * 100);
        const grade = getResultsGrade(percentage);
        const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

        const isCurrentTeam = team.name === teamCode;
        const cardClass = isCurrentTeam ? 'current-team' : '';

        return `
            <div class="leaderboard-mobile-card ${cardClass}">
                <div class="leaderboard-card-header">
                    <div class="leaderboard-card-rank ${rankClass}">${rankEmoji}</div>
                    <div class="leaderboard-card-team">${team.name.toUpperCase()}</div>
                    <div class="leaderboard-card-score">${solution.score}/${maxScore}</div>
                </div>
                
                <div class="leaderboard-card-row">
                    <div class="leaderboard-card-label">ΤΙΤΛΟΣ</div>
                    <div class="leaderboard-card-value">
                        <span class="leaderboard-grade-badge" style="background: ${grade.color}; color: ${percentage >= 50 ? '#000' : '#fff'};">
                            ${grade.name}
                        </span>
                    </div>
                </div>
                
                <div class="leaderboard-card-row">
                    <div class="leaderboard-card-label">ΧΡΟΝΟΣ</div>
                    <div class="leaderboard-card-value">${formatTime(solution.completionTimeMs)}</div>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Leaderboard displayed successfully');
}

function setupResultsListener() {
    if (!window.firebaseDB || !window.firebaseOnSnapshot) {
        console.warn('Firebase not ready for results listener');
        setTimeout(setupResultsListener, 500);
        return;
    }

    if (resultsUnsubscribe) {
        console.log('🧹 Cleaning up old results listener');
        resultsUnsubscribe();
        resultsUnsubscribe = null;
    }

    try {
        const docRef = window.firebaseDoc(window.firebaseDB, 'config', 'leaderboard');
        
        resultsUnsubscribe = window.firebaseOnSnapshot(docRef, 
            async () => {
                console.log('⚡ Leaderboard status changed, updating results tab...');
                const resultsTab = document.getElementById('tab-results');
                if (resultsTab && resultsTab.classList.contains('active')) {
                    await updateResultsTabState();
                }
            },
            (error) => {
                console.error('❌ Error listening to leaderboard status:', error);
            }
        );

        console.log('✅ Results tab real-time listener active');
    } catch (error) {
        console.error('❌ Error setting up results listener:', error);
    }
}

function setupAlertListener() {
    if (!window.firebaseDB || !window.firebaseOnSnapshot) {
        console.warn('Firebase not ready for alerts');
        setTimeout(setupAlertListener, 1000);
        return;
    }
    
    if (alertsUnsubscribe) {
        console.log('🧹 Cleaning up old alerts listener');
        alertsUnsubscribe();
        alertsUnsubscribe = null;
    }
    
    try {
        const alertsRef = window.firebaseCollection(window.firebaseDB, 'alerts');
        
        alertsUnsubscribe = window.firebaseOnSnapshot(alertsRef,
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const alert = change.doc.data();
                        
                        if (alert.targetTeam === 'all' || alert.targetTeam === teamCode) {
                            if (!alert.read) {
                                showAlert(alert.message, change.doc.id);
                            }
                        }
                    }
                });
            },
            (error) => {
                console.error('❌ Error listening to alerts:', error);
            }
        );
        
        console.log('✅ Alert listener active for team:', teamCode);
    } catch (error) {
        console.error('❌ Error setting up alert listener:', error);
    }
}

function showAlert(message, alertId) {
    const notification = document.getElementById('alertNotification');
    const overlay = document.getElementById('alertOverlay');
    const messageContent = document.getElementById('alertMessageContent');
    
    messageContent.textContent = message;
    
    overlay.style.display = 'block';
    notification.style.display = 'block';
    
    notification.dataset.alertId = alertId;
    
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVajk7adaFQxKouHvumoiBTeP1PPRgzQFI3fH8NSMPwoVYbfo66tXFgxIoOLyu2sjBzKK0fPSgzUGImzA6+ScSg0OWKjl7qhbFgxKo+LvvWwjBjmO1fPQgTMFI3jH8NOOQAoVYbjp66tVFgtIpODxvGwiBlmH0PPUgjQHHm3B7+SbSg0PVqnl76hbFQxKpOPvwGwjBzmK0vPRgTMFJXfH8NSNQAoUYbjq66tYFwxIpODxvWwiBzaJ0fPThDQGHmzA6+ObSg0PV6jk7qhbFQxKpOHvwGwhBzaM0/PRgTMGI3fH8NONPwoUYbjq66tZFgtIpODxvWwiBjiK0vLSgzUGH23B6+ObTAwOWKjl76dcFQxKo+HvwGwiBzmL0fPShDUGI3fH8NOOQAoUYbfp66tZFgtIpN/xvGwiBjiJ0vLSgzUGH23A6+ObTAwOWKfk76dbFgxLpODvv2wiBzmM0/PRgzMGI3fH79ONPwoVYrjp66tZFgtFpODxvGwiBjiJ0vLSgzUGH23A6+ObTAwOWKjk76dcFQxLpODvv2wiBzmM0/PRgjMGJHbH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23A6+ObTAwOWKjk76dcFQxLpODvv2wiBzmM0vPRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGwiBjiJ0vLSgzUGH23B6+OaTAwOWKjk76dbFgxMpODvv2wiBzmM0/PRgjMGJHfH79CNQAoVYrjp66tYFgtFpODxvGw');
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
        console.log('Could not play notification sound:', e);
    }
}

window.closeAlert = async function() {
    const notification = document.getElementById('alertNotification');
    const overlay = document.getElementById('alertOverlay');
    const alertId = notification.dataset.alertId;
    
    if (alertId && window.firebaseDB) {
        try {
            const alertRef = window.firebaseDoc(window.firebaseDB, 'alerts', alertId);
            await window.firebaseSetDoc(alertRef, { read: true }, { merge: true });
        } catch (error) {
            console.error('Error marking alert as read:', error);
        }
    }
    
    notification.style.display = 'none';
    overlay.style.display = 'none';
};

function initTabsWithResults() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
            if (targetTab === 'results') {
                await updateResultsTabState();
            }
        });
    });
}

let activityTimeout;

function trackActivity() {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
        StorageManager.syncSessionToFirebase();
    }, 30000);
}

['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, trackActivity, { passive: true });
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && StorageManager.isSessionActive()) {
        StorageManager.syncSessionToFirebase();
    }
});

window.addEventListener('beforeunload', () => {
    const { teamCode, memberName } = StorageManager.getAuth();
    if (!teamCode || !memberName || !window.firebaseDB) return;
    
    try {
        const docRef = window.firebaseDoc(
            window.firebaseDB, 
            'activeSessions', 
            `${teamCode}_${memberName}`
        );
        
        window.firebaseSetDoc(docRef, {
            lastActive: new Date().toISOString(),
            sessionEnd: true
        }, { merge: true });
    } catch (error) {
        console.warn('Could not sync session on unload:', error);
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Initializing tabs...');
    initTabsWithResults();
    console.log('✅ Tabs initialized');

    function checkFirestoreConnection() {
        if (!window.firebaseDB) return false;
        
        const testRef = window.firebaseDoc(window.firebaseDB, 'config', 'test');
        window.firebaseGetDoc(testRef)
            .then(() => {
                console.log('🟢 Firestore connection active');
            })
            .catch((error) => {
                console.error('🔴 Firestore connection failed:', error);
                alert('⚠️ Connection issues - Your progress may not save!');
            });
    }

    setInterval(checkFirestoreConnection, 30000);
    
    const urlParams = new URLSearchParams(window.location.search);
    const requestedTab = urlParams.get('tab');
    if (requestedTab) {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        const targetButton = document.querySelector(`[data-tab="${requestedTab}"]`);
        const targetPane = document.getElementById(`tab-${requestedTab}`);
        if (targetButton && targetPane) {
            targetButton.classList.add('active');
            targetPane.classList.add('active');
        }
    }
    if (!StorageManager.isAuthenticated()) {
        console.warn('⚠️ Not authenticated, redirecting to member entry...');
		window.location.href = 'pages/team_entry.html';
        return;
    }
    
    const { teamCode: authTeamCode, memberName } = StorageManager.getAuth();
    if (authTeamCode) {
        teamCode = authTeamCode;
    }
    
    console.log(`✅ Authenticated as ${memberName} in team ${teamCode}`);
    await StorageManager.syncSessionToFirebase();

    try {
        const teamData = await getTeamData();
        if (!teamData.unlocked) {
            console.warn(`⚠️ Team ${teamCode} has no unlock data, initializing empty array`);
            teamData.unlocked = [];
        }
        
        console.log(`✅ Team ${teamCode} loaded successfully`);
    } catch (error) {
        console.error('Error checking/creating team:', error);
    }

    try {
        if (typeof SuspectsModule !== 'undefined') {
            SuspectsModule.renderSuspects('suspectsContainer');
        } else {
            console.error('SuspectsModule not loaded! Make sure suspects.js is included before this script.');
        }
        
        renderEvidence();
        const teamData = await getTeamData();
        await updateProgress(teamData);
        await initSolutionTab(teamData);
        
    } catch (error) {
        console.error('Error during initialization:', error);
        alert('Σφάλμα φόρτωσης! Παρακαλώ ανανεώστε τη σελίδα.');
    }

    setInterval(async () => {
        const solutionTab = document.getElementById('tab-solution');
        if (solutionTab && solutionTab.classList.contains('active')) {
            const teamData = await getTeamData();
            const solutionForm = document.getElementById('solutionForm');
            if (teamData.solution && solutionForm && solutionForm.style.display !== 'none') {
                console.log('Solution detected from another source, refreshing display...');
                await initSolutionTab(teamData);
            }
        }
    }, 5000);

let pollingInterval = null;
let isFirestoreActive = false;

function startPolling() {
    if (pollingInterval) return;
    console.log('📡 Starting polling mode (every 3 seconds)');
    pollingInterval = setInterval(checkForUpdates, 3000);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log('🛑 Polling stopped');
    }
}

function setupRealtimeListener() {
    if (!window.firebaseDB || !window.firebaseOnSnapshot) {
        console.warn('Firebase not ready, falling back to polling');
        startPolling();
        return;
    }
    
    if (firestoreUnsubscribe) {
        console.log('🧹 Cleaning up old Firestore listener');
        firestoreUnsubscribe();
        firestoreUnsubscribe = null;
    }
    
    try {
        const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamCode);
        
        firestoreUnsubscribe = window.firebaseOnSnapshot(docRef, 
            async (doc) => {
                if (doc.exists()) {
                    const firebaseData = doc.data();
                    console.log('⚡ Real-time update received for team:', teamCode);
                    console.log('📦 Firebase data testingMode:', firebaseData.testingMode, '(type:', typeof firebaseData.testingMode, ')');
                    
                    isFirestoreActive = true;
                    stopPolling();
                    const dataToSave = {
                        ...firebaseData,
                        testingMode: firebaseData.testingMode !== undefined ? firebaseData.testingMode : false
                    };
                    
                    localStorage.setItem(getStorageKey(), JSON.stringify(dataToSave));
                    renderEvidence();
                    await updateProgress(dataToSave);
                    
                    const solutionTab = document.getElementById('tab-solution');
                    if (solutionTab && solutionTab.classList.contains('active')) {
                        await initSolutionTab(dataToSave);
                    }
                }
            }, 
            (error) => {
                console.error('❌ Real-time listener error:', error);
                isFirestoreActive = false;
                console.log('📡 Falling back to polling mode');
                startPolling();
            }
        );
        
        console.log('✅ Real-time listener active for team:', teamCode);
    } catch (error) {
        console.error('❌ Error setting up real-time listener:', error);
        startPolling();
    }
}

    function startPolling() {
        if (pollingInterval) {
            console.log('⚠️ Polling already active');
            return;
        }
        
        console.log('📡 Starting polling mode (every 3 seconds)');
        pollingInterval = setInterval(checkForUpdates, 3000);
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
            console.log('🛑 Polling stopped');
        }
    }

    async function checkForUpdates() {
        if (!window.firebaseDB) return;
        
        try {
            const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamCode);
            const docSnap = await window.firebaseGetDoc(docRef);
            
            if (docSnap.exists()) {
                const firebaseData = docSnap.data();
                const localData = await getTeamData();
                
                if (firebaseData.lastUpdate && 
                    (!localData.lastUpdate || firebaseData.lastUpdate > localData.lastUpdate)) {
                    
                    console.log('🔄 Update detected via polling');
                    localStorage.setItem(getStorageKey(), JSON.stringify(firebaseData));
                    renderEvidence();
                    await updateProgress(firebaseData);
                }
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

async function initializeAllListeners() {
    if (!window.firebaseDB) {
        setTimeout(initializeAllListeners, 500);
        return;
    }
    
    console.log('🔄 Initializing all listeners...');
    
    await Promise.allSettled([
        setupRealtimeListener(),
        setupResultsListener(),
        setupAlertListener()
    ]);
    
    console.log('✅ All listeners initialized');
}

setTimeout(initializeAllListeners, 500);
});

window.addEventListener('resize', () => {
    const table = document.getElementById('resultsTable');
    const cards = document.getElementById('resultsCards');
    
    if (table && cards) {
        if (window.innerWidth > 768) {
            table.style.display = 'table';
            cards.style.display = 'none';
        } else {
            table.style.display = 'none';
            cards.style.display = 'block';
        }
    }
});

window.addEventListener('beforeunload', () => {
    console.log('🧹 Cleaning up all listeners before page unload...');
    
    stopTimer();
    stopPolling();
    
    if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
        firestoreUnsubscribe = null;
    }
    
    if (resultsUnsubscribe) {
        resultsUnsubscribe();
        resultsUnsubscribe = null;
    }
    
    if (alertsUnsubscribe) {
        alertsUnsubscribe();
        alertsUnsubscribe = null;
    }
    
    console.log('✅ All listeners cleaned up');
});

window.addEventListener('online', () => {
    console.log('🟢 Back online');
    if (!isFirestoreActive) {
        stopPolling();
        initializeAllListeners();
    }
});

window.addEventListener('offline', () => {
    console.log('🔴 Offline - Some features may not work');
    alert('⚠️ You are offline. Your progress may not save.');
});