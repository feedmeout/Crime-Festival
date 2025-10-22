let observationSession = {
    observerId: null,
    teamCode: null,
    startTime: null,
    notes: [],
    formData: {},
    isActive: false
};

let sessionTimer = null;
let autoSaveTimer = null;

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
    await loadTeams();
    loadDraft();
    setupAutoSave();
    
    // Listen for form changes
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('change', () => {
            if (observationSession.isActive) {
                scheduleAutoSave();
            }
        });
    });
});

async function loadTeams() {
    if (!window.firebaseDB) {
        console.error('Firebase not ready');
        return;
    }
    
    try {
        const teamsRef = window.firebaseCollection(window.firebaseDB, 'teams');
        const snapshot = await window.firebaseGetDocs(teamsRef);
        
        const select = document.getElementById('teamSelect');
        const options = ['<option value="">Select team...</option>'];
        
        snapshot.forEach(doc => {
            const team = doc.data();
            if (!team.deleted) {
                options.push(`<option value="${doc.id}">${doc.id.toUpperCase()}</option>`);
            }
        });
        
        select.innerHTML = options.join('');
    } catch (error) {
        console.error('Error loading teams:', error);
    }
}

function toggleSession() {
    const observerName = document.getElementById('observerName').value.trim();
    const teamCode = document.getElementById('teamSelect').value;
    
    if (!observationSession.isActive) {
        // Start session
        if (!observerName || !teamCode) {
            alert('⚠️ Please enter observer name and select a team!');
            return;
        }
        
        observationSession.observerId = observerName;
        observationSession.teamCode = teamCode;
        observationSession.startTime = new Date().toISOString();
        observationSession.isActive = true;
        
        // Update UI
        document.getElementById('statusIndicator').textContent = '🟢 Observing...';
        document.getElementById('statusIndicator').classList.add('active');
        document.getElementById('startStopBtn').textContent = '⏸️ End Observation';
        document.getElementById('startStopBtn').classList.remove('btn-primary');
        document.getElementById('startStopBtn').classList.add('btn-secondary');
        
        // Disable editing session info
        document.getElementById('observerName').disabled = true;
        document.getElementById('teamSelect').disabled = true;
        
        // Show observation sections
        document.getElementById('observationSection').style.display = 'block';
        document.getElementById('detailedSection').style.display = 'block';
        
        // Start timer
        startTimer();
        
        console.log('✅ Observation session started');
    } else {
        // End session
        if (!confirm('End observation session? Make sure you\'ve saved or submitted your observations!')) {
            return;
        }
        
        stopSession();
    }
}

function stopSession() {
    observationSession.isActive = false;
    stopTimer();
    
    // Update UI
    document.getElementById('statusIndicator').textContent = '⏸️ Session Ended';
    document.getElementById('statusIndicator').classList.remove('active');
    document.getElementById('startStopBtn').textContent = '🎬 Start New Observation';
    document.getElementById('startStopBtn').classList.remove('btn-secondary');
    document.getElementById('startStopBtn').classList.add('btn-primary');
    
    console.log('⏸️ Observation session ended');
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
    }, 1000);
}

function stopTimer() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
}

function addQuickNote() {
    const noteText = document.getElementById('quickNote').value.trim();
    
    if (!noteText) {
        alert('⚠️ Please enter a note!');
        return;
    }
    
    if (!observationSession.isActive) {
        alert('⚠️ Please start an observation session first!');
        return;
    }
    
    const note = {
        timestamp: new Date().toISOString(),
        elapsed: Date.now() - new Date(observationSession.startTime).getTime(),
        content: noteText
    };
    
    observationSession.notes.push(note);
    renderNotes();
    
    // Clear input
    document.getElementById('quickNote').value = '';
    
    // Auto-save
    scheduleAutoSave();
}

function renderNotes() {
    const timeline = document.getElementById('notesTimeline');
    
    if (observationSession.notes.length === 0) {
        timeline.innerHTML = '<p class="empty-state">No notes yet. Start adding timestamped observations...</p>';
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
    if (confirm('Delete this note?')) {
        observationSession.notes.splice(index, 1);
        renderNotes();
        scheduleAutoSave();
    }
}

function formatElapsedTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function collectFormData() {
    const formData = {};
    
    // Collect all radio buttons
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        formData[radio.name] = radio.value;
    });
    
    // Collect all checkboxes
    const checkboxGroups = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (!checkboxGroups[checkbox.name]) {
            checkboxGroups[checkbox.name] = [];
        }
        if (checkbox.checked) {
            checkboxGroups[checkbox.name].push(checkbox.value);
        }
    });
    Object.assign(formData, checkboxGroups);
    
    // Collect all textareas
    document.querySelectorAll('textarea[name]').forEach(textarea => {
        formData[textarea.name] = textarea.value.trim();
    });
    
    return formData;
}

function setupAutoSave() {
    // Auto-save every 30 seconds during active observation
    setInterval(() => {
        if (observationSession.isActive) {
            saveDraft(true); // Silent save
        }
    }, 30000);
}

