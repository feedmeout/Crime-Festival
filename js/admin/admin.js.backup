let teamsData = {};
    const BASE_URL = window.location.origin + window.location.pathname.split('/').slice(0, -2).join('/') + '/';
    const TOTAL_TEKS = 11;
    
    function isFirebaseReady() {
        return typeof window.firebaseDB !== 'undefined';
    }

    function formatTime(ms) {
        if (!ms) return 'N/A';
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

    function formatDateTime(isoString) {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString('el-GR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    async function saveTeamToFirebase(teamName, data) {
        if (!isFirebaseReady()) return false;
        try {
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDB, 'teams', teamName),
                { ...data, lastUpdate: new Date().toISOString() }
            );
            console.log('✅ Firebase save successful');
            return true;
        } catch (error) {
            console.error('❌ Firebase save error:', error);

            const status = document.getElementById('firebaseStatus');
            if (status) {
                status.style.background = '#dc3545';
                status.innerHTML = '⚠️ Firebase Sync Failed - Using Local Storage';
                status.style.display = 'block';
            }
            
            return false;
        }
    }

    async function loadTeamFromFirebase(teamName) {
        if (!isFirebaseReady()) return null;
        try {
            const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamName);
            const docSnap = await window.firebaseGetDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error('Firebase load error:', error);
            return null;
        }
    }

    async function getAllTeamsFromFirebase() {
        if (!isFirebaseReady()) return [];
        try {
            const querySnapshot = await window.firebaseGetDocs(
                window.firebaseCollection(window.firebaseDB, 'teams')
            );
            const teams = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                
                if (!data.deleted) {
                    teams.push({ name: doc.id, ...data });
                }
            });
            
            console.log(`🔥 Firebase returned ${teams.length} teams`);
            return teams;
        } catch (error) {
            console.error('Firebase load all error:', error);
            return [];
        }
    }

async function deleteAllAlerts() {
    if (!confirm('ΔΙΑΓΡΑΦΗ ΟΛΩΝ ΤΩΝ ΕΙΔΟΠΟΙΗΣΕΩΝ;')) {
        return;
    }
    
    if (!window.firebaseDB) {
        alert('❌ Firebase δεν είναι διαθέσιμο!');
        return;
    }
    
    try {
        const alertsRef = window.firebaseCollection(window.firebaseDB, 'alerts');
        const querySnapshot = await window.firebaseGetDocs(alertsRef);
        
        console.log(`🗑️ Found ${querySnapshot.size} alerts to delete`);
        
        if (querySnapshot.size === 0) {
            alert('✅ ΔΕΝ ΥΠΑΡΧΟΥΝ ΕΙΔΟΠΟΙΗΣΕΙΣ!');
            return;
        }
        
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            console.log(`🗑️ Deleting alert: ${doc.id}`);
            deletePromises.push(
                window.firebaseDeleteDoc(
                    window.firebaseDoc(window.firebaseDB, 'alerts', doc.id)
                )
            );
        });
        
        await Promise.all(deletePromises);
        alert(`✅ ΔΙΑΓΡΑΦΗΚΑΝ!`);
        console.log('✅ All alerts deleted successfully');
        
    } catch (error) {
        console.error('❌ Error deleting alerts:', error);
        alert(`❌ Σφάλμα`);
    }
}

async function deleteALLSurveysNuclear() {
    const confirm1 = confirm('⚠️ ΠΡΟΣΟΧΗ! ΘΑ ΔΙΑΓΡΑΨΕΙ ΟΛΑ ΤΑ ΕΡΩΤΗΜΑΤΟΛΟΓΙΑ!\n\nΣΙΓΟΥΡΑ;');
    if (!confirm1) return;
    
    const confirm2 = confirm('🚨 ΤΕΛΕΥΤΑΙΑ ΠΡΟΕΙΔΟΠΟΙΗΣΗ!\n\nΘΑ ΔΙΑΓΡΑΦΟΥΝ ΟΛΑ ΤΑ ΔΕΔΟΜΕΝΑ ΕΡΕΥΝΩΝ!\n\nΣΥΝΕΧΕΙΑ;');
    if (!confirm2) return;
    
    const surveysRef = window.firebaseCollection(window.firebaseDB, 'surveys');
    const querySnapshot = await window.firebaseGetDocs(surveysRef);
    
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
        deletePromises.push(
            window.firebaseDeleteDoc(
                window.firebaseDoc(window.firebaseDB, 'surveys', doc.id)
            )
        );
    });
    
    await Promise.all(deletePromises);
    alert(`🗑️ ΔΙΑΓΡΑΦΗΚΑΝ ΟΛΑ ΤΑ ΕΡΩΤΗΜΑΤΟΛΟΓΙΑ!`);
    refreshTeams();
}

async function resetAllProgress() {
    const confirm1 = confirm('🔄 ΚΑΘΑΡΙΣΜΟΣ ΠΡΟΟΔΟΥ ΓΙΑ ΟΛΕΣ ΤΙΣ ΟΜΑΔΕΣ;\n\nΘΑ ΔΙΑΓΡΑΦΟΥΝ: ΤΕΚΜΗΡΙΑ, TIMESTAMPS, ΛΥΣΕΙΣ\nΘΑ ΔΙΑΤΗΡΗΘΟΥΝ: ΟΜΑΔΕΣ, ΚΩΔΙΚΟΙ, ΜΕΓΕΘΗ');
    if (!confirm1) return;
    
    if (!window.firebaseDB) {
        alert('❌ Firebase δεν είναι διαθέσιμο!');
        return;
    }
    
    try {
        const teams = await getAllTeams();
        let resetCount = 0;
        
        for (const team of teams) {
            const resetData = {
                password: team.password || null,
                teamSize: team.teamSize || null,
                testingMode: team.testingMode || false,
                unlocked: [],
                timestamps: {},
                evidenceTimestamps: {},
                startTime: null,
                completedAt: null,
                totalTimeMs: null,
                solution: null,
                lastUpdate: new Date().toISOString()
            };
            
            await saveTeam(team.name, resetData);
            resetCount++;
        }
        
        alert(`✅ Η ΠΡΟΟΔΟΣ ΕΧΕΙ ΚΑΘΑΡΙΣΤΕΙ ΓΙΑ ΟΛΕΣ ΤΙΣ ΟΜΑΔΕΣ!`);
        console.log(`✅ Reset progress for ${resetCount} teams`);
        refreshTeams();
        
    } catch (error) {
        console.error('❌ Error resetting progress:', error);
        alert(`❌ ΣΦΑΛΜΑ: ${error.message}`);
    }
}

