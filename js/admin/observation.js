// Observation Session State
let observationSession = {
    observerId: null,
    teamCode: null,
    startTime: null,
    pauseTime: null,
    totalPausedMs: 0,
    isActive: false,
    isPaused: false,
    
    // Behavior frequency counters
    behaviors: {
        // AI Usage Patterns
        ai_queries: 0,
        prompt_quality: 0,
        ai_verification: 0,
        
        // Team Collaboration
        active_discussion: 0,
        info_sharing: 0,
        task_division: 0,
        
        // Problem-Solving Approach
        systematic_analysis: 0,
        cross_referencing: 0,
        critical_thinking: 0,
        
        // Engagement & Motivation
        enthusiasm: 0,
        persistence: 0,
        focus: 0
    },
    
    // Timestamped notes
    notes: []
};

let sessionTimer = null;
let autoSaveTimer = null;

// Initialize
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
        alert('⚠️ Παρακαλώ εισάγετε το όνομά σας και επιλέξτε ομάδα!');
        return;
    }
    
    observationSession.observerId = observerName;
    observationSession.teamCode = teamCode;
    observationSession.startTime = new Date().toISOString();
    observationSession.isActive = true;
    observationSession.isPaused = false;
    
    // Hide setup, show observation interface
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('observationInterface').style.display = 'block';
    
    // Start timer
    startTimer();
    
    // Setup auto-save
    setupAutoSave();
    
    console.log('✅ Παρατήρηση ξεκίνησε:', observationSession);
}

function pauseSession() {
    if (!observationSession.isActive) return;
    
    if (observationSession.isPaused) {
        // Resume
        const pauseDuration = Date.now() - new Date(observationSession.pauseTime).getTime();
        observationSession.totalPausedMs += pauseDuration;
        observationSession.isPaused = false;
        observationSession.pauseTime = null;
        
        document.getElementById('statusIndicator').textContent = '🟢 Σε εξέλιξη';
        document.getElementById('statusIndicator').className = 'status-indicator active';
        
        startTimer();
    } else {
        // Pause
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
        alert('⚠️ Παρακαλώ ξεκινήστε ή συνεχίστε την παρατήρηση!');
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
        
        // Visual feedback
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
        alert('⚠️ Παρακαλώ γράψτε μια σημείωση!');
        return;
    }
    
    if (!observationSession.isActive) {
        alert('⚠️ Παρακαλώ ξεκινήστε την παρατήρηση πρώτα!');
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
    
    // Clear input
    document.getElementById('generalNotes').value = '';
    
    // Auto-save
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
    // Auto-save every 30 seconds
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
        if (!silent) alert('⚠️ Παρακαλώ ξεκινήστε την παρατήρηση πρώτα!');
        return;
    }
    
    const draftData = {
        ...observationSession,
        lastSaved: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('observation_draft', JSON.stringify(draftData));
    
    // Save to Firebase
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

function checkForDraft() {
    const draft = localStorage.getItem('observation_draft');
    if (!draft) return;
    
    if (confirm('Βρέθηκε αποθηκευμένο πρόχειρο. Θέλετε να συνεχίσετε από εκεί που σταματήσατε;')) {
        loadDraft(JSON.parse(draft));
    } else {
        localStorage.removeItem('observation_draft');
    }
}

function loadDraft(data) {
    observationSession = data;
    observationSession.isActive = true;
    
    // Restore UI
    document.getElementById('observerName').value = data.observerId;
    document.getElementById('teamSelect').value = data.teamCode;
    
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('observationInterface').style.display = 'block';
    
    // Restore counters
    Object.keys(observationSession.behaviors).forEach(key => {
        updateCounterDisplay(key);
    });
    
    // Restore notes
    renderNotes();
    
    // Restart timer if not paused
    if (!data.isPaused) {
        startTimer();
    } else {
        document.getElementById('statusIndicator').textContent = '⏸️ Παύση';
        document.getElementById('statusIndicator').className = 'status-indicator paused';
    }
    
    setupAutoSave();
}

function saveProgress() {
    saveDraft(false);
}

async function submitObservation() {
    if (!observationSession.isActive) {
        alert('⚠️ Παρακαλώ ξεκινήστε την παρατήρηση πρώτα!');
        return;
    }
    
    // Validation
    const totalBehaviors = Object.values(observationSession.behaviors).reduce((sum, count) => sum + count, 0);
    
    if (totalBehaviors === 0) {
        if (!confirm('Δεν έχετε καταγράψει καμία συμπεριφορά. Θέλετε να υποβάλετε ούτως ή άλλως;')) {
            return;
        }
    }
    
    if (!confirm('Υποβολή τελικής παρατήρησης; Αυτό δεν μπορεί να αναιρεθεί.')) {
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
        
        // Behavior frequencies
        behaviors: observationSession.behaviors,
        
        // Total behavior count for quick reference
        totalBehaviorCount: Object.values(observationSession.behaviors).reduce((sum, count) => sum + count, 0),
        
        // Notes
        notes: observationSession.notes,
        notesCount: observationSession.notes.length,
        
        // Metadata
        submittedAt: now.toISOString(),
        status: 'submitted'
    };
    
    try {
        const observationId = `obs_${observationSession.teamCode}_${Date.now()}`;
        const observationRef = window.firebaseDoc(window.firebaseDB, 'observations', observationId);
        
        await window.firebaseSetDoc(observationRef, finalData);
        
        // Clear draft
        localStorage.removeItem('observation_draft');
        
        // Delete draft from Firebase
        try {
            const draftId = `draft_${observationSession.teamCode}_${observationSession.observerId.replace(/\s+/g, '_')}`;
            const draftRef = window.firebaseDoc(window.firebaseDB, 'observations', draftId);
            await window.firebaseDeleteDoc(draftRef);
        } catch (e) {
            console.warn('Αποτυχία καθαρισμού προχείρου:', e);
        }
        
        alert('✅ Η παρατήρηση υποβλήθηκε επιτυχώς!');
        
        // Redirect
        if (confirm('Επιστροφή στο πάνελ διαχείρισης;')) {
            window.location.href = 'admin.html';
        } else {
            // Reset for new observation
            resetSession();
        }
        
    } catch (error) {
        console.error('Σφάλμα υποβολής:', error);
        alert('❌ Αποτυχία υποβολής! Τα δεδομένα σας είναι αποθηκευμένα τοπικά. Παρακαλώ δοκιμάστε ξανά.');
    }
}

function endSession() {
    if (!observationSession.isActive) return;
    
    if (!confirm('Τερματισμός παρατήρησης; Βεβαιωθείτε ότι έχετε αποθηκεύσει ή υποβάλει τις παρατηρήσεις σας!')) {
        return;
    }
    
    stopTimer();
    
    if (confirm('Θέλετε να διαγράψετε τα δεδομένα αυτής της συνεδρίας;')) {
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
    
    // Reset UI
    document.getElementById('observerName').value = '';
    document.getElementById('teamSelect').value = '';
    document.getElementById('generalNotes').value = '';
    document.getElementById('sessionTimer').textContent = '00:00:00';
    
    // Reset counters
    Object.keys(observationSession.behaviors).forEach(key => {
        const display = document.getElementById(`counter_${key}`);
        if (display) display.textContent = '0';
    });
    
    // Reset notes
    renderNotes();
    
    // Show setup
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
