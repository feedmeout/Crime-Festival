let observationSession = {
    observerId: null,
    teamCode: null,
    startTime: null,
    isActive: false,
    
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
    checkForDraft();
});

async function loadTeams() {
    if (!window.firebaseDB) {
        console.error('Firebase δεν είναι έτοιμο');
        return;
    }
    
    try {
        const teamsRef = window.firebaseCollection(window.firebaseDB, 'teams');
        const snapshot = await window.firebaseGetDocs(teamsRef);
        
        const select = document.getElementById('teamSelect');
        const options = ['<option value="">Επιλέξτε ομάδα...</option>'];
        
        snapshot.forEach(doc => {
            const team = doc.data();
            if (!team.deleted) {
                options.push(`<option value="${doc.id}">${doc.id.toUpperCase()}</option>`);
            }
        });
        
        select.innerHTML = options.join('');
    } catch (error) {
        console.error('Σφάλμα φόρτωσης ομάδων:', error);
    }
}

function startSession() {
    const observerName = document.getElementById('observerName').value.trim();
    const teamCode = document.getElementById('teamSelect').value;
    
    if (!observerName || !teamCode) {
        alert('⚠️ ΕΙΣΑΓΕΤΕ ΤΟ ΟΝΟΜΑ ΣΑΣ ΚΑΙ ΕΠΙΛΕΞΤΕ ΟΜΑΔΑ!');
        return;
    }
    
    observationSession.observerId = observerName;
    observationSession.teamCode = teamCode;
    observationSession.startTime = new Date().toISOString();
    observationSession.isActive = true;
    
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('observationInterface').style.display = 'block';
    
    startTimer();
    setupAutoSave();
    console.log('✅ Παρατήρηση ξεκίνησε:', observationSession);
}

function startTimer() {
    sessionTimer = setInterval(() => {
        if (!observationSession.startTime) return;
        
        const elapsed = Date.now() - new Date(observationSession.startTime).getTime();
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
    if (!observationSession.isActive) {
        alert('⚠️ ΞΕΚΙΝΗΣΤΕ ΤΗΝ ΠΑΡΑΤΗΡΗΣΗ ΠΡΩΤΑ!');
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
    const elapsed = now.getTime() - new Date(observationSession.startTime).getTime();
    
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
        if (observationSession.isActive) {
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
            showSaveStatus('saved', '💾 ΤΟ ΠΡΟΧΕΙΡΟ ΑΠΟΘΗΚΕΥΤΗΚΕ ΕΠΙΤΥΧΩΣ!');
        } else {
            showSaveStatus('saved', '💾 ΑΥΤΟΜΑΤΗ ΑΠΟΘΗΚΕΥΣΗ', 2000);
        }
    } catch (error) {
        console.error('Σφάλμα αποθήκευσης:', error);
        if (!silent) {
            showSaveStatus('error', '❌ ΑΠΟΤΥΧΙΑ ΑΠΟΘΗΚΕΥΣΗΣ (ΑΠΟΘΗΚΕΥΤΗΚΕ ΤΟΠΙΚΑ)');
        }
    }
}

function checkForDraft() {
    const draft = localStorage.getItem('observation_draft');
    if (!draft) return;
    
    if (confirm('ΒΡΕΘΗΚΕ ΑΠΟΘΗΚΕΥΜΕΝΟ ΠΡΟΧΕΙΡΟ. ΘΕΛΕΤΕ ΝΑ ΣΥΝΕΧΙΣΕΤΕ ΑΠΟ ΕΚΕΙ ΠΟΥ ΣΤΑΜΑΤΗΣΑΤΕ;')) {
        loadDraft(JSON.parse(draft));
    } else {
        localStorage.removeItem('observation_draft');
    }
}

function loadDraft(data) {
    observationSession = data;
    observationSession.isActive = true;

    document.getElementById('observerName').value = data.observerId;
    document.getElementById('teamSelect').value = data.teamCode;
    
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('observationInterface').style.display = 'block';
    
    Object.keys(observationSession.behaviors).forEach(key => {
        updateCounterDisplay(key);
    });
    
    renderNotes();
    startTimer();
    setupAutoSave();
}

function saveProgress() {
    saveDraft(false);
}

async function submitObservation() {
    if (!observationSession.isActive) {
        alert('⚠️ ΠΑΡΑΚΑΛΩ ΞΕΚΙΝΗΣΤΕ ΤΗΝ ΠΑΡΑΤΗΡΗΣΗ ΠΡΩΤΑ!');
        return;
    }
    
    const totalBehaviors = Object.values(observationSession.behaviors).reduce((sum, count) => sum + count, 0);
    
    if (totalBehaviors === 0) {
        if (!confirm('ΔΕΝ ΕΧΕΤΕ ΚΑΤΑΓΡΑΨΕΙ ΚΑΜΙΑ ΣΥΜΠΕΡΙΦΟΡΑ. ΘΕΛΕΤΕ ΝΑ ΥΠΟΒΑΛΕΤΕ ΟΥΤΩΣ Η ΑΛΛΩΣ;')) {
            return;
        }
    }
    
    if (!confirm('ΥΠΟΒΟΛΗ ΤΕΛΙΚΗΣ ΠΑΡΑΤΗΡΗΣΗΣ; ΔΕΝ ΜΠΟΡΕΙ ΝΑ ΑΝΑΙΡΕΘΕΙ.')) {
        return;
    }
    
    const now = new Date();
    const finalData = {
        observerId: observationSession.observerId,
        teamCode: observationSession.teamCode,
        startTime: observationSession.startTime,
        endTime: now.toISOString(),
        durationMs: now.getTime() - new Date(observationSession.startTime).getTime(),
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
        
        stopTimer();
        
        alert('✅ Η ΠΑΡΑΤΗΡΗΣΗ ΥΠΟΒΛΗΘΗΚΕ!');
        window.location.href = 'admin.html';
        
    } catch (error) {
        console.error('Σφάλμα υποβολής:', error);
        alert('❌ ΑΠΟΤΥΧΙΑ ΥΠΟΒΟΛΗΣ! ΤΑ ΔΕΔΟΜΕΝΑ ΣΑΣ ΕΙΝΑΙ ΑΠΟΘΗΚΕΥΜΕΝΑ ΤΟΠΙΚΑ. ΠΑΡΑΚΑΛΩ ΔΟΚΙΜΑΣΤΕ ΞΑΝΑ.');
    }
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