async function setupTestEnvironment() {
    if (!window.firebaseDB) {
        alert('❌ Firebase δεν είναι διαθέσιμο!');
        return;
    }
    
    const mode = confirm('🧪 ΔΗΜΙΟΥΡΓΙΑ ΔΟΚΙΜΑΣΤΙΚΟΥ ΠΕΡΙΒΑΛΛΟΝΤΟΣ?\n\nOK = ΔΗΜΙΟΥΡΓΙΑ ΝΕΩΝ ΟΜΑΔΩΝ\nCANCEL = ΧΡΗΣΗ ΥΠΑΡΧΟΥΣΩΝ ΟΜΑΔΩΝ');
    
    let teams;
    
    try {
        if (mode) {
            const numTeams = parseInt(prompt('ΠΟΣΕΣ ΟΜΑΔΕΣ ΝΑ ΔΗΜΙΟΥΡΓΗΘΟΥΝ; (1-20)', '5'));
            if (!numTeams || numTeams < 1 || numTeams > 20) {
                alert('❌ ΜΗ ΕΓΚΥΡΟΣ ΑΡΙΘΜΟΣ ΟΜΑΔΩΝ!');
                return;
            }
            
            const clearFirst = confirm('ΔΙΑΓΡΑΦΗ ΥΠΑΡΧΟΥΣΩΝ ΟΜΑΔΩΝ ΠΡΩΤΑ;');
            if (clearFirst) {
                const existingTeams = await getAllTeams();
                for (const team of existingTeams) {
                    localStorage.removeItem(`unlocked_teks_${team.name}`);
                    await window.firebaseDeleteDoc(
                        window.firebaseDoc(window.firebaseDB, 'teams', team.name)
                    );
                }
                
                const surveysRef = window.firebaseCollection(window.firebaseDB, 'surveys');
                const querySnapshot = await window.firebaseGetDocs(surveysRef);
                const deletePromises = [];
                querySnapshot.forEach((doc) => {
                    deletePromises.push(
                        window.firebaseDeleteDoc(
                            window.firebaseDoc(window.firebaseDB, 'surveys', doc.id)
                        )
                    );
                });
                await Promise.all(deletePromises);
                console.log('✅ Cleared all existing teams and surveys');
            }
            
            teams = [];
            for (let i = 0; i < numTeams; i++) {
                const teamName = `ομαδα${i + 1}`;
                const teamSize = Math.floor(Math.random() * 10) + 1;
                const password = `pass${i + 1}`;
                
                const teamData = {
                    password: password,
                    teamSize: teamSize,
                    testingMode: true,
                    unlocked: [],
                    timestamps: {},
                    evidenceTimestamps: {},
                    startTime: null,
                    completedAt: null,
                    totalTimeMs: null,
                    solution: null,
                    createdAt: new Date().toISOString()
                };
                
                await saveTeam(teamName, teamData);
                teams.push({ name: teamName, ...teamData });
                console.log(`✅ Created test team: ${teamName} (${teamSize} members, password: ${password})`);
            }
            
            alert(`✅ ΝΕΕΣ ΟΜΑΔΕΣ ΔΗΜΙΟΥΡΓΗΘΗΚΑΝ!`);
            
        } else {
            teams = await getAllTeams();
            if (teams.length === 0) {
                alert('❌ ΔΕΝ ΥΠΑΡΧΟΥΝ ΟΜΑΔΕΣ! ΠΑΤΗΣΤΕ «OK» ΓΙΑ ΔΗΜΙΟΥΡΓΙΑ ΝΕΩΝ ΟΜΑΔΩΝ.');
                return;
            }
        }
        
        let setupCount = 0;
        
        const allSuspects = ['maria', 'konstantinos', 'eleni', 'georgios', 'alexandra', 'suicide'];
        const correctSuspects = ['konstantinos', 'georgios', 'eleni'];
        
        for (const team of teams) {
            const teamSize = team.teamSize || 1;
            const hasSubmitted = Math.random() > 0.5;
            
            let randomCount;
            if (hasSubmitted) {
                randomCount = Math.floor(Math.random() * 6) + 6;
            } else {
                randomCount = Math.floor(Math.random() * (TOTAL_TEKS + 1));
            }
            
            const randomTeks = Array.from({length: randomCount}, (_, i) => (i + 1).toString());
            
            const timestamps = {};
            const baseTime = Date.now() - Math.random() * 3600000;
            randomTeks.forEach((tek, i) => {
                timestamps[tek] = new Date(baseTime + i * 60000).toISOString();
            });
            
            const startTime = new Date(baseTime).toISOString();
            const completionTime = hasSubmitted ? baseTime + (randomCount * 60000) + Math.random() * 1800000 : null;
            
            let solutionObject = null;
            
            if (hasSubmitted) {
                const selectedSuspects = [];
                const quality = Math.random();
                
                if (quality > 0.7) {
                    selectedSuspects.push(...correctSuspects);
                    if (Math.random() > 0.8) {
                        const wrong = allSuspects.filter(s => !correctSuspects.includes(s));
                        selectedSuspects.push(wrong[Math.floor(Math.random() * wrong.length)]);
                    }
                } else if (quality > 0.4) {
                    const numCorrect = Math.floor(Math.random() * 2) + 1;
                    for (let i = 0; i < numCorrect; i++) {
                        selectedSuspects.push(correctSuspects[i]);
                    }
                    const wrong = allSuspects.filter(s => !selectedSuspects.includes(s));
                    const numWrong = Math.floor(Math.random() * 2) + 1;
                    for (let i = 0; i < numWrong; i++) {
                        const randomWrong = wrong[Math.floor(Math.random() * wrong.length)];
                        if (!selectedSuspects.includes(randomWrong)) {
                            selectedSuspects.push(randomWrong);
                        }
                    }
                } else {
                    const wrong = allSuspects.filter(s => !correctSuspects.includes(s));
                    const numWrong = Math.floor(Math.random() * 3) + 1;
                    for (let i = 0; i < numWrong; i++) {
                        const randomWrong = wrong[Math.floor(Math.random() * wrong.length)];
                        if (!selectedSuspects.includes(randomWrong)) {
                            selectedSuspects.push(randomWrong);
                        }
                    }
                }
                
                const randomPrompts = Math.floor(Math.random() * 20) + 1;
                
                solutionObject = {
                    suspects: selectedSuspects,
                    justification: `Δοκιμαστική αιτιολόγηση για testing`,
                    completionTimeMs: completionTime - baseTime,
                    promptCount: randomPrompts,
                    score: 0,
                    maxScore: 140,
                    submittedAt: new Date(completionTime).toISOString()
                };
                
                const scoreResult = calculateScore(
                    selectedSuspects,
                    completionTime - baseTime,
                    randomPrompts
                );
                
                solutionObject.score = scoreResult.score;
                solutionObject.breakdown = scoreResult.breakdown;
            }
            
            await saveTeam(team.name, {
                password: team.password || null,
                teamSize: teamSize,
                testingMode: true,
                unlocked: randomTeks,
                timestamps: timestamps,
                evidenceTimestamps: team.evidenceTimestamps || {},
                startTime: startTime,
                completedAt: hasSubmitted ? new Date(completionTime).toISOString() : null,
                totalTimeMs: hasSubmitted ? (completionTime - baseTime) : null,
                solution: solutionObject,
                lastUpdate: new Date().toISOString()
            });
            setupCount++;
        }
        
        console.log('📋 Creating surveys...');
        let preSurveyCount = 0;
        let postSurveyCount = 0;
        
        for (const team of teams) {
            const teamSize = team.teamSize || 1;
            const hasSubmitted = team.solution !== null;
            
            for (let i = 1; i <= teamSize; i++) {
                const memberName = `Μέλος ${i}`;
                const surveyId = `${team.name}_pre_${memberName.toLowerCase().replace(/\s+/g, '_')}`;
                
                const preSurveyData = {
                    teamCode: team.name,
                    memberName: memberName,
                    surveyType: 'pre',
                    submittedAt: new Date(Date.now() - Math.random() * 7200000).toISOString(),
                    responses: {
                        'group': Math.random() > 0.5 ? 'student' : 'professional',
                        'gender': ['male', 'female', 'other'][Math.floor(Math.random() * 3)],
                        'age': ['18-24', '25-34', '35-44', '45-54', '55+'][Math.floor(Math.random() * 5)],
                        'education': ['high-school', 'bachelor', 'master', 'phd'][Math.floor(Math.random() * 4)],
                        'genai-used': Math.random() > 0.3 ? 'yes' : 'no',
                        'genai-frequency': ['daily', 'weekly', 'monthly', 'rarely'][Math.floor(Math.random() * 4)],
                        'prompt-ability': Math.floor(Math.random() * 5) + 1,
                        'trust-level': Math.floor(Math.random() * 5) + 1,
                        'verify-frequency': Math.floor(Math.random() * 5) + 1,
                        'ai-attitude-1': Math.floor(Math.random() * 5) + 1,
                        'ai-attitude-2': Math.floor(Math.random() * 5) + 1,
                        'ai-attitude-3': Math.floor(Math.random() * 5) + 1,
                        'ai-attitude-4': Math.floor(Math.random() * 5) + 1,
                        'pu1': Math.floor(Math.random() * 5) + 1,
                        'pu2': Math.floor(Math.random() * 5) + 1,
                        'peu1': Math.floor(Math.random() * 5) + 1,
                        'peu2': Math.floor(Math.random() * 5) + 1
                    }
                };
                
                const preSurveyRef = window.firebaseDoc(window.firebaseDB, 'surveys', surveyId);
                await window.firebaseSetDoc(preSurveyRef, preSurveyData);
                preSurveyCount++;
            }
            
            if (hasSubmitted) {
                const completionRate = Math.random() * 0.6 + 0.4;
                const numCompleted = Math.max(1, Math.floor(teamSize * completionRate));
                const memberIndices = Array.from({length: teamSize}, (_, i) => i + 1);
                const completedMembers = [];
                for (let i = 0; i < numCompleted; i++) {
                    const randomIndex = Math.floor(Math.random() * memberIndices.length);
                    completedMembers.push(memberIndices[randomIndex]);
                    memberIndices.splice(randomIndex, 1);
                }
                
                for (const memberIndex of completedMembers) {
                    const memberName = `Μέλος ${memberIndex}`;
                    const surveyId = `${team.name}_post_${memberName.toLowerCase().replace(/\s+/g, '_')}`;
                    
                    const postSurveyData = {
                        teamCode: team.name,
                        memberName: memberName,
                        surveyType: 'post',
                        submittedAt: new Date(Date.now() - Math.random() * 1800000).toISOString(),
                        responses: {
                            'group': Math.random() > 0.5 ? 'student' : 'professional',
                            'gender': ['male', 'female', 'other'][Math.floor(Math.random() * 3)],
                            'age': ['18-24', '25-34', '35-44', '45-54', '55+'][Math.floor(Math.random() * 5)],
                            'education': ['high-school', 'bachelor', 'master', 'phd'][Math.floor(Math.random() * 4)],
                            'genai-used': 'yes',
                            'genai-frequency': ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)],
                            'prompt-ability': Math.floor(Math.random() * 5) + 1,
                            'trust-level': Math.floor(Math.random() * 5) + 1,
                            'verify-frequency': Math.floor(Math.random() * 5) + 1,
                            'ai-attitude-1': Math.floor(Math.random() * 5) + 1,
                            'ai-attitude-2': Math.floor(Math.random() * 5) + 1,
                            'ai-attitude-3': Math.floor(Math.random() * 5) + 1,
                            'ai-attitude-4': Math.floor(Math.random() * 5) + 1,
                            'ai-attitude-5': Math.floor(Math.random() * 5) + 1,
                            'ai-attitude-6': Math.floor(Math.random() * 5) + 1,
                            'pu1': Math.floor(Math.random() * 5) + 1,
                            'pu2': Math.floor(Math.random() * 5) + 1,
                            'pu3': Math.floor(Math.random() * 5) + 1,
                            'peu1': Math.floor(Math.random() * 5) + 1,
                            'peu2': Math.floor(Math.random() * 5) + 1,
                            'peu3': Math.floor(Math.random() * 5) + 1,
                            'open-strategy': 'Χρησιμοποιήσαμε το AI για να αναλύσουμε τα στοιχεία και να εντοπίσουμε ασυνέπειες.',
                            'open-difficulties': 'Κάποιες φορές το AI έδινε αντικρουόμενες απαντήσεις.',
                            'open-learning': 'Μάθαμε να κάνουμε πιο συγκεκριμένες ερωτήσεις στο AI.'
                        }
                    };
                    
                    const postSurveyRef = window.firebaseDoc(window.firebaseDB, 'surveys', surveyId);
                    await window.firebaseSetDoc(postSurveyRef, postSurveyData);
                    postSurveyCount++;
                }
            }
        }
        
        alert(`✅ ΔΟΚΙΜΑΣΤΙΚΟ ΠΕΡΙΒΑΛΛΟΝ ΔΗΜΙΟΥΡΓΗΘΗΚΕ!`);
        console.log(`✅ Test environment setup: ${setupCount} teams, ${preSurveyCount} pre-surveys, ${postSurveyCount} post-surveys`);
        refreshTeams();
        
    } catch (error) {
        console.error('❌ Error setting up test environment:', error);
        alert(`❌ ΣΦΑΛΜΑ: ${error.message}`);
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
        return { score: 0, breakdown: ['❌ Δεν επέλεξαν κανέναν ύποπτο'], maxScore: 140, correctCount: 0 };
    }
    
    const hasSuicide = selectedSuspects.includes('suicide');
    const hasKiller = selectedSuspects.some(s => s !== 'suicide');
    
    if (hasSuicide && hasKiller) {
        return { score: 0, breakdown: ['🚫 ΛΟΓΙΚΗ ΑΝΤΙΦΑΣΗ'], maxScore: 140, correctCount: 0 };
    }
    
    if (hasSuicide && !hasKiller) {
        return { score: 0, breakdown: ['❌ ΕΣΦΑΛΜΕΝΗ ΘΕΩΡΙΑ'], maxScore: 140, correctCount: 0 };
    }
    
    let correctCount = 0;
    let wrongSuspects = [];
    
    selectedSuspects.forEach(suspect => {
        if (CORRECT_SUSPECTS.includes(suspect)) {
            correctCount++;
        } else {
            wrongSuspects.push(suspect);
        }
    });
    
    score += SCORING.murder_diagnosis;
    breakdown.push(`🧩 ΒΑΣΙΚΗ ΕΚΤΙΜΗΣΗ (+${SCORING.murder_diagnosis})`);
    
    let perpetratorPoints = 0;
    if (correctCount === 3 && selectedSuspects.length === 3) {
        perpetratorPoints = SCORING.perpetrator * 3 + SCORING.perfect_solution_bonus + SCORING.cooperation;
        breakdown.push(`🎖️ ΤΕΛΕΙΑ ΑΝΑΛΥΣΗ! (+${perpetratorPoints})`);
    } else {
        if (correctCount >= 2) perpetratorPoints += SCORING.cooperation;
        perpetratorPoints += correctCount * SCORING.perpetrator;
        breakdown.push(`👥 ΤΑΥΤΟΠΟΙΗΣΗ (+${perpetratorPoints})`);
    }
    score += perpetratorPoints;
    
    if (correctCount >= 2) {
        let efficiencyPoints = 0;
        const minutes = totalTimeMs / 60000;
        
        if (minutes < 30) efficiencyPoints += SCORING.time_under_30;
        else if (minutes < 45) efficiencyPoints += SCORING.time_30_45;
        else if (minutes < 60) efficiencyPoints += SCORING.time_45_60;
        
        if (promptCount <= 5) efficiencyPoints += SCORING.prompts_1_5;
        else if (promptCount <= 10) efficiencyPoints += SCORING.prompts_6_10;
        else if (promptCount <= 15) efficiencyPoints += SCORING.prompts_11_15;
        
        score += efficiencyPoints;
        if (efficiencyPoints > 0) {
            breakdown.push(`⚡ BONUSES (+${efficiencyPoints})`);
        }
    }
    
    if (wrongSuspects.length > 0) {
        const multiplier = wrongSuspects.length === 1 ? 0.5 : wrongSuspects.length === 2 ? 0.2 : 0.05;
        const originalScore = score;
        score = Math.floor(score * multiplier);
        breakdown.push(`❌ PENALTY (-${originalScore - score})`);
    }
    
    score = Math.max(0, Math.min(score, 140));
    return { score, breakdown, maxScore: 140, correctCount, wrongCount: wrongSuspects.length };
}

