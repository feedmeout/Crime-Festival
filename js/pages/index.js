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
		page: 'evidence/TEK1_AR.html',
		critical: true
	},
	{
		id: '2',
		name: 'Κρυστάλλινα Ποτήρια',
		subtitle: 'Κρυστάλλινα Ποτήρια',
		icon: '🥃',
		description: '<strong>Τοποθεσία:</strong> Γραφείο Δημητρίου<br><strong>Περιεχόμενα:</strong> Ίχνη ουίσκι και κυανίου σε ΕΝΑ ποτήρι μόνο<br><strong>Αποτυπώματα:</strong> Δημητρίου (και τα δύο), Αναγνώστου (το ένα χωρίς κυάνιο)<br>',
		page: 'evidence/TEK2_AR.html',
		critical: true
	},
	{
		id: '3',
		name: 'Κινητό Δημητρίου',
		subtitle: 'Κινητό Δημητρίου',
		icon: '📱',
		description: '<strong>SMS 20:45:</strong> «Θα τελειώσει απόψε»<br><strong>Προπληρωμένη κάρτα</strong> - Αγορά: Περίπτερο Σταδίου, 19/09, 14:30<br><strong>Τοποθεσία:</strong> Cell tower σε ακτίνα 250m από κτίριο<br><strong>CCTV περιπτέρου:</strong> Άτομο με κουκούλα, ύψος ~165-175cm, δεν φαίνεται πρόσωπο',
		page: 'evidence/TEK3_AR.html',
		critical: false,
		threat: true
	},
	{
		id: '4',
		name: 'Email Αυτοκτονίας',
		subtitle: 'Email «Αυτοκτονίας»',
		icon: '📧',
		description: '<strong>IP:</strong> 192.168.1.23 - 7ος όροφος (κοινόχρηστος υπολογιστής αίθουσας συσκέψεων)<br><strong>Πρόσβαση:</strong> Χωρίς κωδικό - ανοιχτή συνεδρία<br><strong>Browser History:</strong><br>• 18:15 - Σύνδεση Αναγνώστου (email check)<br>• 21:15 - Άγνωστος χρήστης (10 λεπτά σύνδεση)<br>• 21:25 - Αποστολή email «αυτοκτονίας»',
		page: 'evidence/TEK4_AR.html',
		critical: false,
		forgery: true
	},
    {
        id: '5',
        name: 'Ιατρική Γνωμάτευση',
        subtitle: 'Ιατρική Γνωμάτευση (Κρυφή)',
        icon: '🥼',
        description: '<strong>Διάγνωση:</strong> Καρκίνος παγκρέατος σταδίου IV<br><strong>Ημερομηνία:</strong> 28/08/2025<br><strong>Πρόγνωση:</strong> 2-3 μήνες ζωής<br><strong>Γιατρός:</strong> Δρ. Σταυρίδης',
        page: 'evidence/TEK5_AR.html',
        critical: false,
        secret: true
    },
    {
        id: '6',
        name: 'Γάντια Λάτεξ',
        subtitle: 'Ίχνη Γαντιών Λάτεξ',
        icon: '🧤',
        description: '<strong>Τοποθεσία:</strong> Πόμολο πόρτας (εσωτερικά)<br><strong>Τύπος:</strong> Γάντια ιατρικού τύπου<br><strong>Πρόσβαση:</strong> Όλο το προσωπικό',
        page: 'evidence/TEK6_AR.html',
        critical: false,
        clue: true
    },
	{
		id: '7',
		name: 'Χειρόγραφο Σημείωμα',
		subtitle: 'Χειρόγραφο Σημείωμα',
		icon: '✍️',
		description: '<strong>Κείμενο:</strong> «Συγχώρεσέ με Μ.»<br><strong>Ανάλυση:</strong> Προσπάθεια μίμησης γραφικού χαρακτήρα Δημητρίου (68% ταύτιση, πίεση γραφής ασυνεπής με αυθεντικά δείγματα)',
		page: 'evidence/TEK7_AR.html',
		critical: false,
		forgery: true
	},
    {
        id: '8',
        name: 'Φάκελος Εμπιστευτικό',
        subtitle: 'Φάκελος «ΕΜΠΙΣΤΕΥΤΙΚΟ»',
        icon: '📂',
        description: '<strong>Περιεχόμενα:</strong><br>• Υποψίες υπεξαίρεσης (Αναγνώστου)<br>• Ερωτικές φωτογραφίες (Μαυρίδη)<br>• Κλοπή χειρογράφων (Νικολάου)<br>• Απλήρωτοι μισθοί (Παπαδοπούλου)<br>• Χρέη (Πετρόπουλος)',
        page: 'evidence/TEK8_AR.html',
        critical: false,
        blackmail: true
    },
	{
		id: '9',
		name: 'Απόδειξη Χημικών',
		subtitle: 'Απόδειξη Αγοράς Χημικών',
		icon: '🧪',
		description: '<strong>Ημερομηνία:</strong> 19/09, 14:30<br><strong>Αγορά:</strong> Κυανιούχο κάλιο 500g από «ΧημικάPlus»<br><strong>Άδεια:</strong> Επαγγελματική άδεια απεντόμωσης εταιρείας<br><strong>Υπογραφή:</strong> Γ. Πετρόπουλος (υπό γραφολογική εξέταση)<br><strong>Προμηθευτής:</strong> «Άνδρας 40-55 ετών»',
		page: 'evidence/TEK9_AR.html',
		critical: true
	},
    {
        id: '10',
        name: 'Κλειδί Χρηματοκιβωτίου',
        subtitle: 'Κλειδί Χρηματοκιβωτίου',
        icon: '🔑',
        description: '<strong>Αποτυπώματα:</strong> Δημητρίου, Αναγνώστου<br><strong>Ίχνη:</strong> Σκόνη ταλκ (από latex γάντια)',
        page: 'evidence/TEK10_AR.html',
        critical: false,
        financial: true
    },
	{
		id: '11',
		name: 'Κάμερες Ασφαλείας',
		subtitle: 'Κάμερες Ασφαλείας',
		icon: '🎥',
		description: '<strong>Απενεργοποίηση:</strong> 20:55-21:42 (διάρκεια: 47 λεπτά)<br><strong>Τετράδιο Συμβάντων:</strong> «20:58 - Τεχνική βλάβη CCTV» - Αναφορά από βάρδια<br><strong>Χειρόγραφο:</strong> ΔΕΝ ταιριάζει απόλυτα με γραφικό χαρακτήρα Πετρόπουλου (υπό ανάλυση)<br><strong>Τεχνικός έλεγχος:</strong> Μη εξουσιοδοτημένη πρόσβαση στο σύστημα 20:53',
		page: 'evidence/TEK11_AR.html',
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
        window.location.href = "pages/team_entry.html';
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
    let score = 0;
    let breakdown = [];
    
    if (selectedSuspects.length === 0) {
        return {
            score: 0,
            breakdown: [
                'ERROR:Δεν επιλέξατε κανέναν ύποπτο ή αυτοκτονία'
            ],
            maxScore: 140,
            correctCount: 0
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
            correctCount: 0
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
                'INFO:Η δολοφονία σκηνοθετήθηκε να μοιάζει με αυτοκτονία.'
            ],
            maxScore: 140,
            correctCount: 0
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
    
	breakdown.push(`HEADER:🧩 ΒΑΣΙΚΗ ΕΚΤΙΜΗΣΗ`);
	breakdown.push('');
	score += SCORING.murder_diagnosis;
	breakdown.push(`SUCCESS:Σωστή Διάγνωση: ΔΟΛΟΦΟΝΙΑ (+${SCORING.murder_diagnosis} πόντοι)`);
	breakdown.push('ITEM:Αναγνωρίσατε ότι δεν ήταν αυτοκτονία');
    breakdown.push('');
    breakdown.push('HEADER:👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ');
    breakdown.push('');
    
    if (correctCount >= 2) {
        score += SCORING.cooperation;
        breakdown.push(`SUCCESS:Εντοπισμός Συνεργασίας (+${SCORING.cooperation} πόντοι)`);
        breakdown.push('ITEM:Καταλάβατε ότι ήταν ομαδική προσπάθεια');
        breakdown.push('');
    }

    if (correctCount === 3 && selectedSuspects.length === 3) {
        score += SCORING.perpetrator * 3;
        score += SCORING.perfect_solution_bonus;
        breakdown.push(`SUCCESS:ΤΕΛΕΙΑ ΑΝΑΛΥΣΗ! (+${SCORING.perpetrator * 3 + SCORING.perfect_solution_bonus} πόντοι)`);
        breakdown.push('ITEM:Εντοπίσατε και τους 3 συνεργούς');
        breakdown.push('');
        breakdown.push('ITEM:✓ Αναγνώστου (Μαστρομυαλός - έριξε το κυάνιο στο ποτήρι)');
        breakdown.push('ITEM:✓ Πετρόπουλος (Προμηθευτής - αγόρασε κυάνιο, απενεργοποίησε κάμερες)');
        breakdown.push('ITEM:✓ Μαυρίδη (Συγκάλυψη - πλαστό email & χειρόγραφο σημείωμα)');
    } else {
        if (correctCount > 0) {
            const points = correctCount * SCORING.perpetrator;
            score += points;
            breakdown.push(`SUCCESS:Εντοπίσατε ${correctCount}/3 Δράστες (+${points} πόντοι)`);
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
        } else {
            breakdown.push(`ERROR:Δεν εντοπίσατε κανέναν από τους πραγματικούς δράστες (0 πόντοι)`);
        }
        
        if (correctCount >= 2 && correctCount < 3) {
            score += SCORING.evidence_use;
            breakdown.push('');
            breakdown.push(`SUCCESS:Καλή Χρήση Τεκμηρίων (+${SCORING.evidence_use} πόντοι)`);
        }
    }

    if (wrongSuspects.length === 0 && correctCount > 0 && correctCount < 3) {
        const precisionBonus = correctCount * 15;
        score += precisionBonus;
        breakdown.push('');
        breakdown.push(`SUCCESS:Bonus Ακρίβειας (+ ${precisionBonus} πόντοι)`);
        breakdown.push(`ITEM:Όλες οι επιλογές σας ήταν σωστές - χάσατε ${3 - correctCount} δράστη`);
    }
    
    breakdown.push('');
    
    if (correctCount >= 2) {
        breakdown.push('HEADER:⚡ BONUSES ΑΠΟΔΟΤΙΚΟΤΗΤΑΣ');
        breakdown.push('');
        
        let hasBonus = false;
        
        if (totalTimeMs) {
            const minutes = totalTimeMs / 60000;
            if (minutes < 30) {
                score += SCORING.time_under_30;
                breakdown.push(`SUCCESS:Ταχύτατη Λύση (+${SCORING.time_under_30} πόντοι)`);
                breakdown.push('ITEM:Χρόνος: <30 λεπτά');
                hasBonus = true;
            } else if (minutes < 45) {
                score += SCORING.time_30_45;
                breakdown.push(`SUCCESS:Γρήγορη Λύση (+${SCORING.time_30_45} πόντοι)`);
                breakdown.push('ITEM:Χρόνος: 30-45 λεπτά');
                hasBonus = true;
            } else if (minutes < 60) {
                score += SCORING.time_45_60;
                breakdown.push(`SUCCESS:Καλός Χρόνος (+${SCORING.time_45_60} πόντοι)`);
                breakdown.push('ITEM:Χρόνος: 45-60 λεπτά');
                hasBonus = true;
            }
        }

		if (promptCount !== null && promptCount !== undefined) {
			if (promptCount <= 5) {
				score += SCORING.prompts_1_5;
				breakdown.push(`SUCCESS:Ελάχιστη Χρήση ΤΝ (+${SCORING.prompts_1_5} πόντοι)`);
				breakdown.push('ITEM:Prompts AI: ≤5');
				hasBonus = true;
			} else if (promptCount <= 10) {
				score += SCORING.prompts_6_10;
				breakdown.push(`SUCCESS:Μέτρια Χρήση ΤΝ (+${SCORING.prompts_6_10} πόντοι)`);
				breakdown.push('ITEM:Prompts AI: 6-10');
				hasBonus = true;
			} else if (promptCount <= 15) {
				score += SCORING.prompts_11_15;
				breakdown.push(`SUCCESS:Συχνή Χρήση ΤΝ (+${SCORING.prompts_11_15} πόντοι)`);
				breakdown.push('ITEM:Prompts AI: 11-15');
				hasBonus = true;
			} else {
				breakdown.push(`INFO:Υπερβολική Χρήση ΤΝ (0 πόντοι)`);
				breakdown.push(`ITEM:Prompts AI: ${promptCount} (>15)`);
				hasBonus = true;
			}
		}
        
        if (!hasBonus) {
            breakdown.push('INFO:Κανένα bonus αποδοτικότητας');
        }
        
        breakdown.push('');
    }
    
    if (wrongSuspects.length > 0) {
        breakdown.push(`PENALTY:Κατηγορήσατε Αθώους (${wrongSuspects.length})`);
        breakdown.push('');
        wrongSuspects.forEach(name => {
            breakdown.push(`ITEM:→ ${name}`);
            if (name === 'Παπαδοπούλου Μαρία') {
                breakdown.push('ITEM:  • Σιδηρένιο άλλοθι (γιατρός 18:30-19:30 & δείπνο με αδελφή 19:45-22:00)');
                breakdown.push('ITEM:  • Τα μόνα αποτυπώματά της στο μπουκάλι ήταν παλιά');
            } else if (name === 'Νικολάου Αλεξάνδρα') {
                breakdown.push('ITEM:  • Έφυγε 18:30, πριν τη δολοφονία');
                breakdown.push('ITEM:  • Δεν είχε πρόσβαση σε κυάνιο');
            }
        });
        
        const originalScore = score;
        let multiplier = 1.0;
        if (wrongSuspects.length === 1) multiplier = 0.5;
        else if (wrongSuspects.length === 2) multiplier = 0.2;
        else multiplier = 0.05;
        
        score = Math.floor(score * multiplier);
        const penalty = originalScore - score;
        breakdown.push('');
        breakdown.push(`PENALTY:Ποινή Λανθασμένων Κατηγοριών: - ${penalty} πόντοι`);
        breakdown.push('');
    }
        
    if (missedSuspects.length > 0) {
        breakdown.push('PENALTY:Χάσατε Πραγματικούς Δράστες');
        breakdown.push('');
        const missedPenalty = missedSuspects.length * 20;
        score -= missedPenalty;
        
        missedSuspects.forEach(name => {
            breakdown.push(`ITEM:→ ${name}`);
            if (name === 'Αναγνώστου Κωνσταντίνος') {
                breakdown.push('ITEM:  • Αποτυπώματά του στο μπουκάλι (λαιμός) και κλειδί χρηματοκιβωτίου');
                breakdown.push('ITEM:  • Υπεξαίρεση €500.000 σε Ελβετία - το κίνητρο');
                breakdown.push('ITEM:  • Ο μαστρομυαλός - έριξε το κυάνιο στο ποτήρι');
            } else if (name === 'Πετρόπουλος Γεώργιος') {
                breakdown.push('ITEM:  • Αγόρασε κυάνιο 19/09 (ΤΕΚ #9 - Απόδειξη)');
                breakdown.push('ITEM:  • Απενεργοποίησε κάμερες 20:55 (ΤΕΚ #11)');
                breakdown.push('ITEM:  • Χρέη €60.000 - το κίνητρο');
            } else if (name === 'Μαυρίδη Ελένη') {
                breakdown.push('ITEM:  • Έστειλε πλαστό email «αυτοκτονίας» (ΤΕΚ #4)');
                breakdown.push('ITEM:  • Πλαστογράφησε χειρόγραφο σημείωμα (ΤΕΚ #7)');
                breakdown.push('ITEM:  • Εκβιασμός €100.000 για ερωτικές φωτογραφίες');
            }
        });
        
        breakdown.push('');
        breakdown.push(`PENALTY:Ποινή Ελλιπούς Ανάλυσης: - ${missedPenalty} πόντοι`);
    }
    
    breakdown.push('');
    breakdown.push(`INFO:🏁 ΤΕΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ: ${Math.max(0, score)}/${140}`);
    
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
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px 30px; border-radius: 12px; margin: 20px 0; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(40,167,69,0.3); flex-wrap: wrap; gap: 15px;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 40px;"></div>
                <div>
                    <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">ΛΥΣΗ ΥΠΟΒΛΗΘΗΚΕ ΕΠΙΤΥΧΩΣ!</div>
                    <div style="font-size: 14px; opacity: 0.9;">📅 ${new Date().toLocaleString('el-GR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 3px solid #ff6b00; padding: 0; border-radius: 15px; margin-top: 20px; box-shadow: 0 10px 40px rgba(255, 107, 0, 0.4); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #ff6b00 0%, #ff8800 100%); padding: 25px; text-align: center; position: relative;">
                <div style="font-size: 56px; margin-bottom: 10px; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));">🔒</div>
                <h3 style="color: #000; font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 2px; text-shadow: 1px 1px 2px rgba(255,255,255,0.3);">
                    Η ΑΛΗΘΕΙΑ ΘΑ ΑΠΟΚΑΛΥΦΘΕΙ ΣΥΝΤΟΜΑ...
                </h3>
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 100%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px); pointer-events: none;"></div>
            </div>
            <div style="padding: 30px;">
                <div style="background: linear-gradient(135deg, rgba(255, 107, 0, 0.2) 0%, rgba(255, 136, 0, 0.2) 100%); border: 2px solid #ff6b00; border-radius: 12px; padding: 20px; margin-bottom: 30px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -20px; right: -20px; font-size: 100px; opacity: 0.1;">⚠️</div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 28px;">💡</span>
                            <span style="color: #ff6b00; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">ΠΡΟΣΟΧΗ!</span>
                        </div>
                        <p style="color: #fff; font-size: 14px; margin: 0; text-align: center; line-height: 1.7; font-weight: 600;">
                            ΚΡΑΤΗΣΤΕ ΤΗ ΛΥΣΗ ΣΑΣ ΜΥΣΤΙΚΗ!<br>
                            ΜΗΝ ΜΟΙΡΑΣΤΕΙΤΕ ΠΛΗΡΟΦΟΡΙΕΣ ΜΕ ΑΛΛΕΣ ΟΜΑΔΕΣ ΜΕΧΡΙ ΤΗΝ ΕΠΙΣΗΜΗ ΛΗΞΗ ΤΟΥ ΔΙΑΓΩΝΙΣΜΟΥ!
                        </p>
                    </div>
                </div>

                <div style="background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 25px; backdrop-filter: blur(5px);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="display: inline-flex; align-items: center; gap: 10px; background: rgba(255, 107, 0, 0.2); padding: 10px 20px; border-radius: 25px; border: 1px solid rgba(255, 107, 0, 0.4);">
                            <span style="font-size: 20px;">🔓</span>
                            <span style="color: #ff6b00; font-weight: bold; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Έχετε τον κωδικό πρόσβασης;</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: stretch; max-width: 500px; margin: 0 auto;">
                        <input type="password" id="solutionPassword" placeholder="Εισάγετε κωδικό..." 
                               style="flex: 1; min-width: 200px; padding: 15px 20px; border: 2px solid rgba(255, 107, 0, 0.5); background: rgba(255, 255, 255, 0.9); border-radius: 10px; font-size: 16px; font-weight: 500; transition: all 0.3s ease; outline: none; color: #1a1a2e;"
                               onfocus="this.style.borderColor='#ff6b00'; this.style.background='#fff'; this.style.boxShadow='0 0 20px rgba(255, 107, 0, 0.3)'"
                               onblur="this.style.borderColor='rgba(255, 107, 0, 0.5)'; this.style.background='rgba(255, 255, 255, 0.9)'; this.style.boxShadow='none'">
                        <button onclick="revealSolution()" 
                                style="padding: 15px 35px; background: linear-gradient(135deg, #ff6b00 0%, #ff8800 100%); color: #000; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4); transition: all 0.3s ease; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px;"
                                onmouseover="this.style.transform='translateY(-3px) scale(1.05)'; this.style.boxShadow='0 6px 25px rgba(255, 107, 0, 0.6)'"
                                onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 4px 15px rgba(255, 107, 0, 0.4)'">
                            🔓 ΑΠΟΚΑΛΥΨΗ
                        </button>
                    </div>
                    
                    <p style="color: rgba(255, 255, 255, 0.6); font-size: 12px; text-align: center; margin: 15px 0 0 0; font-style: italic;">
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
				'ITEM:  • Αποτυπώματά του στο μπουκάλι (λαιμός) και κλειδί χρηματοκιβωτίου (ΤΕΚ #1, #10)',
				'ITEM:  • Υπεξαίρεση €500.000 σε Ελβετία - το κίνητρο (ΤΕΚ #8)',
				'ITEM:  • Ο εγκέφαλος της επιχείρησης - έριξε το κυάνιο στο ποτήρι',
				'',
				'ITEM:→ Πετρόπουλος Γεώργιος (Προμηθευτής)',
				'ITEM:  • Αγόρασε κυάνιο 19/09 με επαγγελματική άδεια (ΤΕΚ #9)',
				'ITEM:  • Απενεργοποίησε κάμερες ασφαλείας 20:55 (ΤΕΚ #11)',
				'ITEM:  • Χρέη €60.000 - το κίνητρο (ΤΕΚ #8)',
				'',
				'ITEM:→ Μαυρίδη Ελένη (Συγκάλυψη)',
				'ITEM:  • Έστειλε πλαστό email «αυτοκτονίας» από κοινόχρηστο PC (ΤΕΚ #4)',
				'ITEM:  • Πλαστογράφησε χειρόγραφο σημείωμα (ΤΕΚ #7)',
				'ITEM:  • Εκβιασμός €100.000 για ερωτικές φωτογραφίες - το κίνητρο (ΤΕΚ #8)',
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
        breakdown.push('HEADER:⚡ BONUSES ΑΠΟΔΟΤΙΚΟΤΗΤΑΣ');
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
                breakdown.push('ITEM:Prompts AI: ≤5');
                hasEfficiencyBonus = true;
            } else if (promptCount <= 10) {
                score += SCORING.prompts_6_10;
                breakdown.push(`SUCCESS:Μέτρια Χρήση AI (+${SCORING.prompts_6_10} πόντοι)`);
                breakdown.push('ITEM:Prompts AI: 6-10');
                hasEfficiencyBonus = true;
            } else if (promptCount <= 15) {
                score += SCORING.prompts_11_15;
                breakdown.push(`SUCCESS:Συχνή Χρήση AI (+${SCORING.prompts_11_15} πόντοι)`);
                breakdown.push('ITEM:Prompts AI: 11-15');
                hasEfficiencyBonus = true;
            } else {
                breakdown.push(`INFO:Υπερβολική Χρήση AI (0 πόντοι)`);
                breakdown.push(`ITEM:Prompts AI: ${promptCount}`);
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
                breakdown.push('ITEM:  • Σιδηρένιο άλλοθι (γιατρός 18:30-19:30 & δείπνο 19:45-22:00)');
                breakdown.push('ITEM:  • Τα αποτυπώματά της στο μπουκάλι ήταν παλιά');
            } else if (name === 'Νικολάου Αλεξάνδρα') {
                breakdown.push('ITEM:  • Έφυγε 18:30, πριν τη δολοφονία');
                breakdown.push('ITEM:  • Δεν είχε πρόσβαση σε κυάνιο');
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
                breakdown.push('ITEM:  • Αποτυπώματά του στο μπουκάλι και κλειδί χρηματοκιβωτίου');
                breakdown.push('ITEM:  • Υπεξαίρεση €500.000 - το κίνητρο');
                breakdown.push('ITEM:  • Ο μαστρομυαλός που έριξε το κυάνιο');
            } else if (name === 'Πετρόπουλος Γεώργιος') {
                breakdown.push('ITEM:  • Αγόρασε κυάνιο 19/09 (ΤΕΚ #9)');
                breakdown.push('ITEM:  • Απενεργοποίησε κάμερες 20:55 (ΤΕΚ #11)');
                breakdown.push('ITEM:  • Χρέη €60.000 - το κίνητρο');
            } else if (name === 'Μαυρίδη Ελένη') {
                breakdown.push('ITEM:  • Έστειλε πλαστό email «αυτοκτονίας» (ΤΕΚ #4)');
                breakdown.push('ITEM:  • Πλαστογράφησε χειρόγραφο σημείωμα (ΤΕΚ #7)');
                breakdown.push('ITEM:  • Εκβιασμός €100.000 για ερωτικές φωτογραφίες');
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
    const hasSuicide = solution.suspects.includes('suicide');
    const hasKiller = solution.suspects.some(s => s !== 'suicide');
    const isContradiction = hasSuicide && hasKiller;
    
    let statusMessage = '';
    let caseStatus = '';
    if (isPerfect) {
        statusMessage = 'ΤΕΛΕΙΑ ΕΚΤΕΛΕΣΗ!';
        caseStatus = 'CASE SOLVED';
    } else if (isContradiction || solution.score === 0) {
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

    const sections = {
        diagnosis: [],
        suspects: [],
        bonuses: [],
        penalties: []
    };

    let currentCategory = null;

    solution.breakdown.forEach(item => {
        if (item.trim() === '') return;
        if (item.includes('ΤΕΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ')) return;
        
        if (item.includes('ΒΑΣΙΚΗ ΕΚΤΙΜΗΣΗ')) {
            currentCategory = 'diagnosis';
        } else if (item.includes('ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ')) {
            currentCategory = 'suspects';
        } else if (item.includes('BONUSES')) {
            currentCategory = 'bonuses';
        } else if (item.startsWith('PENALTY:') || item.startsWith('ERROR:') || item.startsWith('CONTRADICTION:')) {
            currentCategory = 'penalties';
        }
        
        if (currentCategory && !item.startsWith('HEADER:')) {
            let cleanItem = item
                .replace('SUCCESS:', '')
                .replace('PENALTY:', '')
                .replace('ERROR:', '')
                .replace('INFO:', '')
                .replace('ITEM:', '')
                .replace('SUBHEADER:', '')
                .replace('CONTRADICTION:', '')
                .replace(/^→\s*/, '')
                .replace(/^▸\s*/, '')
                .replace(/^•\s*/, '')
                .trim();
            
            if (cleanItem && !item.startsWith('HEADER:')) {
                sections[currentCategory].push({
                    text: cleanItem,
                    type: item.startsWith('SUCCESS:') ? 'success' :
                          item.startsWith('PENALTY:') ? 'penalty' :
                          item.startsWith('ERROR:') ? 'error' :
                          item.startsWith('CONTRADICTION:') ? 'error' :
                          item.startsWith('ITEM:') ? 'detail' :
                          'info'
                });
            }
        }
    });

    resultDiv.innerHTML = `
        <style>
            @keyframes stamped {
                0% { transform: scale(0) rotate(-45deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(-5deg); opacity: 1; }
                100% { transform: scale(1) rotate(-3deg); opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes pinDrop {
                0% { transform: translateY(-100px) rotate(180deg); opacity: 0; }
                60% { transform: translateY(5px) rotate(-10deg); opacity: 1; }
                80% { transform: translateY(-3px) rotate(5deg); }
                100% { transform: translateY(0) rotate(0deg); opacity: 1; }
            }
            
            .case-stamp { animation: stamped 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
            .evidence-card { animation: fadeInUp 0.5s ease-out; opacity: 0; animation-fill-mode: forwards; }
            .evidence-card:nth-child(1) { animation-delay: 0.1s; }
            .evidence-card:nth-child(2) { animation-delay: 0.2s; }
            .evidence-card:nth-child(3) { animation-delay: 0.3s; }
            .evidence-card:nth-child(4) { animation-delay: 0.4s; }
            
            .paper-texture {
                background-color: #fdfcf8;
                background-image: 
                    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 3px),
                    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 3px);
            }

            .pin {
                width: clamp(16px, 4vw, 20px);
                height: clamp(16px, 4vw, 20px);
                background: radial-gradient(circle, #ff4444 0%, #cc0000 100%);
                border-radius: 50% 50% 50% 0%;
                transform: rotate(-45deg);
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                position: absolute;
                top: -10px;
                animation: pinDrop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            @media (max-width: 768px) {
                .case-stamp {
                    transform: rotate(0deg) !important;
                }
                .evidence-card {
                    min-width: 100% !important;
                }
            }
        </style>

        <div style="background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%); border-radius: 0; padding: 0; margin-bottom: clamp(15px, 4vw, 25px); position: relative; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.4); border: 3px solid #ff6b00;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 8px; background: repeating-linear-gradient(90deg, #ff6b00 0px, #ff6b00 40px, #d45500 40px, #d45500 80px); opacity: 0.9;"></div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 8px; background: repeating-linear-gradient(90deg, #ff6b00 0px, #ff6b00 40px, #d45500 40px, #d45500 80px); opacity: 0.9;"></div>
            
            <div style="padding: clamp(20px, 5vw, 30px);">
                <div style="text-align: center; margin-bottom: clamp(15px, 4vw, 20px);">
                    <div style="display: inline-block; border: 3px solid #ff6b00; padding: clamp(6px, 2vw, 8px) clamp(20px, 5vw, 30px); background: rgba(255,107,0,0.1); transform: rotate(-2deg);">
                        <div style="font-size: clamp(10px, 2.5vw, 12px); color: #ff6b00; font-weight: 900; letter-spacing: clamp(2px, 1vw, 4px);">ΕΜΠΙΣΤΕΥΤΙΚΟ</div>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: clamp(20px, 5vw, 25px);">
                    <div style="color: rgba(255,255,255,0.5); font-size: clamp(9px, 2vw, 11px); letter-spacing: clamp(1px, 0.5vw, 2px); margin-bottom: 8px; font-family: monospace;">
                        ΑΝΑΦΟΡΑ ΥΠΟΘΕΣΗΣ #${teamCode.toUpperCase()}
                    </div>
                    <div style="color: white; font-size: clamp(20px, 5vw, 28px); font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
                        ${caseStatus}
                    </div>
                    
                    <div class="case-stamp" style="position: relative; display: inline-block; margin: clamp(8px, 2vw, 10px) 0;">
                        <div style="border: clamp(4px, 1.5vw, 6px) solid ${gradeColor}; padding: clamp(10px, 3vw, 15px) clamp(25px, 7vw, 40px); background: rgba(0,0,0,0.3); transform: rotate(-3deg); display: inline-block;">
                            <div style="font-size: clamp(32px, 10vw, 48px); margin-bottom: 5px;">${gradeEmoji}</div>
                            <div style="font-size: clamp(14px, 4vw, 18px); font-weight: 900; color: ${gradeColor}; letter-spacing: clamp(1px, 0.5vw, 2px);">
                                ${grade}
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.3); border: 2px solid rgba(255,107,0,0.5); border-radius: 8px; padding: clamp(15px, 4vw, 20px); backdrop-filter: blur(10px);">
                    <div style="text-align: center;">
                        <div style="color: rgba(255,255,255,0.6); font-size: clamp(9px, 2.5vw, 11px); text-transform: uppercase; letter-spacing: clamp(1px, 0.5vw, 2px); margin-bottom: 10px;">
                            ${statusMessage}
                        </div>
                        <div style="display: flex; align-items: baseline; justify-content: center; gap: clamp(10px, 3vw, 15px); margin-bottom: 15px; flex-wrap: wrap;">
                            <div style="font-size: clamp(48px, 15vw, 64px); font-weight: 900; color: ${gradeColor}; line-height: 1; font-family: 'Courier New', monospace; text-shadow: 0 0 30px ${gradeColor}80;">
                                ${solution.score}
                            </div>
                            <div style="color: rgba(255,255,255,0.4); font-size: clamp(18px, 5vw, 24px); font-weight: 600;">
                                / ${solution.maxScore}
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); height: clamp(10px, 3vw, 12px); border-radius: 20px; overflow: hidden; position: relative; margin-bottom: 10px;">
                            <div style="position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px);"></div>
                            <div style="background: linear-gradient(90deg, ${gradeColor}, ${gradeColor}DD); height: 100%; width: ${percentage}%; border-radius: 20px; box-shadow: 0 0 20px ${gradeColor}80; transition: width 2s ease-out;"></div>
                        </div>
                        <div style="color: rgba(255,255,255,0.5); font-size: clamp(10px, 2.5vw, 12px); font-weight: 700; font-family: monospace;">
                            ΕΠΙΔΟΣΗ: ${percentage}%
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="background: #3a3a3a; padding: clamp(20px, 5vw, 30px); border-radius: 12px; margin-bottom: clamp(20px, 5vw, 25px); position: relative; box-shadow: inset 0 0 100px rgba(0,0,0,0.5), 0 5px 20px rgba(0,0,0,0.3);">
            <div style="position: absolute; top: 15px; left: 20px; color: rgba(255,255,255,0.3); font-size: clamp(9px, 2vw, 11px); letter-spacing: clamp(1px, 0.5vw, 2px); font-weight: 700;">
                📌 ΣΤΑΤΙΣΤΙΚΑ ΕΡΕΥΝΑΣ
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: clamp(15px, 4vw, 20px); margin-top: 25px;">
                ${solution.completionTimeMs ? `
                <div class="evidence-card" style="position: relative;">
                    <div class="pin" style="left: 50%; margin-left: clamp(-8px, -2vw, -10px);"></div>
                    <div class="paper-texture" style="padding: clamp(15px, 4vw, 20px) clamp(12px, 3vw, 15px); border-radius: 4px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transform: rotate(-2deg); border: 1px solid #ddd;">
                        <div style="text-align: center;">
                            <div style="font-size: clamp(24px, 7vw, 32px); margin-bottom: 8px;">⏱️</div>
                            <div style="font-size: clamp(18px, 5vw, 24px); font-weight: 900; color: #1a1a2e; margin-bottom: 5px; font-family: 'Courier New', monospace;">
                                ${formatElapsedTime(solution.completionTimeMs)}
                            </div>
                            <div style="font-size: clamp(8px, 2vw, 10px); color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                                Χρόνος
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="evidence-card" style="position: relative;">
                    <div class="pin" style="left: 50%; margin-left: clamp(-8px, -2vw, -10px);"></div>
                    <div class="paper-texture" style="padding: clamp(15px, 4vw, 20px) clamp(12px, 3vw, 15px); border-radius: 4px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transform: rotate(1deg); border: 1px solid #ddd;">
                        <div style="text-align: center;">
                            <div style="font-size: clamp(24px, 7vw, 32px); margin-bottom: 8px;">🎯</div>
                            <div style="font-size: clamp(18px, 5vw, 24px); font-weight: 900; color: #1a1a2e; margin-bottom: 5px; font-family: 'Courier New', monospace;">
                                ${solution.promptCount}
                            </div>
                            <div style="font-size: clamp(8px, 2vw, 10px); color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                                Prompts
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="evidence-card" style="position: relative;">
                    <div class="pin" style="left: 50%; margin-left: clamp(-8px, -2vw, -10px);"></div>
                    <div class="paper-texture" style="padding: clamp(15px, 4vw, 20px) clamp(12px, 3vw, 15px); border-radius: 4px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transform: rotate(-1deg); border: 1px solid #ddd;">
                        <div style="text-align: center;">
                            <div style="font-size: clamp(24px, 7vw, 32px); margin-bottom: 8px;">✅</div>
                            <div style="font-size: clamp(18px, 5vw, 24px); font-weight: 900; color: #1a1a2e; margin-bottom: 5px; font-family: 'Courier New', monospace;">
                                ${solution.correctCount}/3
                            </div>
                            <div style="font-size: clamp(8px, 2vw, 10px); color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                                Σωστοί Δράστες
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="paper-texture" style="padding: clamp(20px, 5vw, 30px); border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); border: 2px solid #e0d5c7; position: relative;">
            <div style="border-bottom: 3px double #333; padding-bottom: clamp(12px, 3vw, 15px); margin-bottom: clamp(20px, 5vw, 25px);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <div style="font-size: clamp(9px, 2vw, 11px); color: #666; text-transform: uppercase; letter-spacing: clamp(1px, 0.5vw, 2px); margin-bottom: 5px;">
                            Αστυνομία Αθηνών
                        </div>
                        <div style="font-size: clamp(16px, 4vw, 20px); font-weight: 900; color: #1a1a2e; font-family: 'Georgia', serif;">
                            ΑΝΑΛΥΤΙΚΗ ΕΚΘΕΣΗ
                        </div>
                    </div>
                    <div style="text-align: right; font-family: 'Courier New', monospace; font-size: clamp(9px, 2vw, 11px); color: #666;">
                        <div>ΗΜΕΡ: ${new Date().toLocaleDateString('el-GR')}</div>
                        <div>ΩΡΑ: ${new Date().toLocaleTimeString('el-GR', {hour: '2-digit', minute: '2-digit'})}</div>
                    </div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: clamp(15px, 4vw, 20px);">
                ${sections.diagnosis.length > 0 ? `
                <div style="border-left: 4px solid #2196f3; padding-left: clamp(15px, 4vw, 20px); position: relative;">
                    <div style="position: absolute; left: clamp(-18px, -5vw, -25px); top: -5px; background: #2196f3; color: white; width: clamp(32px, 8vw, 40px); height: clamp(32px, 8vw, 40px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(16px, 4vw, 20px); box-shadow: 0 4px 10px rgba(33,150,243,0.4);">
                        🧩
                    </div>
                    <div style="font-size: clamp(12px, 3vw, 14px); font-weight: 900; color: #0d47a1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: clamp(10px, 3vw, 12px); margin-left: clamp(20px, 5vw, 25px);">
                        ΔΙΑΓΝΩΣΗ ΥΠΟΘΕΣΗΣ
                    </div>
                    <div style="display: flex; flex-direction: column; gap: clamp(8px, 2vw, 10px);">
                        ${sections.diagnosis.map(item => {
                            if (item.type === 'detail') {
                                return `<div style="margin-left: clamp(15px, 4vw, 20px); padding-left: clamp(12px, 3vw, 15px); border-left: 2px dashed #ccc; color: #666; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;">${item.text}</div>`;
                            }
                            return `
                                <div style="background: ${item.type === 'success' ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' : item.type === 'error' ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' : '#f5f5f5'}; 
                                            padding: clamp(10px, 3vw, 12px) clamp(12px, 3vw, 15px); border-radius: 6px; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;
                                            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); font-family: 'Georgia', serif;
                                            border-left: 3px solid ${item.type === 'success' ? '#4caf50' : item.type === 'error' ? '#f44336' : '#2196f3'};">
                                    <span style="color: ${item.type === 'success' ? '#1b5e20' : item.type === 'error' ? '#b71c1c' : '#0d47a1'}; font-weight: 600;">
                                        ${item.type === 'success' ? '✓' : item.type === 'error' ? '✗' : '•'} ${item.text}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                ` : ''}

                ${sections.suspects.length > 0 ? `
                <div style="border-left: 4px solid #ff9800; padding-left: clamp(15px, 4vw, 20px); position: relative;">
                    <div style="position: absolute; left: clamp(-18px, -5vw, -25px); top: -5px; background: #ff9800; color: white; width: clamp(32px, 8vw, 40px); height: clamp(32px, 8vw, 40px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(16px, 4vw, 20px); box-shadow: 0 4px 10px rgba(255,152,0,0.4);">
                        👥
                    </div>
                    <div style="font-size: clamp(12px, 3vw, 14px); font-weight: 900; color: #e65100; text-transform: uppercase; letter-spacing: 1px; margin-bottom: clamp(10px, 3vw, 12px); margin-left: clamp(20px, 5vw, 25px);">
                        ΤΑΥΤΟΠΟΙΗΣΗ ΥΠΟΠΤΩΝ
                    </div>
                    <div style="display: flex; flex-direction: column; gap: clamp(8px, 2vw, 10px);">
                        ${sections.suspects.map(item => {
                            if (item.type === 'detail') {
                                return `<div style="margin-left: clamp(15px, 4vw, 20px); padding-left: clamp(12px, 3vw, 15px); border-left: 2px dashed #ccc; color: #666; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;">${item.text}</div>`;
                            }
                            return `
                                <div style="background: ${item.type === 'success' ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' : item.type === 'error' ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' : '#f5f5f5'}; 
                                            padding: clamp(10px, 3vw, 12px) clamp(12px, 3vw, 15px); border-radius: 6px; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;
                                            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); font-family: 'Georgia', serif;
                                            border-left: 3px solid ${item.type === 'success' ? '#4caf50' : item.type === 'error' ? '#f44336' : '#ff9800'};">
                                    <span style="color: ${item.type === 'success' ? '#1b5e20' : item.type === 'error' ? '#b71c1c' : '#e65100'}; font-weight: 600;">
                                        ${item.type === 'success' ? '✓' : item.type === 'error' ? '✗' : '•'} ${item.text}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                ` : ''}

                ${sections.bonuses.length > 0 ? `
                <div style="border-left: 4px solid #4caf50; padding-left: clamp(15px, 4vw, 20px); position: relative;">
                    <div style="position: absolute; left: clamp(-18px, -5vw, -25px); top: -5px; background: #4caf50; color: white; width: clamp(32px, 8vw, 40px); height: clamp(32px, 8vw, 40px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(16px, 4vw, 20px); box-shadow: 0 4px 10px rgba(76,175,80,0.4);">
                        ⚡
                    </div>
                    <div style="font-size: clamp(12px, 3vw, 14px); font-weight: 900; color: #1b5e20; text-transform: uppercase; letter-spacing: 1px; margin-bottom: clamp(10px, 3vw, 12px); margin-left: clamp(20px, 5vw, 25px);">
                        BONUSES ΑΠΟΔΟΤΙΚΟΤΗΤΑΣ
                    </div>
                    <div style="display: flex; flex-direction: column; gap: clamp(8px, 2vw, 10px);">
                        ${sections.bonuses.map(item => {
                            if (item.type === 'detail') {
                                return `<div style="margin-left: clamp(15px, 4vw, 20px); padding-left: clamp(12px, 3vw, 15px); border-left: 2px dashed #ccc; color: #666; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;">${item.text}</div>`;
                            }
                            return `
                                <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); 
                                            padding: clamp(10px, 3vw, 12px) clamp(12px, 3vw, 15px); border-radius: 6px; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;
                                            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); font-family: 'Georgia', serif;
                                            border-left: 3px solid #4caf50;">
                                    <span style="color: #1b5e20; font-weight: 600;">
                                        ✓ ${item.text}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                ` : ''}

                ${sections.penalties.length > 0 ? `
                <div style="border-left: 4px solid #f44336; padding-left: clamp(15px, 4vw, 20px); position: relative;">
                    <div style="position: absolute; left: clamp(-18px, -5vw, -25px); top: -5px; background: #f44336; color: white; width: clamp(32px, 8vw, 40px); height: clamp(32px, 8vw, 40px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(16px, 4vw, 20px); box-shadow: 0 4px 10px rgba(244,67,54,0.4);">
                        ⚠️
                    </div>
                    <div style="font-size: clamp(12px, 3vw, 14px); font-weight: 900; color: #b71c1c; text-transform: uppercase; letter-spacing: 1px; margin-bottom: clamp(10px, 3vw, 12px); margin-left: clamp(20px, 5vw, 25px);">
                        ΠΟΙΝΕΣ & ΠΑΡΑΛΕΙΨΕΙΣ
                    </div>
                    <div style="display: flex; flex-direction: column; gap: clamp(8px, 2vw, 10px);">
                        ${sections.penalties.map(item => {
                            if (item.type === 'detail') {
                                return `<div style="margin-left: clamp(15px, 4vw, 20px); padding-left: clamp(12px, 3vw, 15px); border-left: 2px dashed #ccc; color: #666; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;">${item.text}</div>`;
                            }
                            return `
                                <div style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); 
                                            padding: clamp(10px, 3vw, 12px) clamp(12px, 3vw, 15px); border-radius: 6px; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.7;
                                            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); font-family: 'Georgia', serif;
                                            border-left: 3px solid #f44336;">
                                    <span style="color: #b71c1c; font-weight: 600;">
                                        ✗ ${item.text}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <div style="margin-top: clamp(30px, 8vw, 40px); padding-top: clamp(15px, 4vw, 20px); border-top: 1px solid #ddd;">
                <div style="text-align: right; font-family: 'Courier New', monospace; font-size: clamp(9px, 2vw, 11px); color: #999;">
                    ΤΕΛΟΣ ΑΝΑΦΟΡΑΣ - ${teamCode.toUpperCase()}
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
    
    if (isPerfect && percentage >= 90) {
        setTimeout(() => {
            createConfetti();
        }, 500);
    }
}

function createConfetti() {
    const colors = ['#f093fb', '#f5576c', '#667eea', '#764ba2', '#ffd700'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
    
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
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
        const rowStyle = isCurrentTeam ? 'background: #fff3cd; font-weight: bold;' : '';

        return `
            <tr style="${rowStyle}">
                <td class="rank ${rankClass}" style="padding: 12px 10px; font-size: clamp(18px, 4vw, 24px); font-weight: bold; text-align: center;">
                    ${rankEmoji}
                </td>
                <td style="padding: 12px 10px; font-weight: bold; color: #1a1a2e; text-transform: uppercase;">
                    ${team.name.toUpperCase()}
                </td>
                <td style="padding: 12px 10px; font-weight: bold; color: #28a745;">
                    ${solution.score}/${maxScore}
                </td>
                <td style="padding: 12px 10px;">
                    <span style="display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: clamp(10px, 2vw, 12px); font-weight: bold; background: ${grade.color}; color: ${percentage >= 50 ? '#000' : '#fff'};">
                        ${grade.name}
                    </span>
                </td>
                <td style="padding: 12px 10px;">
                    ${formatTime(solution.completionTimeMs)}
                </td>
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
        const cardStyle = isCurrentTeam ? 'border: 3px solid #ffc107; box-shadow: 0 5px 25px rgba(255,193,7,0.4);' : '';

        return `
            <div style="background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 15px; ${cardStyle}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
                    <div class="${rankClass}" style="font-size: 36px; font-weight: bold;">${rankEmoji}</div>
                    <div style="font-size: 18px; font-weight: bold; color: #1a1a2e; text-transform: uppercase; flex: 1; margin: 0 15px;">
                        ${team.name.toUpperCase()}
                    </div>
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">
                        ${solution.score}/${maxScore}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                    <div style="font-weight: bold; color: #666; font-size: 13px;">ΤΙΤΛΟΣ</div>
                    <div>
                        <span style="display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: bold; background: ${grade.color}; color: ${percentage >= 50 ? '#000' : '#fff'};">
                            ${grade.name}
                        </span>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                    <div style="font-weight: bold; color: #666; font-size: 13px;">ΧΡΟΝΟΣ</div>
                    <div style="color: #333;">${formatTime(solution.completionTimeMs)}</div>
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
		window.location.href = "pages/team_entry.html';
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