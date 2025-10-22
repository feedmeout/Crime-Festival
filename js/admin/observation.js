let observationSession = {
    observerId: null,
    teamCode: null,
    startTime: null,
    pauseTime: null,
    totalPausedMs: 0,
    isActive: false,
    isPaused: false,
    
    behaviors: {
        ai_queries: 0,
        prompt_quality: 0,
        ai_verification: 0,
        
        active_discussion: 0,
        info_sharing: 0,
        task_division: 0,

        systematic_analysis: 0,
        cross_referencing: 0,
        critical_thinking: 0,

        enthusiasm: 0,
        persistence: 0,
        focus: 0
    },

    notes: []
};

let sessionTimer = null;
let autoSaveTimer = null;

window.addEventListener('DOMContentLoaded', async () => {
    await loadTeams();
    // REMOVED: checkForDraft() - Draft recovery feature removed
});

async function loadTeams() {
    if (!window.firebaseDB) {
        console.error('Firebase δεν είναι έτοιμο');
        return;
    }
    
    try {
        // Load all teams
        const teamsRef = window.firebaseCollection(window.firebaseDB, 'teams');
        const teamsSnapshot = await window.firebaseGetDocs(teamsRef);
        
        // Load all submitted observations to check which teams already have observations
        const observationsRef = window.firebaseCollection(window.firebaseDB, 'observations');
        const observationsSnapshot = await window.firebaseGetDocs(observationsRef);
        
        const observedTeams = new Set();
        observationsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'submitted' && data.teamCode) {
                observedTeams.add(data.teamCode);
            }
        });
        
        const select = document.getElementById('teamSelect');
        const options = ['<option value="">Επιλέξτε ομάδα...</option>'];
        
        teamsSnapshot.forEach(doc => {
            const team = doc.data();
            if (!team.deleted) {
                const teamCode = doc.id;
                const isObserved = observedTeams.has(teamCode);
                const label = isObserved ? 
                    `${teamCode.toUpperCase()} ✅ (ΗΔΗ ΠΑΡΑΤΗΡΗΘΗΚΕ)` : 
                    teamCode.toUpperCase();
                
                // Add option but keep it enabled for transparency
                // The validation in startSession will prevent actual duplicate observations
                options.push(`<option value="${teamCode}">${label}</option>`);
            }
        });
        
        select.innerHTML = options.join('');
    } catch (error) {
        console.error('Σφάλμα φόρτωσης ομάδων:', error);
    }
}

async function startSession() {
    const observerName = document.getElementById('observerName').value.trim();
    const teamCode = document.getElementById('teamSelect').value;
    
    if (!observerName || !teamCode) {
        alert('⚠️ ΕΙΣΑΓΕΤΕ ΤΟ ΟΝΟΜΑ ΣΑΣ ΚΑΙ ΕΠΙΛΕΞΤΕ ΟΜΑΔΑ!');
        return;
    }
    
    // FIXED: Check if team already has a submitted observation
    try {
        const observationsRef = window.firebaseCollection(window.firebaseDB, 'observations');
        const snapshot = await window.firebaseGetDocs(observationsRef);
        
        let existingObservation = null;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.teamCode === teamCode && data.status === 'submitted') {
                existingObservation = data;
            }
        });
        
        if (existingObservation) {
            const observerInfo = existingObservation.observerId || 'Άγνωστος παρατηρητής';
            const dateInfo = existingObservation.submittedAt ? 
                new Date(existingObservation.submittedAt).toLocaleString('el-GR') : 'Άγνωστη ημερομηνία';
            
            alert(`⚠️ Η ΟΜΑΔΑ "${teamCode.toUpperCase()}" ΕΧΕΙ ΗΔΗ ΠΑΡΑΤΗΡΗΘΕΙ!\n\nΠαρατηρητής: ${observerInfo}\nΗμερομηνία: ${dateInfo}\n\nΚΑΘΕ ΟΜΑΔΑ ΜΠΟΡΕΙ ΝΑ ΠΑΙΞΕΙ ΜΟΝΟ ΜΙΑ ΦΟΡΑ.`);
            return;
        }
    } catch (error) {
        console.error('Σφάλμα ελέγχου υπάρχουσας παρατήρησης:', error);
        if (!confirm('⚠️ ΔΕΝ ΜΠΟΡΕΣΑΜΕ ΝΑ ΕΛΕΓΞΟΥΜΕ ΑΝ Η ΟΜΑΔΑ ΕΧΕΙ ΗΔΗ ΠΑΡΑΤΗΡΗΘΕΙ.\n\nΘΕΛΕΤΕ ΝΑ ΣΥΝΕΧΙΣΕΤΕ;')) {
            return;
        }
    }
    
    observationSession.observerId = observerName;
    observationSession.teamCode = teamCode;
    observationSession.startTime = new Date().toISOString();
    observationSession.isActive = true;
    observationSession.isPaused = false;
    
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('observationInterface').style.display = 'block';
    
    startTimer();
    setupAutoSave();
    console.log('✅ Παρατήρηση ξεκίνησε:', observationSession);
}