async function getAllTeams() {
    const allTeams = new Map();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('unlocked_teks_')) {
            const teamName = key.replace('unlocked_teks_', '');
            const storedData = JSON.parse(localStorage.getItem(key));

            if (Array.isArray(storedData)) {
                allTeams.set(teamName, { 
                    name: teamName, 
                    unlocked: storedData,
                    timestamps: {},
                    startTime: null,
                    completedAt: null,
                    totalTimeMs: null,
                    solution: null,
                    lastUpdate: null,
                    teamSize: null,
                    password: null,
                    evidenceTimestamps: {},
                    source: 'localStorage-legacy'
                });
            } else {
                allTeams.set(teamName, {
                    name: teamName,
                    password: storedData.password || null,
                    teamSize: storedData.teamSize || null,
                    unlocked: storedData.unlocked || [],
                    timestamps: storedData.timestamps || {},
                    evidenceTimestamps: storedData.evidenceTimestamps || {},
                    startTime: storedData.startTime || null,
                    completedAt: storedData.completedAt || null,
                    totalTimeMs: storedData.totalTimeMs || null,
                    solution: storedData.solution || null,
                    lastUpdate: storedData.lastUpdate || null,
                    source: 'localStorage'
                });
            }
        }
    }

    if (isFirebaseReady()) {
        try {
            const firebaseTeams = await getAllTeamsFromFirebase();
            firebaseTeams.forEach(team => {
                console.log(`📦 Processing team ${team.name} from Firebase`);
                
                const localTeam = allTeams.get(team.name);
                
                if (!localTeam) {
                    allTeams.set(team.name, {
                        name: team.name,
                        password: team.password || null,
                        teamSize: team.teamSize || null,
                        unlocked: team.unlocked || [],
                        timestamps: team.timestamps || {},
                        evidenceTimestamps: team.evidenceTimestamps || {},
                        startTime: team.startTime || null,
                        completedAt: team.completedAt || null,
                        totalTimeMs: team.totalTimeMs || null,
                        lastUpdate: team.lastUpdate || null,
                        solution: team.solution || null,
                        source: 'firebase'
                    });
                } else {
                    const teamLastUpdate = team.lastUpdate || '0';
                    const localLastUpdate = localTeam.lastUpdate || '0';
                    const mergedTeamSize = team.teamSize || localTeam.teamSize || null;
                    const mergedPassword = team.password || localTeam.password || null;
                    
                    if (teamLastUpdate > localLastUpdate) {
                        console.log(`🔥 Firebase data is newer for ${team.name}`);
                        allTeams.set(team.name, {
                            name: team.name,
                            password: mergedPassword,
                            teamSize: mergedTeamSize,
                            unlocked: team.unlocked || [],
                            timestamps: team.timestamps || {},
                            evidenceTimestamps: team.evidenceTimestamps || {},
                            startTime: team.startTime || null,
                            completedAt: team.completedAt || null,
                            totalTimeMs: team.totalTimeMs || null,
                            lastUpdate: team.lastUpdate || null,
                            solution: team.solution || null,
                            source: 'firebase-newer'
                        });
                    } else {
                        console.log(`💾 localStorage data is current for ${team.name}, but preserving teamSize and testingMode`);
                        localTeam.teamSize = mergedTeamSize;
                        localTeam.password = mergedPassword;
                        
                        if (team.testingMode !== undefined && localTeam.testingMode === undefined) {
                            localTeam.testingMode = team.testingMode;
                        }
                    }
                }
            });
        } catch (error) {
            console.error('⚠️ Firebase load failed, using localStorage only:', error);
        }
    }
    
    const teams = Array.from(allTeams.values());
    console.log(`📊 Loaded ${teams.length} teams total`);
    return teams;
}