function scheduleAutoSave() {
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
    }
    
    autoSaveTimer = setTimeout(() => {
        saveDraft(true); // Silent save
    }, 3000);
}

async function saveDraft(silent = false) {
    if (!observationSession.isActive) {
        if (!silent) alert('⚠️ Please start an observation session first!');
        return;
    }
    
    const formData = collectFormData();
    
    const draftData = {
        ...observationSession,
        formData: formData,
        lastSaved: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('observation_draft', JSON.stringify(draftData));
    
    // Save to Firebase
    try {
        const draftRef = window.firebaseDoc(
            window.firebaseDB, 
            'observations', 
            `draft_${observationSession.teamCode}_${observationSession.observerId.replace(/\s+/g, '_')}`
        );
        
        await window.firebaseSetDoc(draftRef, draftData);
        
        if (!silent) {
            showSaveStatus('saved', '💾 Draft saved successfully!');
        } else {
            showSaveStatus('saved', '💾 Auto-saved', 2000);
        }
    } catch (error) {
        console.error('Error saving draft:', error);
        if (!silent) {
            showSaveStatus('error', '❌ Save failed (stored locally)');
        }
    }
}

function loadDraft() {
    const draft = localStorage.getItem('observation_draft');
    if (!draft) return;
    
    if (confirm('Found a saved draft. Would you like to continue from where you left off?')) {
        const data = JSON.parse(draft);
        
        // Restore session
        observationSession = data;
        observationSession.isActive = true;
        
        // Restore UI
        document.getElementById('observerName').value = data.observerId;
        document.getElementById('teamSelect').value = data.teamCode;
        document.getElementById('observerName').disabled = true;
        document.getElementById('teamSelect').disabled = true;
        
        document.getElementById('statusIndicator').textContent = '🟢 Observing...';
        document.getElementById('statusIndicator').classList.add('active');
        document.getElementById('startStopBtn').textContent = '⏸️ End Observation';
        document.getElementById('startStopBtn').classList.remove('btn-primary');
        document.getElementById('startStopBtn').classList.add('btn-secondary');
        
        document.getElementById('observationSection').style.display = 'block';
        document.getElementById('detailedSection').style.display = 'block';
        
        // Restore notes
        renderNotes();
        
        // Restore form data
        if (data.formData) {
            Object.keys(data.formData).forEach(key => {
                const value = data.formData[key];
                
                if (Array.isArray(value)) {
                    // Checkboxes
                    value.forEach(val => {
                        const checkbox = document.querySelector(`input[name="${key}"][value="${val}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                } else {
                    // Radio buttons
                    const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
                    if (radio) {
                        radio.checked = true;
                    } else {
                        // Textarea
                        const textarea = document.querySelector(`textarea[name="${key}"]`);
                        if (textarea) textarea.value = value;
                    }
                }
            });
        }
        
        startTimer();
    }
}

async function submitObservation() {
    if (!observationSession.isActive) {
        alert('⚠️ Please start an observation session first!');
        return;
    }
    
    if (!confirm('Submit final observation? This cannot be undone.')) {
        return;
    }
    
    const formData = collectFormData();
    
    // Validate essential fields
    if (!formData['ai-frequency']) {
        alert('⚠️ Please complete the AI Usage Patterns section!');
        return;
    }
    
    const finalData = {
        observerId: observationSession.observerId,
        teamCode: observationSession.teamCode,
        startTime: observationSession.startTime,
        endTime: new Date().toISOString(),
        durationMs: Date.now() - new Date(observationSession.startTime).getTime(),
        notes: observationSession.notes,
        formData: formData,
        submittedAt: new Date().toISOString(),
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
            const draftRef = window.firebaseDoc(
                window.firebaseDB, 
                'observations', 
                `draft_${observationSession.teamCode}_${observationSession.observerId.replace(/\s+/g, '_')}`
            );
            await window.firebaseDeleteDoc(draftRef);
        } catch (e) {
            console.warn('Draft cleanup failed:', e);
        }
        
        alert('✅ Observation submitted successfully!');
        
        // Reset
        stopSession();
        resetForm();
        
        // Redirect to admin panel
        if (confirm('Return to admin panel?')) {
            window.location.href = 'admin.html';
        }
        
    } catch (error) {
        console.error('Error submitting observation:', error);
        alert('❌ Submission failed! Your data is saved locally. Please try again.');
    }
}

function resetForm() {
    observationSession = {
        observerId: null,
        teamCode: null,
        startTime: null,
        notes: [],
        formData: {},
        isActive: false
    };
    
    document.getElementById('observerName').value = '';
    document.getElementById('teamSelect').value = '';
    document.getElementById('observerName').disabled = false;
    document.getElementById('teamSelect').disabled = false;
    document.getElementById('quickNote').value = '';
    
    document.getElementById('observationSection').style.display = 'none';
    document.getElementById('detailedSection').style.display = 'none';
    
    // Clear all form inputs
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll('textarea[name]').forEach(textarea => textarea.value = '');
    
    renderNotes();
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