function pauseSession() {
    if (!observationSession.isActive) return;
    
    if (observationSession.isPaused) {
        const pauseDuration = Date.now() - new Date(observationSession.pauseTime).getTime();
        observationSession.totalPausedMs += pauseDuration;
        observationSession.isPaused = false;
        observationSession.pauseTime = null;
        
        document.getElementById('statusIndicator').textContent = '🟢 Σε εξέλιξη';
        document.getElementById('statusIndicator').className = 'status-indicator active';
        
        startTimer();
    } else {
        observationSession.isPaused = true;
        observationSession.pauseTime = new Date().toISOString();
        
        document.getElementById('statusIndicator').textContent = '⏸️ Παύση';
        document.getElementById('statusIndicator').className = 'status-indicator paused';
        
        stopTimer();
    }
}

function startTimer() {
    sessionTimer = setInterval(() => {
        if (!observationSession.startTime || observationSession.isPaused) return;
        
        const elapsed = Date.now() - new Date(observationSession.startTime).getTime() - observationSession.totalPausedMs;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('sessionTimer').textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 100);
    
    document.getElementById('statusIndicator').textContent = '🟢 Σε εξέλιξη';
    document.getElementById('statusIndicator').className = 'status-indicator active';
}

function stopTimer() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
}

function incrementBehavior(behaviorKey) {
    if (!observationSession.isActive || observationSession.isPaused) {
        alert('⚠️ ΞΕΚΙΝΗΣΤΕ Η ΣΥΝΕΧΙΣΤΕ ΤΗΝ ΠΑΡΑΤΗΡΗΣΗ!');
        return;
    }
    
    observationSession.behaviors[behaviorKey]++;
    updateCounterDisplay(behaviorKey);
    scheduleAutoSave();
}

function decrementBehavior(behaviorKey) {
    if (!observationSession.isActive) return;
    
    if (observationSession.behaviors[behaviorKey] > 0) {
        observationSession.behaviors[behaviorKey]--;
        updateCounterDisplay(behaviorKey);
        scheduleAutoSave();
    }
}

function updateCounterDisplay(behaviorKey) {
    const display = document.getElementById(`counter_${behaviorKey}`);
    if (display) {
        display.textContent = observationSession.behaviors[behaviorKey];
        display.style.transform = 'scale(1.2)';
        display.style.color = 'var(--primary-color)';
        setTimeout(() => {
            display.style.transform = 'scale(1)';
            display.style.color = 'var(--text-dark)';
        }, 200);
    }
}

function addTimestampedNote() {
    const noteText = document.getElementById('generalNotes').value.trim();
    
    if (!noteText) {
        alert('⚠️ ΓΡΑΨΤΕ ΜΙΑ ΣΗΜΕΙΩΣΗ!');
        return;
    }
    
    if (!observationSession.isActive) {
        alert('⚠️ ΞΕΚΙΝΗΣΤΕ ΤΗΝ ΠΑΡΑΤΗΡΗΣΗ ΠΡΩΤΑ!');
        return;
    }
    
    const now = new Date();
    const elapsed = now.getTime() - new Date(observationSession.startTime).getTime() - observationSession.totalPausedMs;
    
    const note = {
        timestamp: now.toISOString(),
        elapsed: elapsed,
        content: noteText
    };
    
    observationSession.notes.push(note);
    renderNotes();

    document.getElementById('generalNotes').value = '';

    scheduleAutoSave();
}