async function getSurveyCompletionStatus(teamName) {
    if (!window.firebaseDB) {
        return { pre: 0, post: 0 };
    }
    
    try {
        const surveysRef = window.firebaseCollection(window.firebaseDB, 'surveys');
        const querySnapshot = await window.firebaseGetDocs(surveysRef);
        
        const preMembers = new Set();
        const postMembers = new Set();
        
        querySnapshot.forEach((doc) => {
            const docId = doc.id;
            if (docId.startsWith(`${teamName}_pre_`)) {
                const memberName = docId.replace(`${teamName}_pre_`, '');
                preMembers.add(memberName);
            } else if (docId.startsWith(`${teamName}_post_`)) {
                const memberName = docId.replace(`${teamName}_post_`, '');
                postMembers.add(memberName);
            }
        });
        
        return {
            pre: preMembers.size,
            post: postMembers.size
        };
    } catch (error) {
        console.error(`Error counting surveys for ${teamName}:`, error);
        return { pre: 0, post: 0 };
    }
}

async function saveTeam(teamName, data) {
	console.log('🔧 NEW CODE VERSION - saveTeam called');
    const existingTeam = teamsData[teamName];
    
    if (existingTeam && existingTeam.teamSize && !data.teamSize) {
        console.warn(`⚠️ teamSize missing in save, preserving existing value: ${existingTeam.teamSize}`);
        data.teamSize = existingTeam.teamSize;
    }
    
    if (existingTeam && existingTeam.testingMode !== undefined && data.testingMode === undefined) {
        console.warn(`⚠️ testingMode missing in save, preserving existing value: ${existingTeam.testingMode}`);
        data.testingMode = existingTeam.testingMode;
    }
    
    if (data.teamSize !== undefined && data.teamSize !== null) {
        data.teamSize = parseInt(data.teamSize);
        if (isNaN(data.teamSize) || data.teamSize < 1) {
            console.error(`Invalid teamSize for team ${teamName}:`, data.teamSize);
            alert('Error: Invalid team size!');
            return false;
        }
    }
    
    data.lastUpdate = new Date().toISOString();
    
    console.log(`💾 Saving team ${teamName} with data:`, {
        teamSize: data.teamSize,
        testingMode: data.testingMode,
        unlocked: data.unlocked?.length,
        hasPassword: !!data.password
    });
    
    localStorage.setItem(`unlocked_teks_${teamName}`, JSON.stringify(data));
    teamsData[teamName] = { name: teamName, ...data };
    
    const firebaseSuccess = await saveTeamToFirebase(teamName, data);
    
    if (!firebaseSuccess) {
        console.warn('⚠️ Continuing with localStorage only for team:', teamName);
    }
    
    if (firebaseSuccess && window.firebaseDB) {
        const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamName);
        const verify = await window.firebaseGetDoc(docRef);
        if (verify.exists()) {
            const saved = verify.data();
            console.log('✅ Verified team saved with teamSize:', saved.teamSize, 'testingMode:', saved.testingMode);
            if (!saved.teamSize || saved.teamSize < 1) {
                console.error('❌ teamSize not saved correctly!', saved);
            }
            if (saved.testingMode === undefined) {
                console.error('❌ testingMode not saved correctly!', saved);
            }
        }
    }
    
    refreshTeams();
    
    return true;
}

    async function exportAllData() {
        const teams = await getAllTeams();
        
        const dataStr = JSON.stringify({ 
            exportDate: new Date().toISOString(),
            teams: teams 
        }, null, 2);
        
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crime-festival-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert(`✅ Data Exported!`);
    }

    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            const text = await file.text();
            const data = JSON.parse(text);
            
            let imported = 0;
            for (const team of data.teams) {
                await saveTeam(team.name, team);
                imported++;
            }
            
            alert(`✅ Data Imported!`);
            refreshTeams();
        };
        
        input.click();
    }

async function addTeam() {
    const alertDiv = document.getElementById('addTeamAlert');
    const teamName = document.getElementById('newTeamName').value.trim().toLowerCase();
    const password = document.getElementById('newTeamPassword').value.trim();
    const teamSize = parseInt(document.getElementById('newTeamSize').value);
    const testingMode = document.getElementById('testingModeCheckbox').checked;
	
    console.log('🧪 Testing Mode Checkbox Value:', testingMode);
	
    
    if (!teamName) {
        alertDiv.innerHTML = '<div class="alert alert-danger">⚠️ Παρακαλώ εισάγετε όνομα ομάδας</div>';
        return;
    }
    if (!password) {
        alertDiv.innerHTML = '<div class="alert alert-danger">⚠️ Παρακαλώ εισάγετε κωδικό ομάδας</div>';
        return;
    }
    if (!teamSize || teamSize < 1 || teamSize > 10) {
        alertDiv.innerHTML = '<div class="alert alert-danger">⚠️ Παρακαλώ εισάγετε αριθμό μελών (1-10)</div>';
        return;
    }
    if (isFirebaseReady()) {
        const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamName);
        const docSnap = await window.firebaseGetDoc(docRef);
        if (docSnap.exists()) {
            alertDiv.innerHTML = '<div class="alert alert-warning">⚠️ Η ομάδα υπάρχει ήδη</div>';
            return;
        }
    }
    
    const teamData = {
        password: password,
        teamSize: teamSize,
        testingMode: testingMode,
        unlocked: [],
        timestamps: {},
        evidenceTimestamps: {},
        startTime: null,
        completedAt: null,
        totalTimeMs: null,
        solution: null,
        createdAt: new Date().toISOString()
    };
    
    console.log('📦 Creating team with data:', JSON.stringify(teamData, null, 2)); 
    
    await saveTeam(teamName, teamData);
    
    const modeText = testingMode ? ' (🧪 ΛΕΙΤΟΥΡΓΙΑ ΔΟΚΙΜΩΝ)' : '';
    alertDiv.innerHTML = `<div class="alert alert-success">✅ Η ομάδα "${teamName}" δημιουργήθηκε με κωδικό: <strong>${password}</strong> και <strong>${teamSize} μέλη</strong>${modeText}</div>`;
    
    document.getElementById('newTeamName').value = '';
    document.getElementById('newTeamPassword').value = '';
    document.getElementById('newTeamSize').value = '';
    document.getElementById('testingModeCheckbox').checked = false;
    
    setTimeout(() => { alertDiv.innerHTML = ''; }, 5000);
    refreshTeams();
}

let refreshTimeout = null;

function debouncedRefreshTeams() {
    if (refreshTimeout) clearTimeout(refreshTimeout);
    
    refreshTimeout = setTimeout(() => {
        refreshTeams();
        refreshTimeout = null;
    }, 300);
}

async function refreshTeams() {
    console.log('🔄 === REFRESH TEAMS START ===');
    showSyncStatus('🔄 Syncing data...', 'syncing');
    
    let teams = await getAllTeams();
    teamsData = {};
    teams.forEach(team => {
        teamsData[team.name] = team;
    });
    
    const container = document.getElementById('teamsContainer');
    const sortOrder = document.getElementById('sortOrder').value;

    console.log(`📊 Loaded ${teams.length} teams from Firebase/localStorage`);
    teams.forEach(t => console.log(`  - ${t.name}: ${t.unlocked.length} TEKs unlocked, data:`, t.unlocked));

if (teams.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;"></div>';
        if (window.timerInterval) {
            clearInterval(window.timerInterval);
        }
        
        showSyncStatus('✅ Data synced', 'success');
        console.log('🔄 === REFRESH TEAMS END ===');
        return;
    }
    
    teams = sortTeams(teams, sortOrder);
	const surveyCounts = new Map();
	for (const team of teams) {
		const counts = await getSurveyCompletionStatus(team.name);
		surveyCounts.set(team.name, counts);
	}
    container.innerHTML = '';    
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

window.timerInterval = setInterval(() => {
    document.querySelectorAll('.team-card').forEach(teamCard => {
        const teamName = teamCard.dataset.teamId;
        const team = teamsData[teamName];
        
        if (team && team.startTime && !team.completedAt && !team.solution) {
            const elapsed = Date.now() - new Date(team.startTime).getTime();
            const timerValue = teamCard.querySelector('.timer-value');
            
            if (timerValue) {
                timerValue.innerHTML = `<strong>${formatTime(elapsed)}</strong>`;
            }
        }
    });
}, 1000);
    
    const html = teams.map(team => {
        const progress = Math.round((team.unlocked.length / TOTAL_TEKS) * 100);
        const allEvidenceUnlocked = team.unlocked.length === TOTAL_TEKS;
        const solutionSubmitted = !!team.solution;
		const surveys = surveyCounts.get(team.name) || { pre: 0, post: 0 };
		const teamSize = team.teamSize || 0;
		
		let preStatusIcon = '❌';
		if (surveys.pre === teamSize && teamSize > 0) {
			preStatusIcon = '✅';
		} else if (surveys.pre > 0) {
			preStatusIcon = '⚠️';
		}
		
		let postStatusIcon = '❌';
		if (surveys.post === teamSize && teamSize > 0) {
			postStatusIcon = '✅';
		} else if (surveys.post > 0) {
			postStatusIcon = '⚠️';
		}
        
        let timingHtml = '';
        if (team.startTime) {
            const now = new Date();
            const startTime = new Date(team.startTime);
            
            if (solutionSubmitted && team.completedAt) {
                timingHtml = `
					<div class="team-stat-label">⏱️ ΧΡΟΝΟΣ ΟΛΟΚΛΗΡΩΣΗΣ</div>
					<div class="team-stat-colon">:</div>
					<div class="team-stat-value"><strong>${formatTime(team.totalTimeMs)}</strong></div>
                `;
            } else {
                const elapsed = now - startTime;
                timingHtml = `
					<div class="team-stat-label">⏱️ ΧΡΟΝΟΣ ΣΕ ΕΞΕΛΙΞΗ</div>
					<div class="team-stat-colon">:</div>
					<div class="team-stat-value timer-value"><strong>${formatTime(elapsed)}</strong></div>
                `;
            }
        }
  
        console.log(`🎨 Rendering team ${team.name} with unlocked:`, team.unlocked);
            
        return `
            <div class="team-card ${solutionSubmitted ? 'completed' : ''}" data-team-id="${team.name}">
				<h3>
					<span style="font-size: 24px;"></span> 
					${team.name.toUpperCase()}
					${team.testingMode ? '<span class="completion-badge" style="background: #2196f3;">🧪 ΔΟΚΙΜΗ</span>' : ''}
					${solutionSubmitted ? 
						'<span class="completion-badge">✅ ΟΛΟΚΛΗΡΩΘΗΚΕ</span>' : 
						(allEvidenceUnlocked ? '<span class="completion-badge" style="background: #17a2b8;">📦 ΠΛΗΡΗΣ ΣΥΛΛΟΓΗ</span>' : '')
					}
				</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress === 0 ? '100' : progress}%; ${progress === 0 ? 'background: #e0e0e0; color: #666;' : ''}">${progress}%</div>
                </div>
                <div class="team-stats-grid">
					<div class="team-stat-label">📊 ΞΕΚΛΕΙΔΩΜΕΝΑ ΣΤΟΙΧΕΙΑ</div>
					<div class="team-stat-colon">:</div>
					<div class="team-stat-value"><strong>${team.unlocked.length} / ${TOTAL_TEKS}</strong></div>

					<div class="team-stat-label">${preStatusIcon} ΠΡΟΚΑΤΑΡΚΤΙΚΗ ΕΡΕΥΝΑ</div>
					<div class="team-stat-colon">:</div>
					<div class="team-stat-value"><strong>${surveys.pre} / ${teamSize || 'N/A'} </strong></div>

					<div class="team-stat-label">${postStatusIcon} ΤΕΛΙΚΗ ΕΡΕΥΝΑ</div>
					<div class="team-stat-colon">:</div>
					<div class="team-stat-value"><strong>${surveys.post} / ${teamSize || 'N/A'} </strong></div>

					<div class="team-stat-label">🔑 ΚΩΔΙΚΟΣ ΟΜΑΔΑΣ</div>
					<div class="team-stat-colon">:</div>
					<div class="team-stat-value"><strong>${team.password || 'N/A'}</strong></div>
                    
                    ${timingHtml}
                </div>
				<div class="tek-grid">
					${Array.from({length: TOTAL_TEKS}, (_, i) => {
						const tekNum = (i + 1).toString();
						const isUnlocked = team.unlocked.includes(tekNum);
						const isLocked = !!team.solution;
						console.log(`  TEK ${tekNum}: unlocked=${isUnlocked}, array contains:`, team.unlocked);
						const onclickAttr = isLocked 
							? '' 
							: `toggleTek('${team.name}', ${i + 1})`;
						
						const titleText = isLocked 
							? 'Κλειδωμένο (λύση υποβλήθηκε)' 
							: (isUnlocked ? 'Κλικ για κλείδωμα' : 'Κλικ για ξεκλείδωμα');
						
						return `<div class="tek-box ${isUnlocked ? 'unlocked' : ''} ${isLocked ? 'disabled' : 'clickable'}" 
									 onclick="${onclickAttr}" 
									 title="${titleText}">${i + 1}</div>`;
					}).join('')}
				</div>
                <div class="team-actions">
                    <button class="btn btn-primary" onclick="viewTeam('${team.name}')">👀 ΠΡΟΒΟΛΗ</button>
                    <button class="btn" style="background: #17a2b8; color: white;" onclick="showTimestamps('${team.name}')">🕐 ΧΡΟΝΙΚΑ</button>
                    <button class="btn btn-success" onclick="unlockAll('${team.name}')">🔓 ΤΕΚΜΗΡΙΑ</button>
                    <button class="btn btn-secondary" onclick="resetTeam('${team.name}')">🔄 RESET</button>
                    <button class="btn btn-danger" onclick="deleteTeam('${team.name}')">🗑️ ΔΙΑΦΡΑΦΗ</button>
                </div>
            </div>
        `;
    }).join('');
    
container.innerHTML = html;
    showSyncStatus('✅ Data synced', 'success');
    console.log('🔄 === REFRESH TEAMS END ===');
}

    function sortTeams(teams, order) {
        switch(order) {
            case 'name':
                return teams.sort((a, b) => a.name.localeCompare(b.name));
            
            case 'progress':
                return teams.sort((a, b) => b.unlocked.length - a.unlocked.length);
            
            case 'completion':
                const completed = teams.filter(t => t.completedAt).sort((a, b) => a.totalTimeMs - b.totalTimeMs);
                const incomplete = teams.filter(t => !t.completedAt).sort((a, b) => b.unlocked.length - a.unlocked.length);
                return [...completed, ...incomplete];
            
            case 'recent':
                return teams.sort((a, b) => {
                    const aTime = a.lastUpdate || a.startTime || '0';
                    const bTime = b.lastUpdate || b.startTime || '0';
                    return bTime.localeCompare(aTime);
                });
            
            default:
                return teams;
        }
    }