function renderNotes() {
    const timeline = document.getElementById('notesTimeline');
    
    if (observationSession.notes.length === 0) {
        timeline.innerHTML = '<p class="empty-state">Δεν υπάρχουν σημειώσεις ακόμα...</p>';
        return;
    }
    
    const html = observationSession.notes.map((note, index) => {
        const elapsed = formatElapsedTime(note.elapsed);
        const time = new Date(note.timestamp).toLocaleTimeString('el-GR');
        
        return `
            <div class="note-item">
                <div class="note-timestamp">⏱️ ${elapsed} (${time})</div>
                <div class="note-content">${escapeHtml(note.content)}</div>
                <button class="note-delete" onclick="deleteNote(${index})">×</button>
            </div>
        `;
    }).join('');
    
    timeline.innerHTML = html;
}

function deleteNote(index) {
    if (confirm('Διαγραφή αυτής της σημείωσης;')) {
        observationSession.notes.splice(index, 1);
        renderNotes();
        scheduleAutoSave();
    }
}

function formatElapsedTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}λ ${seconds}δ`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setupAutoSave() {
    setInterval(() => {
        if (observationSession.isActive && !observationSession.isPaused) {
            saveDraft(true);
        }
    }, 30000);
}

function scheduleAutoSave() {
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
    }
    
    autoSaveTimer = setTimeout(() => {
        saveDraft(true);
    }, 3000);
}

async function saveDraft(silent = false) {
    if (!observationSession.isActive) {
        if (!silent) alert('⚠️ ΞΕΚΙΝΗΣΤΕ ΤΗΝ ΠΑΡΑΤΗΡΗΣΗ ΠΡΩΤΑ!');
        return;
    }
    
    const draftData = {
        ...observationSession,
        lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('observation_draft', JSON.stringify(draftData));
    
    try {
        const draftId = `draft_${observationSession.teamCode}_${observationSession.observerId.replace(/\s+/g, '_')}`;
        const draftRef = window.firebaseDoc(window.firebaseDB, 'observations', draftId);
        
        await window.firebaseSetDoc(draftRef, draftData);
        
        if (!silent) {
            showSaveStatus('saved', '💾 Το πρόχειρο αποθηκεύτηκε επιτυχώς!');
        } else {
            showSaveStatus('saved', '💾 Αυτόματη αποθήκευση', 2000);
        }
    } catch (error) {
        console.error('Σφάλμα αποθήκευσης:', error);
        if (!silent) {
            showSaveStatus('error', '❌ Αποτυχία αποθήκευσης (αποθηκεύτηκε τοπικά)');
        }
    }
}

function saveProgress() {
    saveDraft(false);
}

async function submitObservation() {
    if (!observationSession.isActive) {
        alert('⚠️ ΞΕΚΙΝΗΣΤΕ ΤΗΝ ΠΑΡΑΤΗΡΗΣΗ ΠΡΩΤΑ!');
        return;
    }
    
    const totalBehaviors = Object.values(observationSession.behaviors).reduce((sum, count) => sum + count, 0);
    
    if (totalBehaviors === 0) {
        if (!confirm('ΔΕΝ ΕΧΕΤΕ ΚΑΤΑΓΡΑΨΕΙ ΚΑΜΙΑ ΣΥΜΠΕΡΙΦΟΡΑ. ΘΕΛΕΤΕ ΝΑ ΥΠΟΒΑΛΕΤΕ;')) {
            return;
        }
    }
    
    // FIXED: Changed confirmation message to all caps
    if (!confirm('ΥΠΟΒΟΛΗ ΤΕΛΙΚΗΣ ΠΑΡΑΤΗΡΗΣΗΣ; ΔΕΝ ΜΠΟΡΕΙ ΝΑ ΑΝΑΙΡΕΘΕΙ!')) {
        return;
    }
    
    const now = new Date();
    const finalData = {
        observerId: observationSession.observerId,
        teamCode: observationSession.teamCode,
        startTime: observationSession.startTime,
        endTime: now.toISOString(),
        durationMs: now.getTime() - new Date(observationSession.startTime).getTime() - observationSession.totalPausedMs,
        totalPausedMs: observationSession.totalPausedMs,
        behaviors: observationSession.behaviors,
        totalBehaviorCount: Object.values(observationSession.behaviors).reduce((sum, count) => sum + count, 0),
        notes: observationSession.notes,
        notesCount: observationSession.notes.length,
        submittedAt: now.toISOString(),
        status: 'submitted'
    };
    
    try {
        const observationId = `obs_${observationSession.teamCode}_${Date.now()}`;
        const observationRef = window.firebaseDoc(window.firebaseDB, 'observations', observationId);
        
        await window.firebaseSetDoc(observationRef, finalData);
		
        localStorage.removeItem('observation_draft');

        try {
            const draftId = `draft_${observationSession.teamCode}_${observationSession.observerId.replace(/\s+/g, '_')}`;
            const draftRef = window.firebaseDoc(window.firebaseDB, 'observations', draftId);
            await window.firebaseDeleteDoc(draftRef);
        } catch (e) {
            console.warn('Αποτυχία καθαρισμού προχείρου:', e);
        }
        
        alert('✅ Η ΠΑΡΑΤΗΡΗΣΗ ΥΠΟΒΛΗΘΗΚΕ!');
        
        // FIXED: Removed confirmation, automatically redirect to admin.html
        window.location.href = 'admin.html';
        
    } catch (error) {
        console.error('Σφάλμα υποβολής:', error);
        alert('❌ ΑΠΟΤΥΧΙΑ ΥΠΟΒΟΛΗΣ! ΤΑ ΔΕΔΟΜΕΝΑ ΣΑΣ ΕΙΝΑΙ ΑΠΟΘΗΚΕΥΜΕΝΑ ΤΟΠΙΚΑ. ΠΑΡΑΚΑΛΩ ΔΟΚΙΜΑΣΤΕ ΞΑΝΑ.');
    }
}

function endSession() {
    if (!observationSession.isActive) return;
    
    if (!confirm('ΤΕΡΜΑΤΙΣΜΟΣ ΠΑΡΑΤΗΡΗΣΗΣ; ΒΕΒΑΙΩΘΕΙΤΕ ΟΤΙ ΕΧΕΤΕ ΑΠΟΘΗΚΕΥΣΕΙ Η ΥΠΟΒΑΛΕΙ ΤΙΣ ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΑΣ!')) {
        return;
    }
    
    stopTimer();
    
    if (confirm('ΘΕΛΕΤΕ ΝΑ ΔΙΑΓΡΑΨΕΤΕ ΤΑ ΔΕΔΟΜΕΝΑ ΑΥΤΗΣ ΤΗΣ ΣΥΝΕΔΡΙΑΣ;')) {
        resetSession();
    }
}

function resetSession() {
    stopTimer();
    
    observationSession = {
        observerId: null,
        teamCode: null,
        startTime: null,
        pauseTime: null,
        totalPausedMs: 0,
        isActive: false,
        isPaused: false,
        behaviors: {
            ai_queries: 0,
            prompt_quality: 0,
            ai_verification: 0,
            active_discussion: 0,
            info_sharing: 0,
            task_division: 0,
            systematic_analysis: 0,
            cross_referencing: 0,
            critical_thinking: 0,
            enthusiasm: 0,
            persistence: 0,
            focus: 0
        },
        notes: []
    };
    
    document.getElementById('observerName').value = '';
    document.getElementById('teamSelect').value = '';
    document.getElementById('generalNotes').value = '';
    document.getElementById('sessionTimer').textContent = '00:00:00';
    
    Object.keys(observationSession.behaviors).forEach(key => {
        const display = document.getElementById(`counter_${key}`);
        if (display) display.textContent = '0';
    });
    
    renderNotes();
    
    document.getElementById('setupSection').style.display = 'block';
    document.getElementById('observationInterface').style.display = 'none';
    
    localStorage.removeItem('observation_draft');
}

function showSaveStatus(type, message, duration = 3000) {
    const indicator = document.getElementById('autoSaveIndicator');
    const status = document.getElementById('saveStatus');
    
    indicator.className = 'auto-save-indicator ' + type;
    status.textContent = message;
    
    setTimeout(() => {
        indicator.className = 'auto-save-indicator';
    }, duration);
}