async function showTimestamps(teamName) {
    const teams = await getAllTeams();
    const team = teams.find(t => t.name === teamName);
    
    if (!team) return;

    const modal = document.getElementById('timestampModal');
    const modalTeamName = document.getElementById('modalTeamName');
    const modalContent = document.getElementById('modalContent');

    modalTeamName.textContent = `ΧΡΟΝΙΚΑ ΣΗΜΕΙΑ - ${teamName.toUpperCase()}`;

    let html = '';
    if (team.startTime || team.completedAt) {
        html += '<div class="info-box info-box-start">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 10px;">';
        
        if (team.startTime) {
            html += `<div><strong>🚀 ΕΝΑΡΞΗ:</strong> ${formatDateTime(team.startTime)}</div>`;
        }
        
        if (team.completedAt) {
            html += `<div><strong>🏁 ΟΛΟΚΛΗΡΩΣΗ:</strong> ${formatDateTime(team.completedAt)}</div>`;
        }
        
        html += '</div>';
        
        if (team.completedAt && team.totalTimeMs) {
            html += `<div><strong>⏱️ ΣΥΝΟΛΙΚΟΣ ΧΡΟΝΟΣ:</strong> ${formatTime(team.totalTimeMs)}</div>`;
        }
        
        html += '</div>';
    }

    if (team.timestamps && Object.keys(team.timestamps).length > 0) {
        html += '<h3 style="margin: 20px 0 10px 0;">ΞΕΚΛΕΙΔΩΜΕΝΑ ΤΕΚΜΗΡΙΑ:</h3>';
        html += '<ul class="timestamp-list">';
        const sortedTeks = Object.entries(team.timestamps)
            .sort((a, b) => new Date(a[1]) - new Date(b[1]));
        
        sortedTeks.forEach(([tek, timestamp]) => {
            html += `
                <li class="timestamp-item">
                    <span class="tek-label">ΤΕΚ #${tek.padStart(2, '0')}</span>
                    <span class="time">${formatDateTime(timestamp)}</span>
                </li>
            `;
        });
        
        html += '</ul>';
    } else {
        html += '<p style="color: #999; text-align: center; padding: 20px;">Δεν υπάρχουν χρονικά δεδομένα</p>';
    }

    modalContent.innerHTML = html;
    modal.classList.add('active');
}
    function closeModal() {
        const modal = document.getElementById('timestampModal');
        modal.classList.remove('active');
    }
    
    window.onclick = function(event) {
        const modal = document.getElementById('timestampModal');
        if (event.target === modal) {
            closeModal();
        }
    }

function viewTeam(teamName) {
    window.open(`${BASE_URL}index.html?team=${teamName}`, '_blank');
}

async function toggleTek(teamName, tekNumber) {
    console.log(`🎯 Toggle TEK ${tekNumber} for team ${teamName}`);
    
    const teams = await getAllTeams();
    const team = teams.find(t => t.name === teamName);
    
    if (!team) {
        alert('Ομάδα δεν βρέθηκε!');
        return;
    }
    
    if (team.solution) {
        alert('❌ Δεν μπορείτε να τροποποιήσετε τεκμήρια μετά την υποβολή λύσης!');
        return;
    }
    
    const tekStr = tekNumber.toString();
    const unlocked = [...(team.unlocked || [])];
    const timestamps = {...(team.timestamps || {})};
    
    if (unlocked.includes(tekStr)) {
        const index = unlocked.indexOf(tekStr);
        unlocked.splice(index, 1);
        delete timestamps[tekStr];
        console.log(`🔒 Locked TEK ${tekNumber} for team ${teamName}`);
    } else {
        unlocked.push(tekStr);
        timestamps[tekStr] = new Date().toISOString();
        console.log(`🔓 Unlocked TEK ${tekNumber} for team ${teamName}`);
    }
    
const updatedTeam = {
    password: team.password || null,
    teamSize: team.teamSize !== undefined ? team.teamSize : null,
    testingMode: team.testingMode !== undefined ? team.testingMode : false,
    unlocked: unlocked,
    timestamps: timestamps,
    evidenceTimestamps: team.evidenceTimestamps || {},
    startTime: team.startTime || new Date().toISOString(),
    completedAt: team.completedAt || null,
    totalTimeMs: team.totalTimeMs || null,
    solution: team.solution || null,
    lastUpdate: new Date().toISOString()
};
    
    console.log(`💾 Saving team ${teamName} with ${unlocked.length} TEKs`);
    await saveTeam(teamName, updatedTeam);
    await refreshTeams();
    
    console.log('✅ Toggle complete');
}

async function unlockAll(teamName) {
    if (confirm(`ΞΕΚΛΕΙΔΩΜΑ ΟΛΩΝ ΤΩΝ ΤΕΚΜΗΡΙΩΝ ΓΙΑ ΤΗΝ ΟΜΑΔΑ "${teamName}";`)) {
        console.log(`🔓 Unlocking all TEKs for team ${teamName}`);
        const teams = await getAllTeams();
        const team = teams.find(t => t.name === teamName);
        
        const allTeks = Array.from({length: TOTAL_TEKS}, (_, i) => (i + 1).toString());
        const now = new Date().toISOString();
        const timestamps = {...(team?.timestamps || {})};
        let earliestTime = team?.startTime || now;
        
        allTeks.forEach((tek, i) => {
            if (!timestamps[tek]) {
                timestamps[tek] = new Date(Date.now() + i * 100).toISOString();
            } else {
                const existingTime = new Date(timestamps[tek]);
                if (existingTime < new Date(earliestTime)) {
                    earliestTime = timestamps[tek];
                }
            }
        });
    
        const updatedTeam = {
            password: team?.password || null,
            teamSize: team?.teamSize !== undefined ? team.teamSize : null,
            testingMode: team?.testingMode !== undefined ? team.testingMode : false,
            unlocked: allTeks,
            timestamps: timestamps,
            evidenceTimestamps: team?.evidenceTimestamps || {},
            startTime: earliestTime,
            completedAt: team?.completedAt || null,
            totalTimeMs: team?.totalTimeMs || null,
            solution: team?.solution || null,
            lastUpdate: now
        };
    
        console.log(`💾 Saving unlock all for team ${teamName}`);
        await saveTeam(teamName, updatedTeam);
        await refreshTeams();
        
        console.log('✅ Unlock all complete');
    }
}

async function resetTeam(teamName) {
    if (confirm(`Reset πρόοδο για την ομάδα "${teamName}";`)) {
        const teams = await getAllTeams();
        const team = teams.find(t => t.name === teamName);
        
        await saveTeam(teamName, {
            password: team?.password || null,
            teamSize: team?.teamSize !== undefined ? team.teamSize : null,
            testingMode: team?.testingMode !== undefined ? team.testingMode : false,
            unlocked: [],
            timestamps: {},
            startTime: null,
            completedAt: null,
            totalTimeMs: null
        });
        refreshTeams();
    }
}

async function deleteTeam(teamName) {
    if (confirm(`ΔΙΑΓΡΑΦΗ ΟΜΑΔΑΣ "${teamName}" ΚΑΙ ΟΛΩΝ ΤΩΝ ΣΥΝΔΕΔΕΜΕΝΩΝ ΕΡΕΥΝΩΝ;`)) {
        console.log(`🗑️ Starting deletion for team: ${teamName}`);
        localStorage.removeItem(`unlocked_teks_${teamName}`);
        console.log(`✅ Deleted from localStorage`);
        
        if (isFirebaseReady()) {
            try {
                const surveysRef = window.firebaseCollection(window.firebaseDB, 'surveys');
                const querySnapshot = await window.firebaseGetDocs(surveysRef);
                
                const deletePromises = [];
                let surveyCount = 0;
                
                querySnapshot.forEach((doc) => {
                    const docId = doc.id;
                    if (docId.startsWith(`${teamName}_pre_`) || docId.startsWith(`${teamName}_post_`)) {
                        console.log(`🗑️ Queuing survey for deletion: ${docId}`);
                        surveyCount++;
                        deletePromises.push(
                            window.firebaseDeleteDoc(
                                window.firebaseDoc(window.firebaseDB, 'surveys', docId)
                            ).then(() => {
                                console.log(`✅ Deleted survey: ${docId}`);
                            }).catch(err => {
                                console.error(`❌ Failed to delete survey ${docId}:`, err);
                            })
                        );
                    }
                });
                
                console.log(`📊 Found ${surveyCount} surveys to delete`);
                if (deletePromises.length > 0) {
                    await Promise.all(deletePromises);
                    console.log(`✅ All surveys deleted successfully`);
                }
                
                await window.firebaseDeleteDoc(
                    window.firebaseDoc(window.firebaseDB, 'teams', teamName)
                );
                console.log(`✅ Deleted team document: ${teamName}`);                
            } catch (error) {
                console.error('❌ Firebase delete error:', error);
                alert(`⚠️ ΣΦΑΛΜΑ ΔΙΑΓΡΑΦΗΣ!`);
            }
        } else {
            console.warn('⚠️ Firebase not ready, only deleted from localStorage');
            alert('⚠️ Firebase δεν είναι διαθέσιμο. Διαγράφηκε μόνο τοπικά.');
        }
        
        refreshTeams();
    }
}

async function unlockAllForAll() {
    if (confirm('ΞΕΚΛΕΙΔΩΜΑ ΟΛΩΝ ΤΩΝ ΤΕΚΜΗΡΙΩΝ ΓΙΑ ΟΛΕΣ ΤΙΣ ΟΜΑΔΕΣ;')) {
        const teams = await getAllTeams();
        const allTeks = Array.from({length: TOTAL_TEKS}, (_, i) => (i + 1).toString());
        
        for (const team of teams) {
            const now = new Date().toISOString();
            const timestamps = {...(team.timestamps || {})};
            let earliestTime = team.startTime || now;
            
            allTeks.forEach((tek, i) => {
                if (!timestamps[tek]) {
                    timestamps[tek] = new Date(Date.now() + i * 100).toISOString();
                } else {
                    const existingTime = new Date(timestamps[tek]);
                    if (existingTime < new Date(earliestTime)) {
                        earliestTime = timestamps[tek];
                    }
                }
            });
            
await saveTeam(team.name, {
    password: team.password || null,
    teamSize: team.teamSize !== undefined ? team.teamSize : null,
    testingMode: team.testingMode !== undefined ? team.testingMode : false,
    unlocked: allTeks,
    timestamps: timestamps,
    startTime: earliestTime,
    completedAt: team.completedAt || null,
    totalTimeMs: team.totalTimeMs || null,
    solution: team.solution || null,
    evidenceTimestamps: team.evidenceTimestamps || {}
});
        }
        refreshTeams();
    }
}

async function resetAll() {
    if (confirm('ΔΙΑΓΡΑΦΗ ΟΛΩΝ ΤΩΝ ΟΜΑΔΩΝ ΚΑΙ ΕΡΕΥΝΩΝ;')) {
        const teams = await getAllTeams();
        console.log(`🗑️ Resetting ${teams.length} teams...`);
        for (const team of teams) {
            localStorage.removeItem(`unlocked_teks_${team.name}`);
        }
        console.log(`✅ Deleted all from localStorage`);
        
        if (isFirebaseReady()) {
            try {
                for (const team of teams) {
                    await window.firebaseDeleteDoc(
                        window.firebaseDoc(window.firebaseDB, 'teams', team.name)
                    );
                    console.log(`✅ Deleted team: ${team.name}`);
                }
                
                const surveysRef = window.firebaseCollection(window.firebaseDB, 'surveys');
                const querySnapshot = await window.firebaseGetDocs(surveysRef);
                
                const deletePromises = [];
                let surveyCount = 0;
                
                querySnapshot.forEach((doc) => {
                    console.log(`🗑️ Deleting survey: ${doc.id}`);
                    surveyCount++;
                    deletePromises.push(
                        window.firebaseDeleteDoc(
                            window.firebaseDoc(window.firebaseDB, 'surveys', doc.id)
                        )
                    );
                });
                
                await Promise.all(deletePromises);
                
                console.log(`✅ Deleted ${teams.length} teams and ${surveyCount} surveys`);
            } catch (error) {
                console.error('❌ Firebase delete error:', error);
                alert(`⚠️ ΣΦΑΛΜΑ: ${error.message}`);
            }
        }
        
        refreshTeams();
    }
}

async function checkLeaderboardStatus() {
    if (!window.firebaseDB) {
        console.warn('Firebase not ready');
        return false;
    }
    
    try {
        const docRef = window.firebaseDoc(window.firebaseDB, 'config', 'leaderboard');
        const docSnap = await window.firebaseGetDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().unlocked || false;
        }
        return false;
    } catch (error) {
        console.error('Error checking leaderboard status:', error);
        return false;
    }
}

async function updateLeaderboardButton() {
    const isUnlocked = await checkLeaderboardStatus();
    const btn = document.getElementById('leaderboardToggleBtn');
    
    if (btn) {
        if (isUnlocked) {
            btn.innerHTML = '🔓 LEADERBOARD (TEAMS)';
            btn.style.background = '#28a745';
        } else {
            btn.innerHTML = '🔒 LEADERBOARD (TEAMS)';
            btn.style.background = '#dc3545';
        }
    }
}

async function toggleLeaderboard() {
    if (!window.firebaseDB) {
        alert('❌ Firebase δεν είναι διαθέσιμο!');
        return;
    }
    
    const currentStatus = await checkLeaderboardStatus();
    const newStatus = !currentStatus;
    
    try {
        const docRef = window.firebaseDoc(window.firebaseDB, 'config', 'leaderboard');
        await window.firebaseSetDoc(docRef, {
            unlocked: newStatus,
            lastModified: new Date().toISOString(),
            modifiedBy: 'admin'
        });
        
        await updateLeaderboardButton();
        
    } catch (error) {
        console.error('Error toggling leaderboard:', error);
        alert('❌ Σφάλμα! Δοκιμάστε ξανά.');
    }
}

async function exportSurveyDataToExcel() {
    if (!window.firebaseDB) {
        alert('❌ Firebase not available!');
        return;
    }

    try {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; text-align: center;';
        statusDiv.innerHTML = '<div style="font-size: 48px; margin-bottom: 20px;">⳿</div><h3>Exporting Survey Data...</h3><p>Please wait...</p>';
        document.body.appendChild(statusDiv);

        const surveysRef = window.firebaseCollection(window.firebaseDB, 'surveys');
        const querySnapshot = await window.firebaseGetDocs(surveysRef);
        
        console.log(`📊 Found ${querySnapshot.size} survey responses`);

        if (querySnapshot.size === 0) {
            alert('No survey data found!');
            document.body.removeChild(statusDiv);
            return;
        }

        const allResponses = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            allResponses.push({
                docId: doc.id,
                ...data
            });
        });

        allResponses.sort((a, b) => {
            if (a.teamCode !== b.teamCode) {
                return (a.teamCode || '').localeCompare(b.teamCode || '', 'el');
            }
            if (a.memberName !== b.memberName) {
                return (a.memberName || '').localeCompare(b.memberName || '', 'el');
            }
            const typeOrder = { 'pre': 1, 'post': 2 };
            return (typeOrder[a.surveyType] || 3) - (typeOrder[b.surveyType] || 3);
        });

        const SURVEY_COLUMN_ORDER = [
            'Document_ID',
            'Team_Code',
            'Member_Name',
            'Survey_Type',
            'Submitted_At',
            'Submission_Date',
            'Submission_Time',
            'group',
            'gender',
            'age',
            'education',
            'genai-used',
            'genai-duration',
            'genai-frequency',
            'genai-tools',
            'genai-tools-other',
            'genai-purposes',
            'genai-purposes-other',
            'prompt-ability',
            'trust-level',
            'verify-frequency',
            'biggest-challenge',
            'non-use-reason',
            'non-use-reason-other',
            'genai-awareness',
            'genai-concerns',
            'future-likelihood',
            'genai-motivators',
            'services-used',
            'genai-importance',
            'education-adequacy',
            'ai-attitude-1',
            'ai-attitude-2',
            'ai-attitude-3',
            'ai-attitude-4',
            'ai-attitude-5',
            'ai-attitude-6',
            'ai-attitude-7',
            'ai-attitude-8',
            'pu1',
            'pu2',
            'pu3',
            'pu4',
            'pu5',
            'pu6',
            'peu1',
            'peu2',
            'peu3',
            'peu4',
            'peu5',
            'peu6',
            'open-strategy',
            'open-difficulties',
            'open-learning'
        ];
        
        const processedData = allResponses.map(survey => {
            const flatData = {
                'Document_ID': survey.docId || '',
                'Team_Code': survey.teamCode || '',
                'Member_Name': survey.memberName || '',
                'Survey_Type': survey.surveyType || '',
                'Submitted_At': survey.submittedAt || '',
                'Submission_Date': survey.submittedAt ? new Date(survey.submittedAt).toLocaleDateString('el-GR') : '',
                'Submission_Time': survey.submittedAt ? new Date(survey.submittedAt).toLocaleTimeString('el-GR') : '',
            };
            
            if (survey.responses) {
                Object.keys(survey.responses).forEach(key => {
                    const value = survey.responses[key];
                    if (Array.isArray(value)) {
                        flatData[key] = value.join('; ');
                    } else {
                        flatData[key] = value;
                    }
                });
            }

            return flatData;
        });
        
        const allFieldsInData = new Set();
        processedData.forEach(row => {
            Object.keys(row).forEach(key => allFieldsInData.add(key));
        });
        
        const extraFields = Array.from(allFieldsInData)
            .filter(field => !SURVEY_COLUMN_ORDER.includes(field))
            .sort();

        const finalHeaders = [
            ...SURVEY_COLUMN_ORDER.filter(h => allFieldsInData.has(h)),
            ...extraFields
        ];
        
        const worksheetData = [
            finalHeaders,
            ...processedData.map(row => 
                finalHeaders.map(header => row[header] !== undefined ? row[header] : '')
            )
        ];
        
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        
        const colWidths = finalHeaders.map(header => {
            const maxLength = Math.max(
                header.length,
                ...processedData.map(row => 
                    String(row[header] || '').length
                ).slice(0, 100)
            );
            return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
        });
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `Crime_Festival_2025_Survey_Data_${timestamp}.xlsx`;

        XLSX.writeFile(wb, filename, { 
            bookType: 'xlsx',
            type: 'binary',
            compression: true
        });

		document.body.removeChild(statusDiv);
        alert(`✅ Exported: ${filename}`);
        console.log('✅ Export completed successfully');

	} catch (error) {
        console.error('❌ Export error:', error);
        alert('❌ Export failed! (Check console)');
        const statusDiv = document.querySelector('div[style*="position: fixed"]');
        if (statusDiv) {
            document.body.removeChild(statusDiv);
        }
    }
}

function setupLeaderboardButtonListener() {
    if (!window.firebaseDB) {
        setTimeout(setupLeaderboardButtonListener, 500);
        return;
    }
    
    const docRef = window.firebaseDoc(window.firebaseDB, 'config', 'leaderboard');
    
    const unsubscribe = window.firebaseOnSnapshot(docRef, 
        async (doc) => {
            const btn = document.getElementById('leaderboardToggleBtn');
            const isUnlocked = doc.data()?.unlocked || false;
            
            if (btn) {
                btn.innerHTML = isUnlocked 
                    ? '🔓 LEADERBOARD (TEAMS)' 
                    : '🔒 LEADERBOARD (TEAMS)';
                btn.style.background = isUnlocked ? '#28a745' : '#dc3545';
            }
        },
        (error) => {
            console.error('Error listening to leaderboard config:', error);
        }
    );
    
    console.log('✅ Leaderboard button listener active');
}

async function openAlertModal() {
    const modal = document.getElementById('alertModal');
    const select = document.getElementById('alertTarget');
    
    const teams = await getAllTeams();
    const options = ['<option value="all">📢 ΟΛΕΣ ΟΙ ΟΜΑΔΕΣ</option>'];
    
    teams.forEach(team => {
        options.push(`<option value="${team.name}">👥 ${team.name.toUpperCase()}</option>`);
    });
    
    select.innerHTML = options.join('');
    modal.classList.add('active');
}

function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    modal.classList.remove('active');
    document.getElementById('alertMessage').value = '';
    document.getElementById('alertTarget').value = 'all';
}

async function sendAlert() {
    const message = document.getElementById('alertMessage').value.trim();
    const target = document.getElementById('alertTarget').value;
    
    if (!message) {
        alert('⚠️ Παρακαλώ εισάγετε μήνυμα!');
        return;
    }
    
    if (!window.firebaseDB) {
        alert('❌ Firebase δεν είναι διαθέσιμο!');
        return;
    }
    
    try {
        const alertData = {
            message: message,
            targetTeam: target,
            timestamp: new Date().toISOString(),
            read: false,
            sender: 'admin'
        };
        
        const alertId = `alert_${Date.now()}`;
        const alertRef = window.firebaseDoc(window.firebaseDB, 'alerts', alertId);
        
		await window.firebaseSetDoc(alertRef, alertData);
        
        closeAlertModal();
        alert('✅ Η ΕΙΔΟΠΟΙΗΣΗ ΣΤΑΛΘΗΚΕ!');
        
    } catch (error) {
        console.error('Error sending alert:', error);
        alert(`❌ ΣΦΑΛΜΑ ΑΠΟΣΤΟΛΗΣ`);
    }
}

let firestoreUnsubscribe = null;
let lastKnownTeamsState = {};
let pollingInterval = null;
let isFirestoreActive = false;

function startPolling() {
    if (pollingInterval) return;
    console.log('📡 Starting polling mode (every 3 seconds)');
    pollingInterval = setInterval(refreshTeams, 3000);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log('🛑 Polling stopped');
    }
}

function setupRealtimeListener() {
    if (!isFirebaseReady()) {
        console.warn('⚠️ Firebase not ready - using periodic refresh');
        startPolling();
        return;
    }

    try {
        const teamsCollection = window.firebaseCollection(window.firebaseDB, 'teams');
        firestoreUnsubscribe = window.firebaseOnSnapshot(teamsCollection, 
            (snapshot) => {
                console.log('🔥 Firebase real-time update received');
                isFirestoreActive = true;
                stopPolling();
                
                let hasChanges = false;
                
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        console.log(`🔍 Team ${change.doc.id} was ${change.type}`);
                        hasChanges = true;
                    }
                    if (change.type === 'removed') {
                        console.log(`🗑️ Team ${change.doc.id} was removed`);
                        hasChanges = true;
                    }
                });
                
                if (hasChanges) {
                    debouncedRefreshTeams();
                }
            },
            (error) => {
                console.error('❌ Firebase listener error:', error);
                isFirestoreActive = false;
                startPolling();
            }
        );
        
        console.log('✅ Real-time Firebase listener active');
        
    } catch (error) {
        console.error('❌ Failed to setup Firebase listener:', error);
        setInterval(refreshTeams, 2000);
    }
}


function showSyncStatus(message, type = 'success') {
    const status = document.getElementById('firebaseStatus');
    if (!status) return;
    
    status.classList.remove('syncing');
    
    if (type === 'syncing') {
        status.classList.add('syncing');
        status.style.background = '#17a2b8';
    } else if (type === 'success') {
        status.style.background = '#28a745';
    } else if (type === 'error') {
        status.style.background = '#dc3545';
    }
    
    status.innerHTML = message;
    status.style.display = 'block';
    
    if (type !== 'syncing') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

function toggleAdminMode() {
    const mode = document.getElementById('adminMode').value;
    const allH3 = document.querySelectorAll('.section h3');
    let testingSection = null;
    let dangerSection = null;
    
    allH3.forEach(h3 => {
        if (h3.textContent.includes('Testing & Debug Tools') || h3.textContent.includes('🧪')) {
            testingSection = h3;
        }
        if (h3.textContent.includes('Danger Zone') || h3.textContent.includes('⚠️')) {
            dangerSection = h3;
        }
    });
    
    if (!testingSection || !dangerSection) {
        console.warn('⚠️ Admin sections not found yet');
        return;
    }
    
    const testingButtons = testingSection.nextElementSibling;
    const dangerButtons = dangerSection.nextElementSibling;
    
    if (mode === 'live') {
        testingSection.style.display = 'none';
        testingButtons.style.display = 'none';
        dangerSection.style.display = 'none';
        dangerButtons.style.display = 'none';
        
        console.log('🎮 LIVE EVENT MODE: Testing tools hidden');
    } else {
        testingSection.style.display = 'block';
        testingButtons.style.display = 'grid';
        dangerSection.style.display = 'block';
        dangerButtons.style.display = 'grid';
        
        console.log('🧪 TESTING MODE: All tools visible');
    }
    
    localStorage.setItem('adminMode', mode);
}

window.addEventListener('DOMContentLoaded', async () => {
    const savedMode = localStorage.getItem('adminMode') || 'testing';
    const modeSelect = document.getElementById('adminMode');
    if (modeSelect) {
        modeSelect.value = savedMode;
        toggleAdminMode();
    }
    
    function checkFirestoreConnection() {
        if (!window.firebaseDB) return false;
        
        const testRef = window.firebaseDoc(window.firebaseDB, 'config', 'test');
        window.firebaseGetDoc(testRef)
            .then(() => {
                console.log('🟢 Firestore connection active');
                showSyncStatus('✅ Connected', 'success');
            })
            .catch((error) => {
                console.error('🔴 Firestore connection failed:', error);
                showSyncStatus('⚠️ Connection issues', 'error');
            });
    }

    setInterval(checkFirestoreConnection, 30000);
    
    await refreshTeams();
    setupRealtimeListener();
    setupLeaderboardButtonListener();
    
    setTimeout(() => {
        const status = document.getElementById('firebaseStatus');
        if (status && !status.classList.contains('syncing')) {
            status.style.display = 'none';
        }
    }, 5000);
});

window.addEventListener('online', () => {
    console.log('🟢 Back online');
    showSyncStatus('🟢 Reconnecting...', 'syncing');
    if (!isFirestoreActive) {
        stopPolling();
        setupRealtimeListener();
    }
});

window.addEventListener('offline', () => {
    console.log('🔴 Offline');
    showSyncStatus('🔴 Offline - Changes may not save', 'error');
});